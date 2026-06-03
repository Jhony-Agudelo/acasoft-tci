"use client";

import React, { useState, useEffect } from 'react';
import { Search, Calendar, CheckCircle2, XCircle, AlertCircle, Users, BookOpen } from 'lucide-react';
import { Attendance, Student, Course } from '@/lib/db-schema';
import { getAttendances } from '@/lib/actions/attendance.actions';
import { getStudents } from '@/lib/actions/student.actions';
import { getCourses } from '@/lib/actions/course.actions';

export default function AsistenciaPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    Promise.all([
      getAttendances(),
      getStudents(),
      getCourses()
    ]).then(([attData, stuData, couData]) => {
      setAttendances(attData);
      setStudents(stuData);
      setCourses(couData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-10 font-bold text-slate-500 text-center">Cargando reportes de asistencia...</div>;
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
    return matchSearch && matchDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Presente</span>;
      case 'ABSENT':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-700"><XCircle className="h-3.5 w-3.5" /> Ausente</span>;
      case 'EXCUSED':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-700"><AlertCircle className="h-3.5 w-3.5" /> Excusado</span>;
      default:
        return <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 font-display">Reportes de Asistencia</h2>
          <p className="text-slate-500 text-sm mt-1">Consulta el historial de asistencia por estudiante y curso.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o documento del estudiante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="pl-4 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-slate-600"
            />
          </div>
          {filterDate && (
            <button 
              onClick={() => setFilterDate('')}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-colors"
            >
              Limpiar Fecha
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 font-display mb-1">Sin registros</h3>
            <p className="text-slate-500 text-sm">No se encontraron asistencias con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4 pl-6">Fecha</th>
                  <th className="p-4">Estudiante</th>
                  <th className="p-4">Documento</th>
                  <th className="p-4">Curso / Grupo</th>
                  <th className="p-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-2 font-mono text-slate-600 font-medium">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {item.date}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      {item.studentName}
                    </td>
                    <td className="p-4 text-slate-500 font-mono">
                      {item.documento}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <BookOpen className="h-4 w-4 text-[#fc7609]" />
                        {item.courseName}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(item.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
