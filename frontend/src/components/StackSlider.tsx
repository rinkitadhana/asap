"use client"
import React from "react"
import {
  SiNextdotjs,
  SiTailwindcss,
  SiFramer,
  SiGreensock,
  SiPostgresql,
  SiPrisma,
  SiFigma,
  SiTypescript,
  SiReact,
  SiSocketdotio,
  SiVercel,
  SiNodedotjs,
} from "react-icons/si"

const StackSlider = () => {
  // Tech stack data with React icons
  const techStack = [
    {
      name: "Next.js",
      icon: SiNextdotjs,
      color: "#000000"
    },
    {
      name: "React",
      icon: SiReact,
      color: "#61DAFB"
    },
    {
      name: "TypeScript",
      icon: SiTypescript,
      color: "#3178C6"
    },
    {
      name: "Tailwind CSS",
      icon: SiTailwindcss,
      color: "#06B6D4"
    },
    {
      name: "Framer Motion",
      icon: SiFramer,
      color: "#0055FF"
    },
    {
      name: "GSAP",
      icon: SiGreensock,
      color: "#88CE02"
    },
    {
      name: "Node.js",
      icon: SiNodedotjs,
      color: "#339933"
    },
    {
      name: "Socket.io",
      icon: SiSocketdotio,
      color: "#010101"
    },
    {
      name: "PostgreSQL",
      icon: SiPostgresql,
      color: "#4169E1"
    },
    {
      name: "Prisma",
      icon: SiPrisma,
      color: "#2D3748"
    },
    {
      name: "Figma",
      icon: SiFigma,
      color: "#F24E1E"
    },
    {
      name: "Vercel",
      icon: SiVercel,
      color: "#000000"
    }
  ]

  // Duplicate the array for seamless infinite scroll
  const duplicatedStack = [...techStack, ...techStack]

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center">
      {/* Left gradient mask */}
      <div className="absolute left-0 top-0 h-full w-40 z-10 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none" />

      {/* Right gradient mask */}
      <div className="absolute right-0 top-0 h-full w-40 z-10 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />

      {/* Scrolling container */}
      <div className="flex items-center w-full">
        <div className="flex animate-infinite-scroll items-center">
          {duplicatedStack.map((tech, index) => {
            const IconComponent = tech.icon
            return (
              <div
                key={`${tech.name}-${index}`}
                className="flex-shrink-0 mx-6 flex flex-col items-center"
              >
                <div className="h-18 flex items-center justify-center ">
                  <IconComponent
                    size={36}
                    style={{ color: tech.color }}
                    className="transition-transform duration-300"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default StackSlider
