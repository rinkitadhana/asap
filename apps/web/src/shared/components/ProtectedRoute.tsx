"use client"

import { useUserStore } from "@/shared/store/userStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, fetchUser } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/")
    }
  }, [user, isLoading, router])

  if (isLoading) return <p>Loading...</p>

  return <>{children}</>
}
