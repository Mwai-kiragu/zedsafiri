import { Header } from "@/components/Header"
import { SignInForm } from "@/components/SignInForm"
import { MarketingSection } from "@/components/MarketingSection"

const Index = () => {
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
          <SignInForm />
          <MarketingSection />
        </main>
      </div>
    </div>
  )
}

export default Index
