"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login")
        else if (status === "authenticated" && session.user.role === "creator") router.push("/dashboard")
    }, [status])

    if (status === "loading") return <p className="text-white text-center mt-20">Loading...</p>

    return (
        <div className="flex justify-center px-4 py-12 bg-[#0a0e17] min-h-screen text-white">
            <div className="w-full max-w-xl bg-[#111826] border border-white/10 rounded-2xl p-8 shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-2 text-amber-100">Welcome, {session?.user?.name}</h1>
                <p className="text-gray-400 text-sm mb-8">{session?.user?.email}</p>

                <div className="bg-[#1a2333] border border-white/10 rounded-xl p-6 text-gray-400 text-sm">
                    You haven't supported or liked any creators yet.
                </div>
            </div>
        </div>
    )
}