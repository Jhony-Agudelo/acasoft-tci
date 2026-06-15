"use client";

import React, { useState } from 'react';
import { Student, Guardian, Course, StudentStatus } from '@/lib/db-schema';
import { X, User, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ViewModalProps {
  student: Student;
  guardian?: Guardian;
  course?: Course;
  onClose: () => void;
}

export function ViewStudentModal({ student, guardian, course, onClose }: ViewModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
          <h3 className="font-extrabold text-xl text-slate-800 font-display flex items-center gap-2">
            <User className="h-5 w-5 text-[#fc7609]" />
            Perfil del Estudiante
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex gap-6 items-start">
            <div className="w-24 h-24 rounded-2xl bg-orange-50 border-2 border-orange-100 flex items-center justify-center text-[#fc7609] shrink-0 overflow-hidden">
              {student.avatar_url ? (
                <img src={student.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="h-10 w-10" />
              )}
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-800 leading-tight">{student.nombres} {student.apellidos}</h4>
              <p className="text-slate-500 font-mono text-sm mt-1">ID: {student.documento_identidad}</p>
              <div className="mt-3 inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wider text-[10px] rounded-lg">
                {student.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Información Académica</span>
              <p className="font-medium text-slate-700"><strong>Colegio:</strong> {student.colegio_origen}</p>
              <p className="font-medium text-slate-700"><strong>Grado:</strong> {student.grado_escolar || 'N/A'}</p>
              <p className="font-medium text-slate-700"><strong>Curso Actual:</strong> {course ? course.nombre_curso : student.curso_actual}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Acudiente</span>
              <p className="font-medium text-slate-700"><strong>Nombre:</strong> {guardian?.nombre_completo || 'N/A'}</p>
              <p className="font-medium text-slate-700"><strong>Teléfono:</strong> {guardian?.telefono || 'N/A'}</p>
              <p className="font-medium text-slate-700"><strong>Parentesco:</strong> {guardian?.parentesco || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EditModalProps {
  student: Student;
  guardian?: Guardian;
  onClose: () => void;
  onSave: (updatedStudent: Student, updatedGuardian?: Guardian) => void;
}

export function EditStudentModal({ student, guardian, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState<Student>({ ...student });
  const [guardianData, setGuardianData] = useState<Guardian | undefined>(guardian ? { ...guardian } : undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Usaremos directamente onSave (que llama a las Server Actions)
      // para evitar depender de endpoints de API que podrían fallar
      await onSave(formData, guardianData);
      toast.success('Estudiante actualizado exitosamente');
      onClose();
    } catch (error) {
      toast.error('No se pudo actualizar el estudiante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
          <h3 className="font-extrabold text-xl text-slate-800 font-display flex items-center gap-2">
            Editar Estudiante
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombres</label>
              <input type="text" value={formData.nombres} onChange={e => setFormData({...formData, nombres: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Apellidos</label>
              <input type="text" value={formData.apellidos} onChange={e => setFormData({...formData, apellidos: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Documento Identidad</label>
              <input type="text" value={formData.documento_identidad} onChange={e => setFormData({...formData, documento_identidad: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Nacimiento</label>
              <input type="date" value={formData.fecha_nacimiento || ''} onChange={e => setFormData({...formData, fecha_nacimiento: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL Avatar (Opcional)</label>
              <input type="url" placeholder="https://..." value={formData.avatar_url || ''} onChange={e => setFormData({...formData, avatar_url: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Colegio Origen</label>
              <input type="text" value={formData.colegio_origen || ''} onChange={e => setFormData({...formData, colegio_origen: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Grado Escolar</label>
              <input type="text" value={formData.grado_escolar || ''} onChange={e => setFormData({...formData, grado_escolar: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estado</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as StudentStatus})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium">
                <option value="REGISTERED">Inscrito</option>
                <option value="IN_INTERVIEW">Entrevista</option>
                <option value="ACTIVE">Activo</option>
                <option value="BLOCKED">Bloqueado (Mora)</option>
                <option value="RETIRED">Retirado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Día de Pago (1-31)</label>
              <input type="number" min="1" max="31" value={formData.payment_day || 15} onChange={e => {
                const newDay = parseInt(e.target.value) || 15;
                const oldDate = new Date(formData.payment_deadline_date + 'T12:00:00');
                if (!isNaN(oldDate.getTime())) {
                  const nextMonth = oldDate.getMonth();
                  oldDate.setDate(newDay);
                  if (oldDate.getMonth() !== nextMonth) {
                    oldDate.setDate(0); // prevent overflow
                  }
                  setFormData({...formData, payment_day: newDay, payment_deadline_date: oldDate.toISOString().split('T')[0]});
                } else {
                  setFormData({...formData, payment_day: newDay});
                }
              }} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
            </div>
          </div>

          {guardianData && (
            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-bold text-slate-700 text-sm mb-3">Datos del Acudiente</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                  <input type="text" value={guardianData.nombre_completo} onChange={e => setGuardianData({...guardianData, nombre_completo: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                  <input type="text" value={guardianData.telefono} onChange={e => setGuardianData({...guardianData, telefono: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dirección</label>
                  <input type="text" value={guardianData.direccion} onChange={e => setGuardianData({...guardianData, direccion: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Parentesco</label>
                  <input type="text" value={guardianData.parentesco} onChange={e => setGuardianData({...guardianData, parentesco: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#fc7609] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Save className="h-4 w-4" />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
