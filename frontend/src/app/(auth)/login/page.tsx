"use client"
import Input from "@/components/ui/Input"
import PageHead from "@/components/PageHead"
// import { useLogin } from "@/hooks/useAuth"
import FooterInfo from "@/components/FooterInfo"
import { Eye, EyeOff, LoaderCircle, LockKeyhole, UserRound } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const LogIn = () => {
  const [formData, setFormData] = useState<{
    identifier: string
    password: string
  }>({
    identifier: "",
    password: "",
  })
  const [identifierError, setIdentifierError] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)
  // const { mutate: login, isPending: isLoggingIn } = useLogin()
  // Temporarily mocking these values until useLogin is available
  const isLoggingIn = false
  const login = (data: any) => {
    console.log("Login function called with:", data)
    // This is a placeholder for the actual login function
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData.identifier == "") {
      setIdentifierError(true)
      setTimeout(() => {
        setIdentifierError(false)
      }, 5000)
    }
    if (formData.password == "") {
      setPasswordError(true)
      setTimeout(() => {
        setPasswordError(false)
      }, 5000)
    }
    login(formData)
  }

  return (
    <section className="flex flex-col py-4 h-screen">
      <PageHead title="Login | bordre" />
      <div className="flex-grow sin-screen ">
        <form className=" flex flex-col gap-6" onSubmit={handleLogin}>
          <div className=" flex flex-col gap-4">
            {/* <Image
              className=" size-50 select-none"
              src="/img/icon/bordre-name.png"
              height={180}
              width={180}
              alt="company_logo"
            /> */}
            <h1 className=" text-mainclr text-5xl font-bold">bordre</h1>
            <p>Please enter your email or username and your password.</p>
          </div>
          <div className=" flex flex-col gap-4">
            <Input
              text="Username / email address"
              name="identifier"
              type="text"
              value={formData.identifier}
              error={identifierError}
              onChange={handleChange}
              ficon={<UserRound strokeWidth={1.5} />}
            />
            <Input
              text="Password"
              name="password"
              type="password"
              value={formData.password}
              error={passwordError}
              onChange={handleChange}
              ficon={<LockKeyhole strokeWidth={1.5} />}
              licon1={<Eye strokeWidth={1.5} />}
              licon2={<EyeOff strokeWidth={1.5} />}
            />
          </div>
          <div className=" flex flex-col gap-4">
            <button disabled={isLoggingIn} className="btn" type="submit">
              {isLoggingIn ? (
                <div className="flex items-center justify-center gap-2">
                  <LoaderCircle className="animate-spin" />
                </div>
              ) : (
                "Log in"
              )}
            </button>
            <div className="  flex justify-between">
              <Link
                href="forgot-password"
                className=" hover:opacity-80 transition duration-200 cursor-pointer"
              >
                forgot password?
              </Link>
              <Link
                href="/signup"
                className=" hover:opacity-80 transition duration-200 cursor-pointer"
              >
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
      <FooterInfo />
    </section>
  )
}

export default LogIn
