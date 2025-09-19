import React from "react"
import PageTitle from "@/shared/components/PageTitle"
import LandingNavbar from "@/shared/components/landing/LandingNavbar"
import LandingHero from "@/shared/components/landing/LandingHero"
import LandingTechStack from "@/shared/components/landing/LandingTechStack"
import LandingTemp from "@/shared/components/landing/LandingTemp"
import LandingFooter from "@/shared/components/landing/LandingFooter"
const page = () => {
  return (
    <>
      <PageTitle title="Home | Asap" />
      <LandingNavbar />
      <LandingHero />
      <div className="border-t-2 border-main-border border-dashed w-full" />
      <LandingTechStack />
      <div className="border-t-2 border-main-border border-dashed w-full" />
      <LandingTemp />
      <div className="border-t-2 border-main-border border-dashed w-full" />
      <LandingTemp />
      <div className="border-t-2 border-main-border border-dashed w-full" />
      <LandingFooter />
    </>
  )
}

export default page
