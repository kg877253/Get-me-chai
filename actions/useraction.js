"use server"

import Razorpay from "razorpay"
import dbConnect from "@/db/connect"
import Payment from "@/models/payment"
import User from "@/models/user"
import Post from "@/models/posts"
import { getServerSession } from "next-auth"
import mongoose from "mongoose"
import { authOptions } from "@/lib/authOptions"
import Like from "@/models/like"
import { encrypt, decrypt } from "@/lib/crypto"

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// Creators ko username ya name se dhoondo (max 5), sirf safe fields
export const searchCreators = async (query) => {
    const q = (query || "").trim()
    if (q.length < 3 || q.length > 30) return []

    await dbConnect()

    const regex = new RegExp(escapeRegex(q), "i")
    const creators = await User.find({
        role: "creator",
        $or: [{ username: regex }, { name: regex }],
    })
        .select("username name profilepic")
        .limit(5)
        .lean()

    return JSON.parse(JSON.stringify(creators))
}

// Order create + payment record create + order details client ko return
// Errors throw nahi karte, return karte hain (production me thrown error ka message client tak nahi pahunchta)
export const initiatePayment = async (amount, to_username, paymentform) => {
    if (typeof to_username !== "string" || !to_username) return { error: "Creator not found" }

    await dbConnect()

    const name = (paymentform?.name || "").trim()
    const message = (paymentform?.message || "").trim()
    const amt = Number(amount)

    //  validation (order banane se PEHLE) 
    if (!name) return { error: "Please enter your name" }
    if (name.length > 50) return { error: "Name should be less than 50 characters" }
    if (!Number.isInteger(amt) || amt < 1) {
        return { error: "Please enter a valid amount (₹1 or more)" }
    }
    if (amt > 100000) return { error: "Maximum amount is ₹1,00,000" }

    // creator exist karta hai ya nahi
    const creator = await User.findOne({ username: to_username })
        .select("razorpayid razorpaysecret").lean()
    if (!creator) return { error: "Creator not found" }
    if (!creator.razorpayid || !creator.razorpaysecret) {
        return { error: "This creator has not set up payments yet" }
    }

    let razorpay
    try {
        razorpay = new Razorpay({
            key_id: creator.razorpayid,
            key_secret: decrypt(creator.razorpaysecret),
        })
    } catch (err) {
        console.error("Secret decrypt error:", err)
        return { error: "Payment setup error. Please try again later." }
    }

    // ab Razorpay order + DB record 
    let order
    try {
        order = await razorpay.orders.create({
            amount: amt * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        })
    } catch (err) {
        console.error("Razorpay order error:", err)
        return { error: "Could not start payment. Creator's Razorpay keys may be invalid." }
    }

    await Payment.create({
        name,
        to_user: to_username,
        oid: order.id,
        amount: amt,
        message,
        done: false,
    })

    return {
        orderId: String(order.id),
        amount: Number(order.amount),
        currency: String(order.currency),
        receipt: String(order.receipt),
        key_id: creator.razorpayid,     // pehle process.env.NEXT_PUBLIC_KEY_ID tha
    }
}


// Public page ke liye: sirf safe fields (email, razorpay keys kabhi nahi)
export const fetchuser = async (username) => {
    await dbConnect()

    if (typeof username !== "string") {
        return { error: "Invalid username" }
    }
    const user = await User.findOne({ username })
        .select(" -razorpaysecret -email").lean()
    if (!user) {
        return { error: "User not found" }
    }

    return JSON.parse(JSON.stringify(user))
}


// Supporters list: sirf successful payments, sirf zaroori fields
export const fetchpayments = async (username) => {
    if (typeof username !== "string") return { list: [], total: 0, totalRaised: 0 }
    await dbConnect()

    const [list, total, sumResult] = await Promise.all([
        Payment.find({ to_user: username, done: true })
            .select("name amount message createdAt").sort({ amount: -1 }).limit(10).lean(),
        Payment.countDocuments({ to_user: username, done: true }),
        Payment.aggregate([
            { $match: { to_user: username, done: true } },
            { $group: { _id: null, sum: { $sum: "$amount" } } },
        ]),
    ])

    return {
        list: JSON.parse(JSON.stringify(list)),
        total,
        totalRaised: sumResult[0]?.sum || 0,
    }
}

// Dashboard ke liye: sirf apna hi profile update kar sakta hai, isliye session check
const RESERVED = ["dashboard", "login", "signup", "api", "yourpage", "about", "notfound", "explore", "me"]

