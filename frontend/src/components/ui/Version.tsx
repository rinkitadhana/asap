import React from "react"

const Version = ({ text }: { text: string }) => {
  return (
    <div className="px-3 py-1 rounded-full text-xs font-semibold font-mono bg-green-100 border border-border capitalize select-none">
      {text}
    </div>
  )
}

export default Version
