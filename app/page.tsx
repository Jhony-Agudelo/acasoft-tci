"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Footer } from '@/components/ui/Footer';
import { LoginForm } from '@/components/auth/LoginForm';
import { EnrollmentForm } from '@/components/public/EnrollmentForm';
import { User, Student, Guardian } from '@/lib/db-schema';
import { getUsers } from '@/lib/actions/user.actions';
import { getStudents } from '@/lib/actions/student.actions';
import { getSettings } from '@/lib/actions/settings.actions';
import logoApp from '../assets/img/logoApp.png';

export default function Home() {
  const router = useRouter();
  const [unauthView, setUnauthView] = useState<'login' | 'public_enrollment'>('public_enrollment');
  const [publicEnrollmentSuccess, setPublicEnrollmentSuccess] = useState<boolean>(false);
  const [registeredStudentInfo, setRegisteredStudentInfo] = useState<{ student: Student; guardian: Guardian } | null>(null);

  const [dbUsers, setDbUsers] = useState<User[]>([]);
  const [dbStudents, setDbStudents] = useState<Student[]>([]);
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          router.push('/dashboard');
        } else {
          // Load public data
          Promise.all([getUsers(), getStudents(), getSettings()]).then(([users, students, settings]) => {
            setDbUsers(users);
            setDbStudents(students);
            setEnrollmentOpen(settings?.enrollment_open ?? false);
            setLoading(false);
          });
        }
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleLoginSuccess = (user: User) => {
    router.push('/dashboard');
  };

  const handleEnrollmentSuccess = (student: Student, guardian: Guardian) => {
    setRegisteredStudentInfo({ student, guardian });
    setPublicEnrollmentSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mock addLog for LoginForm compatibility
  const addLog = (action: string, status: 'SUCCESS' | 'DENIED' | 'INFO', msg: string) => {
    console.log(`[${status}] ${action}: ${msg}`);
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Cargando sistema...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* PUBLIC UNAUTHENTICATED SHELL */}
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

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setUnauthView('public_enrollment')}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                  ${unauthView === 'public_enrollment' ? 'bg-white text-[#fc7609] shadow-xl scale-105' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'}`}
              >
                <GraduationCap className="w-5 h-5" />
                Inscripción Estudiantes
              </button>

              <button
                onClick={() => setUnauthView('login')}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                  ${unauthView === 'login' ? 'bg-white text-[#fc7609] shadow-xl scale-105' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'}`}
              >
                Acceso al Portal
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-slate-50 to-slate-50 -z-10"></div>

          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {unauthView === 'login' && (
                <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <LoginForm onLoginSuccess={handleLoginSuccess} addLog={addLog} dbUsers={dbUsers} />
                </motion.div>
              )}

              {unauthView === 'public_enrollment' && (
                <motion.div key="enrollment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  {publicEnrollmentSuccess ? (
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h2 className="text-2xl font-extrabold text-slate-800 font-display mb-2">¡Inscripción Exitosa!</h2>
                      <p className="text-slate-500 mb-6">Hemos registrado los datos de manera relacional en el sistema.</p>
                      {registeredStudentInfo && (
                        <div className="bg-slate-50 p-6 rounded-2xl text-left border border-slate-100 mb-8 inline-block w-full max-w-md mx-auto">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Detalles del Registro</p>
                          <div className="space-y-2 text-sm font-medium">
                            <p className="text-slate-700 flex justify-between">
                              <span className="text-slate-500">Estudiante:</span>
                              <span>{registeredStudentInfo.student.nombres} {registeredStudentInfo.student.apellidos}</span>
                            </p>
                            <p className="text-slate-700 flex justify-between">
                              <span className="text-slate-500">Documento:</span>
                              <span className="font-mono">{registeredStudentInfo.student.documento_identidad}</span>
                            </p>
                            <p className="text-slate-700 flex justify-between">
                              <span className="text-slate-500">Acudiente:</span>
                              <span>{registeredStudentInfo.guardian.nombre_completo}</span>
                            </p>
                          </div>
                        </div>
                      )}
                      <button onClick={() => { setPublicEnrollmentSuccess(false); setUnauthView('login'); }} className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors shadow-lg">
                        Ir al Inicio de Sesión
                      </button>
                    </div>
                  ) : enrollmentOpen ? (
                    <EnrollmentForm onSuccess={handleEnrollmentSuccess} dbStudents={dbStudents} />
                  ) : (
                    <div className="bg-white rounded-3xl p-10 text-center shadow-xl border border-slate-100 max-w-md mx-auto">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <GraduationCap className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-800 font-display mb-2">Inscripciones Cerradas</h3>
                      <p className="text-slate-500 text-sm">El proceso de matrícula pública no está disponible en este momento. Por favor contacte a la administración del Taller Creativo De Inglés.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
