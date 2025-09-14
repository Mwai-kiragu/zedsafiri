import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BookingCardProps {
  bookingId: string;
  status: 'Paid' | 'Pending' | 'Cancelled';
  from: string;
  to: string;
  date: string;
  time: string;
  seats: string;
  price: string;
  icon: string;
}

const BookingCard: React.FC<BookingCardProps> = ({
  bookingId,
  status,
  from,
  to,
  date,
  time,
  seats,
  price,
  icon
}) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'text-success-foreground bg-success-bg';
      case 'Pending':
        return 'text-warning-foreground bg-warning-bg';
      case 'Cancelled':
        return 'text-destructive-foreground bg-destructive/10';
      default:
        return 'text-success-foreground bg-success-bg';
    }
  };

  return (
    <article className="shadow-sm bg-card text-card-foreground flex flex-col flex-1 shrink basis-0 px-8 py-6 rounded-xl border max-md:max-w-full max-md:px-5">
      <div className="flex w-full items-center gap-10 justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-brand-light rounded-lg p-1">
            <img
              src={icon}
              alt="Booking type"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div className="text-foreground text-base font-normal">
            {bookingId}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center px-2 py-1.5 rounded-xl text-xs font-semibold ${getStatusStyles(status)}`}>
            {status}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-lg text-foreground font-normal mt-2">
        <div>{from}</div>
        <ArrowRight className="w-4 h-4" />
        <div>{to}</div>
      </div>
      
      <div className="flex w-full gap-2 mt-2">
        <div className="flex flex-col text-sm text-muted-foreground font-normal">
          <div className="flex items-center gap-2">
            <div>{date} at {time}</div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div>Seats: {seats}</div>
          </div>
        </div>
        <div className="flex flex-col text-base text-foreground font-semibold flex-1 shrink basis-0">
          <div className="flex items-center gap-2">
            <div>{price}</div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BookingCard;