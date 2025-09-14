import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EyeIcon, EyeOffIcon } from "lucide-react"

interface SignInFormData {
  phoneNumber?: string
  email?: string
  password: string
}

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"mobile" | "email">("mobile")
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>()

  const onSubmit = (data: SignInFormData) => {
    console.log("Sign in data:", data)
  }

  const handleSocialLogin = (provider: "google" | "apple") => {
    console.log(`Sign in with ${provider}`)
  }

  return (
    <section className="flex w-[533px] flex-col items-start gap-14 backdrop-blur-md box-border bg-[rgba(255,255,255,0.70)] p-16 rounded-3xl max-md:w-full max-md:max-w-[500px] max-md:p-12 max-sm:w-full max-sm:gap-10 max-sm:px-6 max-sm:py-8">
      <div className="flex flex-col items-start gap-4 w-full max-sm:gap-3">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-[#006FFD] text-lg font-bold leading-6 tracking-[0.09px]">
            Sign in
          </h1>
          <div className="flex justify-center items-center gap-2 px-4 py-2 rounded-lg">
            <p className="text-[#71727A] text-xs font-normal tracking-[0.12px]">
              Create an account?{" "}
              <Link to="/signup" className="text-[#006FFD] font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        
        <h2 className="w-[315px] text-[#111] text-[28px] font-normal leading-8 max-sm:w-full max-sm:text-2xl max-sm:leading-7">
          Hi, Welcome
        </h2>
        
        <p className="w-full text-[#71727A] text-base font-normal leading-[22px] max-sm:text-sm max-sm:leading-5">
          Sign in to book or view your tickets.
        </p>

        <Tabs 
          value={loginMethod} 
          onValueChange={(value) => setLoginMethod(value as "mobile" | "email")}
          className="flex w-full flex-col gap-4"
        >
          <div className="flex w-[332px] justify-center items-center gap-2 p-1 rounded-2xl max-sm:w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent p-1">
              <TabsTrigger 
                value="mobile"
                className="flex justify-center items-center gap-2.5 flex-[1_0_0] p-3 rounded-xl data-[state=active]:text-[#006FFD] data-[state=active]:bg-transparent data-[state=inactive]:text-[#71727A] data-[state=inactive]:bg-transparent"
              >
                <span className="font-bold text-center text-xs">Mobile Number</span>
              </TabsTrigger>
              <TabsTrigger 
                value="email"
                className="flex justify-center items-center gap-2.5 flex-[1_0_0] p-3 rounded-xl data-[state=active]:text-[#006FFD] data-[state=active]:bg-transparent data-[state=inactive]:text-[#71727A] data-[state=inactive]:bg-transparent"
              >
                <span className="font-bold text-center text-xs">Email</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start gap-4 w-full max-sm:gap-3">
            <TabsContent value="mobile" className="w-full mt-0">
              <div className="flex flex-col items-start gap-2 w-full bg-white">
                <div className="flex h-12 items-center gap-2 w-full border box-border px-4 py-3 rounded-xl border-solid border-[#C5C6CC] max-sm:h-11 max-sm:px-3.5 max-sm:py-2.5">
                  <div className="flex items-center gap-4 flex-[1_0_0]">
                    <div className="flex flex-col justify-center items-center gap-2.5 bg-[#E8E9F1] px-2.5 py-[5px] rounded-md">
                      <span className="text-[#1F2024] text-sm font-normal leading-5">
                        +255
                      </span>
                    </div>
                    <Input
                      {...register("phoneNumber", { 
                        required: loginMethod === "mobile" ? "Phone number is required" : false 
                      })}
                      type="tel"
                      placeholder="Phone Number"
                      className="border-0 p-0 h-auto bg-transparent text-[#71727A] text-sm font-normal leading-5 placeholder:text-[#71727A] focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
                {errors.phoneNumber && (
                  <span className="text-red-500 text-xs">{errors.phoneNumber.message}</span>
                )}
              </div>
            </TabsContent>

            <TabsContent value="email" className="w-full mt-0">
              <div className="flex flex-col items-start gap-2 w-full bg-white">
                <div className="flex h-12 items-center gap-2 w-full border box-border px-4 py-3 rounded-xl border-solid border-[#C5C6CC] max-sm:h-11 max-sm:px-3.5 max-sm:py-2.5">
                  <Input
                    {...register("email", { 
                      required: loginMethod === "email" ? "Email is required" : false,
                      pattern: loginMethod === "email" ? {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address"
                      } : undefined
                    })}
                    type="email"
                    placeholder="Email Address"
                    className="border-0 p-0 h-auto bg-transparent text-[#71727A] text-sm font-normal leading-5 placeholder:text-[#71727A] focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-xs">{errors.email.message}</span>
                )}
              </div>
            </TabsContent>

          <div className="flex flex-col items-start gap-2 w-full bg-white">
            <div className="flex h-12 items-center gap-2 w-full border box-border px-4 py-3 rounded-xl border-solid border-[#C5C6CC] max-sm:h-11 max-sm:px-3.5 max-sm:py-2.5">
              <div className="flex items-center gap-4 flex-[1_0_0]">
                <Input
                  {...register("password", { required: "Password is required" })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="border-0 p-0 h-auto bg-transparent text-[#71727A] text-sm font-normal leading-5 placeholder:text-[#71727A] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="w-4 h-4 relative text-[#8F9098] hover:text-[#71727A] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs">{errors.password.message}</span>
            )}
          </div>

            <button
              type="button"
              className="w-full text-[#006FFD] text-xs font-bold text-left hover:underline"
            >
              Forgot Password?
            </button>

            <div className="flex flex-col items-start gap-4 w-full">
              <Button
                type="submit"
                variant="primary"
                size="custom"
                className="flex h-12 justify-center items-center gap-2 w-full box-border bg-[#E5F1FF] px-4 py-3 rounded-xl max-sm:h-11 max-sm:px-3.5 max-sm:py-2.5"
              >
                <span className="text-[#006FFD] text-xs font-bold">Sign In</span>
              </Button>
            </div>
          </form>
        </Tabs>

        <div className="flex flex-col items-center gap-6 w-full">
          <p className="text-[#71727A] text-center text-sm font-bold">
            or continue with
          </p>
          <div className="flex items-start gap-4 w-full max-sm:flex-col max-sm:gap-3">
            <Button
              type="button"
              variant="google"
              onClick={() => handleSocialLogin("google")}
              className="flex h-10 justify-center items-center gap-2 flex-[1_0_0] bg-[#ED3241] px-4 py-2 rounded-[63px] max-sm:w-full max-sm:h-11"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-[#FBFBFB] text-xs font-bold">Google</span>
            </Button>
            <Button
              type="button"
              variant="apple"
              onClick={() => handleSocialLogin("apple")}
              className="flex h-10 justify-center items-center gap-2 flex-[1_0_0] bg-[#1F2024] px-4 py-2 rounded-[63px] max-sm:w-full max-sm:h-11"
            >
              <div className="w-3 h-3 relative">
                <div className="w-3 h-3 absolute bg-[#FBFBFB] left-0 top-0" />
              </div>
              <span className="text-[#FBFBFB] text-xs font-bold">Apple</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
