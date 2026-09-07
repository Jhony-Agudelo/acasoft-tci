"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Users, 
  BookOpen, 
  PlusCircle, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  CheckCheck,
  Filter
} from 'lucide-react';
import { Attendance, Student, Course, AttendanceStatus } from '@/lib/db-schema';
import { getAttendances, saveAttendances } from '@/lib/actions/attendance.actions';
import { getStudents } from '@/lib/actions/student.actions';
import { getCourses } from '@/lib/actions/course.actions';
import { toast } from 'sonner';

export default function AsistenciaPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterCourse, setFilterCourse] = useState('TODOS');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Modal para Registrar Asistencia
  const [showTakeAttendanceModal, setShowTakeAttendanceModal] = useState(false);
  const [modalCourseId, setModalCourseId] = useState('');
  const [modalDate, setModalDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [modalAttendanceMap, setModalAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [isSavingModal, setIsSavingModal] = useState(false);

  useEffect(() => {
    Promise.all([
      getAttendances(),
      getStudents(),
      getCourses()
    ]).then(([attData, stuData, couData]) => {
      setAttendances(attData);
      setStudents(stuData);
      setCourses(couData);
      if (couData.length > 0) {
        setModalCourseId(couData[0].id);
      }
      setLoading(false);
    });
  }, []);

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterDate, filterCourse, itemsPerPage]);

  // When modal opens or course/date changes, initialize attendance map for that group
  useEffect(() => {
    if (!modalCourseId) return;
    const selectedCourse = courses.find(c => c.id === modalCourseId);
    const courseStudents = students.filter(s => 
      s.course_id === modalCourseId || 
      s.curso_actual === modalCourseId || 
      s.curso_actual === selectedCourse?.nombre_curso
    );

    const initialMap: Record<string, AttendanceStatus> = {};
    courseStudents.forEach(s => {
      const existing = attendances.find(a => a.student_id === s.id && a.date === modalDate && a.course_id === modalCourseId);
      initialMap[s.id] = (existing?.status as AttendanceStatus) || AttendanceStatus.PRESENT;
    });
    setModalAttendanceMap(initialMap);
  }, [modalCourseId, modalDate, showTakeAttendanceModal, courses, students, attendances]);

  if (loading) {
    return <div className="p-10 font-bold text-slate-500 text-center">Cargando módulo de asistencia...</div>;
  }

  // Enriquecer registros de asistencia
  const enrichedData = attendances.map(att => {
    const student = students.find(s => s.id === att.student_id);
    const course = courses.find(c => c.id === att.course_id);
    return {
      ...att,
      studentName: student ? `${student.nombres} ${student.apellidos}` : 'Estudiante Desconocido',
      documento: student?.documento_identidad || 'N/A',
      courseName: course?.nombre_curso || 'Curso Desconocido'
    };
  });

  // Filtrar
  const filteredData = enrichedData.filter(item => {
    const matchSearch = item.studentName.toLowerCase().includes(search.toLowerCase()) || item.documento.includes(search);
    const matchDate = filterDate ? item.date === filterDate : true;
    const matchCourse = filterCourse === 'TODOS' ? true : item.course_id === filterCourse;
    return matchSearch && matchDate && matchCourse;
  });

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Presente</span>;
      case 'ABSENT':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-700"><XCircle className="h-3.5 w-3.5" /> Ausente</span>;
      case 'EXCUSED':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-700"><AlertCircle className="h-3.5 w-3.5" /> Excusado</span>;
      default:
        return <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  // Guardar asistencia desde modal
  const handleSaveModalAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalCourseId) {
      toast.error('Debe seleccionar un grupo o curso.');
      return;
    }

    const selectedCourse = courses.find(c => c.id === modalCourseId);
    const courseStudents = students.filter(s => 
      s.course_id === modalCourseId || 
      s.curso_actual === modalCourseId || 
      s.curso_actual === selectedCourse?.nombre_curso
    );

    if (courseStudents.length === 0) {
      toast.error('No hay estudiantes inscritos en el grupo seleccionado.');
      return;
    }

    setIsSavingModal(true);
    try {
      const recordsToSave: Attendance[] = courseStudents.map(s => {
        const existing = attendances.find(a => a.student_id === s.id && a.date === modalDate && a.course_id === modalCourseId);
        return {
          id: existing?.id || `att_${s.id}_${modalDate}_${modalCourseId}`,
          student_id: s.id,
          course_id: modalCourseId,
          date: modalDate,
          status: modalAttendanceMap[s.id] || AttendanceStatus.PRESENT,
        };
      });

      const success = await saveAttendances(recordsToSave);
      if (success) {
        setAttendances(prev => {
          const updatedMap = new Map(prev.map(a => [a.id, a]));
          recordsToSave.forEach(a => updatedMap.set(a.id, a));
          return Array.from(updatedMap.values()).sort((a, b) => b.date.localeCompare(a.date));
        });
        toast.success(`Asistencia guardada exitosamente (${recordsToSave.length} estudiantes).`);
        setShowTakeAttendanceModal(false);
      } else {
        toast.error('Ocurrió un error al guardar la asistencia.');
      }
    } catch (error: any) {
      toast.error('Error al guardar asistencia: ' + (error?.message || String(error)));
    } finally {
      setIsSavingModal(false);
    }
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const selectedCourse = courses.find(c => c.id === modalCourseId);
    const courseStudents = students.filter(s => 
      s.course_id === modalCourseId || 
      s.curso_actual === modalCourseId || 
      s.curso_actual === selectedCourse?.nombre_curso
    );
    const newMap = { ...modalAttendanceMap };
    courseStudents.forEach(s => {
      newMap[s.id] = status;
    });
    setModalAttendanceMap(newMap);
  };

  const selectedCourseInModal = courses.find(c => c.id === modalCourseId);
  const studentsInModalCourse = students.filter(s => 
    s.course_id === modalCourseId || 
    s.curso_actual === modalCourseId || 
    s.curso_actual === selectedCourseInModal?.nombre_curso
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 font-display">Registro y Reportes de Asistencia</h2>
          <p className="text-slate-500 text-sm mt-1">Consulta y gestiona el historial de asistencia por estudiante y grupo.</p>
        </div>
        <button
          onClick={() => setShowTakeAttendanceModal(true)}
          className="bg-gradient-to-r from-[#fc7609] to-orange-500 hover:to-orange-400 text-white px-4 py-2.5 rounded-xl font-bold font-display shadow-lg shadow-orange-500/20 flex items-center gap-2 self-start md:self-auto transition-all"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Registrar Asistencia</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        {/* Search by student */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#fc7609]/20 focus:border-[#fc7609] outline-none transition-all"
          />
        </div>

        {/* Filter by Group / Course */}
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#fc7609] shrink-0 hidden sm:block" />
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="w-full sm:w-56 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#fc7609]/20 focus:border-[#fc7609]"
          >
            <option value="TODOS">Todos los Grupos</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.nombre_curso}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Date */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full sm:w-44 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#fc7609]/20 focus:border-[#fc7609] outline-none transition-all text-slate-700"
            />
          </div>

          {(search || filterDate || filterCourse !== 'TODOS') && (
            <button 
              onClick={() => {
                setSearch('');
                setFilterDate('');
                setFilterCourse('TODOS');
              }}
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
              title="Restablecer todos los filtros"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Table Card with Scroll and Pagination */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-600 text-sm">Historial de Asistencias</h3>
          <span className="bg-orange-100 text-[#fc7609] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Total: {filteredData.length} {filteredData.length === 1 ? 'Registro' : 'Registros'}
          </span>
        </div>

        {/* Scrollable table container */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto relative">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px] sticky top-0 z-10 shadow-2xs">
              <tr>
                <th className="p-4 pl-6 bg-slate-50">Fecha</th>
                <th className="p-4 bg-slate-50">Estudiante</th>
                <th className="p-4 bg-slate-50">Documento</th>
                <th className="p-4 bg-slate-50">Curso / Grupo</th>
                <th className="p-4 bg-slate-50">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 px-4 text-slate-400 font-medium">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-600">No se encontraron registros de asistencia.</p>
                    <p className="text-xs text-slate-400 mt-1">Prueba cambiando los filtros o registra una nueva asistencia.</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-orange-50/50 transition-colors">
                    <td className="p-4 pl-6 font-mono text-slate-600 font-medium text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {item.date}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      {item.studentName}
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-xs">
                      {item.documento}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <BookOpen className="h-3.5 w-3.5 text-[#fc7609]" />
                        {item.courseName}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(item.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginador */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Mostrando <span className="font-bold text-slate-800">{filteredData.length > 0 ? startIndex + 1 : 0}</span> a <span className="font-bold text-slate-800">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> de <span className="font-bold text-slate-800">{filteredData.length}</span> registros
            </span>
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-slate-400 text-[11px]">Por página:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:border-[#fc7609]"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Primera página"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-bold"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>

            <div className="flex items-center px-2 font-bold text-slate-700">
              <span>Página {currentPage} de {totalPages}</span>
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-bold"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Última página"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal para Registrar Asistencia */}
      {showTakeAttendanceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-xl text-slate-800 font-display flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-[#fc7609]" /> Registrar Asistencia
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">Selecciona el grupo, la fecha y marca la asistencia de los estudiantes.</p>
              </div>
              <button 
                onClick={() => setShowTakeAttendanceModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModalAttendance} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Grupo / Curso *
                  </label>
                  <select
                    required
                    value={modalCourseId}
                    onChange={(e) => setModalCourseId(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#fc7609]/20 focus:border-[#fc7609] outline-none"
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.nombre_curso}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Fecha de Asistencia *
                  </label>
                  <input
                    type="date"
                    required
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#fc7609]/20 focus:border-[#fc7609] outline-none"
                  />
                </div>
              </div>

              {/* Students attendance list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#fc7609]" />
                    Estudiantes ({studentsInModalCourse.length})
                  </label>
                  {studentsInModalCourse.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMarkAll(AttendanceStatus.PRESENT)}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Marcar todos presentes
                    </button>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl max-h-72 overflow-y-auto p-3 space-y-2">
                  {studentsInModalCourse.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs font-medium">
                      No hay estudiantes matriculados en este grupo.
                    </div>
                  ) : (
                    studentsInModalCourse.map((student) => {
                      const currentStatus = modalAttendanceMap[student.id] || AttendanceStatus.PRESENT;
                      return (
                        <div 
                          key={student.id} 
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-colors shadow-2xs"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">
                              {student.nombres} {student.apellidos}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              Doc: {student.documento_identidad}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => setModalAttendanceMap(prev => ({ ...prev, [student.id]: AttendanceStatus.PRESENT }))}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                currentStatus === AttendanceStatus.PRESENT
                                  ? 'bg-emerald-500 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                              }`}
                            >
                              Presente
                            </button>
                            <button
                              type="button"
                              onClick={() => setModalAttendanceMap(prev => ({ ...prev, [student.id]: AttendanceStatus.ABSENT }))}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                currentStatus === AttendanceStatus.ABSENT
                                  ? 'bg-rose-500 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                              }`}
                            >
                              Ausente
                            </button>
                            <button
                              type="button"
                              onClick={() => setModalAttendanceMap(prev => ({ ...prev, [student.id]: AttendanceStatus.EXCUSED }))}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                currentStatus === AttendanceStatus.EXCUSED
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                              }`}
                            >
                              Excusado
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Modal footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTakeAttendanceModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingModal || studentsInModalCourse.length === 0}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#fc7609] to-orange-500 hover:to-orange-400 text-white rounded-xl text-sm font-bold font-display shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSavingModal ? 'Guardando...' : 'Guardar Asistencia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
