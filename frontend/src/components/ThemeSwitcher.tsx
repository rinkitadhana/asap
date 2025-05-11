"use client"
import { Moon, Sun } from "lucide-react"
import React, { useEffect, useState } from "react"

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<string | null>(null)

  // Set theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const initial = saved || getSystemTheme()
    setTheme(initial)
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(initial)
  }, [])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (!localStorage.getItem("theme")) {
        const newTheme = mediaQuery.matches ? "dark" : "light"
        setTheme(newTheme)
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(newTheme)
      }
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Update theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark/light mode"
      className="cursor-pointer p-2 hover:bg-hover rounded-md transition-all duration-200"
    >
      {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
