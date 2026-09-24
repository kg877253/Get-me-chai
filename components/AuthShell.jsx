"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import AuthSocialButtons from "@/components/AuthSocialButtons"

const ERROR_MESSAGES = {
  exists: "This email is already registered. Please log in instead.",
  noaccount: "No account found with this email. Please sign up first.",
  oauth: "Sign in failed. Try again or use another provider.",
}

export default function AuthShell({ mode, errorCode }) {
  const { data: session } = useSession()
  const router = useRouter()
  const isSignup = mode === "signup"

  useEffect(() => {
    if (session) router.push("/dashboard")
  }, [session, router])

  const errorMessage = errorCode ? ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.oauth : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white flex flex-col items-center pt-16 px-4 pb-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
        {isSignup ? (
          <>
            Sign up to support your{" "}
            <span className="text-orange-400">favorite creators</span>
          </>
        ) : (
          <>
            Log in to support your{" "}
            <span className="text-orange-400">favorite creators</span>
          </>
        )}
      </h1>
      <p className="text-gray-400 text-sm mb-6 text-center max-w-sm">
        {isSignup
          ? "New here? Create your account with Google or GitHub."
          : "Welcome back. Use the same provider you signed up with."}
      </p>

      {errorMessage && (
        <p
          role="alert"
          className="mb-6 max-w-xs w-full rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-center"
        >
          {errorMessage}
        </p>
      )}

      <AuthSocialButtons mode={mode} />

      <p className="mt-10 text-sm text-gray-400">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium">
              Log in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-orange-400 hover:text-orange-300 font-medium">
              Sign up first
            </Link>
          </>
        )}
      </p>
    </div>
  )
}