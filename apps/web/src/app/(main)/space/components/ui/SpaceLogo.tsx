import Image from "next/image"
import React from "react"

const SpaceLogo = () => {
  return <div className="flex items-center gap-2">
    <Image
      src="/img/logo/logo.png"
      className="size-7"
      alt="Asap"
      width={40}
      height={40}
    />
    <h1 className="text-xl font-semibold">Asap</h1>
  </div>
}

export default SpaceLogo
