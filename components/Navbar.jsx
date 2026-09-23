"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"

const Navbar = () => {
    const { data: session } = useSession()
    const [dropdownOpen, setDropdownOpen] = useState(false)

    return (
        <nav className="bg-gray-800 text-white py-4 flex md:justify-between justify-around items-center md:px-6 px-4 md:sticky top-0 z-50">
            <Link className="container mx-auto flex items-center md:gap-3 gap-1" href="/">
                <h1 className="md:text-xl font-bold cursor-pointer hover:scale-110 hover:rotate-2 duration-300">Get-me-chai</h1>
                <Image src="/chai.gif" alt="Logo" width={30} height={30} />
            </Link>

            <ul className="flex space-x-4 items-center relative">

                {session && (<li className="relative">
                    <button onClick={() => setDropdownOpen((prev) => !prev)} className="cursor-pointer inline-flex items-center md:gap-6 gap-3 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-sm md:px-8 px-4 py-2 leading-4">
                        {session.user?.image && (<Image src={session.user.image} alt="profile" width={24} height={24} className="rounded-full" />)}
                        {session.user?.name}
                        <svg className={`w-3 h-3 md:w-4 md:h-4 shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                        </svg>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-5 mt-2 z-10 bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-42">
                            <ul className="p-2 text-sm text-gray-200 font-medium">
                                <li>
                                    <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="inline-flex items-center w-full p-2 hover:bg-gray-700 hover:text-white rounded">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href={`/${session.user?.username}`} onClick={() => setDropdownOpen(false)} className="inline-flex items-center w-full p-2 hover:bg-gray-700 hover:text-white rounded">
                                        Your page
                                    </Link>
                                </li>
                                <li><button
                                    onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: "/" }) }}
                                    className="cursor-pointer inline-flex items-center w-full p-2 hover:bg-gray-700 hover:text-white rounded text-left"
                                >Sign out
                                </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </li>
                )}

                {!session && (
                    <Link href={"/login"}>
                        <button type="button" className="cursor-pointer text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-xl text-sm px-5 py-3 text-center leading-5">
                            LOGIN
                        </button>
                    </Link>
                )}

            </ul>

        </nav>
    )
}

export default Navbar