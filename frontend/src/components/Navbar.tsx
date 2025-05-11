"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import ThemeSwitcher from "./ThemeSwitcher"
import GithubButton from "./GithubButton"
import Button from "./ui/Button"
import Version from "./ui/Version"
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

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
        className={`max-w-[1100px] mx-auto flex justify-between items-center w-full py-3 px-6  dark:bg-back border shadow-sm rounded-2xl transition-all duration-400 
 ${
   scrolled
     ? "bg-white border-border shadow-black/10"
     : "border-transparent shadow-transparent"
 }`}
      >
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">bordre</h1>
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
            <button className="select-none text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity duration-200">
              Sign in
            </button>
            <Button text="Get started" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Navbar
