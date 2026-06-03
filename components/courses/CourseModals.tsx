"use client";

import React, { useState } from 'react';
import { Course, User, Student, StudentStatus } from '@/lib/db-schema';
import { X, Save, Clock, Trash2, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';

interface EditCourseModalProps {
  course: Course;
  teachers: User[];
  students: Student[];
  currentUser: User | null;
  onClose: () => void;
  onSave: (updatedCourse: Course) => void;
  onSaveStudent: (updatedStudent: Student) => void;
  onSaveAttendance?: (courseId: string, attendanceData: Record<string, string>) => void;
}

export function EditCourseModal({ course, teachers, students, currentUser, onClose, onSave, onSaveStudent, onSaveAttendance }: EditCourseModalProps) {
  const isTeacher = currentUser?.role === 'TEACHER';
  const [formData, setFormData] = useState<Course>({
    ...course,
    schedule: course.schedule ? [...course.schedule] : []
  });
  
  // Track students currently assigned to this course
  const [assignedStudentIds, setAssignedStudentIds] = useState<Set<string>>(new Set(
    students.filter(s => s.curso_actual === course.id || s.curso_actual === course.nombre_curso).map(s => s.id)
  ));
  
  // Track attendance selections
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  
  const [loading, setLoading] = useState(false);

  const handleAddSchedule = () => {
    setFormData({
      ...formData,
      schedule: [...(formData.schedule || []), { day: 'Lunes', start_time: '14:00', end_time: '16:00' }]
    });
  };

  const handleRemoveSchedule = (index: number) => {
    const newSchedule = [...(formData.schedule || [])];
    newSchedule.splice(index, 1);
    setFormData({ ...formData, schedule: newSchedule });
  };

  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedule = [...(formData.schedule || [])];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setFormData({ ...formData, schedule: newSchedule });
  };

  const toggleStudent = (studentId: string) => {
    const newSet = new Set(assignedStudentIds);
    if (newSet.has(studentId)) {
      newSet.delete(studentId);
    } else {
      newSet.add(studentId);
    }
    setAssignedStudentIds(newSet);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isTeacher) {
        // Only save attendance
        if (onSaveAttendance) {
          // Fill missing ones with 'PRESENT' default
          const finalData = { ...attendanceData };
          Array.from(assignedStudentIds).forEach(id => {
            if (!finalData[id]) finalData[id] = 'PRESENT';
          });
          await onSaveAttendance(course.id, finalData);
          toast.success('Asistencia guardada exitosamente');
          onClose();
        }
      } else {
        await onSave(formData);
        
        // Update all students whose assignments changed
        const originalAssigned = new Set(students.filter(s => s.curso_actual === course.id || s.curso_actual === course.nombre_curso).map(s => s.id));
        
        for (const student of students) {
          const wasAssigned = originalAssigned.has(student.id);
          const isNowAssigned = assignedStudentIds.has(student.id);
          
          if (wasAssigned && !isNowAssigned) {
            await onSaveStudent({ ...student, curso_actual: '' });
          } else if (!wasAssigned && isNowAssigned) {
            await onSaveStudent({ ...student, curso_actual: course.id });
          } else if (isNowAssigned && student.curso_actual !== course.id) {
            await onSaveStudent({ ...student, curso_actual: course.id });
          }
        }
        toast.success('Curso y estudiantes actualizados exitosamente');
        onClose();
      }
    } catch (error) {
      toast.error('No se pudo completar la operación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl overflow-hidden my-8">
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
          <h3 className="font-extrabold text-xl text-slate-800 font-display flex items-center gap-2">
            {isTeacher ? 'Detalles del Curso y Asistencia' : 'Editar Curso'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Curso</label>
              <input type="text" disabled={isTeacher} value={formData.nombre_curso} onChange={e => setFormData({...formData, nombre_curso: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium disabled:opacity-70" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Maestro Asignado</label>
              <select disabled={isTeacher} value={formData.teacher_id} onChange={e => setFormData({...formData, teacher_id: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium disabled:opacity-70">
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.nombres} {t.apellidos}</option>
                ))}
              </select>
            </div>
            {!isTeacher && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estado</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium">
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                </select>
              </div>
            )}
          </div>
          
          <div className="border-t border-slate-100 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#fc7609]" /> Horarios
              </h4>
              {!isTeacher && (
                <button type="button" onClick={handleAddSchedule} className="text-xs font-bold text-[#fc7609] hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Agregar
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {formData.schedule && formData.schedule.map((s, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <select disabled={isTeacher} value={s.day} onChange={e => handleScheduleChange(idx, 'day', e.target.value)} className="p-2 border border-slate-200 rounded-lg bg-white text-sm flex-1 disabled:opacity-70 disabled:bg-slate-100">
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                    <option value="Sábado">Sábado</option>
                  </select>
                  <input type="time" disabled={isTeacher} value={s.start_time} onChange={e => handleScheduleChange(idx, 'start_time', e.target.value)} className="p-2 border border-slate-200 rounded-lg bg-white text-sm w-32 disabled:opacity-70 disabled:bg-slate-100" />
                  <span className="text-slate-400 font-bold">-</span>
                  <input type="time" disabled={isTeacher} value={s.end_time} onChange={e => handleScheduleChange(idx, 'end_time', e.target.value)} className="p-2 border border-slate-200 rounded-lg bg-white text-sm w-32 disabled:opacity-70 disabled:bg-slate-100" />
                  {!isTeacher && (
                    <button type="button" onClick={() => handleRemoveSchedule(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {(!formData.schedule || formData.schedule.length === 0) && (
                <p className="text-sm text-slate-400 italic text-center py-4">Sin horarios asignados.</p>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-[#fc7609]" /> Estudiantes Inscritos</div>
              {isTeacher && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-lg">Modo Asistencia</span>}
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-xl max-h-64 overflow-y-auto p-4 space-y-2">
              {students.filter(s => s.status !== StudentStatus.REGISTERED).length === 0 ? (
                <p className="text-xs text-slate-500 text-center">No hay estudiantes activos en el sistema.</p>
              ) : (
                students
                  .filter(s => s.status !== StudentStatus.REGISTERED)
                  .filter(s => isTeacher ? assignedStudentIds.has(s.id) : true) // Teachers only see assigned students
                  .map(student => (
                  <label key={student.id} className="flex items-center justify-between p-2 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                    <div className="flex items-center gap-3">
                      {!isTeacher && (
                        <input 
                          type="checkbox" 
                          checked={assignedStudentIds.has(student.id)} 
                          onChange={() => toggleStudent(student.id)}
                          className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{student.nombres} {student.apellidos}</span>
                        <span className="text-[10px] font-mono text-slate-400">ID: {student.documento_identidad} | {student.curso_actual && student.curso_actual !== course.id ? `Asignado a otro curso (${student.curso_actual})` : 'Inscrito'}</span>
                      </div>
                    </div>
                    {isTeacher && (
                      <div className="flex gap-2">
                        <select 
                          className="text-xs border border-slate-200 p-1.5 rounded-lg bg-white focus:ring-orange-500" 
                          value={attendanceData[student.id] || 'PRESENT'}
                          onChange={e => setAttendanceData({...attendanceData, [student.id]: e.target.value})}
                        >
                          <option value="PRESENT">Presente</option>
                          <option value="ABSENT">Ausente</option>
                          <option value="EXCUSED">Excusado</option>
                        </select>
                      </div>
                    )}
                  </label>
                ))
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#fc7609] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Save className="h-4 w-4" />
              {loading ? 'Guardando...' : (isTeacher ? 'Guardar Asistencia' : 'Guardar Cambios')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
