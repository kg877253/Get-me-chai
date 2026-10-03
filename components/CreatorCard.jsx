"use client"

import Link from "next/link"
import { useState } from "react"

const CreatorCard = ({ creator, index }) => {
    const [transform, setTransform] = useState(
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)"
    )

    const handleMouseMove = (e) => {
        const card = e.currentTarget
        const rect = card.getBoundingClientRect()

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const maxTilt = 5
        const rotateY =
            ((x - centerX) / centerX) * maxTilt

        const rotateX =
            ((centerY - y) / centerY) * maxTilt

        setTransform(
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
        )
    }

    const handleMouseLeave = () => { setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)") }

    return (
        <Link
            href={`/${creator.username}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform,
                transition: "transform 0.15s ease-out",
                transformStyle: "preserve-3d",
            }}
            className="group block overflow-hidden rounded-xl border border-white/10 bg-white/5 hover:border-amber-500/60"
        >
            {/* Cover */}
            <div className="relative h-28 overflow-hidden bg-gradient-to-r from-amber-900/40 to-slate-900">
                {creator.coverpic && (
                    <img
                        src={creator.coverpic}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                )}

                {index < 3 && (
                    <span className="absolute right-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-black">
                        #{index + 1}
                    </span>
                )}
            </div>

            {/* Creator Info */}
            <div className="relative -mt-8 px-4 pb-4">
                <img
                    src={creator.profilepic || "/avatar.gif"}
                    alt={creator.name}
                    className="h-16 w-16 rounded-full border-4 border-[#121b2b] bg-slate-800 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <h2 className="mt-2 text-lg font-semibold transition-colors duration-300 group-hover:text-amber-400">
                    {creator.name}
                </h2>

                <p className="text-sm text-gray-400">
                    @{creator.username}
                </p>

                <div className="mt-3 flex gap-4 text-sm text-gray-300">
                    <span>
                        ₹{creator.totalRaised.toLocaleString("en-IN")} raised
                    </span>

                    <span>
                        {creator.supporters} supporter
                        {creator.supporters !== 1 && "s"}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default CreatorCard