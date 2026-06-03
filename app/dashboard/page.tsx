"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Users, DollarSign, Calendar } from 'lucide-react';
import { getStudents } from '@/lib/actions/student.actions';
import { getCourses } from '@/lib/actions/course.actions';
import { getPayments } from '@/lib/actions/payment.actions';
import { User, Course } from '@/lib/db-schema';

export default function DashboardHome() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ students: 0, courses: 0, payments: 0 });
  const [teacherCourses, setTeacherCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(res => res.json()),
      getStudents(), 
      getCourses(), 
      getPayments()
    ]).then(([authData, students, courses, payments]) => {
      if (authData.success && authData.user) {
        setCurrentUser(authData.user);
        if (authData.user.role === 'TEACHER') {
          setTeacherCourses(courses.filter(c => c.teacher_id === authData.user.id));
        }
      }
      setStats({
        students: students.length,
        courses: courses.length,
        payments: payments.reduce((acc, p) => acc + p.amount, 0),
      });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-10 font-bold text-slate-500 text-center">Cargando inicio...</div>;

  const isTeacher = currentUser?.role === 'TEACHER';

  // Compute teacher schedule for today
  const todayName = new Date().toLocaleDateString('es-CO', { weekday: 'long' });
  const todayCapitalized = todayName.charAt(0).toUpperCase() + todayName.slice(1);
  let todayClasses: Array<{courseName: string, start: string, end: string}> = [];
  
  if (isTeacher) {
    teacherCourses.forEach(c => {
      c.schedule?.forEach(s => {
        // Simple day matching
        if (s.day.toLowerCase() === todayCapitalized.toLowerCase() || 
            (s.day === 'Miercoles' && todayCapitalized === 'Miércoles') ||
            (s.day === 'Miércoles' && todayCapitalized === 'Miercoles') ||
            (s.day === 'Sabado' && todayCapitalized === 'Sábado') ||
            (s.day === 'Sábado' && todayCapitalized === 'Sabado')) {
          todayClasses.push({ courseName: c.nombre_curso, start: s.start_time, end: s.end_time });
        }
      });
    });
    // Sort by start time
    todayClasses.sort((a, b) => a.start.localeCompare(b.start));
  }

  if (loading) return <div className="p-10 font-bold text-slate-500 text-center">Cargando inicio...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#fc7609] to-orange-400 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold font-display mb-2">¡Bienvenido, {currentUser?.nombres}!</h2>
          <p className="text-orange-50 font-medium">
            {isTeacher ? "Aquí tienes un resumen de tus clases." : "Seleccione una opción en el menú lateral para gestionar la academia."}
          </p>
        </div>
      </div>

      {!isTeacher ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Estudiantes Totales</p>
              <p className="text-2xl font-extrabold text-slate-800 font-display">{stats.students}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Cursos Activos</p>
              <p className="text-2xl font-extrabold text-slate-800 font-display">{stats.courses}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Pagos Registrados</p>
              <p className="text-2xl font-extrabold text-slate-800 font-display">
                ${stats.payments.toLocaleString('es-CO')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6">
          <h3 className="font-extrabold text-lg text-slate-800 font-display mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#fc7609]" /> Clases de Hoy ({todayCapitalized})
          </h3>
          
          {todayClasses.length > 0 ? (
            <div className="space-y-4">
              {todayClasses.map((cls, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 text-orange-600 font-bold px-4 py-2 rounded-xl text-sm">
                      {cls.start} - {cls.end}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{cls.courseName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No tienes clases programadas para hoy.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
