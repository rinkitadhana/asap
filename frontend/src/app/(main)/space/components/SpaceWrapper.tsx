import React from "react"
import Back from "@/components/Back"
import Logo from "@/components/Logo"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { UserPlus } from "lucide-react"
import Controls from "./Controls"
import { LuUsers } from "react-icons/lu"
import { IoChatbubbleOutline } from "react-icons/io5"
import { BsInfoLg, BsPatchQuestion } from "react-icons/bs"
import { TbUserQuestion } from "react-icons/tb";

const SpaceWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="bg-call-background h-screen flex items-center px-4 pb-2">
      <div className="relative flex-1 flex flex-col items-center justify-center h-full max-w-full overflow-hidden">
        <header className="w-full p-2 select-none z-50">
          <div className="flex items-center justify-between py-2 w-full rounded-xl">
            <div className="flex items-center gap-2">
              <Back />
              <Logo />
              <div className="h-6 border-l border-primary-border mx-1" />
              <div className=" text-secondary-text text-sm">
                Rinkit Adhana's Space
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher scrolled={false} className="p-2.5 border border-call-border rounded-xl hover:bg-primary-hover transition-all duration-200 bg-call-primary cursor-pointer select-none" />
              <div className="h-7 border-l border-primary-border mx-1" />
              <div className="flex items-center gap-2 py-2.5 px-3 border border-call-border rounded-xl hover:bg-primary-hover transition-all duration-200 bg-call-primary cursor-pointer select-none">
                <BsPatchQuestion size={17} />
                <span className="font-medium text-[15px] leading-tight">
                  Help
                </span>
              </div>

              <div className="flex items-center gap-2 py-2.5 px-3 border border-call-border rounded-xl hover:bg-primary-hover transition-all duration-200 bg-call-primary cursor-pointer select-none">
                <UserPlus size={17} />
                <span className="font-medium text-[15px] leading-tight">
                  Invite
                </span>
              </div>
            </div>

          </div>
        </header>
        <div className="w-full flex-1 min-h-0 px-2">
          {children}
        </div>

      </div>
      {/* <div className="flex justify-center items-center h-full gap-2 flex-shrink-0">
        <div className=" flex flex-col justify-center items-center border border-call-border h-full w-[200px] rounded-xl bg-call-primary">
          space
        </div>
        <div className="bg-call-primary p-2 w-[70px] rounded-xl h-full flex flex-col justify-between items-center border border-call-border">
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
      </div> */}
    </section>
  )
}

export default SpaceWrapper
