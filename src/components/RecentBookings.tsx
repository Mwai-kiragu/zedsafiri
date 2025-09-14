import React from 'react';
import BookingCard from './BookingCard';

const RecentBookings = () => {
  const bookings = [
    {
      bookingId: '#12345678',
      status: 'Paid' as const,
      from: 'Dar-es-salam',
      to: 'Mwanza',
      date: '2025-03-02',
      time: '08:00',
      seats: '4F',
      price: 'TSh 25,000',
      icon: 'https://api.builder.io/api/v1/image/assets/c88c6030e63c40c6b5ec787e5d7f1a8c/903afd132c1f8a282c0d9776cc74bb9e706d92a8?placeholderIfAbsent=true'
    },
    {
      bookingId: '#12345679',
      status: 'Pending' as const,
      from: 'Mwanza',
      to: 'Arusha',
      date: '2025-03-05',
      time: '14:30',
      seats: '2A',
      price: 'TSh 18,500',
      icon: 'https://api.builder.io/api/v1/image/assets/c88c6030e63c40c6b5ec787e5d7f1a8c/9d9327c2eda3865daae147442e1ae28150944a99?placeholderIfAbsent=true'
    }
  ];

  return (
    <section className="flex w-full flex-col mt-10 max-md:max-w-full">
      <div className="flex items-center justify-center px-8 max-md:px-5">
        <h2 className="text-3xl font-semibold text-foreground">
          Recent Bookings
        </h2>
      </div>
      <div className="flex w-full gap-12 flex-wrap mt-6 max-md:max-w-full">
        {bookings.map((booking, index) => (
          <BookingCard
            key={`${booking.bookingId}-${index}`}
            {...booking}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentBookings;