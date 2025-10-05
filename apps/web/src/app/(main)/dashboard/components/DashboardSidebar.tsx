"use client"
import Logo from "@/shared/components/ui/AsapLogo"
import { FolderClosed, House, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useState, useEffect } from "react"
import { BsLayoutSidebarInset } from "react-icons/bs"

const DashboardSidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const savedSidebarState = localStorage.getItem("sidebarOpen")
        if (savedSidebarState) {
            setIsOpen(savedSidebarState === "true")
        }
        setIsMounted(true)
    }, [])

    // Prevent flash by not rendering until we've read from localStorage
    if (!isMounted) {
        return null
    }

    const toggleSidebar = () => {
        const newState = !isOpen
        setIsOpen(newState)
        localStorage.setItem("sidebarOpen", String(newState))
    }

    const links = [
        {
            icon: <House size={22} />,
            name: "Home",
            href: "/dashboard/home",
        },
        {
            icon: <FolderClosed size={22} />,
            name: "Project",
            href: "/dashboard/project",
        },
    ]

    return (
        <div
            className={`flex flex-col justify-between items-center py-2 ${
                isOpen ? "w-[180px]" : "w-fit"
            }`}
        >
            <div className="flex flex-col items-center justify-center gap-6 w-full">
                <div
                    className={`flex gap-2 pl-1 items-center -pl-2 w-full ${
                        isOpen ? "justify-between" : "justify-center"
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
                            className={`py-2 px-3 rounded-xl border select-none transition-all duration-200 w-full flex items-center gap-2 ${
                                pathname === link.href
                                    ? "bg-call-primary border-call-border"
                                    : "hover:bg-call-primary border-transparent hover:border-call-border"
                            }`}
                        >
                            <span>{link.icon}</span>
                            {isOpen && <span className="truncate">{link.name}</span>}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 w-full select-none">
                <div className="flex items-center gap-2 hover:bg-call-primary rounded-xl border border-transparent hover:border-call-border py-2 px-3 cursor-pointer transition-all duration-200 w-full">
                    <div title="Rinkit Adhana">
                        <User size={22} />
                    </div>
                    {isOpen && <span className="truncate">Rinkit Adhana</span>}
                </div>
            </div>
        </div>
    )
}

export default DashboardSidebar