export const updateprofile = async (data) => {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return { error: "Please login first" }

    await dbConnect()
    const f = Object.fromEntries(data)

    const me = await User.findOne({ email: session.user.email })
    if (!me) return { error: "User not found" }

    const newUsername = (f.username || "").trim()

    if (newUsername !== me.username) {
        if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(newUsername)) {
            return { error: "Username must be 3-30 characters (letters, numbers, _ . -)" }
        }
        if (RESERVED.includes(newUsername.toLowerCase())) {
            return { error: "This username is not allowed" }
        }
        const taken = await User.findOne({
            username: new RegExp(`^${escapeRegex(newUsername)}$`, "i"),
            _id: { $ne: me._id },
        })
        if (taken) return { error: "Username already exists" }
    }

    if (!f.name?.trim()) return { error: "Name is required" }
    if (f.profilepic && !/^https?:\/\//i.test(f.profilepic)) return { error: "Invalid profile picture URL" }
    if (f.coverpic && !/^https?:\/\//i.test(f.coverpic)) return { error: "Invalid cover picture URL" }
    if (f.razorpayid && f.razorpayid !== me.razorpayid && !f.razorpaysecret) {
        return { error: "If Key ID is changed, then Key Secret is also required" }
    }
    const updates = {
        name: f.name,
        username: newUsername,
        profilepic: f.profilepic,
        coverpic: f.coverpic,
        profilecompleted: Boolean(newUsername && f.name && (f.razorpayid || me.razorpayid) && (f.razorpaysecret || me.razorpaysecret)),
    }
    if (f.razorpayid) updates.razorpayid = f.razorpayid
    if (f.razorpaysecret) updates.razorpaysecret = encrypt(f.razorpaysecret.trim())

    const oldUsername = me.username
    await User.findOneAndUpdate({ email: session.user.email }, updates)

    if (newUsername !== oldUsername) {
        await Payment.updateMany({ to_user: oldUsername }, { to_user: newUsername })
        await Post.updateMany({ creatorusername: oldUsername }, { creatorusername: newUsername })
    }

    return { success: true, profilecompleted: updates.profilecompleted }
}


// Session se email -> DB se current user (username/role kabhi stale nahi hoga)
const getCurrentUser = async () => {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return null
    await dbConnect()
    return User.findOne({ email: session.user.email }).select("username role email").lean()
}

// Sirf creator post bana sakta hai. Caption ya image, koi ek bhi chalega
export const createpost = async (data) => {
    const me = await getCurrentUser()
    if (!me) return { error: "Please login first" }
    if (me.role !== "creator") return { error: "Only creators can create posts" }
    if (!me.username) return { error: "Complete your profile first" }

    const caption = (data?.caption || "").trim()
    const image = (data?.image || "").trim()

    if (!caption && !image) return { error: "Add a caption or an image" }
    if (caption.length > 300) return { error: "Caption should be 300 characters or less" }
    if (image && !/^https?:\/\//i.test(image)) return { error: "Invalid image URL" }

    const post = await Post.create({ creatorusername: me.username, caption, image })
    return { success: true, postId: String(post._id) }
}

// Public: koi bhi kisi creator ki posts dekh sakta hai
export const fetchposts = async (username) => {
    await dbConnect()


    if (typeof username !== "string") {
        return { error: "Invalid username" }
    }
    const posts = await Post.find({ creatorusername: username })
        .select("caption image likecount createdAt")
        .sort({ createdAt: -1 })
        .lean()

    return JSON.parse(JSON.stringify(posts))
}

// Sirf apni post delete hogi (ownership check query ke andar hi hai)
export const deletepost = async (postId) => {
    const me = await getCurrentUser()
    if (!me) return { error: "Please login first" }
    if (!mongoose.isValidObjectId(postId)) return { error: "Invalid post" }

    const result = await Post.deleteOne({ _id: postId, creatorusername: me.username })
    if (result.deletedCount === 0) return { error: "Post not found or not yours" }
    await Like.deleteMany({
        postId
    })

    return { success: true }
}

// Login zaroori. Already like hai to unlike, warna like — ek hi function se dono
export const togglelike = async (postId) => {
    const me = await getCurrentUser()
    if (!me) return { error: "Please login first" }
    if (!mongoose.isValidObjectId(postId)) return { error: "Invalid post" }

    const existing = await Like.findOne({ postId, userEmail: me.email })

    if (existing) {
        await Like.deleteOne({ _id: existing._id })
        await Post.findByIdAndUpdate(postId, { $inc: { likecount: -1 } })
        return { success: true, liked: false }
    }

    try {
        await Like.create({ postId, userEmail: me.email })
        await Post.findByIdAndUpdate(postId, { $inc: { likecount: 1 } })
        return { success: true, liked: true }
    } catch (err) {
        // Race condition: dusri request ne already like kar diya
        if (err.code === 11000) return { error: "Already liked" }
        return { error: "Could not like post" }
    }
}

// Public feed ke liye: current user ne kaunsi posts like ki hain (highlight ke liye)
export const fetchmylikes = async (postIds) => {
    const me = await getCurrentUser()
    if (!me) return []

    await dbConnect()
    const likes = await Like.find({ postId: { $in: postIds }, userEmail: me.email })
        .select("postId").lean()

    return likes.map((l) => String(l.postId))
}


// Fans ko apni profile me pta chlega kis kis creator ko like kiya hai, aur kitni posts pr kiya hai
export const fetchmylikedcreators = async () => {
    const me = await getCurrentUser()
    if (!me) return []

    await dbConnect()

    const data = await Like.aggregate([
        { $match: { userEmail: me.email } },
        { $lookup: { from: "posts", localField: "postId", foreignField: "_id", as: "post" } },
        { $unwind: "$post" },
        { $group: { _id: "$post.creatorusername", postsLiked: { $sum: 1 } } },
        { $lookup: { from: "users", localField: "_id", foreignField: "username", as: "creator" } },
        { $unwind: "$creator" },
        {
            $project: {
                _id: 0,
                username: "$_id",
                postsLiked: 1,
                name: "$creator.name",
                profilepic: "$creator.profilepic",
            },
        },
        { $sort: { postsLiked: -1 } },
    ])

    return JSON.parse(JSON.stringify(data))
}

// Creator ki total posts aur un sabka combined likes count
export const fetchpoststats = async (username) => {
    if (typeof username !== "string") return { totalPosts: 0, totalLikes: 0 }
    await dbConnect()

    const result = await Post.aggregate([
        { $match: { creatorusername: username } },
        {
            $group: {
                _id: null,
                totalPosts: { $sum: 1 },
                totalLikes: { $sum: "$likecount" },
            },
        },
    ])

    return {
        totalPosts: result[0]?.totalPosts || 0,
        totalLikes: result[0]?.totalLikes || 0,
    }
}

// Last 30 din ka daily earnings, graph ke liye. Missing din ₹0 se fill hote hain
export const fetchearningsgraph = async (username) => {
    if (typeof username !== "string") return []
    const me = await getCurrentUser()
    if (!me || me.username !== username) return []
    await dbConnect()

    const since = new Date()
    since.setUTCHours(0, 0, 0, 0)
    since.setUTCDate(since.getUTCDate() - 29)

    const raw = await Payment.aggregate([
        { $match: { to_user: username, done: true, createdAt: { $gte: since } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                total: { $sum: "$amount" },
            },
        },
    ])

    const map = Object.fromEntries(raw.map((r) => [r._id, r.total]))

    const result = []
    for (let i = 0; i < 30; i++) {
        const d = new Date(since)
        d.setUTCDate(d.getUTCDate() + i)
        const key = d.toISOString().slice(0, 10)
        result.push({
            date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" }),
            amount: map[key] || 0,
        })
    }

    return result
}

// Explore page: saare completed creators, total raised ke hisaab se sorted
export const fetchexplorecreators = async () => {

    await dbConnect()

    const creators = await User.aggregate([
        { $match: { role: "creator", profilecompleted: true } },
        {
            $lookup: {
                from: "payments",
                let: { uname: "$username" },
                pipeline: [
                    { $match: { $expr: { $and: [{ $eq: ["$to_user", "$$uname"] }, { $eq: ["$done", true] }] } } },
                    { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
                ],
                as: "stats",
            },
        },
        {
            $project: {
                _id: 0,
                username: 1,
                name: 1,
                profilepic: 1,
                coverpic: 1,
                totalRaised: { $ifNull: [{ $arrayElemAt: ["$stats.total", 0] }, 0] },
                supporters: { $ifNull: [{ $arrayElemAt: ["$stats.count", 0] }, 0] },
            },
        },
        { $sort: { totalRaised: -1 } },
        { $limit: 50 },
    ])

    return JSON.parse(JSON.stringify(creators))
}