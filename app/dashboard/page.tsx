"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Users, DollarSign, Calendar, Cake, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { getStudents } from '@/lib/actions/student.actions';
import { getCourses } from '@/lib/actions/course.actions';
import { getPayments } from '@/lib/actions/payment.actions';
import { User, Course, Student } from '@/lib/db-schema';

const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

const parseBirthday = (dateStr?: string | null) => {
  if (!dateStr) return null;
  const str = dateStr.trim();
  // Formato YYYY-MM-DD
  if (str.includes('-')) {
    const parts = str.split('-');
    if (parts.length === 3) {
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (!isNaN(month) && !isNaN(day)) return { month, day };
    }
  }
  // Formato DD/MM/YYYY o D/M/YYYY
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length >= 2) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      if (!isNaN(month) && !isNaN(day)) return { month, day };
    }
  }
  return null;
};

const format12h = (time24: string) => {
  if (!time24) return '';
  const [hour, min] = time24.split(':');
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${min} ${ampm}`;
};

export default function DashboardHome() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ students: 0, courses: 0, payments: 0 });
  const [teacherCourses, setTeacherCourses] = useState<Course[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBirthdayMonth, setSelectedBirthdayMonth] = useState<number>(() => new Date().getMonth() + 1);

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
          setTeacherCourses(courses.filter(c => 
            c.schedule?.some(s => 
              s.main_teacher_id === authData.user.id || 
              (s.support_teachers && s.support_teachers.includes(authData.user.id))
            )
          ));
        } else {
          // If Director/Admin, they could also be teachers in a schedule!
          setTeacherCourses(courses.filter(c => 
            c.schedule?.some(s => 
              s.main_teacher_id === authData.user.id || 
              (s.support_teachers && s.support_teachers.includes(authData.user.id))
            )
          ));
        }
      }
      setAllStudents(students);
      setAllCourses(courses);
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
  let todayClasses: Array<{courseId: string, courseName: string, start: string, end: string}> = [];
  
  // All users can have today classes if they are in the schedule
  teacherCourses.forEach(c => {
    c.schedule?.forEach(s => {
      // Check if this specific user is assigned to THIS specific block
      if (s.main_teacher_id === currentUser?.id || (s.support_teachers && currentUser && s.support_teachers.includes(currentUser.id))) {
        if (s.day.toLowerCase() === todayCapitalized.toLowerCase() || 
            (s.day === 'Miercoles' && todayCapitalized === 'Miércoles') ||
            (s.day === 'Miércoles' && todayCapitalized === 'Miercoles') ||
            (s.day === 'Sabado' && todayCapitalized === 'Sábado') ||
            (s.day === 'Sábado' && todayCapitalized === 'Sabado')) {
          todayClasses.push({ courseId: c.id, courseName: c.nombre_curso, start: s.start_time, end: s.end_time });
        }
      }
    });
  });
  // Sort by start time
  todayClasses.sort((a, b) => a.start.localeCompare(b.start));

  if (loading) return <div className="p-10 font-bold text-slate-500 text-center">Cargando inicio...</div>;

  let blockedStudentsList = [];
  if (isTeacher) {
    const todayCourseIds = todayClasses.map(c => c.courseId);
    const todayCourseNames = todayClasses.map(c => c.courseName);
    blockedStudentsList = allStudents.filter(s => s.status === 'BLOCKED' && (
      (s.course_id && todayCourseIds.includes(s.course_id)) ||
      (s.curso_actual && (todayCourseIds.includes(s.curso_actual) || todayCourseNames.includes(s.curso_actual)))
    ));
  } else {
    blockedStudentsList = allStudents.filter(s => s.status === 'BLOCKED');
  }

  // Cumpleaños
  const today = new Date();
  const currentRealMonth = today.getMonth() + 1;
  const currentRealDay = today.getDate();

  const birthdayStudents = allStudents
    .map(student => ({
      student,
      birthday: parseBirthday(student.fecha_nacimiento),
    }))
    .filter((item): item is { student: Student; birthday: { month: number; day: number } } => {
      if (item.student.status !== 'ACTIVE') return false;
      if (!item.birthday) return false;
      return item.birthday.month === selectedBirthdayMonth;
    })
    .sort((a, b) => a.birthday.day - b.birthday.day);

  const selectedMonthObj = MONTHS.find(m => m.value === selectedBirthdayMonth) || MONTHS[currentRealMonth - 1];

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

      {blockedStudentsList.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-rose-800 text-sm">⚠️ Alerta de Morosidad</h3>
            <p className="text-xs text-rose-600 mt-1">
              {isTeacher 
                ? `Tienes ${blockedStudentsList.length} estudiante(s) bloqueado(s) por mora en tus clases de hoy. No podrás tomarles asistencia.`
                : `Hay ${blockedStudentsList.length} estudiante(s) bloqueado(s) por mora en toda la academia.`}
            </p>
            {isTeacher && (
              <div className="mt-3 flex flex-wrap gap-2">
                {blockedStudentsList.map(s => (
                  <span key={s.id} className="bg-white/50 border border-rose-200 text-rose-700 px-2.5 py-1 rounded-md text-[10px] font-bold">
                    {s.nombres} {s.apellidos}
                  </span>
                ))}
              </div>
            )}
          </div>
          {!isTeacher && (
            <a href="/dashboard/estudiantes" className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              Ver Estudiantes
            </a>
          )}
        </div>
      )}

      {!isTeacher && (
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
      )}

      {(!isTeacher || todayClasses.length > 0) && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 mt-6">
          <h3 className="font-extrabold text-lg text-slate-800 font-display mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#fc7609]" /> Tus Clases de Hoy ({todayCapitalized})
          </h3>
          
          {todayClasses.length > 0 ? (
            <div className="space-y-4">
              {todayClasses.map((cls, idx) => (
                <a 
                  key={idx} 
                  href={isTeacher ? `/dashboard/mis-grupos?search=${encodeURIComponent(cls.courseName)}` : `/dashboard/cursos?search=${encodeURIComponent(cls.courseName)}`}
                  className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-[#fc7609]/30 hover:shadow-md transition-all group block cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 text-orange-600 font-bold px-4 py-2 rounded-xl text-sm group-hover:bg-[#fc7609] group-hover:text-white transition-colors">
                      {format12h(cls.start)} - {format12h(cls.end)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-[#fc7609] transition-colors">{cls.courseName}</p>
                      <p className="text-xs font-medium text-slate-400 group-hover:text-slate-500 transition-colors mt-0.5">Clic para ver detalles</p>
                    </div>
                  </div>
                </a>
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

      {/* BIRTHDAYS SECTION */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#fc7609] flex items-center justify-center shrink-0">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-lg text-slate-800 font-display flex items-center gap-2">
                  🎉 Cumpleañeros de {selectedMonthObj.label}
                </h3>
                {selectedBirthdayMonth === currentRealMonth ? (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#fc7609]">
                    Mes actual
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedBirthdayMonth(currentRealMonth)}
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-[#fc7609] transition-colors cursor-pointer"
                    title="Volver al mes actual"
                  >
                    ← Ir a mes actual
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {birthdayStudents.length === 1 
                  ? '1 cumpleañero registrado' 
                  : `${birthdayStudents.length} cumpleañeros registrados`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {/* Mes anterior */}
            <button
              type="button"
              onClick={() => setSelectedBirthdayMonth(prev => (prev === 1 ? 12 : prev - 1))}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Mes anterior"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Selector de Mes */}
            <div className="relative">
              <select
                value={selectedBirthdayMonth}
                onChange={(e) => setSelectedBirthdayMonth(Number(e.target.value))}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold py-2 pl-3.5 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609]/20 focus:border-[#fc7609] transition-all cursor-pointer hover:bg-slate-100"
              >
                {MONTHS.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.label} {m.value === currentRealMonth ? '(Actual)' : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            {/* Mes siguiente */}
            <button
              type="button"
              onClick={() => setSelectedBirthdayMonth(prev => (prev === 12 ? 1 : prev + 1))}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Mes siguiente"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {birthdayStudents.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-[#fc7609]">
              <Cake className="h-6 w-6" />
            </div>
            <p className="text-slate-600 font-bold text-sm">
              No hay cumpleañeros registrados en {selectedMonthObj.label}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              No se encontraron estudiantes activos con fecha de nacimiento en este mes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {birthdayStudents.map(({ student, birthday }) => {
              const dayStr = String(birthday.day).padStart(2, '0');
              const isToday = selectedBirthdayMonth === currentRealMonth && birthday.day === currentRealDay;
              
              let courseName = student.curso_actual;
              if (student.course_id) {
                const course = allCourses.find(c => c.id === student.course_id);
                if (course) courseName = course.nombre_curso;
              } else {
                const courseById = allCourses.find(c => c.id === student.curso_actual);
                if (courseById) courseName = courseById.nombre_curso;
              }

              return (
                <div 
                  key={student.id} 
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isToday 
                      ? 'bg-orange-50 border-orange-200 shadow-sm shadow-orange-100/50' 
                      : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      isToday 
                        ? 'bg-[#fc7609] text-white shadow-md shadow-orange-500/30' 
                        : 'bg-white text-slate-500 shadow-sm'
                    }`}>
                      {dayStr}
                    </div>
                    <div className="min-w-0">
                      <p 
                        className={`font-bold text-sm truncate ${isToday ? 'text-orange-900' : 'text-slate-800'}`}
                        title={`${student.nombres} ${student.apellidos}`}
                      >
                        {(student.nombres || '').split(' ')[0]} {(student.apellidos || '').split(' ')[0]}
                      </p>
                      <p className={`text-xs font-medium truncate ${isToday ? 'text-[#fc7609]' : 'text-slate-400'}`}>
                        {isToday ? '¡Hoy es su cumpleaños!' : `Día ${dayStr}`} • {courseName || 'Sin curso'}
                      </p>
                    </div>
                  </div>
                  {isToday && <span className="text-2xl animate-bounce shrink-0 ml-2">🎈</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
