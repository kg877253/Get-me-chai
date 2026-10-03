import Link from "next/link"
import { fetchexplorecreators } from "@/actions/useraction"

export const metadata = { title: "Explore Creators - Get Me A Chai" }
export const dynamic = "force-dynamic" // har baar fresh data

const ExplorePage = async () => {
    const creators = await fetchexplorecreators()

    return (
        <div className="px-3 text-white">
            <div className="mx-auto max-w-6xl px-2 py-10">
                <h1 className="mb-2 text-3xl font-bold">Explore Creators</h1>
                <p className="mb-8 text-gray-400">Discover creators and support their work.</p>

                {creators.length === 0 ? (
                    <p className="text-gray-400">No creators yet. Be the first!</p>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {creators.map((c, i) => (
                            <Link
                                key={c.username}
                                href={`/${c.username}`}
                                className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-amber-500/60"
                            >
                                <div className="relative h-28 bg-gradient-to-r from-amber-900/40 to-slate-900">
                                    {c.coverpic && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={c.coverpic} alt="" className="h-full w-full object-cover" />
                                    )}
                                    {i < 3 && (
                                        <span className="absolute right-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-black">
                                            #{i + 1}
                                        </span>
                                    )}
                                </div>

                                <div className="relative -mt-8 px-4 pb-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={c.profilepic || "/avatar.gif"}
                                        alt={c.name}
                                        className="h-16 w-16 rounded-full border-4 border-[#0b1220] bg-slate-800 object-cover"
                                    />
                                    <h2 className="mt-2 text-lg font-semibold transition group-hover:text-amber-400">{c.name}</h2>
                                    <p className="text-sm text-gray-400">@{c.username}</p>

                                    <div className="mt-3 flex gap-4 text-sm text-gray-300">
                                        <span>₹{c.totalRaised.toLocaleString("en-IN")} raised</span>
                                        <span>{c.supporters} supporter{c.supporters !== 1 && "s"}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExplorePage