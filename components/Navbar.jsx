"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from "next-auth/react"
import SearchBar from './Searchbar'

// Chhota helper: ek hi jagah se saare icons
const Icon = ({ d, className = "size-4" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
    </svg>
)

const ICONS = {
    dashboard: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    page: "M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
}

const Navbar = () => {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const dropdownRef = useRef(null)
    const navRef = useRef(null)

    const role = session?.user?.role

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { href: "/about", label: "About" },
        ...(role === "creator" ? [
            { href: "/dashboard", label: "Dashboard" },
        ] : []),
        ...(role === "user" ? [
            { href: "/me", label: "My Profile" },
        ] : []),
    ]

    // Dropdown ke items (conditions wahi hain jo pehle the)
    const menuItems = [
        ...(role === "creator" ? [{ href: "/dashboard", label: "Dashboard", icon: ICONS.dashboard }] : []),
        ...(role === "user" ? [{ href: "/me", label: "My Profile", icon: ICONS.user }] : []),
        ...(role === "creator" ? [{ href: `/${session?.user?.username}`, label: `${session?.user?.username} page`, icon: ICONS.page }] : []),
    ]

    const isActive = (href) => (href === "/" ? pathname === "/" : pathname?.startsWith(href))

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8)
        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })

        return () => window.removeEventListener("scroll", handleScroll)

    }, [])

    // Route badalte hi dono menu band
    useEffect(() => {
        setDropdownOpen(false)
        setMobileOpen(false)
    }, [pathname])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
            if (navRef.current && !navRef.current.contains(event.target)) {
                setMobileOpen(false)
            }
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setDropdownOpen(false)
                setMobileOpen(false)
            }
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

    const initial = session?.user?.name?.charAt(0)?.toUpperCase() || "U"

    return (
        <nav
            ref={navRef}
            onPointerMove={handlePointerMove}
            className={`group/nav sticky top-0 z-50 overflow-visible border-b px-3 text-white backdrop-blur-2xl transition-all duration-300 ${scrolled ? "border-amber-200/15 bg-[#030711]/90 py-2 shadow-[0_18px_55px_rgba(0,0,0,0.45)]" : "border-white/10 bg-[#020817]/70 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.28)]"}`}
            style={{ "--x": "30%", "--y": "30%" }}
        >
            {/* Mouse ke saath chalne wali glow */}
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/nav:opacity-100"
                style={{ background: "radial-gradient(150px circle at var(--x) var(--y), rgba(245, 158, 11, 0.06), rgba(16, 185, 129, 0.03), transparent 46%)" }}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent" />

            <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
                {/* Brand */}
                <Link
                    className="group/brand relative z-10 flex shrink-0 items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-amber-200/45"
                    href="/"
                    onClick={() => { setDropdownOpen(false); setMobileOpen(false) }}
                >
                    <span className="relative flex size-10 items-center justify-center rounded-lg border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_25px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover/brand:-rotate-3 group-hover/brand:scale-105">
                        <span className="absolute -inset-1 -z-10 rounded-xl bg-amber-400/20 opacity-0 blur-md transition-opacity duration-300 group-hover/brand:opacity-100" />
                        <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-300/20 via-transparent to-emerald-300/10 opacity-0 transition-opacity duration-300 group-hover/brand:opacity-100" />
                        <Image src="/chai.gif" unoptimized alt="Logo" width={30} height={30} className="relative" />
                    </span>
                    <span className="leading-tight">
                        <span className="block bg-gradient-to-r from-white via-amber-100 to-emerald-100 bg-clip-text text-base font-bold tracking-tight text-transparent md:text-lg">Get-me-chai</span>
                        <span className="hidden text-[11px] font-medium uppercase tracking-[0.24em] text-amber-100/55 sm:block">creator fuel</span>
                    </span>
                </Link>

                {/* Desktop links */}
                <div className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:flex">
                    {navLinks.map((link) => {
                        const active = isActive(link.href)
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setDropdownOpen(false)}
                                aria-current={active ? "page" : undefined}
                                className={`group/link relative overflow-hidden rounded-md px-3.5 py-2 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-200/45 ${active ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}
                            >
                                <span className={`absolute inset-x-2 bottom-1 h-px bg-gradient-to-r from-amber-200 via-emerald-200 to-transparent transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-100"}`} />
                                <span className="relative">{link.label}</span>
                            </Link>
                        )
                    })}
                </div>

                {/* Right side */}
                <ul className="relative flex items-center gap-2">
                    <li><SearchBar /></li>

                    {session && (<li className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            aria-expanded={dropdownOpen}
                            aria-haspopup="menu"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="group/profile inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 px-2.5 text-sm font-medium text-zinc-100 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200/25 hover:bg-white/15 hover:shadow-[0_12px_30px_rgba(245,158,11,0.12)] focus:outline-none focus:ring-2 focus:ring-amber-200/55 focus:ring-offset-2 focus:ring-offset-[#020817] active:translate-y-0 md:px-3.5"
                        >
                            {session.user?.image ? (
                                <Image src={session.user.image} alt="profile" width={28} height={28} className="size-7 rounded-full border border-white/20 object-cover shadow-sm" />
                            ) : (
                                <span className="flex size-7 items-center justify-center rounded-full border border-white/15 bg-amber-200/15 text-xs font-bold text-amber-100">
                                    {initial}
                                </span>
                            )}
                            <span className="hidden max-w-36 truncate md:inline">{session.user?.name}</span>
                            <svg className={`size-3.5 shrink-0 opacity-70 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                xmlns="http://www.w3.org/2000/svg"
                                width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown: hamesha render, class se animate hota hai */}
                        <div
                            role="menu"
                            className={`absolute right-0 z-50 mt-3 w-64 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-[#090f1c]/95 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-200 ${dropdownOpen ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-1 scale-95 opacity-0"}`}
                        >
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />

                            {/* User info header */}
                            <div className="flex items-center gap-3 rounded-lg bg-white/[0.04] px-3 py-3">
                                {session.user?.image ? (
                                    <Image src={session.user.image} alt="" width={36} height={36} className="size-9 rounded-full border border-white/20 object-cover" />
                                ) : (
                                    <span className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-amber-200/15 text-sm font-bold text-amber-100">
                                        {initial}
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-white">{session.user?.name}</p>
                                    {session.user?.email && (
                                        <p className="truncate text-xs text-zinc-400">{session.user.email}</p>
                                    )}
                                    {role && (
                                        <span className="mt-1 inline-block rounded-full border border-amber-200/20 bg-amber-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
                                            {role === "creator" ? "Creator" : "Supporter"}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <ul className="mt-1.5 space-y-0.5 text-sm font-medium text-zinc-200">
                                {menuItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            role="menuitem"
                                            onClick={() => setDropdownOpen(false)}
                                            className="group/item flex w-full items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/45"
                                        >
                                            <Icon d={item.icon} className="size-4 text-zinc-400 transition-colors group-hover/item:text-amber-200" />
                                            <span className="flex-1 truncate">{item.label}</span>
                                            <span className="translate-x-[-4px] opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100">-&gt;</span>
                                        </Link>
                                    </li>
                                ))}
                                <li className="mt-1 border-t border-white/10 pt-1">
                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: "/" }) }}
                                        className="group/item flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-red-500/10 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-300/40"
                                    >
                                        <Icon d={ICONS.logout} className="size-4 text-zinc-400 transition-colors group-hover/item:text-red-300" />
                                        Sign out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </li>
                    )}

                    {!session && (
                        <><li className="hidden sm:block"><Link href="/signup" className="rounded-md border border-white/15 px-3.5 py-2 text-sm font-medium text-zinc-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200/30 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/45 active:translate-y-0">
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

                    {/* Mobile hamburger */}
                    <li className="md:hidden">
                        <button
                            type="button"
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                            onClick={() => setMobileOpen((prev) => !prev)}
                            className="relative flex size-10 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/10 transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-amber-200/55"
                        >
                            <span className={`absolute h-0.5 w-5 rounded bg-zinc-100 transition-all duration-300 ${mobileOpen ? "rotate-45" : "-translate-y-1.5"}`} />
                            <span className={`absolute h-0.5 w-5 rounded bg-zinc-100 transition-all duration-300 ${mobileOpen ? "opacity-0" : "opacity-100"}`} />
                            <span className={`absolute h-0.5 w-5 rounded bg-zinc-100 transition-all duration-300 ${mobileOpen ? "-rotate-45" : "translate-y-1.5"}`} />
                        </button>
                    </li>
                </ul>
            </div>

            {/* Mobile menu panel */}
            <div
                className={`absolute inset-x-3 top-full mt-2 origin-top overflow-hidden rounded-xl border border-white/10 bg-[#090f1c]/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-200 md:hidden ${mobileOpen ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-2 scale-95 opacity-0"}`}
            >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
                <ul className="space-y-1">
                    {navLinks.map((link) => {
                        const active = isActive(link.href)
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    aria-current={active ? "page" : undefined}
                                    className={`flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-200/45 ${active ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}
                                >
                                    {link.label}
                                    {active && <span className="size-1.5 rounded-full bg-amber-300" />}
                                </Link>
                            </li>
                        )
                    })}
                    {!session && (
                        <li className="sm:hidden">
                            <Link
                                href="/signup"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center rounded-md px-3 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/45"
                            >
                                Sign up
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar