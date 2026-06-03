"use client";

import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit, GraduationCap, X, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { Student, Guardian, Course, User, StudentStatus, SchoolDayPeriod, COLEGIOS_LA_VIRGINIA } from '@/lib/db-schema';
import { getStudents, saveStudent } from '@/lib/actions/student.actions';
import { getGuardians, saveGuardian } from '@/lib/actions/guardian.actions';
import { getCourses } from '@/lib/actions/course.actions';
import { toast } from 'sonner';
import { ViewStudentModal, EditStudentModal } from '@/components/students/StudentModals';
import { EnrollmentForm } from '@/components/public/EnrollmentForm';

export default function EstudiantesPage() {
  const [dbStudents, setDbStudents] = useState<Student[]>([]);
  const [dbGuardians, setDbGuardians] = useState<Guardian[]>([]);
  const [dbCourses, setDbCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilterStatus, setStudentFilterStatus] = useState<string>('TODOS');

  // Modals
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newStudentForm, setNewStudentForm] = useState({
    documento_identidad: '', nombres: '', apellidos: '', fecha_nacimiento: '',
    edad: 8, colegio_origen: COLEGIOS_LA_VIRGINIA[0], grado_escolar: 'Primero',
    curso_actual: 'Kids Starter (Nivel A1.1)', jornada_escolar: SchoolDayPeriod.TARDE,
    course_id: '', status: StudentStatus.REGISTERED, payment_deadline_date: '2026-06-30',
    guardian_nombre_completo: '', guardian_direccion: '', guardian_telefono: '', guardian_parentesco: 'Madre',
  });

  useEffect(() => {
    Promise.all([getStudents(), getGuardians(), getCourses()]).then(([students, guardians, courses]) => {
      setDbStudents(students);
      setDbGuardians(guardians);
      setDbCourses(courses);
      setLoading(false);
    });
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.documento_identidad || !newStudentForm.nombres || !newStudentForm.apellidos) {
      toast.error('Por favor complete los datos obligatorios del estudiante.');
      return;
    }

    const duplicate = dbStudents.find((s) => s.documento_identidad === newStudentForm.documento_identidad);
    if (duplicate) {
      toast.error('Ya existe un estudiante con este Documento de Identidad.');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newStudentForm, clientStudents: dbStudents }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Error al crear estudiante.');
        return;
      }

      setDbStudents([...dbStudents, data.student]);
      setDbGuardians([...dbGuardians, data.guardian]);
      setShowAddStudentModal(false);
      toast.success('¡Estudiante y Acudiente registrados en el sistema!');
      
      // Reset
      setNewStudentForm({
        documento_identidad: '', nombres: '', apellidos: '', fecha_nacimiento: '',
        edad: 8, colegio_origen: COLEGIOS_LA_VIRGINIA[0], grado_escolar: 'Primero',
        curso_actual: 'Kids Starter (Nivel A1.1)', jornada_escolar: SchoolDayPeriod.TARDE,
        course_id: '', status: StudentStatus.REGISTERED, payment_deadline_date: '2026-06-30',
        guardian_nombre_completo: '', guardian_direccion: '', guardian_telefono: '', guardian_parentesco: 'Madre',
      });
    } catch {
      toast.error('Error de conexión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student, updatedGuardian?: Guardian) => {
    try {
      await saveStudent(updatedStudent);
      setDbStudents(dbStudents.map(s => s.id === updatedStudent.id ? updatedStudent : s));
      
      if (updatedGuardian) {
        await saveGuardian(updatedGuardian);
        setDbGuardians(dbGuardians.map(g => g.id === updatedGuardian.id ? updatedGuardian : g));
      }
      // Toast success is handled inside the modal
    } catch (error) {
      throw error; // Let the modal catch it
    }
  };

  const filteredStudents = dbStudents.filter((student) => {
    const matchesSearch = student.nombres.toLowerCase().includes(studentSearch.toLowerCase()) || student.apellidos.toLowerCase().includes(studentSearch.toLowerCase()) || student.documento_identidad.includes(studentSearch);
    const matchesStatus = studentFilterStatus === 'TODOS' || student.status === studentFilterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Cargando datos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 font-display">Estudiantes (Core)</h2>
          <p className="text-slate-500 text-sm mt-1">Gestión del padrón estudiantil e histórico relacional.</p>
        </div>
        <button
          onClick={() => setShowAddStudentModal(true)}
          className="bg-gradient-to-r from-[#fc7609] to-orange-500 hover:to-orange-400 text-white px-4 py-2.5 rounded-xl font-bold font-display shadow-lg shadow-orange-500/20 flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Matricular Estudiante</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por documento, nombre o apellido..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#fc7609]/20 focus:border-[#fc7609] focus:outline-none text-sm font-medium text-slate-700"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase">Estatus:</span>
          <select
            value={studentFilterStatus}
            onChange={(e) => setStudentFilterStatus(e.target.value)}
            className="p-2 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-700 font-medium focus:outline-none flex-1 md:w-48"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value={StudentStatus.REGISTERED}>Inscrito (Pre-Matriculado)</option>
            <option value={StudentStatus.IN_INTERVIEW}>En Entrevista</option>
            <option value={StudentStatus.ACTIVE}>Activo (Cursando)</option>
            <option value={StudentStatus.BLOCKED}>Bloqueado (Mora/Baja)</option>
          </select>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Documento</th>
                <th className="px-6 py-4">Estudiante</th>
                <th className="px-6 py-4">Acudiente</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic font-medium">
                    No se encontraron estudiantes registrados en la Base de Datos.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const guardian = dbGuardians.find(g => g.id === student.guardian_id);
                  return (
                    <tr key={student.id} className="hover:bg-orange-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-600 text-xs">
                        {student.documento_identidad}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{student.nombres} {student.apellidos}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{student.curso_actual}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-700 font-medium text-xs">{guardian?.nombre_completo || 'N/A'}</div>
                        <div className="text-[10px] text-slate-500">{guardian?.telefono || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                          ${student.status === StudentStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' :
                            student.status === StudentStatus.REGISTERED ? 'bg-blue-100 text-blue-700' :
                              student.status === StudentStatus.IN_INTERVIEW ? 'bg-amber-100 text-amber-700' :
                                'bg-rose-100 text-rose-700'}`}>
                          {student.status === StudentStatus.REGISTERED ? 'INSCRITO' :
                            student.status === StudentStatus.IN_INTERVIEW ? 'ENTREVISTA' :
                              student.status === StudentStatus.ACTIVE ? 'ACTIVO' : 'BLOQUEADO'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => setViewStudent(student)}
                          className="text-slate-400 hover:text-slate-600 p-2 rounded-lg transition-colors font-semibold text-xs inline-flex items-center"
                        >
                          Ver
                        </button>
                        <button 
                          onClick={() => setEditStudent(student)}
                          className="text-[#fc7609] hover:bg-orange-100 p-2 rounded-lg transition-colors font-semibold text-xs inline-flex items-center gap-1"
                        >
                          Editar <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewStudent && (
        <ViewStudentModal 
          student={viewStudent} 
          guardian={dbGuardians.find(g => g.id === viewStudent.guardian_id)}
          course={dbCourses.find(c => c.id === viewStudent.course_id)}
          onClose={() => setViewStudent(null)} 
        />
      )}

      {editStudent && (
        <EditStudentModal 
          student={editStudent} 
          guardian={dbGuardians.find(g => g.id === editStudent.guardian_id)}
          onClose={() => setEditStudent(null)} 
          onSave={handleUpdateStudent}
        />
      )}

      {showAddStudentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl my-8 flex flex-col max-h-[90vh]">
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center shrink-0 rounded-t-3xl">
              <h3 className="font-extrabold text-xl text-slate-800 font-display flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-[#fc7609]" />
                Matricular Nuevo Estudiante
              </h3>
              <button onClick={() => setShowAddStudentModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <EnrollmentForm  
                dbStudents={dbStudents} 
                onSuccess={(s, g) => {
                  setDbStudents([...dbStudents, s]);
                  setDbGuardians([...dbGuardians, g]);
                  setShowAddStudentModal(false);
                  toast.success('¡Estudiante y Acudiente registrados en el sistema!');
                }} 
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
