"use client"
import CopyrightBar from "@/shared/components/CopyrightBar"
import LoginWrapper from "./components/LoginWrapper"
import LoginGoogle from "./components/LoginGoogle"
import LoginContent from "./components/LoginContent"
import LoginBack from "./components/LoginBack"
import LoginLogo from "./components/LoginLogo"
import LoginUsers from "./components/LoginUsers"
import LoginImage from "./components/LoginImage"

const Login = () => {
  
  return (
    <LoginWrapper>
      <div className="flex flex-row p-6 gap-6">
        <div className="flex flex-1 flex-col justify-between">
        <div className="flex flex-1 flex-col gap-9">
          <LoginLogo />
          <LoginUsers />
          <LoginContent />
          <div className="flex flex-row gap-2">
            <LoginBack />
            <LoginGoogle />
          </div>
        </div>
        <CopyrightBar />
        </div>
        <div>
          <LoginImage />
        </div>
      </div>
    </LoginWrapper>
  )
}

export default Login