"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Footer } from '@/components/ui/Footer';
import logoApp from '@/assets/img/logoApp.png';

export function AuthShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          router.push('/dashboard');
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Cargando sistema...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
      <div className="flex-1 flex flex-col lg:flex-row relative">
        <div className="w-full lg:w-[45%] bg-gradient-to-br from-[#fc7609] via-orange-500 to-orange-400 p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-white p-2 rounded-2xl shadow-xl shadow-orange-900/20">
              <Image src={logoApp} alt="TCI Logo" width={48} height={48} className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-white font-extrabold font-display text-2xl tracking-tight leading-none">TCI</h1>
              <p className="text-orange-100 font-medium text-xs tracking-wider uppercase mt-1">Taller Creativo De Inglés</p>
            </div>
          </div>

          <div className="relative z-10 my-16 lg:my-auto">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white font-display leading-tight mb-6 drop-shadow-sm">
              Potencia la creatividad de tus hijos con el inglés.
            </h2>
            <p className="text-orange-50 text-lg font-medium leading-relaxed max-w-md">
              Abre las puertas de un mundo lleno de oportunidades para tus pequeños. Inscríbelos hoy en Taller Creativo de Inglés y acompáñalos en su camino hacia un futuro brillante y bilingüe.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-slate-50 to-slate-50 -z-10"></div>

          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: pathname === '/login' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: pathname === '/login' ? -20 : 20 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
