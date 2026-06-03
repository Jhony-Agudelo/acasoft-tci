import React from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { Footer } from '@/components/ui/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
      <div className="flex-1 flex max-w-7xl mx-auto w-full relative">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col pb-20 lg:pb-0 px-4 md:px-6 py-6 md:py-8 lg:pl-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
