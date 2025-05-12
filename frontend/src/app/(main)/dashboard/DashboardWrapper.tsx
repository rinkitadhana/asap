"use client"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { FolderClosed, House } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { BsLayoutSidebarInset } from "react-icons/bs"

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
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
    <section className="flex bg-background p-4 gap-4">
      <div
        className={`flex flex-col justify-between items-center bg-background h-[calc(100vh-2rem] py-3 px-2 ${
          isOpen ? "w-[150px]" : "w-fit"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-6">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="hover:bg-primary-hover p-2 rounded-md cursor-pointer"
          >
            <BsLayoutSidebarInset className="size-[20px]" />
          </button>
          <nav className="flex flex-col items-center justify-center gap-3 border">
            {links.map((link) => (
              <Link
                href={link.href}
                title={link.name}
                className="p-2 hover:bg-primary-hover rounded-md"
              >
                {link.icon}
              </Link>
            ))}
          </nav>
        </div>
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
