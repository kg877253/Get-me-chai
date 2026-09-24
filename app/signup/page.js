import AuthShell from "@/components/AuthShell"

export default async function SignupPage({ searchParams }) {
  const params = await searchParams
  return <AuthShell mode="signup" errorCode={params?.error} />
}