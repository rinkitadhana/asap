import React from "react"
import Navbar from "@/shared/components/Navbar"
import Hero from "@/shared/components/Hero"
import PageHead from "@/shared/components/PageHead"
import Stack from "@/shared/components/Stack"
import Footer from "@/shared/components/Footer"
import TempBox from "@/shared/components/TempBox"
const page = () => {
  return (
    <>
      <PageHead title="Home | bordre" />
      <Navbar />
      <Hero />
      <div className="border-t-2 border-main-border border-dashed w-full" />
      <Stack />
      <div className="border-t-2 border-main-border border-dashed w-full" />
      <TempBox />
      <div className="border-t-2 border-main-border border-dashed w-full" />
      <TempBox />
      <div className="border-t-2 border-main-border border-dashed w-full" />
      <Footer />
    </>
  )
}

export default page
