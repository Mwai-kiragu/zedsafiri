import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import SearchResults from "./pages/SearchResults";
import SeatSelection from "./pages/SeatSelection";
import BookingConfirm from "./pages/BookingConfirm";
import NotFound from "./pages/NotFound";
import SeatLockDemo from "./components/SeatLockDemo";
import SeatLockTestSuite from "./components/SeatLockTestSuite";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/booking/seat-selection" element={<SeatSelection />} />
            <Route path="/booking/confirm" element={<BookingConfirm />} />
            <Route path="/seat-lock-demo" element={<SeatLockDemo />} />
            <Route path="/seat-lock-tests" element={<SeatLockTestSuite />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
