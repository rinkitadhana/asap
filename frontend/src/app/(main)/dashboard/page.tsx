"use client"
import { useRouter } from "next/navigation"

const Dashboard = () => {
  const router = useRouter()
  router.push("/dashboard/home")
}

export default Dashboard
