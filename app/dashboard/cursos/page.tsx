"use client";

import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, BookOpen, Clock, Users, ArrowRight, X } from 'lucide-react';
import { Course, User, UserRole, UserStatus, Student, Attendance, AttendanceStatus } from '@/lib/db-schema';
import { getCourses, saveCourse } from '@/lib/actions/course.actions';
import { getUsers } from '@/lib/actions/user.actions';
import { getStudents, saveStudent } from '@/lib/actions/student.actions';
import { saveAttendances } from '@/lib/actions/attendance.actions';
import { toast } from 'sonner';
import { EditCourseModal } from '@/components/courses/CourseModals';

export default function CursosPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dbCourses, setDbCourses] = useState<Course[]>([]);
  const [dbUsers, setDbUsers] = useState<User[]>([]);
  const [dbStudents, setDbStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseSearch, setCourseSearch] = useState('');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newCourseForm, setNewCourseForm] = useState({
    nombre_curso: '',
    teacher_id: '',
  });
  const [newCourseSchedule, setNewCourseSchedule] = useState<Array<{ day: string; start_time: string; end_time: string }>>([
    { day: 'Lunes', start_time: '14:00', end_time: '16:00' }
  ]);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(res => res.json()),
      getCourses(), 
      getUsers(), 
      getStudents()
    ]).then(([authData, courses, users, students]) => {
      if (authData.success && authData.user) {
        setCurrentUser(authData.user);
        if (authData.user.role === 'TEACHER') {
          setDbCourses(courses.filter(c => c.teacher_id === authData.user.id));
        } else {
          setDbCourses(courses);
        }
      } else {
        setDbCourses(courses);
      }
      setDbUsers(users);
      setDbStudents(students);
      setLoading(false);
    });
  }, []);

  const isTeacher = currentUser?.role === 'TEACHER';

  const handleRegisterCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseForm.nombre_curso) {
      toast.error('Debe ingresar un nombre para el curso.');
      return;
    }

    let resolvedTeacherId = newCourseForm.teacher_id;
    if (!resolvedTeacherId) {
      const activeTeacher = dbUsers.find((u) => u.role === UserRole.TEACHER && u.status === UserStatus.ACTIVE);
      if (!activeTeacher) {
        toast.error('Error Crítico: No hay maestros activos en el sistema.');
        return;
      }
      resolvedTeacherId = activeTeacher.id;
    }

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCourseForm,
          teacher_id: resolvedTeacherId,
          schedule: newCourseSchedule,
          clientCourses: dbCourses,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Error al crear curso.');
        return;
      }

      setDbCourses([...dbCourses, data.course]);
      setShowAddCourseModal(false);
      setNewCourseForm({ nombre_curso: '', teacher_id: '' });
      setNewCourseSchedule([{ day: 'Lunes', start_time: '14:00', end_time: '16:00' }]);
      toast.success(`¡Curso registrado de manera exitosa!`);
    } catch {
      toast.error('Error al enviar la solicitud de creación de curso.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCourse = async (updatedCourse: Course) => {
    try {
      await saveCourse(updatedCourse);
      setDbCourses(dbCourses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      await saveStudent(updatedStudent);
      setDbStudents(dbStudents.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveAttendance = async (courseId: string, attendanceData: Record<string, string>) => {
    const today = new Date().toISOString().split('T')[0];
    
    const attendances: Attendance[] = Object.keys(attendanceData).map(studentId => ({
      id: `att_${studentId}_${courseId}_${today}`,
      student_id: studentId,
      course_id: courseId,
      date: today,
      status: attendanceData[studentId] as AttendanceStatus
    }));

    await saveAttendances(attendances);
  };

  const filteredCourses = dbCourses.filter((c) =>
    c.nombre_curso.toLowerCase().includes(courseSearch.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Cargando cursos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 font-display">{isTeacher ? 'Mis Grupos' : 'Gestión de Cursos'}</h2>
          <p className="text-slate-500 text-sm mt-1">{isTeacher ? 'Visualiza y toma asistencia de tus estudiantes.' : 'Administre los grupos, horarios y maestros asignados.'}</p>
        </div>
        {!isTeacher && (
          <button 
            onClick={() => setShowAddCourseModal(true)}
            className="bg-[#fc7609] hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="h-5 w-5" />
            Registrar Nuevo Curso
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar curso por nombre..."
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#fc7609]/20 focus:border-[#fc7609] focus:outline-none text-sm font-medium text-slate-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full bg-white p-10 text-center rounded-3xl border border-slate-100 shadow-sm text-slate-400 font-medium">
            No se encontraron cursos que coincidan con la búsqueda.
          </div>
        ) : (
          filteredCourses.map((course) => {
            const teacher = dbUsers.find((u) => u.id === course.teacher_id);
            return (
              <div key={course.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#fc7609] flex items-center justify-center shrink-0">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                      ${course.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {course.status === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 font-display mb-1 group-hover:text-[#fc7609] transition-colors line-clamp-2">
                    {course.nombre_curso}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-2">
                    <Users className="h-3.5 w-3.5" />
                    <span>Maestro: {teacher ? `${teacher.nombres} ${teacher.apellidos}` : 'No asignado'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-4">
                    <Users className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Estudiantes Inscritos: <strong className="text-slate-800">{dbStudents.filter(s => s.curso_actual === course.id || s.curso_actual === course.nombre_curso).length}</strong></span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Horarios
                    </h4>
                    {course.schedule && course.schedule.length > 0 ? (
                      <div className="space-y-1">
                        {course.schedule.map((s, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="font-bold text-slate-600">{s.day}</span>
                            <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">{s.start_time} - {s.end_time}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No hay horarios registrados</p>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 border-t border-slate-100 p-3 flex gap-2">
                  {isTeacher ? (
                    <button onClick={() => setEditCourse(course)} className="flex-1 bg-white hover:bg-orange-50 border border-slate-200 text-slate-700 hover:text-[#fc7609] py-2 rounded-lg text-xs font-bold transition-colors flex justify-center items-center gap-1.5">
                      Ver y Tomar Asistencia <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <>
                      <button onClick={() => setEditCourse(course)} className="flex-1 bg-white hover:bg-orange-50 border border-slate-200 text-slate-700 hover:text-[#fc7609] py-2 rounded-lg text-xs font-bold transition-colors flex justify-center items-center gap-1.5">
                        Gestionar <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {editCourse && (
        <EditCourseModal 
          course={editCourse} 
          teachers={dbUsers.filter(u => u.role === UserRole.TEACHER)} 
          students={dbStudents}
          currentUser={currentUser}
          onClose={() => setEditCourse(null)} 
          onSave={handleUpdateCourse} 
          onSaveStudent={handleUpdateStudent}
          onSaveAttendance={handleSaveAttendance}
        />
      )}

      {showAddCourseModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
              <h3 className="font-extrabold text-xl text-slate-800 font-display flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-[#fc7609]" /> Registrar Nuevo Curso
              </h3>
              <button onClick={() => setShowAddCourseModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleRegisterCourse} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Curso *</label>
                  <input type="text" required value={newCourseForm.nombre_curso} onChange={e => setNewCourseForm({...newCourseForm, nombre_curso: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Maestro Asignado</label>
                  <select value={newCourseForm.teacher_id} onChange={e => setNewCourseForm({...newCourseForm, teacher_id: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50">
                    <option value="">Selección Automática / Ninguno</option>
                    {dbUsers.filter(u => u.role === UserRole.TEACHER).map(t => (
                      <option key={t.id} value={t.id}>{t.nombres} {t.apellidos}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddCourseModal(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-[#fc7609] text-white font-bold rounded-xl shadow-lg disabled:opacity-50">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
