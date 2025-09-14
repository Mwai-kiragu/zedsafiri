import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EyeIcon, EyeOffIcon, Globe } from "lucide-react"
import { Header } from "@/components/Header"
import { MarketingSection } from "@/components/MarketingSection"
import googleIcon from "@/assets/google-icon.png"
import { useLanguage } from "@/contexts/LanguageContext"

interface SignUpFormData {
  phoneNumber?: string
  email?: string
  password: string
  confirmPassword: string
  fullName: string
  dialCode?: string
}

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"mobile" | "email">("mobile")
  const [dialCode, setDialCode] = useState("+255")
  const { t, toggleLanguage, getCurrentLanguageDisplay } = useLanguage()
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormData>()
  const password = watch("password")

  const onSubmit = (data: SignUpFormData) => {
    const submitData = {
      ...data,
      phoneNumber: loginMethod === "mobile" && data.phoneNumber ? `${dialCode}${data.phoneNumber}` : data.phoneNumber
    }
    console.log("Sign up data:", submitData)
  }

  const handleSocialLogin = (provider: "google" | "apple") => {
    console.log(`Sign up with ${provider}`)
  }

  return (
    <section className="flex w-[533px] flex-col items-start gap-14 backdrop-blur-md box-border bg-[rgba(255,255,255,0.70)] p-16 rounded-3xl max-md:w-full max-md:max-w-[500px] max-md:p-12 max-sm:w-full max-sm:gap-10 max-sm:px-6 max-sm:py-8">
      <div className="flex flex-col items-start gap-4 w-full max-sm:gap-3">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-[#006FFD] text-lg font-bold leading-6 tracking-[0.09px]">
            {t('auth.signup')}
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-8 px-3 py-1"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">{getCurrentLanguageDisplay()}</span>
            </Button>
            <div className="flex justify-center items-center gap-2 px-4 py-2 rounded-lg">
              <p className="text-[#71727A] text-xs font-normal tracking-[0.12px]">
                {t('auth.alreadyHaveAccount')}{" "}
                <Link to="/" className="text-[#006FFD] font-bold hover:underline">
                  {t('auth.signin')}
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <h2 className="w-[315px] text-[#111] text-[28px] font-normal leading-8 max-sm:w-full max-sm:text-2xl max-sm:leading-7">
          {t('auth.signupWelcome')}
        </h2>
        
        <p className="w-full text-[#71727A] text-base font-normal leading-[22px] max-sm:text-sm max-sm:leading-5">
          {t('auth.signupSubtitle')}
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
                <span className="font-bold text-center text-xs">{t('auth.mobileNumber')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="email"
                className="flex justify-center items-center gap-2.5 flex-[1_0_0] p-3 rounded-xl data-[state=active]:text-[#006FFD] data-[state=active]:bg-transparent data-[state=inactive]:text-[#71727A] data-[state=inactive]:bg-transparent"
              >
                <span className="font-bold text-center text-xs">{t('auth.email')}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start gap-4 w-full max-sm:gap-3">
            <div className="flex flex-col items-start gap-2 w-full bg-white">
              <div className="flex h-12 items-center gap-2 w-full border box-border px-4 py-3 rounded-xl border-solid border-[#C5C6CC] max-sm:h-11 max-sm:px-3.5 max-sm:py-2.5">
                <Input
                  {...register("fullName", { required: t('auth.fullName') + ' is required' })}
                  type="text"
                  placeholder={t('auth.fullName')}
                  className="border-0 p-0 h-auto bg-transparent text-[#71727A] text-sm font-normal leading-5 placeholder:text-[#71727A] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              {errors.fullName && (
                <span className="text-red-500 text-xs">{errors.fullName.message}</span>
              )}
            </div>

            <TabsContent value="mobile" className="w-full mt-0">
              <div className="flex flex-col items-start gap-2 w-full bg-white">
                <div className="flex h-12 items-center gap-2 w-full border box-border px-4 py-3 rounded-xl border-solid border-[#C5C6CC] max-sm:h-11 max-sm:px-3.5 max-sm:py-2.5">
                  <div className="flex items-center gap-4 flex-[1_0_0]">
                    <select
                      value={dialCode}
                      onChange={(e) => setDialCode(e.target.value)}
                      className="bg-[#E8E9F1] px-2.5 py-[5px] rounded-md text-[#1F2024] text-sm font-normal leading-5 border-0 focus:outline-none"
                    >
                      <option value="+211">🇸🇸 +211</option>
                      <option value="+255">🇹🇿 +255</option>
                      <option value="+254">🇰🇪 +254</option>
                      <option value="+250">🇷🇼 +250</option>
                      <option value="+257">🇧🇮 +257</option>
                      <option value="+256">🇺🇬 +256</option>
                    </select>
                    <Input
                      {...register("phoneNumber", { 
                        required: loginMethod === "mobile" ? t('auth.phoneNumber') + " is required" : false 
                      })}
                      type="tel"
                      placeholder={t('auth.phoneNumber')}
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
                      required: loginMethod === "email" ? t('auth.email') + " is required" : false,
                      pattern: loginMethod === "email" ? {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address"
                      } : undefined
                    })}
                    type="email"
                    placeholder={t('auth.emailAddress')}
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
                    {...register("password", { 
                      required: t('auth.password') + " is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder={t('auth.password')}
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

            <div className="flex flex-col items-start gap-2 w-full bg-white">
              <div className="flex h-12 items-center gap-2 w-full border box-border px-4 py-3 rounded-xl border-solid border-[#C5C6CC] max-sm:h-11 max-sm:px-3.5 max-sm:py-2.5">
                <div className="flex items-center gap-4 flex-[1_0_0]">
                  <Input
                    {...register("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: (value) => value === password || "Passwords do not match"
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t('auth.confirmPassword')}
                    className="border-0 p-0 h-auto bg-transparent text-[#71727A] text-sm font-normal leading-5 placeholder:text-[#71727A] focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="w-4 h-4 relative text-[#8F9098] hover:text-[#71727A] transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>
              )}
            </div>

            <div className="flex flex-col items-start gap-4 w-full">
              <Button
                type="submit"
                variant="primary"
                size="custom"
                className="flex h-12 justify-center items-center gap-2 w-full box-border bg-[#E5F1FF] px-4 py-3 rounded-xl max-sm:h-11 max-sm:px-3.5 max-sm:py-2.5"
              >
                <span className="text-[#006FFD] text-xs font-bold">{t('auth.signup')}</span>
              </Button>
            </div>
          </form>
        </Tabs>

        <div className="flex flex-col items-center gap-6 w-full">
          <p className="text-[#71727A] text-center text-sm font-bold">
            {t('auth.orContinueWith')}
          </p>
          <div className="flex items-start gap-4 w-full max-sm:flex-col max-sm:gap-3">
            <Button
              type="button"
              variant="google"
              onClick={() => handleSocialLogin("google")}
              className="flex h-10 justify-center items-center gap-2 flex-[1_0_0] bg-[#ED3241] px-4 py-2 rounded-[63px] max-sm:w-full max-sm:h-11"
            >
              <img src={googleIcon} alt="Google" className="w-3 h-3" />
              <span className="text-[#FBFBFB] text-xs font-bold">{t('auth.google')}</span>
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
              <span className="text-[#FBFBFB] text-xs font-bold">{t('auth.apple')}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

const SignUp = () => {
  return (
    <div className="w-[1440px] h-[960px] relative overflow-hidden bg-[#F1F7FF] max-md:w-full max-md:max-w-screen-lg max-md:h-auto max-md:min-h-screen max-sm:w-full max-sm:h-auto max-sm:min-h-screen">
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/65945d6d85000cdd48713f2a96d08767595563da?width=2880"
        alt="background"
        className="w-[1440px] h-[500px] absolute object-cover left-0 top-[461px] max-md:w-full max-md:h-[300px] max-md:top-auto max-md:bottom-0 max-sm:w-full max-sm:h-[200px]"
      />
      <div className="flex w-[1440px] flex-col items-start gap-4 absolute h-[769px] left-0 top-0 max-md:w-full max-md:h-auto">
        <Header />
        <main className="flex justify-between items-start w-full box-border px-32 py-0 max-md:flex-col max-md:gap-8 max-md:px-16 max-md:py-0 max-sm:flex-col max-sm:gap-6 max-sm:px-6 max-sm:py-0">
          <SignUpForm />
          <MarketingSection />
        </main>
      </div>
    </div>
  )
}

export default SignUp