import React from 'react';

const WelcomeSection = () => {
  return (
    <section className="bg-card shadow-sm relative flex-1 shrink basis-0 pt-10 pb-12 px-12 rounded-3xl border overflow-hidden max-md:max-w-full max-md:px-5">
      <img
        src="https://api.builder.io/api/v1/image/assets/c88c6030e63c40c6b5ec787e5d7f1a8c/fba9e6156eba30459cc63f2685d338063a4d9ed5?placeholderIfAbsent=true"
        alt="Background decoration"
        className="absolute bottom-0 left-[-39px] w-[673px] h-[213px] object-contain z-0 max-w-full opacity-50"
      />
      <div className="relative z-10 w-full max-md:max-w-full">
        <h1 className="text-brand-dark text-5xl font-semibold">
          Hi Alex 👋
        </h1>
        <p className="text-foreground text-lg font-normal mt-4">
          Good to have you back.
        </p>
      </div>
    </section>
  );
};

export default WelcomeSection;