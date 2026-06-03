"use client";

import React from 'react';
import Image from 'next/image';
import { User, UserRole } from '@/lib/db-schema';
import { LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  handleLogout: () => void;
  setMobileMenuOpen?: (open: boolean) => void;
}

export function Navbar({ currentUser, handleLogout, setMobileMenuOpen }: NavbarProps) {
  const getInitials = () => {
    return `${currentUser.nombres[0] || ''}${currentUser.apellidos[0] || ''}`.toUpperCase();
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 shrink-0 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4">
        {setMobileMenuOpen && (
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <span className="font-bold text-[#fc7609] font-display text-lg hidden md:block">TCI Dashboard</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-800">{currentUser.nombres} {currentUser.apellidos}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{currentUser.role}</p>
        </div>
        
        <div className="w-10 h-10 rounded-full border-2 border-orange-100 flex items-center justify-center bg-orange-50 text-[#fc7609] font-bold overflow-hidden shadow-sm">
          {currentUser.avatar_url ? (
            <Image 
              src={currentUser.avatar_url} 
              alt="Avatar" 
              width={40} 
              height={40} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span>{getInitials()}</span>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

        <button
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors group"
          title="Cerrar sesión"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>
    </header>
  );
}
