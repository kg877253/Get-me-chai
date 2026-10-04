"use client"
import Image from "next/image";
import Link from "next/link";
import Animatedbutton from "@/components/Animatedbutton";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <div className="relative min-h-[45vh] flex flex-col items-center justify-center text-white px-4 sm:px-6 py-10 sm:py-0 overflow-hidden">
        {/* Premium glow, dotted bg ke upar subtle depth ke liye */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <h1 className="relative text-2xl sm:text-4xl md:text-5xl font-bold mb-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
          Welcome to Get-me-chai <Image src="/chai.gif" width={50} height={50} alt="" unoptimized className="w-10 h-10 sm:w-[60px] sm:h-[60px]" />
        </h1>
        <p className="relative text-sm sm:text-lg mb-5 text-center max-w-xl text-white/70">
          A simple page where your fans can send you a chai — no memberships, no middlemen, just support that goes straight to you.
        </p>

        <div className="relative flex flex-row gap-4 m-2">
          {/* <Animatedbutton>
            <Link href="/signup">
              <span className="absolute  inset-x-2 bottom-1 h-px scale-x-0 bg-gradient-to-r from-amber-200 via-emerald-200 to-transparent transition-transform duration-300 group-hover/link:scale-y-100" />
              <span className="relative">Start Here</span>
            </Link>
          </Animatedbutton> */}
          <Link
            href="/signup"
            className="rounded-md bg-amber-500 hover:bg-amber-400 px-4.5 py-3.5 text-base font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            Start Here
          </Link>

          <Animatedbutton>
            <Link href="/about">
              <span className="absolute inset-x-2 bottom-1 h-px scale-x-0 bg-gradient-to-r from-amber-200 via-emerald-200 to-transparent transition-transform duration-300 group-hover/link:scale-y-100" />
              <span className="relative font-semibold">Read more</span>
            </Link>
          </Animatedbutton>

          {/* <Link
            href="/about"
            className="group/link relative overflow-hidden rounded-md border-2 border-white/10 bg-white/[0.04] px-4.5 py-3.5 text-base font-medium text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200/25 hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/45 active:translate-y-0"
          >
            <span className="absolute inset-x-2 bottom-1 h-px scale-x-0 bg-gradient-to-r from-amber-200 via-emerald-200 to-transparent transition-transform duration-300 group-hover/link:scale-x-100" />
            <span className="relative">Read more</span>
          </Link> */}
        </div>
      </div>

      <div className="h-1 opacity-10 bg-white"></div>

      {/* Why fans support */}
      <div className="mx-auto flex flex-col items-center justify-center text-white my-10 sm:my-12 px-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center">Your Fans can buy u a Chai</h1>

        <div className="items-center flex flex-col sm:flex-row gap-6 sm:gap-10 py-10">
          <div className="group flex flex-col items-center justify-center gap-3 max-w-[220px] p-5 rounded-2xl border border-transparent hover:border-amber-400/20 hover:bg-white/[0.03] transition-all duration-300 cursor-default">
            <Image className="bg-slate-300 rounded-full p-3 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" src="/gift.gif" width={75} height={75} alt="" unoptimized />
            <p className="font-bold text-center">Send a thank-you</p>
            <p className="text-center text-sm sm:text-base text-white/60">
              A small gift goes a long way — fans show appreciation in seconds.
            </p>
          </div>
          <div className="group flex flex-col items-center justify-center gap-3 max-w-[220px] p-5 rounded-2xl border border-transparent hover:border-amber-400/20 hover:bg-white/[0.03] transition-all duration-300 cursor-default">
            <Image className="bg-slate-300 rounded-full p-3 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" src="/coin.gif" width={75} height={75} alt="" unoptimized />
            <p className="font-bold text-center">Tip any amount</p>
            <p className="text-center text-sm sm:text-base text-white/60">
              ₹10 or ₹1000 — whatever feels right, no fixed tiers.
            </p>
          </div>
          <div className="group flex flex-col items-center justify-center gap-3 max-w-[220px] p-5 rounded-2xl border border-transparent hover:border-amber-400/20 hover:bg-white/[0.03] transition-all duration-300 cursor-default">
            <Image className="bg-slate-300 rounded-full p-3 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" src="/people.gif" width={75} height={75} alt="" unoptimized />
            <p className="font-bold text-center">Build your community</p>
            <p className="text-center text-sm sm:text-base text-white/60">
              Stick around and come back again
            </p>
          </div>
        </div>
      </div>

      <div className="h-1 opacity-10 bg-white"></div>

      {/* How it works — replaces the random video */}
      <div className="m-6 mx-auto mb-16 flex flex-col items-center justify-center text-white px-6 max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-white mb-10">How it works</h2>

        <div className="flex flex-col sm:flex-row gap-6 w-full">
          <div className="flex-1 flex flex-col items-center text-center gap-3 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300/15 text-amber-200 font-bold">1</span>
            <p className="font-semibold">Create your page</p>
            <p className="text-sm text-white/55">Sign up, add your name and a Razorpay account to receive payments.</p>
          </div>
          <div className="flex-1 flex flex-col items-center text-center gap-3 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-300/15 text-sky-200 font-bold">2</span>
            <p className="font-semibold">Share your link</p>
            <p className="text-sm text-white/55">Drop your get-me-chai-self.vercel.app/username link anywhere your fans are.</p>
          </div>
          <div className="flex-1 flex flex-col items-center text-center gap-3 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-300/15 text-green-200 font-bold">3</span>
            <p className="font-semibold">Get supported</p>
            <p className="text-sm text-white/55">Payments land directly in your account — no waiting, no middleman.</p>
          </div>
        </div>
      </div>
    </>
  );
}