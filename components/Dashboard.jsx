"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { fetchuser, updateprofile } from '@/actions/useraction'
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
    const [savedpic, setSavedpic] = useState("")

    useEffect(() => {
        if (status === "unauthenticated") router.push('/login')
        if (status === "authenticated") getuser()   // session aane ke baad hi
    }, [status])

    const getuser = async () => {
        const user = await fetchuser(session.user.username)
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
    }
    if (status === "loading") return <p className="text-white text-center mt-20">Loading...</p>

    return (
        <>
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
        </>
    )
}

export default Dashboard