"use client"
import { SessionProvider } from "next-auth/react"
import { ToastContainer, Bounce } from "react-toastify"
import React from "react"

const Sessionwrapper = ({ children }) => {
    return (
        <div>
            <SessionProvider>
                {children}
                <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    theme="dark"
                    transition={Bounce}
                />
            </SessionProvider>
        </div>
    )
}

export default Sessionwrapper