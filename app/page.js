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
          <Link href="/login">
            <button className="cursor-pointer relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
              <span className="relative px-4 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-transparent dark:bg-gray-900 leading-5">
                Start Here
              </span>
            </button>
          </Link>
          <Link href="/about">
            <button className="relative cursor-pointer inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-blue-600 to-purple-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
              <span className="relative px-4 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-transparent dark:bg-gray-900 leading-5">
                Read More
              </span>
            </button>
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
    </>
  );
}