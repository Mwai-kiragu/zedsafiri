import React from 'react';

const BookingStats = () => {
  return (
    <section className="bg-card text-card-foreground shadow-sm flex flex-col justify-center w-[282px] px-12 py-8 rounded-3xl border max-md:px-5">
      <div className="max-w-full w-[186px]">
        <div className="text-5xl font-semibold text-primary">
          0
        </div>
        <div className="text-lg font-normal text-foreground mt-4 leading-6">
          Upcoming
          <br />
          Bookings
        </div>
      </div>
    </section>
  );
};

export default BookingStats;