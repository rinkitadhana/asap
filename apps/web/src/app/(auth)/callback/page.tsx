"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useUserStore } from "@/shared/store/userStore"
import api from "@/shared/lib/axiosInstance"

export default function CallbackPage() {
  const router = useRouter()
  const fetchUser = useUserStore((s) => s.fetchUser)

  useEffect(() => {
    const handleAuth = async () => {
      await fetchUser()
      await api.post("/auth/sync-user")
      router.push("/dashboard")
    }
    handleAuth()
  }, [fetchUser, router])

  return <p>Redirecting...</p>
}
