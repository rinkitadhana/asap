import React from "react"
import Header from "./Header"

const SpaceWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex flex-col items-center justify-center">
      <Header />
      {children}
    </section>
  )
}

export default SpaceWrapper
