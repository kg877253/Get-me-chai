"use client"
import React from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-[#111826] border border-white/10 rounded-2xl p-5 flex items-center gap-4 transition hover:border-white/20 hover:-translate-y-0.5 duration-200">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-white leading-none">{value}</p>
            <p className="text-gray-400 text-xs mt-1">{label}</p>
        </div>
    </div>
)

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-[#1a2333] border border-amber-400/30 rounded-lg px-3.5 py-2.5 shadow-xl">
            <p className="text-white/50 text-xs mb-0.5">{label}</p>
            <p className="text-amber-400 font-bold text-sm">₹{payload[0].value}</p>
        </div>
    )
}

const DashboardEarnings = ({ totalRaised, totalSupporters, graphData }) => {
    const best = graphData.reduce((max, d) => (d.amount > max.amount ? d : max), { amount: 0, date: "-" })
    const avgPerSupporter = totalSupporters > 0 ? Math.round(totalRaised / totalSupporters) : 0

    return (
        <div className="flex flex-col gap-6">

            <div className="grid sm:grid-cols-3 gap-4">
                <StatCard
                    label="Total Raised"
                    value={`₹${totalRaised}`}
                    color="bg-green-500/15 text-green-400"
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
                />
                <StatCard
                    label="Supporters"
                    value={totalSupporters}
                    color="bg-blue-500/15 text-blue-400"
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2M17 11l2 2 4-4" /></svg>}
                />
                <StatCard
                    label="Avg / Supporter"
                    value={`₹${avgPerSupporter}`}
                    color="bg-amber-500/15 text-amber-400"
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>}
                />
            </div>

            <div className="bg-[#111826] border border-white/10 rounded-2xl p-5 sm:p-7">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-sm font-semibold text-white/90">Earnings — last 30 days</p>
                        {best.amount > 0 && (
                            <p className="text-xs text-white/40 mt-0.5">Best day: {best.date} · ₹{best.amount}</p>
                        )}
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={graphData} margin={{ top: 5, right: 10, left: 5, bottom: 0 }}>
                        <defs>
                            <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.35} />
                                <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: "#ffffff50", fontSize: 11 }}
                            axisLine={{ stroke: "#ffffff1a" }}
                            tickLine={false}
                            interval={4}
                        />
                        <YAxis
                            tick={{ fill: "#ffffff50", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            width={45}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#fbbf24", strokeWidth: 1, strokeDasharray: "4 4" }} />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#fbbf24"
                            strokeWidth={2}
                            fill="url(#earningsFill)"
                            dot={{ r: 2, fill: "#fbbf24" }}
                            activeDot={{ r: 5, fill: "#fbbf24", stroke: "#0f1724", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default DashboardEarnings