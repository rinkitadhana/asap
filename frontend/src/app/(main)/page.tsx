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
      <div className="h-screen text-background">hello china</div>
    </>
  )
}

export default page
