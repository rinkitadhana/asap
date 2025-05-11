"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import ThemeSwitcher from "./ThemeSwitcher"
import GithubButton from "./GithubButton"
import Version from "./ui/Version"
import { useRouter } from "next/navigation"
const Navbar = () => {
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
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ]
  return (
    <section className="fixed z-10 top-3 left-0 right-0 ">
      <div
        className={`max-w-[1100px] mx-auto flex justify-between items-center w-full py-3 px-6  dark:bg-back border shadow-sm rounded-2xl transition-all duration-300 
 ${
   scrolled
     ? "bg-white border-border shadow-black/10"
     : "border-transparent shadow-transparent"
 }`}
      >
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="text-2xl font-bold cursor-pointer"
            >
              bordre
            </button>
            <Version text="BETA 0.0.1" />
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
            <GithubButton />
            <ThemeSwitcher />
          </div>
          <div className="hidden md:flex gap-4">
            <button
              onClick={() => router.push("/login")}
              className="select-none text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity duration-200"
            >
              Sign in
            </button>
            <button
              onClick={() => router.push("/signup")}
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

export default Navbar
