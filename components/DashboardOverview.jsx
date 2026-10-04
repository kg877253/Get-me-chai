"use client"
import React from 'react'

const checklistItems = (form) => [
    { label: "Name added", done: !!form.name?.trim() },
    { label: "Username set", done: !!form.username?.trim() },
    { label: "Profile picture", done: !!form.profilepic?.trim() },
    { label: "Cover picture", done: !!form.coverpic?.trim() },
    { label: "Razorpay connected", done: !!form.razorpayid?.trim() },
]

const StatCard = ({ label, value, icon, color }) => (

    <div className="bg-[#111826] border border-white/10 rounded-2xl p-5 flex items-center gap-4 transition hover:border-white/20 hover:-translate-y-1 duration-300">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-white leading-none">{value}</p>
            <p className="text-gray-400 text-xs mt-1">{label}</p>
        </div>
    </div>

)

const DashboardOverview = ({ form, savedpic, email, postStats, username,onOpenEdit }) => {
    const items = checklistItems(form)
    const doneCount = items.filter((i) => i.done).length
    const percent = Math.round((doneCount / items.length) * 100)

    return (
        <div className="grid lg:grid-cols-3 gap-6">

            {/* Left: profile + stats */}
            <div className="lg:col-span-2 flex flex-col gap-6">

                {/* Profile header */}
                <div className="bg-gradient-to-br from-[#151e30] to-[#0f1724] border border-white/10 rounded-2xl p-6 sm:p-7">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center border-2 border-amber-400/30 overflow-hidden shrink-0">
                            {savedpic
                                ? <img src={savedpic} alt="profile" className="w-full h-full object-cover" />
                                : <span className="text-3xl">👤</span>}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{form.name}</h2>
                            <p className="text-amber-300/80 text-sm">@{form.username}</p>
                            <p className="text-gray-500 text-xs mt-1 truncate">{email}</p>
                        </div>
                    </div>

                    <a
                        href={`/${username}`}
                        target="_blank"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition"
                    >
                        View my public page
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7M7 7h10v10" /></svg>
                    </a>
                </div>

                {/* Stats */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <StatCard
                        label="Total Posts"
                        value={postStats.totalPosts}
                        color="bg-blue-500/15 text-blue-400"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>}
                    />
                    <StatCard
                        label="Total Likes"
                        value={postStats.totalLikes}
                        color="bg-red-500/15 text-red-400"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" /></svg>}
                    />
                </div>
            </div>

            {/* Right: checklist */}
            <div
                className="bg-[#111826] border border-white/10 rounded-2xl p-5 flex flex-col transition hover:border-amber-400/30 "
            >
                <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-white/90">Profile strength</p>
                    <span className="text-sm font-bold text-amber-400">{percent}%</span>
                </div>

                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-5">
                    <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${percent}%` }}
                    />
                </div>

                <ul className="flex flex-col gap-2.5">
                    {items.map((item) => (
                        <li key={item.label} className="flex items-center gap-2.5 text-sm">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${item.done ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/20 border border-white/10"
                                }`}>
                                {item.done ? (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
                                ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                )}
                            </span>
                            <span className={item.done ? "text-white/70" : "text-white/40"}>{item.label}</span>
                        </li>
                    ))}
                </ul>

                {percent <= 100 && (
                    <button onClick={onOpenEdit} className="mt-10 border-2 p-1 border-amber-400/30 rounded-3xl text-sm font-semibold cursor-pointer text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 hover:border-amber-400/50 transition-colors">
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    )
}

export default DashboardOverview