"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { fetchuser, updateprofile, fetchpayments, fetchearningsgraph } from '@/actions/useraction'
import { toast } from 'react-toastify'

const Dashboard = () => {
    const inputClass = "w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 placeholder:text-gray-500 transition"
    const labelClass = "block text-sm text-gray-300 mb-1.5"

    const { data: session, status, update } = useSession()
    const router = useRouter()

    const [form, setform] = useState({
        name: "",
        username: "",
        profilepic: "",
        coverpic: "",
        razorpayid: "",
        razorpaysecret: "",
    })
    const [payments, setPayments] = useState({
        totalRaised: 0,
        total: 0
    })

    const [savedpic, setSavedpic] = useState("")
    const [profiledone, setprofiledone] = useState(false)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login')
        } else if (status === "authenticated" && session.user.role === "user") {
            router.push('/me')
        } else if (status === "authenticated" && session.user.role === "creator") {
            getuser()
        }
    }, [status])

    const getuser = async () => {
        const user = await fetchuser(session.user.username)
        const graphdata = await fetchearningsgraph("kartk_gupta_")
        console.log("Graph Data:", graphdata)
        if (user.error) return
        setform({
            ...form,
            name: user.name || "",
            username: user.username || "",
            profilepic: user.profilepic || "",
            coverpic: user.coverpic || "",
            razorpayid: user.razorpayid || "",
            razorpaysecret: user.razorpaysecret || "",
        })
        setSavedpic(user.profilepic || "")
        setprofiledone(user.profilecompleted === true)
    }

    const handlechange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const handlesubmit = async (formData) => {
        const res = await updateprofile(formData)
        if (res?.error) {
            toast.error(res.error)
            return
        }
        await update()
        setSavedpic(formData.get("profilepic"))
        toast.success('Profile updated successfully')
        setprofiledone(res.profilecompleted === true)   // server se aaya hua truth
    }

    useEffect(() => {
        if (session?.user?.username) {
            const getPayments = async () => {
                const data = await fetchpayments(session.user.username)
                setPayments(data)
            }

            getPayments()
        }
    }, [session])

    const totalraised = payments.totalRaised
    const supporters = payments.total

    if (status === "loading") return <p className="text-white text-center mt-20">Loading...</p>

    return (
        <>
            {profiledone && (
                
                <div className="flex justify-center px-4 py-12 bg-[#0a0e17] min-h-[75vh] max-h-[90vh] text-white">
                    <div className="w-full max-w-xl bg-[#111826] border border-white/10 rounded-2xl p-8 shadow-lg">

                        <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center border border-white/10 overflow-hidden mb-4">
                                {savedpic
                                    ? <img src={savedpic} alt="profile" className="w-full h-full object-cover " />
                                    : <span className="text-2xl">👤</span>}
                            </div>
                            <h1 className="text-2xl font-bold text-amber-100">{form.name}</h1>
                            <p className="text-gray-400 text-sm">@{form.username}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-[#1a2333] border border-white/10 rounded-xl p-4 text-center">
                                <p className="text-gray-400 text-xs mb-1">Total Raised</p>
                                <p className="text-xl font-bold text-green-400">₹{totalraised}</p>
                            </div>
                            <div className="bg-[#1a2333] border border-white/10 rounded-xl p-4 text-center">
                                <p className="text-gray-400 text-xs mb-1">Supporters</p>
                                <p className="text-xl font-bold text-blue-500">{supporters}</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <a href={`/${form.username}`} target="_blank" className="block text-center bg-blue-600 hover:bg-blue-700 transition py-2.5 rounded-lg font-semibold">
                                View My Page
                            </a>
                            <button onClick={() => setprofiledone(false)} className="w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 transition py-2.5 rounded-lg font-medium cursor-pointer">
                                Edit Settings
                            </button>
                        </div>

                        <div className="pt-4 border-t border-white/10 text-sm text-gray-400 space-y-1">
                            <p>Email:  {session.user.email}</p>
                        </div>
                        <div className="pt-4 border-t border-white/10 text-sm text-gray-400 space-y-1">
                            <p>Payment Method: Razorpay</p>
                        </div>
                    </div>
                </div>
            )}
            {!profiledone && (
                <div className="flex justify-center px-4 py-12 bg-[#0a0e17] min-h-screen text-white">
                    <form className="w-full max-w-xl bg-[#111826] border border-white/10 rounded-2xl p-8 shadow-lg" action={handlesubmit}>
                        <h2 className="text-2xl font-bold mb-8 text-center">Welcome to your Dashboard</h2>

                        <div className="flex justify-center md:mb-8 mb-4">
                            <div className="md:w-20 md:h-20 w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center border border-white/10 overflow-hidden">
                                {savedpic
                                    ? <img src={savedpic} alt="profile" className="w-full h-full object-cover" />
                                    : <span className="text-2xl">👤</span>}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className={labelClass}>Name</label>
                                <input type="text" name="name" value={form.name} onChange={handlechange} placeholder="Your full name" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Email</label>
                                <input type="email" value={session?.user?.email || ""} readOnly className={`${inputClass} opacity-60 cursor-not-allowed`} />
                            </div>
                            <div>
                                <label className={labelClass}>Username</label>
                                <input type="text" name="username" value={form.username} onChange={handlechange} placeholder="username" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Profile Picture URL</label>
                                <input type="text" name="profilepic" value={form.profilepic} onChange={handlechange} placeholder="https://..." className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Cover Picture URL</label>
                                <input type="text" name="coverpic" value={form.coverpic} onChange={handlechange} placeholder="https://..." className={inputClass} />
                            </div>

                            <div className="pt-2 border-t border-white/10">
                                <p className="text-sm font-semibold text-gray-300 mb-3">Razorpay Credentials</p>
                                <div>
                                    <label className={labelClass}>Key ID</label>
                                    <input type="text" name="razorpayid" value={form.razorpayid} onChange={handlechange} placeholder="rzp_test_xxxx" className={inputClass} />
                                </div>
                                <div className="h-4"></div>
                                <div>
                                    <label className={labelClass}>Key Secret</label>
                                    <input type="password" name="razorpaysecret" value={form.razorpaysecret} onChange={handlechange} placeholder="••••••••" className={inputClass} />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="mt-8 w-full bg-blue-600 hover:bg-blue-700 transition py-2.5 rounded-lg font-semibold cursor-pointer">
                            Save
                        </button>
                    </form>
                </div>
            )}

        </>
    )
}

export default Dashboard