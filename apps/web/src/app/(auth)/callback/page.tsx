"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useUserStore } from "@/shared/store/userStore"

export default function CallbackPage() {
  const router = useRouter()
  const fetchUser = useUserStore((s) => s.fetchUser)

  useEffect(() => {
    const handleAuth = async () => {
      await fetchUser()
      router.push("/dashboard")
    }
    handleAuth()
  }, [fetchUser, router])

  return <p>Redirecting...</p>
}