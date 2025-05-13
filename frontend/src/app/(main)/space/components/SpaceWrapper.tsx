import React, { useState } from "react"
import Back from "@/components/Back"
import Logo from "@/components/Logo"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { Lock, LockOpen, UserPlus } from "lucide-react"

const SpaceWrapper = ({ children }: { children: React.ReactNode }) => {
  const [hidden, setHidden] = useState(false)

  return (
    <section className="flex flex-col items-center justify-center bg-background h-screen">
      <header
        className={`w-full p-2 ${hidden ? "fixed top-0 z-50 group h-14" : ""}`}
      >
        {hidden && (
          <div className="h-3 w-full absolute top-0 left-0 group-hover:cursor-pointer" />
        )}
        <div
          className={`
          flex items-center justify-between border border-primary-border p-1.5 w-full
          transition-all duration-300 ease-in-out
          ${
            hidden
              ? "transform -translate-y-[calc(100%+8px)] group-hover:translate-y-0 bg-secondary rounded-t-md"
              : "bg-secondary rounded-md"
          }
        `}
        >
          <div className="flex items-center gap-2">
            <Back />
            <Logo />
            <div className="h-5 border-l border-primary-border px-1" />
            <div className=" text-secondary-text font-medium text-sm">
              Gruz's Space
            </div>
          </div>
          <div className=" flex gap-2 items-center">
            <ThemeSwitcher scrolled={false} />
            <div className="flex items-center gap-2 py-[0.57rem] px-3 rounded-md hover:bg-primary-hover transition-all duration-200 bg-secondary-hover cursor-pointer select-none">
              <UserPlus size={17} />
              <span className="font-medium text-[15px] leading-tight">
                Invite
              </span>
            </div>
            <div
              onClick={() => setHidden(!hidden)}
              className="flex items-center p-2.5 rounded-md hover:bg-primary-hover transition-all duration-200 bg-secondary-hover cursor-pointer select-none"
            >
              {hidden ? <LockOpen size={17} /> : <Lock size={17} />}
            </div>
          </div>
        </div>
      </header>
      <div className={` w-full h-full ${hidden ? "p-2" : "px-2"}`}>
        {children}
      </div>
    </section>
  )
}

export default SpaceWrapper
