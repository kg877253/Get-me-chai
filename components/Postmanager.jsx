"use client"
import React, { useState, useEffect } from 'react'
import { createpost, deletepost, fetchtotallikes } from '@/actions/useraction'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'


const HeartIcon = ({ filled }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
)

const PostsManager = ({ posts, onPostsChange, username }) => {
    const [caption, setCaption] = useState("")
    const [image, setImage] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [totalLikes, setTotalLikes] = useState(0)

    useEffect(() => {
        const fetchTotalLikes = async () => {
            const likes = await fetchtotallikes(username)
            console.log("Total likes fetched:", likes)
            setTotalLikes(likes)
        }
        fetchTotalLikes()
    }, [username, posts]) // Re-fetch total likes whenever username or posts change

    const canSubmit = (caption.trim() || image.trim()) && !submitting

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!canSubmit) return

        setSubmitting(true)
        try {
            const res = await createpost({ caption, image })
            if (res.error) {
                toast.error(res.error)
                return
            }
            toast.success("Post created")
            setCaption("")
            setImage("")
            onPostsChange()
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (postId) => {
        const result = await Swal.fire({
            title: "Delete this post?",
            text: "This can't be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#3f3f46",
            background: "#131316",
            color: "#fff",
        })

        if (!result.isConfirmed) return

        const res = await deletepost(postId)
        if (res.error) {
            toast.error(res.error)
            return
        }
        toast.success("Post deleted")
        onPostsChange()
    }

    return (
        <div className="w-full max-w-2xl my-10 flex flex-col gap-6">
            {/* total posts of the creator */}
            <div className="totalinfo w-full *: flex flex-row justify-around mx-auto">
                <div className="text-center text-white/80 text-lg py-1">Total posts: <span className="text-amber-400">{posts.length}</span></div>
                <div className="text-center text-white/80 text-lg py-1">Total likes: <span className="text-amber-400">{totalLikes || 0}</span></div>
            </div>


            {/* Create post form */}
            <form onSubmit={handleSubmit} className="bg-[#131316] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-white/80">Create a post</h3>

                <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image URL (optional)"
                    className="bg-[#0e0e10] border border-white/10 p-3 rounded-xl w-full text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 placeholder:text-white/30 transition"
                />
                {image.trim() && (
                    <img
                        src={image}
                        alt=""
                        onError={(e) => { e.target.style.display = "none" }}
                        className="w-full max-h-76 object-contain rounded-xl border border-white/10"
                    />
                )}

                <div>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value.slice(0, 300))}
                        placeholder="Caption (optional)"
                        rows={3}
                        className="bg-[#0e0e10] border border-white/10 p-3 rounded-xl w-full text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 placeholder:text-white/30 transition resize-none"
                    />
                    <p className="text-[11px] text-white/25 text-right mt-1">{caption.length}/300</p>
                </div>

                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full mt-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-2.5 rounded-xl cursor-pointer transition active:scale-[0.98]"
                >
                    {submitting ? "Posting..." : "Post"}
                </button>
            </form>

            {/* Posts list */}
            {posts.length === 0 ? (
                <p className="text-center text-white/40 text-sm py-6">No posts yet.</p>
            ) : (
                <div className="flex flex-col gap-5">
                    {posts.map((post) => (
                        <div key={post._id} className="bg-[#131316] border border-white/10 rounded-2xl overflow-hidden">
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt=""
                                    onError={(e) => { e.target.style.display = "none" }}
                                    className="w-full max-h-[420px] object-contain"
                                />
                            )}
                            <div className="p-4 sm:p-5">
                                {post.caption && (
                                    <p className="text-sm text-white/90 whitespace-pre-wrap break-words">{post.caption}</p>
                                )}
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-3">
                                        <p className="text-xs text-white/30">
                                            {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                        <span className="flex items-center gap-1 text-xs ">
                                            <HeartIcon filled={true} />
                                            {post.likecount || 0}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        className="text-xs text-red-400/80 hover:text-red-400 cursor-pointer transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PostsManager