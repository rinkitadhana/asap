import Image from 'next/image'
import React from 'react'
import { RiCustomerService2Line } from 'react-icons/ri'

const LoginImage = () => {
  return (
    <div className="flex flex-col gap-4 relative border border-primary-border h-full overflow-hidden">
        <Image className="select-none" src="/img/login/login-image.png" alt="login-image" width={500} height={500} />
        <a href='mailto:therinkit@gmail.com' className=" select-none flex flex-row items-center gap-2 absolute bottom-2 right-2 px-2 py-1 bg-background/40 hover:bg-background/55 transition-all duration-200 backdrop-blur-xs">
        <RiCustomerService2Line size={16} />
        Contact Us
        </a>
    </div>
  )
}

export default LoginImage