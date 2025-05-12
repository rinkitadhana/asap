"use client"
import { useRouter } from "next/navigation"

const Main = () => {
  const router = useRouter()
  router.push("/dashboard/home")
}

export default Main
