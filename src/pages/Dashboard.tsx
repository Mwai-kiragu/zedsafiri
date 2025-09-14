import DashboardHeader from '@/components/DashboardHeader';
import Navigation from '@/components/Navigation';
import WelcomeSection from '@/components/WelcomeSection';
import BookingStats from '@/components/BookingStats';
import BookingForm from '@/components/BookingForm';
import RecentBookings from '@/components/RecentBookings';
import BookingSimulation from '@/components/BookingSimulation';
import AppleSection from '@/components/AppleSection';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background px-8 lg:px-32 max-md:px-5">
      <DashboardHeader />
      <div className="flex w-full gap-[37px] flex-wrap mt-4 max-md:max-w-full">
        <Navigation />
        <main className="flex-1 shrink basis-16 max-md:max-w-full">
          <div className="flex w-full items-stretch gap-[37px] flex-wrap max-md:max-w-full">
            <WelcomeSection />
            <BookingStats />
          </div>
          <BookingForm />
          <RecentBookings />
          <AppleSection />
          <BookingSimulation />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;