"use client"
import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { searchCreators } from "@/actions/useraction"

const MIN_CHARS = 2

const SearchBar = () => {
    
    const router = useRouter()
    const wrapperRef = useRef(null)

    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const trimmed = query.trim()
    const showResults = open && trimmed.length >= MIN_CHARS
    const showHint = open && trimmed.length > 0 && trimmed.length < MIN_CHARS

    // Debounce (300ms) + purani slow request ka result naye ko overwrite na kare
    useEffect(() => {
        if (trimmed.length < MIN_CHARS) return

        let cancelled = false
        const t = setTimeout(async () => {
            setLoading(true)
            try {
                const data = await searchCreators(trimmed)
                if (!cancelled) setResults(Array.isArray(data) ? data : [])
            } catch (err) {
                if (!cancelled) setResults([])
            } finally {
                if (!cancelled) setLoading(false)
            }
        }, 300)

        return () => {
            cancelled = true
            clearTimeout(t)
        }
    }, [trimmed])

    // Bahar click pe dropdown band
    useEffect(() => {
        const handleMouseDown = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleMouseDown)
        return () => document.removeEventListener("mousedown", handleMouseDown)
    }, [])

    const reset = () => {
        setQuery("")
        setResults([])
        setOpen(false)
    }

    const handleChange = (e) => {
        const value = e.target.value
        setQuery(value)
        setOpen(true)
        if (value.trim().length < MIN_CHARS) setResults([])
    }

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setOpen(false)
            e.currentTarget.blur()
        }
        if (e.key === "Enter" && showResults && results[0]) {
            router.push(`/${results[0].username}`)
            reset()
        }
    }

    return (
        
        <div ref={wrapperRef} className="relative w-34 sm:w-48 lg:w-56">
            <svg
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
            </svg>

            <input
                type="text"
                value={query}
                onChange={handleChange}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search creators..."
                aria-label="Search creators"
                autoComplete="off"
                maxLength={30}
                className="h-10 w-full rounded-md border border-white/10 bg-white/[0.06] pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 transition focus:border-amber-200/25 focus:outline-none focus:ring-2 focus:ring-amber-200/45"
            />

            {(showResults || showHint) && (
                <div className="absolute right-0 top-full z-50 mt-2 w-50 md:w-72 max-w-[90vw] overflow-hidden rounded-lg border border-white/10 bg-[#090f1c]/95 p-1.5 shadow-2xl shadow-black/35 backdrop-blur-xl">
                    {showHint && (
                        <p className="px-3 py-2.5 text-sm text-zinc-400">
                            Type at least {MIN_CHARS} characters
                        </p>
                    )}

                    {showResults && loading && results.length === 0 && (
                        <p className="px-3 py-2.5 text-sm text-zinc-400">Searching...</p>
                    )}

                    {showResults && !loading && results.length === 0 && (
                        <p className="px-3 py-2.5 text-sm text-zinc-400">No creators found</p>
                    )}

                    {showResults && results.length > 0 && (
                        <ul className="space-y-0.5">
                            {results.map((c) => (
                                <li key={c._id}>
                                    <Link
                                        href={`/${c.username}`}
                                        onClick={reset}
                                        className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-200/45"
                                    >
                                        {c.profilepic ? (
                                            <img
                                                src={c.profilepic}
                                                alt=""
                                                referrerPolicy="no-referrer"
                                                className="size-9 shrink-0 rounded-full border border-white/15 object-cover"
                                            />
                                        ) : (
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-amber-200/15 text-sm font-bold text-amber-100">
                                                {(c.name || c.username).charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-medium text-zinc-100">
                                                {c.name || c.username}
                                            </span>
                                            <span className="block truncate text-xs text-zinc-400">
                                                @{c.username}
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchBar