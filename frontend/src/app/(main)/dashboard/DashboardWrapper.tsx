"use client"
import Logo from "@/components/Logo"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { FolderClosed, House, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useState, useEffect } from "react"
import { BsLayoutSidebarInset } from "react-icons/bs"

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const savedSidebarState = localStorage.getItem("sidebarOpen")
    if (savedSidebarState) {
      setIsOpen(savedSidebarState === "true")
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !isOpen
    setIsOpen(newState)
    localStorage.setItem("sidebarOpen", String(newState))
  }

  const links = [
    {
      icon: <House size={24} />,
      name: "Home",
      href: "/dashboard/home",
    },
    {
      icon: <FolderClosed size={24} />,
      name: "Project",
      href: "/dashboard/project",
    },
  ]
  return (
    <section
      className="flex bg-call-background gap-4 p-4 min-h-screen"
    >
      <div
        className={`flex flex-col justify-between items-center py-2 ${isOpen ? "w-[180px]" : "w-fit"
          }`}
      >
        <div className="flex flex-col items-center justify-center gap-6 w-full">
          <div
            className={`flex gap-2  items-center w-full ${isOpen ? "justify-between" : "justify-center"
              }`}
          >
            {isOpen && <Logo />}
            <button
              title={isOpen ? "Close sidebar" : "Open sidebar"}
              onClick={toggleSidebar}
              className="hover:bg-primary-hover p-2 rounded-md cursor-pointer transition-all duration-200"
            >
              <BsLayoutSidebarInset size={20} />
            </button>
          </div>

          <nav className="flex flex-col items-center justify-center gap-2 w-full">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                title={link.name}
                className={`p-2 rounded-md select-none transition-all duration-200 w-full flex items-center gap-2 font-medium ${pathname === link.href
                  ? "bg-primary-hover"
                  : "hover:bg-primary-hover"
                  }`}
              >
                <span>{link.icon}</span>
                {isOpen && <span className="truncate">{link.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div className=" flex flex-col items-center justify-center gap-4 w-full select-none">
          {/* <div
            className={`truncate flex gap-2 items-center  w-full font-medium rounded-md ${
              isOpen
                ? " bg-secondary border border-secondary-border justify-between  py-1 px-2 "
                : " justify-center"
            }`}
          >
            {isOpen && <span className="truncate">Change theme</span>}
            <ThemeSwitcher scrolled={true} />
          </div> */}
          <div className="flex items-center gap-2 hover:bg-primary-hover p-2 rounded-md cursor-pointer transition-all duration-200 font-medium w-full">
            <div title="Rinkit Adhana">
              <User size={22} />
            </div>
            {isOpen && <span className="truncate">Rinkit Adhana</span>}
          </div>
        </div>
      </div>
      <div
        className="flex-1 bg-call-primary overflow-hidden rounded-xl border border-call-border"
      >
        {children}
      </div>
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 border rounded-xl w-[220px] py-0.5 px-2 bg-call-primary"
      >
        <ThemeSwitcher scrolled={false} />
      </div>
    </section>
  )
}

export default DashboardWrapper
