import React from 'react'
import { useSession } from 'next-auth/react'

const SupportersList = ({ payments, totalSupporters }) => {
    const topSupporterId = payments[0]?._id
    const { data: session } = useSession()
    const isCreator = session?.user?.role === "creator"

    return (
        <div className="bg-[#131316] border border-white/10 rounded-3xl p-6 sm:p-9">
            <h2 className='text-lg sm:text-xl font-semibold mb-1 tracking-tight'>
                Supporters
            </h2>
            <p className="text-sm text-white/40 mb-6">
                {totalSupporters > 10 ? `Top 10 of ${totalSupporters}` : `${totalSupporters} total`}
            </p>
            <ul className='chai-scroll overflow-auto max-h-[340px] sm:max-h-[380px] space-y-1 pr-1 -mr-1'>
                {payments.length === 0 && (
                    <li className="text-white/40 text-sm text-center py-10">
                        {isCreator ? "No supporters yet." : "No supporters yet. Support this creator to see your name here!"}
                    </li>
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
    )
}

export default SupportersList