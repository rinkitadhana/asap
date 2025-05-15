import LayoutWrapper from "@/layout/LayoutWrapper"
import React from "react"
import Recording from "./ui/Recording"
import { Disc2, TvMinimal } from "lucide-react"

const Hero = () => {
  return (
    <LayoutWrapper>
      <section className=" border-x border-primary-border border-dashed p-4">
        <div className="h-[700px] flex items-center shadow-md shadow-primary-shadow justify-center border border-secondary-border rounded-xl mt-20 bg-[url('/img/hero.png')] dark:bg-[url('/img/hero-dark.png')] bg-cover bg-center">
          <div className="flex-1 w-full h-full flex flex-col items-start justify-center p-10">
            <Recording />
            <h1 className="text-[4.5rem] font-[950] font-cal leading-[1.05]">
              From Video Call to Podcast in Minutes
            </h1>
            <p className="text-secondary-text font-inter">
              Bordre lets you host powerful 1:1 or group video calls with
              built-in local recording and smooth S3 uploads, delivering
              high-quality videos, perfect for podcasts, content creation, or
              capturing moments that matter.
            </p>
            <div className="flex flex-col gap-4 w-full my-4 pr-20 justify-start items-start">
              <button className="btn w-full font-medium flex gap-2.5 items-center justify-center text-sm">
                <TvMinimal size={17} className="text-green-600" /> Start Your
                Meeting Now
              </button>
              <button className="btn-secondary w-full font-medium flex gap-2.5 items-center justify-center text-sm">
                <Disc2 size={17} className="text-red-600" /> Start Recording
                Your Call
              </button>
              <p className="text-secondary-text w-full text-center font-inter text-sm">
                No credit card required
              </p>
            </div>
          </div>
          <div className="flex-1 w-full h-full flex items-center justify-end">
            <div className="w-full h-[400px] border border-secondary-border rounded-l-xl py-2 pl-2 bg-background">
              <div className="w-full h-full border-y border-l border-secondary-border rounded-l-xl bg-secondary"></div>
            </div>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  )
}

export default Hero
