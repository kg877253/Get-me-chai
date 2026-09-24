"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"

const Navbar = () => {
    const { data: session } = useSession()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const dropdownRef = useRef(null)

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        ...(session ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    ]

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8)
        handleScroll()
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") setDropdownOpen(false)
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    const handlePointerMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`)
        event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`)
    }

    return (
        <nav
            onPointerMove={handlePointerMove}
            className={`group/nav sticky top-0 z-50 overflow-visible border-b px-3 py-3 text-white backdrop-blur-2xl transition-all duration-300 ${scrolled ? "border-amber-200/15 bg-[#030711]/88 shadow-[0_18px_55px_rgba(0,0,0,0.42)]" : "border-white/10 bg-[#020817]/70 shadow-[0_12px_40px_rgba(0,0,0,0.28)]"}`}
            style={{ "--x": "30%", "--y": "30%" }}
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/nav:opacity-100"
                style={{ background: "radial-gradient(120px circle at var(--x) var(--y), rgba(245, 158, 11, 0.15), rgba(16, 185, 129, 0.08), transparent 46%)" }}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent" />

            <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
                <Link
                    className="group/brand relative z-10 flex shrink-0 items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-white/5"
                    href="/"
                    onClick={() => setDropdownOpen(false)}
                >
                    <span className="relative flex size-10 items-center justify-center rounded-lg border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_25px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover/brand:-rotate-3 group-hover/brand:scale-105">
                        <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-300/20 via-transparent to-emerald-300/10 opacity-0 transition-opacity duration-300 group-hover/brand:opacity-100" />
                        <Image src="/chai.gif" alt="Logo" width={30} height={30} className="relative" />
                    </span>
                    <span className="leading-tight">
                        <h1 className="bg-gradient-to-r from-white via-amber-100 to-emerald-100 bg-clip-text text-base font-bold tracking-tight text-transparent md:text-lg">Get-me-chai</h1>
                        <span className="hidden text-[11px] font-medium uppercase tracking-[0.24em] text-amber-100/55 sm:block">creator fuel</span>
                    </span>
                </Link>

                <div className="hidden items-center rounded-lg border border-white/10 bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setDropdownOpen(false)}
                            className="group/link relative overflow-hidden rounded-md px-3.5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/45"
                        >
                            <span className="absolute inset-x-2 bottom-1 h-px scale-x-0 bg-gradient-to-r from-amber-200 via-emerald-200 to-transparent transition-transform duration-300 group-hover/link:scale-x-100" />
                            <span className="relative">{link.label}</span>
                        </Link>
                    ))}
                </div>

                <ul className="relative flex items-center gap-2">

                    {session && (<li className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            aria-expanded={dropdownOpen}
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="group/profile inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 px-2.5 text-sm font-medium text-zinc-100 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200/25 hover:bg-white/15 hover:shadow-[0_12px_30px_rgba(245,158,11,0.12)] focus:outline-none focus:ring-2 focus:ring-amber-200/55 focus:ring-offset-2 focus:ring-offset-[#020817] active:translate-y-0 md:px-4"
                        >
                            {session.user?.image ? (
                                <Image src={session.user.image} alt="profile" width={28} height={28} className="size-7 rounded-full border border-white/20 object-cover shadow-sm" />
                            ) : (
                                <span className="flex size-7 items-center justify-center rounded-full border border-white/15 bg-amber-200/15 text-xs font-bold text-amber-100">
                                    {session.user?.name?.charAt(0) || "U"}
                                </span>
                            )}
                            <span className="hidden max-w-36 truncate md:inline">{session.user?.name}</span>
                            <svg className={`size-3.5 shrink-0 opacity-70 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                xmlns="http://www.w3.org/2000/svg"
                                width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 z-50 mt-3 w-56 origin-top-right overflow-hidden rounded-lg border border-white/10 bg-[#090f1c]/95 p-1.5 shadow-2xl shadow-black/35 backdrop-blur-xl">
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
                                <ul className="space-y-1 text-sm font-medium text-zinc-200">
                                    <li>
                                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="group/item flex w-full items-center justify-between rounded-md px-3 py-2.5 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/45">
                                            Dashboard
                                            <span className="translate-x-[-4px] opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100">-&gt;</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`/${session.user?.username}`} onClick={() => setDropdownOpen(false)} className="group/item flex w-full items-center justify-between rounded-md px-3 py-2.5 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/45">
                                            Your page
                                            <span className="translate-x-[-4px] opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100">-&gt;</span>
                                        </Link>
                                    </li>
                                    <li className="border-t border-white/10 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: "/" }) }}
                                            className="flex w-full cursor-pointer items-center rounded-md px-3 py-2.5 text-left transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/45"
                                        >Sign out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </li>
                    )}

                    {!session && (
                        <>
                            <li>
                                <Link
                                    href="/signup"
                                    className="rounded-md border border-white/15 px-3.5 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-amber-200/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/45"
                                >
                                    Sign up
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="group/login relative inline-flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-zinc-50 px-4 text-sm font-semibold text-zinc-950 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-100 hover:shadow-[0_12px_30px_rgba(245,158,11,0.18)] focus:outline-none focus:ring-2 focus:ring-amber-200/55 focus:ring-offset-2 focus:ring-offset-[#020817] active:translate-y-0"
                                >
                                    <span className="absolute inset-y-0 left-[-60%] w-1/2 skew-x-[-20deg] bg-white/70 opacity-0 transition-all duration-700 group-hover/login:left-[130%] group-hover/login:opacity-100" />
                                    <span className="relative">Log in</span>
                                </Link>
                            </li>
                        </>
                    )}

                </ul>
            </div>

        </nav>
    )
}

export default Navbar
