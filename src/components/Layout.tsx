import React from "react";
import DashboardHeader from "./DashboardHeader";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header stays at the top */}
      <DashboardHeader />
      
      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}