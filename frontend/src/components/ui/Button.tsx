import React from "react"

const Button = ({ text }: { text: string }) => {
  return (
    <button className="select-none px-3.5 py-2.5 font-semibold shadow-inner shadow-primary-text/60  cursor-pointer rounded-[10px] text-sm hover:opacity-90 duration-200 bg-primary text-primary-text inline-flex items-center justify-center whitespace-nowrap  transition-all ">
      {text}
    </button>
  )
}

export default Button
