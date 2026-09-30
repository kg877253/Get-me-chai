"use client"
import React, { useState } from 'react'
import { initiatePayment } from '@/actions/useraction'

const PaymentForm = ({ username, creatorName }) => {
    const quickAmounts = [10, 25, 50, 100]

    const [paymentform, setPaymentform] = useState({ name: "", amount: "", message: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handlechange = (e) => {
        setError("")
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value })
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
            }

            const rzp1 = new window.Razorpay(options)
            rzp1.open()

        } catch (err) {
            console.error("Payment failed:", err)
            setError("Payment start nahi ho paayi. Dobara try karo.")
            setLoading(false)
        }
    }

    return (
        <div className="bg-[#131316] border border-white/10 rounded-3xl p-6 sm:p-9">
            <h2 className='text-lg sm:text-xl font-semibold mb-1 tracking-tight'>
                Buy {creatorName || username} a chai ☕
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
                        className={`flex-1 min-w-[70px] py-2.5 px-3 rounded-xl cursor-pointer text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed border ${Number(paymentform.amount) === amt
                                ? "bg-amber-500 border-amber-500 text-black"
                                : "bg-transparent border-white/10 hover:border-white/25 text-white/80"
                            }`}
                    >
                        ₹{amt}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default PaymentForm