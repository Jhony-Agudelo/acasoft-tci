"use client";

import React, { useState, useMemo } from 'react';
import { Guardian, Student } from '@/lib/db-schema';
import { X, Save, ShieldCheck, GraduationCap, Plus, Search, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface EditGuardianModalProps {
  guardian?: Guardian;
  allStudents: Student[];
  canDelete?: boolean;
  onClose: () => void;
  onSave: (guardian: Guardian, assignedStudents: Student[]) => void;
  onDelete?: (guardianId: string) => void;
}

export function EditGuardianModal({ guardian, allStudents, canDelete, onClose, onSave, onDelete }: EditGuardianModalProps) {
  const isNew = !guardian;
  const [formData, setFormData] = useState<Guardian>(
    guardian || {
      id: `grd_${Date.now()}`,
      nombre_completo: '',
      direccion: '',
      telefono: '',
      parentesco: 'Madre',
    }
  );

  // Initial assigned students
  const initialAssigned = useMemo(() => {
    if (isNew) return [];
    return allStudents.filter(s => s.guardian_id === formData.id);
  }, [allStudents, formData.id, isNew]);

  const [assignedStudents, setAssignedStudents] = useState<Student[]>(initialAssigned);
  
  // Search state
  const [studentSearch, setStudentSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [loading, setLoading] = useState(false);

  const searchResults = useMemo(() => {
    if (!studentSearch.trim()) return [];
    const term = studentSearch.toLowerCase();
    return allStudents.filter(s => 
      !assignedStudents.find(as => as.id === s.id) && // Not already assigned
      (s.nombres.toLowerCase().includes(term) || s.apellidos.toLowerCase().includes(term) || s.documento_identidad.includes(term))
    ).slice(0, 5); // Limit to 5 results
  }, [allStudents, studentSearch, assignedStudents]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSave(formData, assignedStudents);
  };

  const assignStudent = (student: Student) => {
    setAssignedStudents([...assignedStudents, student]);
    setStudentSearch('');
    setShowDropdown(false);
  };

  const removeAssignedStudent = (studentId: string) => {
    setAssignedStudents(assignedStudents.filter(s => s.id !== studentId));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
          <h3 className="font-extrabold text-xl text-slate-800 font-display flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#fc7609]" />
            {isNew ? 'Registrar Nuevo Acudiente' : 'Editar Acudiente'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h4 className="font-bold text-slate-700 text-sm mb-3">Datos del Acudiente</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo *</label>
                <input required type="text" value={formData.nombre_completo} onChange={e => setFormData({...formData, nombre_completo: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono *</label>
                <input required type="text" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dirección *</label>
                <input required type="text" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Parentesco Genérico</label>
                <select value={formData.parentesco} onChange={e => setFormData({...formData, parentesco: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium">
                  <option value="Madre">Madre</option>
                  <option value="Padre">Padre</option>
                  <option value="Abuelo/a">Abuelo/a</option>
                  <option value="Tío/a">Tío/a</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h4 className="font-bold text-slate-700 text-sm mb-3">Estudiantes Asignados</h4>
            
            <div className="space-y-3">
              {/* List of currently assigned */}
              {assignedStudents.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {assignedStudents.map(student => (
                    <div key={student.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#fc7609]">
                          <GraduationCap className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{student.nombres} {student.apellidos}</p>
                          <p className="text-[10px] text-slate-500 font-medium">ID: {student.documento_identidad}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href="/dashboard/estudiantes" className="text-slate-400 hover:text-blue-500 p-1.5 rounded-md hover:bg-blue-50 transition-colors" title="Ir al módulo de Estudiantes">
                           <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button type="button" onClick={() => removeAssignedStudent(student.id)} className="text-slate-400 hover:text-rose-500 p-1.5 rounded-md hover:bg-rose-50 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  <p className="text-sm text-slate-500 font-medium">No hay estudiantes asignados a este acudiente.</p>
                </div>
              )}

              {/* Search to assign */}
              <div className="relative mt-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Buscar estudiante para asignar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={studentSearch}
                    onChange={e => {
                      setStudentSearch(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Escriba nombre o documento..." 
                    className="w-full pl-9 p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" 
                  />
                </div>
                
                {showDropdown && studentSearch.trim() !== '' && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map(s => (
                        <button 
                          key={s.id} 
                          type="button" 
                          onClick={() => assignStudent(s)}
                          className="w-full text-left p-3 hover:bg-orange-50 flex items-center justify-between border-b border-slate-50 last:border-0"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-700">{s.nombres} {s.apellidos}</p>
                            <p className="text-[10px] text-slate-500">ID: {s.documento_identidad}</p>
                          </div>
                          <Plus className="h-4 w-4 text-[#fc7609]" />
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-sm text-slate-500">No se encontraron estudiantes similares.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <div>
              {!isNew && canDelete && onDelete && (
                <button 
                  type="button" 
                  onClick={() => {
                    if(confirm('¿Estás seguro de que deseas eliminar este acudiente? ATENCIÓN: Si este acudiente tiene estudiantes asignados, ESTA ACCIÓN ELIMINARÁ TAMBIÉN A ESOS ESTUDIANTES y toda su información. Se recomienda reasignar primero a los estudiantes.')) {
                      onDelete(formData.id);
                    }
                  }}
                  className="px-4 py-2 text-rose-500 font-bold hover:bg-rose-50 rounded-xl transition-colors text-sm"
                >
                  Eliminar Acudiente
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
              <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#fc7609] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Save className="h-4 w-4" />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Click outside to close dropdown hack */}
      {showDropdown && <div className="fixed inset-0 z-0" onClick={() => setShowDropdown(false)}></div>}
    </div>
  );
}
