import LayoutWrapper from "@/layout/LayoutWrapper"
import React from "react"

const Hero = () => {
  return (
    <LayoutWrapper>
      <section className="h-screen border border-main-border border-dashed">
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold">Welcome to bordre</h1>
          <p className="text-secondary">
            The best way to create and manage your borderless accounts
          </p>
        </div>
      </section>
    </LayoutWrapper>
  )
}

export default Hero
