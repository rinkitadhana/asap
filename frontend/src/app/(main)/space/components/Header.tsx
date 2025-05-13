import Back from "@/components/Back"
import Logo from "@/components/Logo"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { Lock, LockOpen, UserPlus } from "lucide-react"
import React, { useState } from "react"

const Header = () => {
  const [hidden, setHidden] = useState(false)
  return (
    <section className={`w-full p-2 group ${hidden ? "h-12 fixed top-0" : ""}`}>
      <div
        className={`flex items-center justify-between border border-primary-border/70 bg-secondary p-1.5 rounded-md w-full ${
          hidden ? "hidden group-hover:flex" : "flex"
        }`}
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
          <div className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-primary-hover transition-all duration-200 bg-secondary-hover cursor-pointer select-none">
            <UserPlus size={20} />
            <span className="font-medium">Invite</span>
          </div>
          <div
            onClick={() => setHidden(!hidden)}
            className="flex items-center p-2.5 rounded-md hover:bg-primary-hover transition-all duration-200 bg-secondary-hover cursor-pointer select-none"
          >
            {hidden ? <LockOpen size={20} /> : <Lock size={20} />}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Header
