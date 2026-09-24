"use server"

import Razorpay from "razorpay"
import dbConnect from "@/db/connect"
import Payment from "@/models/payment"
import User from "@/models/user"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

// Order create + payment record create + order details client ko return
// Errors throw nahi karte, return karte hain (production me thrown error ka message client tak nahi pahunchta)
export const initiatePayment = async (amount, to_username, paymentform) => {
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

    const razorpay = new Razorpay({
        key_id: creator.razorpayid,
        key_secret: creator.razorpaysecret,
    })

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
        key_id: creator.razorpayid,     // pehle process.env.NEXT_PUBLIC_KEY_ID tha
    }
}


// Public page ke liye: sirf safe fields (email, razorpay keys kabhi nahi)
export const fetchuser = async (username) => {
    await dbConnect()

    const user = await User.findOne({ username })
        .select(" -razorpaysecret -email").lean()
    if (!user) {
        return { error: "User not found" }
    }

    return JSON.parse(JSON.stringify(user))
}


// Supporters list: sirf successful payments, sirf zaroori fields
export const fetchpayments = async (username) => {
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
const RESERVED = ["dashboard", "login", "signup", "api", "yourpage", "about", "notfound"]

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
        const taken = await User.findOne({ username: newUsername })
        if (taken) return { error: "Username already exists" }
    }

    const updates = {
        name: f.name,
        username: newUsername,
        profilepic: f.profilepic,
        coverpic: f.coverpic,
    }
    if (f.razorpayid) updates.razorpayid = f.razorpayid
    if (f.razorpaysecret) updates.razorpaysecret = f.razorpaysecret

    const oldUsername = me.username
    await User.findOneAndUpdate({ email: session.user.email }, updates)

    if (newUsername !== oldUsername) {
        await Payment.updateMany({ to_user: oldUsername }, { to_user: newUsername })
    }

    return { success: true }
}