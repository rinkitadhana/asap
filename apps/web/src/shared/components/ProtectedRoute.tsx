"use client"

import { useGetMe } from "@/shared/hooks/useUserQuery"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useGetMe()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/")
    }
  }, [user, isLoading, router])

  if (isLoading) return <p>Loading...</p>

  return <>{children}</>
}
