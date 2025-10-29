"use client"

import { useGetMe } from "@/shared/hooks/useUserQuery"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError } = useGetMe()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || isError)) {
      router.replace("/login")
    }
  }, [user, isLoading, isError, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user || isError) {
    return null
  }

  return <>{children}</>
}
