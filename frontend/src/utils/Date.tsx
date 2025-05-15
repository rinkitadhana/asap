import React, { useState, useEffect } from "react"

const DateComponent = () => {
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
    <div className="font-mono font-semibold text-base text-foreground/80">
      {formattedTime}
    </div>
  )
}

export default DateComponent
