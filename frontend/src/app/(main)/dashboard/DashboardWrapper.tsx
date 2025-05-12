import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import React from "react"

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex bg-background p-4 gap-4">
      <div className="flex flex-col justify-between items-center bg-background h-[calc(100vh-2rem)] w-fit border">
        <div>bordre</div>
        <div>
          <ThemeSwitcher scrolled={false} />
        </div>
      </div>
      <div className="flex-grow bg-secondary rounded-xl h-[calc(100vh-2rem)] border overflow-hidden">
        {children}
      </div>
    </section>
  )
}

export default DashboardWrapper
