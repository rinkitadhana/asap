"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard")
  }, [router])

  return <p>Redirecting...</p>
}