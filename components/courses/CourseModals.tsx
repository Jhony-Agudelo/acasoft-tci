"use client";

import React, { useState } from 'react';
import { Course, User, Student, StudentStatus, LessonPlan, LessonPlanResource, Guardian } from '@/lib/db-schema';
import { X, Save, Clock, Trash2, Plus, Users, Book, Video, FileText, Activity, ExternalLink, Search, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { saveLessonPlan, deleteLessonPlan, getLessonPlansByCourse, getLessonPlanTemplates } from '@/lib/actions/lesson_plan.actions';

interface EditCourseModalProps {
  course: Course;
  teachers: User[];
  students: Student[];
  guardians?: Guardian[];
  currentUser: User | null;
  onClose: () => void;
  onSave: (updatedCourse: Course) => void;
  onSaveStudent: (updatedStudent: Student) => void;
  onSaveAttendance?: (courseId: string, attendanceData: Record<string, string>) => void;
  isTeacherMode?: boolean;
}

export function EditCourseModal({ course, teachers, students, guardians = [], currentUser, onClose, onSave, onSaveStudent, onSaveAttendance, isTeacherMode }: EditCourseModalProps) {
  const isTeacher = isTeacherMode ?? (currentUser?.role === 'TEACHER');
  const isDirector = currentUser?.role === 'DIRECTOR' || currentUser?.role === 'ADMIN';

  const [activeTab, setActiveTab] = useState<'DETAILS' | 'LESSONS'>('DETAILS');

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

  // Lesson Plans State
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);

  const [loading, setLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  React.useEffect(() => {
    getLessonPlansByCourse(course.id).then(plans => {
      setLessonPlans(plans);
      setLoadingLessons(false);
    });
  }, [course.id]);

  const handleAddSchedule = () => {
    setFormData({
      ...formData,
      schedule: [...(formData.schedule || []), {
        day: 'Lunes',
        start_time: '14:00',
        end_time: '16:00',
        main_teacher_id: teachers[0]?.id || '',
        support_teachers: []
      }]
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

  const handleAddSupportTeacher = (scheduleIndex: number) => {
    const newSchedule = [...(formData.schedule || [])];
    const s = { ...newSchedule[scheduleIndex] };
    if (!s.support_teachers) s.support_teachers = [];
    s.support_teachers.push('');
    newSchedule[scheduleIndex] = s;
    setFormData({ ...formData, schedule: newSchedule });
  };

  const handleRemoveSupportTeacher = (scheduleIndex: number, teacherIndex: number) => {
    const newSchedule = [...(formData.schedule || [])];
    const s = { ...newSchedule[scheduleIndex] };
    if (s.support_teachers) {
      s.support_teachers.splice(teacherIndex, 1);
    }
    newSchedule[scheduleIndex] = s;
    setFormData({ ...formData, schedule: newSchedule });
  };

  const handleSupportTeacherChange = (scheduleIndex: number, teacherIndex: number, value: string) => {
    const newSchedule = [...(formData.schedule || [])];
    const s = { ...newSchedule[scheduleIndex] };
    if (s.support_teachers) {
      s.support_teachers[teacherIndex] = value;
    }
    newSchedule[scheduleIndex] = s;
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
            const student = students.find(s => s.id === id);
            if (student?.status === 'BLOCKED') {
              delete finalData[id];
            } else {
              if (!finalData[id]) finalData[id] = 'PRESENT';
            }
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
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        <div className="bg-slate-50 border-b border-slate-100 p-6 pb-0 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-xl text-slate-800 font-display flex items-center gap-2">
              {isTeacher ? 'Detalles del Grupo' : 'Gestión de Curso'}
            </h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('DETAILS')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'DETAILS' ? 'border-[#fc7609] text-[#fc7609]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Configuración y Asistencia
            </button>
            <button
              onClick={() => setActiveTab('LESSONS')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'LESSONS' ? 'border-[#fc7609] text-[#fc7609]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Planeación Semanal
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {activeTab === 'DETAILS' && (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Curso</label>
                  <input type="text" disabled={isTeacher} value={formData.nombre_curso} onChange={e => setFormData({ ...formData, nombre_curso: e.target.value })} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium disabled:opacity-70" />
                </div>
                {!isTeacher && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estado</label>
                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium">
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

                <div className="space-y-4">
                  {formData.schedule && formData.schedule.map((s, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
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

                      <div className="flex flex-col gap-3 pt-3 border-t border-slate-200 border-dashed">
                        <div className="w-full">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Maestro Principal</label>
                          <select disabled={isTeacher} value={s.main_teacher_id} onChange={e => handleScheduleChange(idx, 'main_teacher_id', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg bg-white text-xs disabled:opacity-70 disabled:bg-slate-100">
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.nombres} {t.apellidos}</option>)}
                          </select>
                        </div>

                        <div className="w-full">
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Maestros Opcionales</label>
                            {!isTeacher && (
                              <button type="button" onClick={() => handleAddSupportTeacher(idx)} className="text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 px-2 py-0.5 rounded transition-colors flex items-center gap-1">
                                <Plus className="h-3 w-3" /> Agregar
                              </button>
                            )}
                          </div>

                          {s.support_teachers && s.support_teachers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              {s.support_teachers.map((supportTeacherId, stIdx) => (
                                <div key={stIdx} className="flex items-center gap-2">
                                  <select disabled={isTeacher} value={supportTeacherId} onChange={e => handleSupportTeacherChange(idx, stIdx, e.target.value)} className="flex-1 p-2 border border-slate-200 rounded-lg bg-white text-xs disabled:opacity-70 disabled:bg-slate-100">
                                    <option value="">- Seleccionar Maestro -</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.nombres} {t.apellidos}</option>)}
                                  </select>
                                  {!isTeacher && (
                                    <button type="button" onClick={() => handleRemoveSupportTeacher(idx, stIdx)} className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors">
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">No hay maestros opcionales asignados para este horario.</p>
                          )}
                        </div>
                      </div>
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

                <div className="mb-3 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar estudiante por nombre o documento..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#fc7609]/20 focus:border-[#fc7609] transition-all bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl max-h-64 overflow-y-auto p-4 space-y-2">
                  {students.filter(s => s.status !== StudentStatus.REGISTERED && s.status !== 'RETIRED').length === 0 ? (
                    <p className="text-xs text-slate-500 text-center">No hay estudiantes activos en el sistema.</p>
                  ) : (
                    students
                      .filter(s => s.status !== StudentStatus.REGISTERED && s.status !== 'RETIRED')
                      .filter(s => isTeacher ? assignedStudentIds.has(s.id) : true) // Teachers only see assigned students
                      .filter(s => (s.nombres + ' ' + s.apellidos).toLowerCase().includes(studentSearch.toLowerCase()) || s.documento_identidad.includes(studentSearch))
                      .map(student => (
                        <label key={student.id} className={`flex items-center justify-between p-2 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200 ${student.status === 'BLOCKED' ? 'opacity-70 bg-rose-50/40' : ''}`}>
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

                              {(isTeacher || isDirector) && (
                                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-rose-600 bg-rose-50 px-2 py-1 rounded-md w-fit border border-rose-100">
                                  {(() => {
                                    const guardian = guardians.find(g => g.id === student.guardian_id);
                                    if (guardian) return <><Phone className="h-3 w-3" /> <strong>{guardian.parentesco}:</strong> {guardian.nombre_completo} ({guardian.telefono})</>;
                                    return <><Phone className="h-3 w-3" /> Sin acudiente asignado</>;
                                  })()}
                                </div>
                              )}
                            </div>
                          </div>
                          {isTeacher && (
                            <div className="flex gap-2 items-center">
                              {student.status === 'BLOCKED' && (
                                <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md uppercase">Mora</span>
                              )}
                              <select
                                className="text-xs border border-slate-200 p-1.5 rounded-lg bg-white focus:ring-orange-500 disabled:opacity-50"
                                value={attendanceData[student.id] || 'PRESENT'}
                                onChange={e => setAttendanceData({ ...attendanceData, [student.id]: e.target.value })}
                                disabled={student.status === 'BLOCKED'}
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
          )}

          {activeTab === 'LESSONS' && (
            <LessonPlansTab
              courseId={course.id}
              isDirector={isDirector}
              lessonPlans={lessonPlans}
              setLessonPlans={setLessonPlans}
              loading={loadingLessons}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ----- SUB-COMPONENT FOR LESSON PLANS -----

function LessonPlansTab({ courseId, isDirector, lessonPlans, setLessonPlans, loading }: {
  courseId: string, isDirector: boolean, lessonPlans: LessonPlan[], setLessonPlans: React.Dispatch<React.SetStateAction<LessonPlan[]>>, loading: boolean
}) {
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [templates, setTemplates] = useState<LessonPlan[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const [newPlan, setNewPlan] = useState<Partial<LessonPlan>>({
    week_start: '',
    week_end: '',
    topic: '',
    description: '',
    resources: []
  });

  const handleAddResource = () => {
    setNewPlan({
      ...newPlan,
      resources: [...(newPlan.resources || []), { title: '', url: '', type: 'other' }]
    });
  };

  const handleResourceChange = (index: number, field: keyof LessonPlanResource, value: string) => {
    const updated = [...(newPlan.resources || [])];
    updated[index] = { ...updated[index], [field]: value };
    setNewPlan({ ...newPlan, resources: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.week_start || !newPlan.topic) return toast.error("La semana y el tema son obligatorios.");

    const id = `lp_${Date.now()}`;
    const planToSave = { ...newPlan, id, course_id: courseId } as LessonPlan;

    const success = await saveLessonPlan(planToSave);
    if (success) {
      toast.success("Planeación guardada");
      setLessonPlans([planToSave, ...lessonPlans]);
      setShowForm(false);
      setNewPlan({ week_start: '', week_end: '', topic: '', description: '', resources: [] });
    } else {
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar planeación?")) return;
    const success = await deleteLessonPlan(id);
    if (success) {
      toast.success("Eliminada");
      setLessonPlans(lessonPlans.filter(p => p.id !== id));
    }
  };

  const openImportModal = async () => {
    setLoadingTemplates(true);
    setShowImport(true);
    const data = await getLessonPlanTemplates();
    setTemplates(data);
    setLoadingTemplates(false);
  };

  const handleSelectTemplate = (template: LessonPlan) => {
    setNewPlan({
      week_start: '',
      week_end: '',
      topic: template.topic,
      description: template.description,
      resources: template.resources ? [...template.resources] : []
    });
    setShowImport(false);
    setShowForm(true);
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Cargando planeación...</div>;

  return (
    <div className="p-6">
      {isDirector && !showForm && (
        <div className="flex gap-3 mb-6">
          <button onClick={() => setShowForm(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
            <Plus className="h-4 w-4" /> Agregar Planeación Semanal
          </button>
          <button onClick={openImportModal} className="bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors">
            <Book className="h-4 w-4" /> Importar desde Planeaciones
          </button>
        </div>
      )}

      {showImport && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-2"><Book className="h-5 w-5 text-emerald-500" /> Importar Plantilla</h4>
            <button onClick={() => setShowImport(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
          </div>

          {loadingTemplates ? (
            <p className="text-center text-sm font-medium text-slate-500 py-4">Cargando banco de planeaciones...</p>
          ) : templates.length === 0 ? (
            <p className="text-center text-sm font-medium text-slate-500 py-4">No hay planeaciones guardadas en el banco general.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {templates.map(tpl => (
                <div key={tpl.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer" onClick={() => handleSelectTemplate(tpl)}>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm mb-1">{tpl.topic}</h5>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{tpl.level || 'Básico'}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">Seleccionar</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSave} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6 space-y-4">
          <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Nueva Planeación</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Inicio de Semana</label>
              <input type="date" required value={newPlan.week_start} onChange={e => setNewPlan({ ...newPlan, week_start: e.target.value })} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fin de Semana</label>
              <input type="date" required value={newPlan.week_end} onChange={e => setNewPlan({ ...newPlan, week_end: e.target.value })} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tema Principal</label>
            <input type="text" required placeholder="Ej: Simple Past" value={newPlan.topic} onChange={e => setNewPlan({ ...newPlan, topic: e.target.value })} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Instrucciones / Actividades</label>
            <textarea required rows={3} value={newPlan.description} onChange={e => setNewPlan({ ...newPlan, description: e.target.value })} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Recursos y Enlaces</label>
              <button type="button" onClick={handleAddResource} className="text-xs font-bold text-emerald-600 flex items-center gap-1"><Plus className="h-3 w-3" /> Añadir Enlace</button>
            </div>

            <div className="space-y-2">
              {newPlan.resources?.map((res, idx) => (
                <div key={idx} className="flex gap-2">
                  <select value={res.type} onChange={e => handleResourceChange(idx, 'type', e.target.value)} className="p-2 border border-slate-200 rounded-lg text-xs w-28">
                    <option value="video">Video</option>
                    <option value="document">Documento</option>
                    <option value="activity">Actividad</option>
                    <option value="other">Otro</option>
                  </select>
                  <input type="text" placeholder="Título" value={res.title} onChange={e => handleResourceChange(idx, 'title', e.target.value)} className="p-2 border border-slate-200 rounded-lg text-xs w-1/3" />
                  <input type="url" placeholder="https://..." value={res.url} onChange={e => handleResourceChange(idx, 'url', e.target.value)} className="p-2 border border-slate-200 rounded-lg text-xs flex-1" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg text-sm">Guardar</button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {lessonPlans.length === 0 && !showForm && (
          <p className="text-center text-slate-500 italic py-10">No hay planeaciones registradas para este curso.</p>
        )}

        {lessonPlans.map(plan => (
          <div key={plan.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">Semana: {plan.week_start} al {plan.week_end}</span>
                <h4 className="text-lg font-bold text-slate-800 font-display mt-2">{plan.topic}</h4>
              </div>
              {isDirector && (
                <button onClick={() => handleDelete(plan.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="h-5 w-5" /></button>
              )}
            </div>

            <p className="text-sm text-slate-600 whitespace-pre-wrap mb-4 bg-slate-50 p-3 rounded-xl">{plan.description}</p>

            {plan.resources && plan.resources.length > 0 && (
              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Book className="h-3.5 w-3.5" /> Recursos de la Semana</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {plan.resources.map((res, i) => (
                    <a key={i} href={res.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-orange-200 hover:bg-orange-50 transition-colors group">
                      <div className={`p-2 rounded-lg ${res.type === 'video' ? 'bg-red-100 text-red-500' : res.type === 'document' ? 'bg-blue-100 text-blue-500' : 'bg-emerald-100 text-emerald-500'}`}>
                        {res.type === 'video' ? <Video className="h-4 w-4" /> : res.type === 'document' ? <FileText className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-[#fc7609] flex-1 truncate">{res.title}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#fc7609]" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
