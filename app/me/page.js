"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchmylikedcreators } from "@/actions/useraction"
import Link from "next/link"

export default function MePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [likedCreators, setLikedCreators] = useState([])
    const [loadingLikes, setLoadingLikes] = useState(true)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        } else if (status === "authenticated" && session.user.role === "creator") {
            router.push("/dashboard")
        } else if (status === "authenticated") {
            fetchmylikedcreators().then((data) => {
                setLikedCreators(data)
                setLoadingLikes(false)
            })
        }
    }, [status])

    if (status === "loading") return <p className="text-white text-center mt-20">Loading...</p>

    return (
        <div className="flex justify-center px-4 py-12 bg-[#0a0e17] min-h-screen text-white">
            <div className="w-full max-w-xl bg-[#111826] border border-white/10 rounded-2xl p-8 shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-2 text-amber-100">Welcome, {session?.user?.name}</h1>
                <p className="text-gray-400 text-sm mb-8">{session?.user?.email}</p>

                <div className="bg-[#1a2333] border border-white/10 rounded-xl p-6 text-gray-400 text-sm">
                    <p className="mb-4 text-left">Creators you've liked:</p>

                    {loadingLikes ? (
                        <p className="text-white/40">Loading...</p>
                    ) : likedCreators.length === 0 ? (
                        <p>You haven't liked any creators yet.</p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {likedCreators.map((creator) => (
                                <li key={creator.username}>
                                    <Link
                                        href={`/${creator.username}`}
                                        className="flex items-center justify-between gap-3 bg-[#0e1420] hover:bg-[#0e1420]/70 rounded-lg px-4 py-2.5 transition"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            {creator.profilepic ? (
                                                <img src={creator.profilepic} alt="" className="size-8 rounded-full object-cover" />
                                            ) : (
                                                <span className="flex size-8 items-center justify-center rounded-full bg-amber-400/15 text-xs font-bold text-amber-300">
                                                    {(creator.name || creator.username).charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                            <span className="text-amber-100">{creator.name || creator.username}</span>
                                        </span>
                                        <span className="text-white/40 text-xs">{creator.postsLiked} post{creator.postsLiked > 1 ? "s" : ""}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}