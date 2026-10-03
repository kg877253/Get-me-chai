import { fetchexplorecreators } from "@/actions/useraction"
import CreatorCard from "@/components/CreatorCard"

export const metadata = {
    title: "Explore Creators - Get Me A Chai",
}

export const dynamic = "force-dynamic"

const ExplorePage = async () => {
    const creators = await fetchexplorecreators()

    const heightcalc =
        creators.length > 0
            ? `calc(90vh - 4.5rem - 3rem)`
            : `calc(90vh - 4.5rem)`

    return (
        <div
            className="px-3 text-white"
            style={{ height: heightcalc }}
        >
            <div className="mx-auto max-w-6xl px-2 py-10">

                {/* Page Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                        <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                            Explore Creators
                        </span>
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-400 md:text-base">
                        Discover creators, explore their work, and support
                        the people who inspire you.
                    </p>

                    <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                </div>

                {creators.length === 0 ? (
                    <p className="text-center text-gray-400">
                        No creators yet. Be the first!
                    </p>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {creators.map((creator, index) => (
                            <CreatorCard
                                key={creator.username}
                                creator={creator}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExplorePage