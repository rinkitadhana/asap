import LayoutWrapper from "@/layout/LayoutWrapper"
import React from "react"
import StackSlider from "./StackSlider"
const Stack = () => {
  return (
    <LayoutWrapper>
      <section className="border-x border-primary-border border-dashed p-4 flex gap-2">
        <div className="w-[20%] text-secondary-text font-inter text-sm flex items-center justify-center">
          Powered by tools that shape great experiences.
        </div>
        <div className="w-[80%]">{/* <StackSlider /> */}</div>
      </section>
    </LayoutWrapper>
  )
}

export default Stack
