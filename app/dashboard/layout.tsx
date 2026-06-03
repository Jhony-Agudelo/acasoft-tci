"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/Sidebar';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Toaster } from 'sonner';
import { User, Student, Course } from '@/lib/db-schema';
import { getStudents } from '@/lib/actions/student.actions';
import { getCourses } from '@/lib/actions/course.actions';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [dbStudentsCount, setDbStudentsCount] = useState(0);
  const [dbCoursesCount, setDbCoursesCount] = useState(0);

  useEffect(() => {
    // Check auth
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
        } else {
          router.push('/');
        }
      })
      .catch(() => router.push('/'));

    // Load counts
    getStudents().then(s => setDbStudentsCount(s.length));
    getCourses().then(c => setDbCoursesCount(c.length));
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch {
      router.push('/');
    }
  };

  if (!currentUser) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Cargando sesión...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
      <Toaster position="top-right" richColors />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          currentUser={currentUser} 
          mobileMenuOpen={mobileMenuOpen} 
          setMobileMenuOpen={setMobileMenuOpen} 
          dbStudentsCount={dbStudentsCount}
          dbCoursesCount={dbCoursesCount}
          handleLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto relative flex flex-col">
          <Navbar 
            currentUser={currentUser} 
            handleLogout={handleLogout} 
            setMobileMenuOpen={setMobileMenuOpen} 
          />

          <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full flex-1">
            {children}
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
