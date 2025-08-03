import React from "react"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import PageHead from "@/components/PageHead"
import Stack from "@/components/Stack"
import Footer from "@/components/Footer"
const page = () => {
  return (
    <>
      <PageHead title="Home | bordre" />
      <Navbar />
      <Hero />
      <div className="border-t-2 border-main-border border-dashed w-full" />
      <Stack />
      <div className="border-t-2 border-main-border border-dashed w-full" />
      <Footer />
    </>
  )
}

export default page
