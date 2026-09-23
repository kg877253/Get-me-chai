"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/login", label: "Login" },
  ]

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`)
  }

  return (
    <footer
      onPointerMove={handlePointerMove}
      className="group/footer relative overflow-hidden border-t border-white/10 bg-[#020817]/90 text-white"
      style={{ "--x": "50%", "--y": "50%" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/footer:opacity-100"
        style={{ background: "radial-gradient(350px circle at var(--x) var(--y), rgba(245, 158, 11, 0.12), rgba(16, 185, 129, 0.08), transparent 48%)" }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Link href="/" className="group/brand inline-flex items-center gap-3 rounded-md px-1 py-1 transition-colors hover:bg-white/5">
              <span className="relative flex size-11 items-center justify-center rounded-lg border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_25px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover/brand:-rotate-3 group-hover/brand:scale-105">
                <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-300/20 via-transparent to-emerald-300/10 opacity-0 transition-opacity duration-300 group-hover/brand:opacity-100" />
                <Image src="/chai.gif" alt="Logo" width={32} height={32} className="relative" />
              </span>
              <span>
                <span className="block bg-gradient-to-r from-white via-amber-100 to-emerald-100 bg-clip-text text-lg font-bold tracking-tight text-transparent">Get-me-chai</span>
                <span className="block text-[11px] font-medium uppercase tracking-[0.24em] text-amber-100/55">creator fuel</span>
              </span>
            </Link>

            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Support independent creators with a chai and help them keep creating.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            <div className="flex flex-wrap gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group/link relative overflow-hidden rounded-md border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200/25 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/45 active:translate-y-0"
                >
                  <span className="absolute inset-x-2 bottom-1 h-px scale-x-0 bg-gradient-to-r from-amber-200 via-emerald-200 to-transparent transition-transform duration-300 group-hover/link:scale-x-100" />
                  <span className="relative">{link.label}</span>
                </Link>
              ))}
            </div>

          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright &copy; {currentYear} Get-me-chai. All rights reserved.</p>
          <p className="text-zinc-400">Chai-powered support, clean and simple.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
