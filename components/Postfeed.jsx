"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { togglelike, fetchmylikes } from '@/actions/useraction'
import { toast } from 'react-toastify'

const HeartIcon = ({ filled, size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
)

const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date).getTime()) / 1000
    if (diff < 60) return "just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

const PostCard = ({ post, creatorName, creatorPic, isLiked, likeCount, canLike, onToggle }) => {
    const [imgLoaded, setImgLoaded] = useState(false)
    const [imgFailed, setImgFailed] = useState(false)
    const [pop, setPop] = useState(false)
    const [burst, setBurst] = useState(false)
    const [avatarFailed, setAvatarFailed] = useState(false)

    const handleDoubleTap = () => {
        setBurst(true)
        setTimeout(() => setBurst(false), 700)
        if (!isLiked) {
            setPop(true)
            setTimeout(() => setPop(false), 300)
            onToggle()
        }
    }

    const handleLikeClick = () => {
        if (!isLiked) {
            setPop(true)
            setTimeout(() => setPop(false), 300)
        }
        onToggle()
    }

    return (
        <div className="bg-gradient-to-b from-[#15151a] to-[#111114] border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-all duration-300 hover:border-white/[0.14] hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)]">

            {/* Header */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5">
                {creatorPic && !avatarFailed ? (
                    <img
                        src={creatorPic}
                        alt=""
                        onError={() => setAvatarFailed(true)}
                        className="size-9 rounded-full object-cover ring-1 ring-white/10 shrink-0"
                    />
                ) : (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-sm font-bold text-amber-300 ring-1 ring-white/10">
                        {(creatorName || "U").charAt(0).toUpperCase()}
                    </span>
                )}
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{creatorName}</p>
                    <p className="text-[11px] text-white/35">{timeAgo(post.createdAt)}</p>
                </div>
            </div>

            {/* Image */}
            {post.image && !imgFailed && (
                <div
                    className="relative w-full bg-black/40 select-none"
                    onDoubleClick={handleDoubleTap}
                >
                    {!imgLoaded && <div className="w-full aspect-[4/3] animate-pulse bg-white/5" />}
                    <img
                        src={post.image}
                        alt=""
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgFailed(true)}
                        className={`w-full max-h-[560px] object-contain cursor-pointer transition-opacity duration-500 ${imgLoaded ? "opacity-100 block" : "opacity-0 absolute inset-0"
                            }`}
                    />
                    {/* Double-tap heart burst */}
                    {burst && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] animate-[heartburst_0.7s_ease-out]">
                                <HeartIcon filled size={90} />
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Caption */}
            {post.caption && (
                <div className="px-4 sm:px-5 pt-4 pb-1">
                    <p className="text-[15px] leading-[1.6] text-white/85 whitespace-pre-wrap break-words">
                        {post.caption}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center px-4 sm:px-5 py-3.5">
                <button
                    onClick={handleLikeClick}
                    title={canLike ? "" : "Login to like"}
                    className={`group flex items-center gap-2 rounded-full pl-1.5 pr-3.5 py-1.5 -ml-1.5 text-sm font-medium transition-all cursor-pointer active:scale-90 ${isLiked
                            ? "text-red-400 bg-red-400/10"
                            : "text-white/50 hover:text-red-400 hover:bg-red-400/[0.06]"
                        }`}
                >
                    <span className={`inline-flex transition-transform duration-300 ${pop ? "scale-125" : "scale-100"} group-hover:scale-110`}>
                        <HeartIcon filled={isLiked} />
                    </span>
                    <span className="tabular-nums">{likeCount > 0 ? likeCount : "Like"}</span>
                </button>
            </div>

            <style jsx>{`
                @keyframes heartburst {
                    0% { transform: scale(0.4); opacity: 0; }
                    30% { transform: scale(1.15); opacity: 1; }
                    50% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(1); opacity: 0; }
                }
            `}</style>
        </div>
    )
}

const PostsFeed = ({ posts, creatorName, creatorPic }) => {
    const { data: session, status } = useSession()
    const [likedIds, setLikedIds] = useState(new Set())
    const [counts, setCounts] = useState({})

    useEffect(() => {
        const initial = {}
        posts.forEach((p) => { initial[p._id] = p.likecount || 0 })
        setCounts(initial)
    }, [posts])

    useEffect(() => {
        if (status !== "authenticated" || posts.length === 0) return
        const load = async () => {
            const ids = await fetchmylikes(posts.map((p) => p._id))
            setLikedIds(new Set(ids))
        }
        load()
    }, [status, posts])

    const handleToggle = async (postId) => {
        if (status !== "authenticated") {
            toast.info("Login to like posts")
            return
        }

        const wasLiked = likedIds.has(postId)

        setLikedIds((prev) => {
            const next = new Set(prev)
            wasLiked ? next.delete(postId) : next.add(postId)
            return next
        })
        setCounts((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + (wasLiked ? -1 : 1) }))

        const res = await togglelike(postId)

        if (res.error) {
            setLikedIds((prev) => {
                const next = new Set(prev)
                wasLiked ? next.add(postId) : next.delete(postId)
                return next
            })
            setCounts((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + (wasLiked ? 1 : -1) }))
            toast.error(res.error)
        }
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="w-full max-w-2xl my-14 flex flex-col items-center gap-2 text-center text-white/40 text-sm">
                <span className="text-3xl">📭</span>
                No posts yet.
            </div>
        )
    }

    return (
        <div className="w-full max-w-2xl my-10 flex flex-col gap-5">
            {posts.map((post) => (
                <PostCard
                    key={post._id}
                    post={post}
                    creatorName={creatorName}
                    creatorPic={creatorPic}
                    isLiked={likedIds.has(post._id)}
                    likeCount={counts[post._id] ?? post.likecount ?? 0}
                    canLike={status === "authenticated"}
                    onToggle={() => handleToggle(post._id)}
                />
            ))}
        </div>
    )
}

export default PostsFeed