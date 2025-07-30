import React from "react"
import Back from "@/components/Back"
import Logo from "@/components/Logo"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { UserPlus } from "lucide-react"
import Controls from "./Controls"
import { LuUsers } from "react-icons/lu"
import { IoChatbubbleOutline } from "react-icons/io5"
import { BsInfoLg } from "react-icons/bs"

const SpaceWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="bg-secondary h-screen flex items-center p-2">
      <div className="relative flex-1 flex flex-col items-center justify-center h-full max-w-full overflow-hidden">
        <div className="w-full p-2 pl-0">
          <div className="flex items-center justify-between p-2.5 w-full rounded-xl border border-primary-border bg-background">
            <div className="flex items-center gap-2">
              <Back />
              <Logo />
              <div className="h-5 border-l border-primary-border px-1" />
              <div className=" text-secondary-text font-medium text-sm">
                Gruz's Space
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 py-[0.57rem] px-3 rounded-md hover:bg-primary-hover/80 transition-all duration-200 bg-primary-hover cursor-pointer select-none">
                <UserPlus size={17} />
                <span className="font-medium text-[15px] leading-tight">
                  Invite
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex-1 min-h-0 px-2 pb-2 pl-0">
          {children}
        </div>
        <div>
          <Controls />
        </div>

      </div>
      <div className="flex justify-center items-center h-full gap-2 flex-shrink-0">
        <div className=" flex flex-col justify-center items-center border border-primary-border h-full w-[200px] rounded-xl bg-background">
          space
        </div>
        <div className="bg-background p-2 w-[70px] rounded-xl h-full flex flex-col justify-between items-center border border-primary-border">
          <div className="py-2">
            <ThemeSwitcher scrolled={false} />
          </div>
          <div className="flex flex-col gap-2">
            <button className="p-2 w-full text-lg flex flex-col gap-0.5 justify-center items-center rounded-md hover:bg-primary-hover/80 transition-all duration-200 bg-primary-hover cursor-pointer select-none">
              <BsInfoLg />
              <span className="text-xs text-secondary-text">Info</span>
            </button>
            <button className="p-2 w-full text-lg flex flex-col gap-0.5 justify-center items-center rounded-md hover:bg-primary-hover/80 transition-all duration-200 cursor-pointer select-none">
              <LuUsers />
              <span className="text-xs text-secondary-text">Users</span>
            </button>
            <button className="p-2 w-full text-lg flex flex-col gap-0.5 justify-center items-center rounded-md hover:bg-primary-hover/80 transition-all duration-200 cursor-pointer select-none">
              <IoChatbubbleOutline />
              <span className="text-xs text-secondary-text">Chat</span>
            </button>
          </div>
          <div></div>
        </div>
      </div>
    </section>
  )
}

export default SpaceWrapper
