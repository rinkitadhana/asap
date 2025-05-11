import LayoutWrapper from "@/layout/LayoutWrapper"
import React from "react"

const Hero = () => {
  return (
    <LayoutWrapper>
      <section className=" border border-main-border border-dashed p-4">
        <div className=" h-[600px] flex flex-col bg-white dark:bg-black items-center justify-center border border-border rounded-xl p-6 mt-20">
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
