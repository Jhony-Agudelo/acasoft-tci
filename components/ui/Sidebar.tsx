"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BookOpen, GraduationCap, Users, DollarSign, Settings, HomeIcon, X, LogOut, BookOpenCheck, NotebookPen, School, ShieldCheck } from 'lucide-react';
import { UserRole, User } from '@/lib/db-schema';
import logoApp from '@/assets/img/logoApp.png';

interface SidebarProps {
  currentUser: User | null;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  dbStudentsCount?: number;
  dbCoursesCount?: number;
  handleLogout?: () => void;
}

export function Sidebar({
  currentUser,
  mobileMenuOpen = false,
  setMobileMenuOpen,
  dbStudentsCount = 0,
  dbCoursesCount = 0,
  handleLogout
}: SidebarProps) {
  const pathname = usePathname();

  const isTeacher = currentUser?.role === UserRole.TEACHER;
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  return (
    <aside className={`w-64 bg-white border-r border-slate-100 shrink-0 md:block ${mobileMenuOpen ? 'block fixed inset-y-0 left-0 z-50 shadow-xl' : 'hidden'}`} id="dashboard_sidebar_nav">
      <div className="p-4 relative flex justify-center items-center border-b border-slate-100 min-h-[80px]">
        <Image src={logoApp} alt="TCI Logo" width={50} height={50} className="object-contain" priority />
        {setMobileMenuOpen && (
          <button onClick={() => setMobileMenuOpen(false)} className="absolute right-4 text-slate-500 md:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="p-4 space-y-1.5 h-full flex flex-col justify-between" id="sidebar_links_navigation">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold font-display transition-all text-left
              ${pathname === '/dashboard' ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <HomeIcon className="h-4 w-4 shrink-0" />
            <span>Inicio</span>
          </Link>
          {isTeacher ? (
            <Link
              href="/dashboard/mis-grupos"
              className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold font-display transition-all text-left
                ${pathname.includes('/mis-grupos') ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              <span>Mis Grupos</span>
            </Link>
          ) : (
            <>
              <Link
                href="/dashboard/estudiantes"
                className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold font-display transition-all text-left
                  ${pathname.includes('/estudiantes') ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <GraduationCap className="h-4 w-4 shrink-0" />
                <span>Estudiantes (Core)</span>
              </Link>

              <Link
                href="/dashboard/acudientes"
                className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold font-display transition-all text-left
                  ${pathname.includes('/acudientes') ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Acudientes</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/dashboard/maestros"
                  className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold font-display transition-all text-left
                    ${pathname.includes('/maestros') ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Users className="h-4 w-4 shrink-0" />
                  <span>Maestros (Usuarios)</span>
                </Link>
              )}

              <Link
                href="/dashboard/mis-grupos"
                className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold font-display transition-all text-left
                  ${pathname.includes('/mis-grupos') ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>Mis Grupos</span>
              </Link>

              <Link
                href="/dashboard/cursos"
                className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold font-display transition-all text-left
                  ${pathname.includes('/cursos') ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <School className="h-4 w-4 shrink-0" />
                <span>Gestión de Cursos</span>
              </Link>

              <Link
                href="/dashboard/planeaciones"
                className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold font-display transition-all text-left
                  ${pathname.includes('/planeaciones') ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <BookOpen className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>Planeaciones</span>
              </Link>

              <Link
                href="/dashboard/seguimiento"
                className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold font-display transition-all text-left
                  ${pathname.includes('/seguimiento') ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <BookOpenCheck className="h-4 w-4 shrink-0 text-blue-500" />
                <span>Seguimiento</span>
              </Link>

              <Link
                href="/dashboard/asistencia"
                className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold font-display transition-all text-left
                  ${pathname.includes('/asistencia') ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <NotebookPen className="h-4 w-4 shrink-0" />
                <span>Reportes Asistencia</span>
              </Link>

              <Link
                href="/dashboard/pagos"
                className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold font-display transition-all text-left
                  ${pathname.includes('/pagos') ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <DollarSign className="h-4 w-4 shrink-0" />
                <span>Módulo Financiero</span>
              </Link>

              <Link
                href="/dashboard/configuracion"
                className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold font-display transition-all text-left
                  ${pathname.includes('/configuracion') ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Settings className="h-4 w-4 shrink-0" />
                <span>Configuración</span>
              </Link>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2 mt-auto" id="sidebar_status_metrix">
          <span className="text-[9px] font-mono font-bold text-slate-400 block tracking-widest uppercase">Estatus Base de Datos</span>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-slate-50 p-2 rounded-lg">
              <span className="text-slate-400 block">Estudiantes</span>
              <span className="font-bold text-slate-800">{dbStudentsCount}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg">
              <span className="text-slate-400 block">Cursos Activos</span>
              <span className="font-bold text-slate-800">{dbCoursesCount}</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
