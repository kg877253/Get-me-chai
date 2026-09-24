import AuthShell from "@/components/AuthShell"

export default async function LoginPage({ searchParams }) {
  const params = await searchParams
  return <AuthShell mode="login" errorCode={params?.error} />
}