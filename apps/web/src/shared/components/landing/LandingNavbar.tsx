"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import GithubButton from "./ui/GithubButton"
import { useRouter } from "next/navigation"
import { ThemeSwitcher } from "../ThemeSwitcher"
import VersionBadge from "./ui/VersionBadge"
import Image from "next/image"

const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  const links = [
    {
      label: "Home",
      href: "#",
    },
    {
      label: "About",
      href: "#about",
    },
    {
      label: "Contact",
      href: "#contact",
    },
  ]
  return (
    <section className="fixed z-10 top-3 left-0 right-0 ">
      <div
        className={`max-w-[1150px] mx-auto flex justify-between items-center w-full py-3 px-4 border shadow-sm rounded-2xl transition-all duration-300 
 ${scrolled
            ? "bg-secondary border-secondary-border shadow-primary-shadow"
            : "border-transparent shadow-transparent"
          }`}
      >
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="text-2xl font-bold cursor-pointer flex items-center gap-3"
            >
              <Image src="/img/logo/logo.png" alt="logo" width={40} height={40} className="size-7" />
              <span className="text-2xl font-bold">Asap</span>
            </button>
            <VersionBadge text="BETA 0.0.1" />
          </div>
          <nav className="hidden md:flex gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex gap-1">
            <GithubButton scrolled={scrolled} />
            <ThemeSwitcher scrolled={scrolled} />
          </div>
          <div className="hidden md:flex gap-4">
            <button
              onClick={() => router.push("/login")}
              className="btn text-sm font-semibold"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingNavbar
