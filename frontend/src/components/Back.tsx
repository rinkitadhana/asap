import { useRouter } from "next/navigation"
import React from "react"
import { MdArrowBackIosNew } from "react-icons/md"

const Back = () => {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push("/dashboard")}
      title="Back"
      className="p-2.5 hover:bg-primary-hover rounded-md cursor-pointer transition-all duration-200"
    >
      <MdArrowBackIosNew size={20} />
    </button>
  )
}

export default Back
