export const MarketingSection = () => {
  return (
    <section className="flex flex-col items-start gap-2.5 backdrop-blur-md px-6 py-16 rounded-3xl max-md:w-full max-md:px-6 max-md:py-12 max-sm:w-full max-sm:px-4 max-sm:py-8">
      <div className="flex w-[487px] flex-col items-start gap-4 max-md:w-full max-sm:w-full">
        <h1 className="w-full text-[#1F2024] text-5xl font-bold leading-[50px] max-md:text-[40px] max-md:leading-[44px] max-sm:text-[32px] max-sm:leading-9">
          Search,
          <br />
          Book, Travel.
          <br />
          <span className="text-[#006FFD]">Conveniently</span>
        </h1>
        <p className="w-full text-[#494A50] text-base font-normal leading-[22px] max-sm:text-sm max-sm:leading-5">
          Travelling by train or bus, Zed Safiri enables you to search, book, pay seamlessly and get your ticket conveniently.
        </p>
      </div>
    </section>
  )
}
