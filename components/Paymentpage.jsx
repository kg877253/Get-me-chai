"use client"

import React from 'react'
import Script from 'next/script'
import { useState, useEffect } from 'react'
import { initiatePayment, fetchuser, fetchpayments } from '@/actions/useraction'
import { toast, Bounce } from 'react-toastify'
import { useSearchParams, useRouter } from 'next/navigation'

const ShareIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.6" y1="10.6" x2="15.4" y2="6.4" /><line x1="8.6" y1="13.4" x2="15.4" y2="17.6" />
    </svg>
)

const Paymentpage = ({ username }) => {
    const SearchParams = useSearchParams()
    const router = useRouter()

    const [paymentform, setPaymentform] = useState({ name: "", amount: "", message: "" })
    const [currentuser, setcurrentuser] = useState({})
    const [payments, setpayments] = useState([])
    const [totalSupporters, setTotalSupporters] = useState(0)
    const [totalRaised, setTotalRaised] = useState(0)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    const quickAmounts = [10, 25, 50, 100]

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
            const data = await fetchpayments(username);
            setpayments(data.list);
            setTotalSupporters(data.total);
            setTotalRaised(data.totalRaised);
        } catch (err) {
            console.error("User load nahi hua:", err)
        }
    }

    const handlechange = (e) => {
        setError("")
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value })
    }

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard', { theme: "dark", autoClose: 2000 })
    }

    const pay = async (amount) => {
        setError("")

        if (!paymentform.name.trim()) {
            setError("Please enter your name")
            return
        }
        const amt = Number(amount)
        if (!Number.isInteger(amt) || amt < 1) {
            setError("Please enter a valid amount (₹1 or more)")
            return
        }

        setLoading(true)
        try {
            const a = await initiatePayment(amt, username, paymentform)

            if (a.error) {
                setError(a.error)
                setLoading(false)
                return
            }

            const options = {
                key: a.key_id,
                amount: a.amount,
                currency: a.currency,
                name: "Get me chai",
                description: "Support the creator",
                order_id: a.orderId,
                callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/razorpay`,
                prefill: { name: paymentform.name },
                notes: { address: "Get-me-chai" },
                theme: { color: "#d97706" },
                modal: { ondismiss: () => setLoading(false) }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (err) {
            console.error("Payment failed:", err);
            setError("Payment start nahi ho paayi. Dobara try karo.")
            setLoading(false)
        }
    }

    const topSupporterId = payments[0]?._id

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

            <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center">

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

                    {/* Supporters + Payment */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 my-10 md:my-16 gap-6 md:gap-8 w-full transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>

                        <div className="bg-[#131316] border border-white/10 rounded-3xl p-6 sm:p-9">
                            <h2 className='text-lg sm:text-xl font-semibold mb-1 tracking-tight'>
                                Supporters
                            </h2>
                            <p className="text-sm text-white/40 mb-6">
                                {totalSupporters > 10 ? `Top 10 of ${totalSupporters}` : `${totalSupporters} total`}
                            </p>
                            <ul className='chai-scroll overflow-auto max-h-[340px] sm:max-h-[380px] space-y-1 pr-1 -mr-1'>
                                {payments.length === 0 && (
                                    <li className='text-white/40 text-sm py-10 text-center'>No supporters yet. Be the first.</li>
                                )}
                                {payments.map((p) => (
                                    <li key={p._id} className='flex gap-3 items-start hover:bg-white/[0.04] transition-colors duration-150 rounded-xl p-3'>
                                        <img className='w-9 h-9 rounded-full shrink-0 ring-1 ring-white/10 p-1' src="/avatar.gif" alt="" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className='text-sm font-medium break-words'>{p.name}</p>
                                                <span className="text-amber-400 text-sm font-semibold shrink-0">₹{p.amount}</span>
                                            </div>
                                            {p.message && (
                                                <p className="text-xs text-white/40 break-words mt-0.5">
                                                    "{p.message}"
                                                </p>
                                            )}
                                            {p._id === topSupporterId && (
                                                <span className="inline-block mt-1.5 text-[10px] uppercase tracking-wider text-amber-400/80 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                                                    Top supporter
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-[#131316] border border-white/10 rounded-3xl p-6 sm:p-9">
                            <h2 className='text-lg sm:text-xl font-semibold mb-1 tracking-tight'>
                                Buy {currentuser.name || username} a chai ☕
                            </h2>
                            <p className="text-sm text-white/40 mb-6">Every bit helps keep the work going.</p>

                            <form className='flex flex-col gap-3'>
                                <input
                                    name='name'
                                    onChange={handlechange}
                                    value={paymentform.name}
                                    type="text"
                                    placeholder='Your name'
                                    className={`bg-[#0e0e10] border border-white/10 p-3 rounded-xl w-full text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 placeholder:text-white/30 transition ${error.toLowerCase().includes("name") ? "border-red-500/60 ring-1 ring-red-500/20" : ""}`}
                                />
                                <input
                                    name='amount'
                                    onChange={handlechange}
                                    value={paymentform.amount}
                                    type="number"
                                    min="1"
                                    placeholder='Amount (₹)'
                                    className='bg-[#0e0e10] border border-white/10 p-3 rounded-xl w-full text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 placeholder:text-white/30 transition'
                                />
                                <div>
                                    <input
                                        name='message'
                                        onChange={handlechange}
                                        value={paymentform.message}
                                        type="text"
                                        maxLength={200}
                                        placeholder='Say something nice (optional)'
                                        className='bg-[#0e0e10] border border-white/10 p-3 rounded-xl w-full text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 placeholder:text-white/30 transition'
                                    />
                                    <p className="text-[11px] text-white/25 text-right mt-1">{paymentform.message.length}/200</p>
                                </div>

                                {error && <p className='text-red-400 text-sm'>{error}</p>}

                                <button
                                    type="button"
                                    disabled={loading}
                                    className='w-full mt-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl cursor-pointer transition active:scale-[0.98]'
                                    onClick={() => pay(paymentform.amount)}
                                >
                                    {loading ? "Processing..." : `Donate ${paymentform.amount ? `₹${paymentform.amount}` : ""}`}
                                </button>
                            </form>

                            <p className="text-xs text-white/30 mt-5 mb-2.5">Quick amount</p>
                            <div className="flex flex-wrap gap-2">
                                {quickAmounts.map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        disabled={loading}
                                        onClick={() => { setPaymentform({ ...paymentform, amount: amt }); setError("") }}
                                        className={`flex-1 min-w-[70px] py-2.5 px-3 rounded-xl cursor-pointer text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed border ${
                                            Number(paymentform.amount) === amt
                                                ? "bg-amber-500 border-amber-500 text-black"
                                                : "bg-transparent border-white/10 hover:border-white/25 text-white/80"
                                        }`}
                                    >
                                        ₹{amt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Paymentpage