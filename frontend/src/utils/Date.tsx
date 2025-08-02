import React, { useState, useEffect } from "react"

const DateComponent = ({ className }: { className?: string }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  return (
    <div className={"select-none font-medium text-base text-foreground/80 w-[70px] text-center" + (className ? ` ${className}` : "")}>
      {formattedTime}
    </div>
  )
}

export default DateComponent
