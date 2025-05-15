"use client"
import React, { useEffect, useRef, useState } from "react"

// Component with inline SVGs
const StackSlider = () => {
  // Tech stack data with inline SVGs
  const techStack = [
    {
      name: "Next.js",
      svg: (
        <svg viewBox="0 0 180 180" fill="none">
          <path
            d="M90 0C40.2 0 0 40.2 0 90s40.2 90 90 90 90-40.2 90-90S139.8 0 90 0Zm-.6 146.7c-.3 0-.6 0-.9-.1-.2-.1-.5-.3-.6-.5l-36.4-45.2v-.3h-2v46.1h-14.7V33.4h13.8c.3 0 .6 0 .9.1.3.1.5.3.7.5l36.4 45.2v.2h2V33.4h14.6v113.3H89.4Z"
            fill="#000"
          />
        </svg>
      ),
    },
    {
      name: "Bun",
      svg: (
        <svg viewBox="0 0 180 180" fill="none">
          <path
            d="M90 160c-24.85 0-45-20.15-45-45s20.15-45 45-45 45 20.15 45 45-20.15 45-45 45Z"
            stroke="#000"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M60 105c12.15 30 60 30 60 0"
            stroke="#000"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="71" cy="90" r="3" fill="#000" />
          <circle cx="109" cy="90" r="3" fill="#000" />
        </svg>
      ),
    },
    {
      name: "Express",
      svg: (
        <svg viewBox="0 0 180 180" fill="none">
          <path
            d="M90 45c-19.09 0-27.73 9.34-32.76 28.08 6.93-9.11 15.01-12.57 24.21-10.35 5.27 1.27 9.04 4.95 13.21 9.02 6.8 6.65 14.67 14.35 31.87 14.35 19.09 0 27.73-9.34 32.76-28.09-6.93 9.12-15.01 12.58-24.21 10.36-5.27-1.27-9.04-4.96-13.21-9.02-6.8-6.66-14.67-14.35-31.87-14.35ZM57.24 85.94C38.15 85.94 29.51 95.28 24.48 114.02c6.93-9.11 15.01-12.57 24.21-10.35 5.27 1.27 9.04 4.95 13.21 9.02 6.8 6.65 14.67 14.35 31.87 14.35 19.09 0 27.73-9.34 32.76-28.09-6.93 9.12-15.01 12.58-24.21 10.36-5.27-1.27-9.04-4.96-13.21-9.02-6.8-6.66-14.67-14.35-31.87-14.35Z"
            fill="#000"
          />
        </svg>
      ),
    },
    {
      name: "Tailwind CSS",
      svg: (
        <svg viewBox="0 0 180 180" fill="none">
          <path
            d="M90 30c-24 0-39 12-45 36 9-12 19.5-16.5 31.5-13.5 6.83 1.69 11.72 6.61 17.12 12.05 8.8 8.86 19 19.12 41.12 19.12 24 0 39-12 45-36-9 12-19.5 16.5-31.5 13.5-6.83-1.7-11.72-6.61-17.12-12.05-8.8-8.86-19-19.12-41.12-19.12ZM45 96c-24 0-39 12-45 36 9-12 19.5-16.5 31.5-13.5 6.83 1.7 11.72 6.61 17.12 12.05 8.8 8.86 19 19.12 41.12 19.12 24 0 39-12 45-36-9 12-19.5 16.5-31.5 13.5-6.83-1.7-11.72-6.61-17.12-12.05-8.8-8.86-19-19.12-41.12-19.12Z"
            fill="#06B6D4"
          />
        </svg>
      ),
    },
    {
      name: "Framer Motion",
      svg: (
        <svg viewBox="0 0 180 180" fill="none">
          <path d="M45 45h90v45H90v45H45V45Z" fill="#0055FF" />
          <path d="M45 135v-45h45l45 45H45Z" fill="#0055FF" />
        </svg>
      ),
    },
    {
      name: "GSAP",
      svg: (
        <svg viewBox="0 0 180 180" fill="none">
          <path
            d="M107.05 81.14a45.45 45.45 0 0 0-9.36-14.47 38.64 38.64 0 0 0-7.37-7.24C78.7 52.2 64.55 48.78 49.3 50.92c-12.64 1.87-24.05 7.64-32.05 15.84-6.44 6.37-10.5 13.75-11.36 21.04-.54 4.7.27 9.1 2.28 13a22.63 22.63 0 0 0 8.59 9.5c7.78 4.84 18.68 7.1 30.3 6.24a90.15 90.15 0 0 0 28.32-6.37c.42-.14.82-.27 1.24-.4.8.8 1.6 1.46 2.5 2.26a44.7 44.7 0 0 0 8.73 6.78c-2.42.8-4.9 1.6-7.5 2.27-13.2 3.7-27.3 5.05-41.37 2.95-16.82-2.68-28.99-10.58-33.2-21.3-1.88-4.83-2.15-10.05-1.07-14.88.8-3.97 2.5-7.65 4.9-11.09-1.08 3.57-1.48 7.14-1.21 10.58.53 6.64 3.76 12.09 9.8 16.2 9.65 6.64 24.72 8.92 41.8 6.65 11.82-1.6 23.92-5.18 33.3-9.78 1.35-.67 2.56-1.33 3.77-2A44.92 44.92 0 0 0 106 81.14h1.05Z"
            fill="#99C905"
          />
        </svg>
      ),
    },
    {
      name: "Auth.js",
      svg: (
        <svg viewBox="0 0 180 180" fill="none">
          <rect width="180" height="180" rx="36" fill="#000" />
          <path
            d="M101.29 72.86v20.57H79.71V72.86h21.58ZM100.28 65H80.72c-7.93 0-14.35 6.43-14.35 14.36v21.57c0 7.93 6.42 14.36 14.35 14.36h19.56c7.93 0 14.36-6.43 14.36-14.36V79.36c0-7.93-6.43-14.36-14.36-14.36Z"
            fill="#FFF"
          />
        </svg>
      ),
    },
    {
      name: "WebRTC",
      svg: (
        <svg viewBox="0 0 180 180" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M89.92 35c-30.32 0-54.92 24.6-54.92 54.92 0 30.33 24.6 54.92 54.92 54.92 30.33 0 54.92-24.6 54.92-54.92 0-30.33-24.6-54.92-54.92-54.92Zm0 98.86c-24.19 0-43.94-19.74-43.94-43.94 0-24.19 19.75-43.94 43.94-43.94 24.2 0 43.94 19.75 43.94 43.94 0 24.2-19.75 43.94-43.94 43.94Z"
            fill="#0065FF"
          />
          <path
            d="M72 90c0 9.94 8.06 18 18 18s18-8.06 18-18-8.06-18-18-18-18 8.06-18 18Z"
            fill="#F0EC00"
          />
        </svg>
      ),
    },
    {
      name: "shadcn/ui",
      svg: (
        <svg viewBox="0 0 180 180" fill="none">
          <path d="M45 45h90v90H45V45Z" stroke="#000" strokeWidth="2" />
          <path
            d="M90 99c0-8.28 6.72-15 15-15s15 6.72 15 15-6.72 15-15 15h-15V99Z"
            fill="#000"
          />
          <path
            d="M90 81c0 8.28-6.72 15-15 15s-15-6.72-15-15 6.72-15 15-15h15v15Z"
            fill="#000"
          />
        </svg>
      ),
    },
    {
      name: "PostgreSQL",
      svg: (
        <svg viewBox="0 0 180 180" fill="none">
          <path
            d="M133.17 94.99c-1.21-1.04-4.32-1.93-8.98-.15-10.2 3.88-14.51-1.35-15.57-3.43 7.92-12.01 14.07-27.22 10.65-31.05-11.7-13.05-31.85-6.87-32.24-6.72l-.1.03c-2.23-.47-4.72-.75-7.5-.8-5.12-.1-9 1.34-11.96 3.58 0 0-36.26-14.99-34.61 18.82.37 7.22 10.58 54.75 22.72 40.32 4.44-5.28 8.72-9.74 8.72-9.74 2.13 1.42 4.69 2.14 7.36 1.88l.2-.18c.07.56.02 1.1-.12 1.73a102.65 102.65 0 0 1 2.52-3.44s4.8 1.07 11.46.83c6.82-.26 10.57-1.76 10.57-1.76s.18 7.36 2.86 14.62c3.66 7.25 9.13 10.72 15.1 8.48 4.6-1.72 10.06-4.68 10.47-16.95.27-8.3.71-12.7 1.37-14.76.91-2.8 2.94-6.22 4.98-5.63 2.5.73 4.85.44 5.93 1.1 2.08 1.27 3.63 2.05 5.5 2.77 3.19 1.23 3.91 8.28-3.92 7 0 0 1.42 11.15 13.54 12.2 11.94.98 17.93-4.58 18.82-6.58.89-2 1.34-3.17-.8-4.31l-1.1-.47-35.68-11.36Z"
            fill="#336791"
          />
        </svg>
      ),
    },
    {
      name: "Prisma",
      svg: (
        <svg viewBox="0 0 180 180" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M53.79 137.88c-2.69 0-5.06-1.84-5.72-4.48L27.59 49.47a5.83 5.83 0 0 1 .85-4.97 5.83 5.83 0 0 1 4.2-2.38l79.68-9.48c1.85-.22 3.64.37 4.95 1.58a5.84 5.84 0 0 1 1.87 4.86l-11.32 93a5.83 5.83 0 0 1-3.95 4.86l-48.3 20.66a5.8 5.8 0 0 1-1.78.28ZM56.4 63.23a2.92 2.92 0 0 0-1.9 5.15l27.19 23.16a2.92 2.92 0 0 0 4.04-.3l15.7-17.12a2.92 2.92 0 0 0-1.95-5.07L56.4 63.24Z"
            fill="#4A6AE2"
          />
        </svg>
      ),
    },
    {
      name: "Figma",
      svg: (
        <svg viewBox="0 0 180 180" fill="none">
          <path
            d="M45 90c0-9.94 8.06-18 18-18h9v36h-9c-9.94 0-18-8.06-18-18Z"
            fill="#F24E1E"
          />
          <path
            d="M72 72h18c9.94 0 18 8.06 18 18s-8.06 18-18 18H72V72Z"
            fill="#FF7262"
          />
          <path
            d="M72 36h18c9.94 0 18 8.06 18 18s-8.06 18-18 18H72V36Z"
            fill="#A259FF"
          />
          <path
            d="M45 54c0-9.94 8.06-18 18-18h9v36h-9c-9.94 0-18-8.06-18-18Z"
            fill="#1ABCFE"
          />
          <path
            d="M45 126c0-9.94 8.06-18 18-18 9.94 0 18 8.06 18 18s-8.06 18-18 18c-9.94 0-18-8.06-18-18Z"
            fill="#0ACF83"
          />
        </svg>
      ),
    },
  ]

  const carouselRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized && carouselRef.current) {
      setIsInitialized(true)
      startAnimation()
    }
  }, [isInitialized])

  const startAnimation = () => {
    if (!carouselRef.current) return

    const carousel = carouselRef.current
    const scrollWidth = carousel.scrollWidth
    const clientWidth = carousel.clientWidth

    // Animation properties
    const duration = 20000 // Animation duration in ms
    let startTime = performance.now()

    const scroll = (timestamp: number) => {
      const elapsed = timestamp - startTime
      const progress = (elapsed % duration) / duration

      // Calculate scroll position
      const scrollPosition = progress * scrollWidth

      // If we're near the end, loop back to beginning
      if (scrollPosition > scrollWidth - clientWidth) {
        startTime = timestamp
        carousel.scrollLeft = 0
      } else {
        carousel.scrollLeft = scrollPosition
      }

      // Continue the animation
      requestAnimationFrame(scroll)
    }

    requestAnimationFrame(scroll)
  }

  return (
    <div className="relative overflow-hidden w-full h-full">
      <div className="absolute left-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-white to-transparent"></div>

      <div
        ref={carouselRef}
        className="flex items-center overflow-x-hidden whitespace-nowrap py-4 w-full"
      >
        {techStack.map((tech, index) => (
          <div key={index} className="inline-block mx-4 flex-shrink-0">
            <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-lg p-2 shadow-sm">
              <div className="w-16 h-16">{tech.svg}</div>
            </div>
            <p className="text-center text-xs mt-2 text-gray-600">
              {tech.name}
            </p>
          </div>
        ))}

        <div className="w-screen flex-shrink-0"></div>
      </div>

      <div className="absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-white to-transparent"></div>
    </div>
  )
}

export default StackSlider
