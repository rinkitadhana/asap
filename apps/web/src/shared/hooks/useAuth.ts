import { supabase } from "@/shared/lib/supabaseClient"
import { useRouter } from "next/navigation"
export function useAuth() {
  const router = useRouter()
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL },
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return { loginWithGoogle, logout }
}
