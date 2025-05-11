import React from "react"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import PageHead from "@/components/PageHead"
const page = () => {
  return (
    <>
      <PageHead title="Home | bordre" />
      <Navbar />
      <Hero />
      <div className="border-t border-main-border border-dashed w-full">
        <div className="h-screen text-background">hello china</div>
      </div>
    </>
  )
}

export default page
