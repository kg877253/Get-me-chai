"use client"

import React from 'react'
import Script from 'next/script'
import { useState, useEffect } from 'react'
import { fetchuser, fetchpayments, fetchposts } from '@/actions/useraction'
import { toast, Bounce } from 'react-toastify'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import SupportersList from './Supporterlist'
import PaymentForm from './PaymentForm'
import PostsFeed from './Postfeed'
import PostsManager from './Postmanager'

const ShareIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.6" y1="10.6" x2="15.4" y2="6.4" /><line x1="8.6" y1="13.4" x2="15.4" y2="17.6" />
    </svg>
)

const Paymentpage = ({ username }) => {
    const SearchParams = useSearchParams()
    const router = useRouter()

    const [currentuser, setcurrentuser] = useState({})
    const [payments, setpayments] = useState([])
    const [totalSupporters, setTotalSupporters] = useState(0)
    const [totalRaised, setTotalRaised] = useState(0)
    const [posts, setPosts] = useState([])
    const [mounted, setMounted] = useState(false)
    const [role, setrole] = useState()

    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState("home")
    const isOwner = session?.user?.username === username
    const tabs = isOwner ? ["Home", "Your Posts"] : ["Home", "Support"]

    useEffect(() => {
        getuser();
        const t = setTimeout(() => setMounted(true), 60)
        return () => clearTimeout(t)
    }, [])

    useEffect(() => {
        if (SearchParams.get("paymentdone") === "true") {
            toast.success('Thank you for your support!', {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
                transition: Bounce,
            });
            router.replace(`/${username}`)
        }
    }, [])

    const getuser = async () => {
        try {
            const user = await fetchuser(username);
            setcurrentuser(user);
            setrole(user.role);
            const data = await fetchpayments(username);
            const postsData = await fetchposts(username)
            setPosts(postsData)
            setpayments(data.list);
            setTotalSupporters(data.total);
            setTotalRaised(data.totalRaised);
        } catch (err) {
            console.error("User load nahi hua:", err)
        }
    }

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard', { theme: "dark", autoClose: 2000 })
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
            <div className="min-h-screen bg-[#02060f]/60 text-white flex flex-col items-center">

                {/* Full-bleed cover */}
                <div className={`relative w-full transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
                    <div className="w-full h-40 sm:h-56 md:h-72 overflow-hidden bg-slate-900">
                        {currentuser.coverpic
                            ? <img src={currentuser.coverpic} alt="" className='w-full h-full object-cover' />
                            : <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-black/30" />
                    </div>

                    <button
                        onClick={copyLink}
                        className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-1.5 bg-black/50 hover:bg-black/70 backdrop-blur border border-white/10 text-xs font-medium px-3.5 py-2 rounded-full cursor-pointer transition"
                    >
                        <ShareIcon /> Share
                    </button>

                    <div className='absolute -bottom-11 sm:-bottom-14 left-1/2 -translate-x-1/2'>
                        <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-[3px] border-[#0a0a0c] ring-1 ring-white/10 bg-slate-800 shadow-xl shadow-black/50">
                            {currentuser.profilepic
                                ? <img src={currentuser.profilepic} alt="" className='w-full h-full object-cover' />
                                : <div className="w-full h-full flex items-center justify-center text-3xl text-slate-500">?</div>}
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-6xl px-4 sm:px-8 flex flex-col items-center">

                    {/* Name + stats */}
                    <div className={`mt-16 sm:mt-20 flex flex-col items-center gap-3 text-center transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                        <h1 className='text-2xl sm:text-3xl font-semibold tracking-tight break-words'>
                            {currentuser.name || `@${username}`}
                        </h1>
                        <p className='text-sm text-white/40 -mt-2'>@{username}</p>

                        <div className="flex items-center gap-6 mt-2 text-sm">
                            <div className="text-center">
                                <p className="text-lg font-semibold">{totalSupporters}</p>
                                <p className="text-white/40 text-xs">Supporters</p>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="text-center">
                                <p className="text-lg font-semibold text-amber-400">₹{totalRaised}</p>
                                <p className="text-white/40 text-xs">Raised</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-8 border-b border-white/10 w-full max-w-md justify-center">
                        {tabs.map((tab) => {
                            const key = tab.toLowerCase().replace(" ", "-")
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition cursor-pointer ${activeTab === key
                                        ? "border-amber-400 text-white"
                                        : "border-transparent text-white/40 hover:text-white/70"
                                        }`}
                                >
                                    {tab}
                                </button>
                            )
                        })}
                    </div>

                    {/* Supporters + Payment */}
                    {(activeTab === "home" && isOwner) || activeTab === "support" ? (
                        <div className={`grid my-10 md:my-16 gap-6 md:gap-8 w-full transition-all duration-700 delay-200 
                            ${isOwner ? "grid-cols-1 max-w-[60%] mx-auto" : "grid-cols-1 md:grid-cols-2"
                            } ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                            <SupportersList payments={payments} totalSupporters={totalSupporters} />
                            {!isOwner && <PaymentForm username={username} creatorName={currentuser.name} />}
                        </div>
                    ) : null}
                    {activeTab === "home" && !isOwner && (
                        <PostsFeed posts={posts} creatorName={currentuser.name || username} creatorPic={currentuser.profilepic} />
                    )}
                    {activeTab === "your-posts" && (
                        <PostsManager posts={posts} onPostsChange={getuser} username={username} />
                    )}
                </div>
            </div>
        </>
    )
}

export default Paymentpage