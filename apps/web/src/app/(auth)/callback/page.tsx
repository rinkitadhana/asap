"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/shared/lib/supabaseClient"

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("Session error:", error)
      }

      if (session) {
        localStorage.setItem("supabase_token", session.access_token)
        router.push("/dashboard")
      }
    }

    getSession()
  }, [router])

  return <p style={{ textAlign: "center" }}>Logging you in...</p>
}
