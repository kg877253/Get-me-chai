"use client"
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession()

  return (
    <>
      <div className="min-h-[40vh] flex flex-col items-center justify-center text-white px-4 sm:px-6 py-10 sm:py-0">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
          Welcome to Get-me-chai <Image src="/chai.gif" width={50} height={50} alt="" className="w-10 h-10 sm:w-[60px] sm:h-[60px]" />
        </h1>
        <p className="text-sm sm:text-lg mb-5 text-center max-w-xl">
          Get-me-chai is a platform that allows creators to receive funding from their supporters. Join us!
        </p>

        <div className="flex flex-row gap-4 m-2">
          <Link
            key={"/signup"}
            href={"/signup"}
            className="group/link relative overflow-hidden rounded-md border-2 border-white/10 bg-white/[0.04] px-4.5 py-3.5 text-base font-medium text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200/25 hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/45 active:translate-y-0"
          >
            <span className="relative hover:font-bold ">Start Here</span>
          </Link>

          <Link
            key={"/about"}
            href={"/about"}
            className="group/link relative overflow-hidden rounded-md border-2 border-white/10 bg-white/[0.04] px-4.5 py-3.5 text-base font-medium text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200/25 hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/45 active:translate-y-0"
          >
            <span className="absolute inset-x-2 bottom-1 h-px scale-x-0 bg-gradient-to-r from-amber-200 via-emerald-200 to-transparent transition-transform duration-300 group-hover/link:scale-x-100" />
            <span className="relative hover:font-bold">Read more</span>
          </Link>
        </div>
      </div>

      <div className="h-1 opacity-10 bg-white"></div>

      <div className="mx-auto flex flex-col items-center justify-center text-white my-10 sm:my-12 px-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center">Your Fans can buy u a Chai</h1>

        <div className="items-center flex flex-col sm:flex-row gap-8 sm:gap-14 py-10">
          <div className="flex flex-col items-center justify-center gap-3 max-w-[220px]">
            <Image className="bg-slate-300 rounded-full p-3 mb-4" src="/gift.gif" width={75} height={75} alt="" />
            <p className="font-bold text-center">Your Fan's want to help</p>
            <p className="text-center text-sm sm:text-base">
              Show your support and help your favorite creators!
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 max-w-[220px]">
            <Image className="bg-slate-300 rounded-full p-3 mb-4" src="/coin.gif" width={75} height={75} alt="" />
            <p className="font-bold text-center">Your Fan's want to help</p>
            <p className="text-center text-sm sm:text-base">
              Show your support and help your favorite creators!
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 max-w-[220px]">
            <Image className="bg-slate-300 rounded-full p-3 mb-4" src="/people.gif" width={75} height={75} alt="" />
            <p className="font-bold text-center">Your Fan's want to help</p>
            <p className="text-center text-sm sm:text-base">
              Show your support and help your favorite creators!
            </p>
          </div>
        </div>
      </div>

      <div className="h-1 opacity-10 bg-white"></div>

      <div className="m-6 mx-auto mb-16 flex flex-col items-center justify-center text-white px-6">
        <h2 className="text-2xl font-bold text-center text-white mb-4 p-4 ">Watch Our Video</h2>

        <iframe width="560" height="315" src="https://www.youtube.com/embed/tVzUXW6siu0?si=tPZfma4XHJ3BZRKa" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

      </div>
    </>
  );
}