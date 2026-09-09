"use client";

import React, { useState, useMemo } from 'react';
import { Student, Guardian, Course, StudentStatus, COLEGIOS_LA_VIRGINIA } from '@/lib/db-schema';
import { X, User, Save, Upload, Search, ShieldCheck, ExternalLink, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { saveGuardian } from '@/lib/actions/guardian.actions';

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
  allGuardians?: Guardian[]; // Opcional por si no se pasa al principio (evita errores), pero siempre se debería pasar
  canDelete?: boolean;
  onClose: () => void;
  onSave: (updatedStudent: Student, updatedGuardian?: Guardian) => void;
  onDelete?: (studentId: string) => void;
  onNewGuardianCreated?: (newGuardian: Guardian) => void;
}

export function EditStudentModal({ student, guardian, allGuardians = [], canDelete, onClose, onSave, onDelete, onNewGuardianCreated }: EditModalProps) {
  const [formData, setFormData] = useState<Student>({ ...student });
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | undefined>(guardian);
  
  // Search states
  const [guardianSearch, setGuardianSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states for creating a new guardian
  const [showCreateGuardianModal, setShowCreateGuardianModal] = useState(false);
  const [newGuardianForm, setNewGuardianForm] = useState({
    nombre_completo: '',
    telefono: '',
    direccion: '',
    parentesco: 'Madre',
  });
  const [isCreatingGuardian, setIsCreatingGuardian] = useState(false);

  const searchResults = useMemo(() => {
    if (!guardianSearch.trim()) return [];
    const term = guardianSearch.toLowerCase();
    return allGuardians.filter(g => 
      g.nombre_completo.toLowerCase().includes(term) || g.telefono.includes(term)
    ).slice(0, 5);
  }, [allGuardians, guardianSearch]);

  const handleSelectGuardian = (g: Guardian) => {
    setSelectedGuardian(g);
    setFormData({ ...formData, guardian_id: g.id });
    setGuardianSearch('');
    setShowDropdown(false);
  };

  const handleOpenCreateGuardianModal = (prefilledName?: string) => {
    setNewGuardianForm({
      nombre_completo: prefilledName || guardianSearch.trim(),
      telefono: '',
      direccion: '',
      parentesco: 'Madre',
    });
    setShowCreateGuardianModal(true);
    setShowDropdown(false);
  };

  const handleSaveNewGuardian = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuardianForm.nombre_completo.trim() || !newGuardianForm.telefono.trim() || !newGuardianForm.direccion.trim()) {
      toast.error('Por favor complete todos los datos obligatorios del acudiente.');
      return;
    }

    setIsCreatingGuardian(true);
    try {
      const newG: Guardian = {
        id: `grd_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        nombre_completo: newGuardianForm.nombre_completo.trim(),
        telefono: newGuardianForm.telefono.trim(),
        direccion: newGuardianForm.direccion.trim(),
        parentesco: newGuardianForm.parentesco || 'Madre',
      };

      const success = await saveGuardian(newG);
      if (!success) {
        toast.error('No se pudo guardar el acudiente en el sistema.');
        return;
      }

      allGuardians.push(newG);
      if (onNewGuardianCreated) {
        onNewGuardianCreated(newG);
      }
      setSelectedGuardian(newG);
      setFormData({ ...formData, guardian_id: newG.id });
      setShowCreateGuardianModal(false);
      setGuardianSearch('');
      setShowDropdown(false);
      toast.success(`Acudiente "${newG.nombre_completo}" registrado y asignado exitosamente.`);
    } catch (err: any) {
      toast.error('Error al registrar acudiente: ' + (err?.message || String(err)));
    } finally {
      setIsCreatingGuardian(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData, selectedGuardian);
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
              <select value={formData.colegio_origen || ''} onChange={e => setFormData({...formData, colegio_origen: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium">
                <option value="">Seleccione...</option>
                {COLEGIOS_LA_VIRGINIA.map(col => <option key={col} value={col}>{col}</option>)}
                <option value="Otro">Otro / Fuera del Municipio</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Grado Escolar</label>
              <select value={formData.grado_escolar || ''} onChange={e => setFormData({...formData, grado_escolar: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium">
                <option value="">Seleccione...</option>
                <option value="Jardín / Guardería">Jardín / Guardería</option>
                <option value="Preescolar / Transición">Preescolar / Transición</option>
                <option value="Primero">Primero</option>
                <option value="Segundo">Segundo</option>
                <option value="Tercero">Tercero</option>
                <option value="Cuarto">Cuarto</option>
                <option value="Quinto">Quinto</option>
                <option value="Sexto">Sexto</option>
                <option value="Séptimo">Séptimo</option>
                <option value="Octavo">Octavo</option>
                <option value="Noveno">Noveno</option>
                <option value="Décimo">Décimo</option>
                <option value="Once">Once</option>
                <option value="Egresado / Universitario">Egresado / Universitario</option>
                <option value="No Aplica">No Aplica</option>
              </select>
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
                    oldDate.setDate(0); 
                  }
                  setFormData({...formData, payment_day: newDay, payment_deadline_date: oldDate.toISOString().split('T')[0]});
                } else {
                  setFormData({...formData, payment_day: newDay});
                }
              }} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-700 text-sm">Asignación de Acudiente</h4>
              <button
                type="button"
                onClick={() => handleOpenCreateGuardianModal()}
                className="text-xs font-bold text-[#fc7609] hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Registrar Nuevo Acudiente</span>
              </button>
            </div>
            
            {/* Acudiente Actual */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between mb-4">
              {selectedGuardian ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-[#fc7609]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{selectedGuardian.nombre_completo}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{selectedGuardian.parentesco} | {selectedGuardian.telefono}</p>
                    {selectedGuardian.direccion && selectedGuardian.direccion !== 'Pendiente' && (
                      <p className="text-[10px] text-slate-400 truncate max-w-xs">{selectedGuardian.direccion}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 font-medium italic">Sin acudiente asignado</p>
              )}
              
              <Link href="/dashboard/acudientes" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1" title="Gestionar en el módulo de Acudientes">
                <ExternalLink className="h-4 w-4" /> Ver / Editar Datos
              </Link>
            </div>

            {/* Buscador de Acudientes */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reasignar o Buscar Acudiente</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  value={guardianSearch}
                  onChange={e => {
                    setGuardianSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Buscar por nombre o teléfono..." 
                  className="w-full pl-9 p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" 
                />
              </div>
              
              {showDropdown && guardianSearch.trim() !== '' && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map(g => (
                      <button 
                        key={g.id} 
                        type="button" 
                        onClick={() => handleSelectGuardian(g)}
                        className="w-full text-left p-3 hover:bg-orange-50 flex items-center justify-between border-b border-slate-50 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-700">{g.nombre_completo}</p>
                          <p className="text-[10px] text-slate-500">{g.telefono} - {g.parentesco}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 border-b border-slate-50 text-sm text-slate-500 text-center">No se encontraron coincidencias.</div>
                  )}
                  
                  {/* Botón para abrir formulario de creación */}
                  <button 
                    type="button" 
                    onClick={() => handleOpenCreateGuardianModal(guardianSearch)}
                    className="w-full text-left p-3 hover:bg-orange-100 flex items-center justify-between bg-orange-50 text-[#fc7609] font-semibold text-sm transition-colors"
                  >
                    <span>Crear nuevo acudiente "{guardianSearch}"</span>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <div>
              {canDelete && onDelete && (
                <button 
                  type="button" 
                  onClick={() => {
                    if(confirm('¿Estás seguro de que deseas eliminar este estudiante? Esta acción es irreversible y eliminará todos sus datos asociados (asistencia, pagos, etc).')) {
                      onDelete(student.id);
                    }
                  }}
                  className="px-4 py-2 text-rose-500 font-bold hover:bg-rose-50 rounded-xl transition-colors text-sm"
                >
                  Eliminar Estudiante
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

      {/* Modal para Crear Nuevo Acudiente */}
      {showCreateGuardianModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden my-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-50 border-b border-slate-100 p-5 flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-slate-800 font-display flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#fc7609]" />
                Registrar Nuevo Acudiente
              </h3>
              <button 
                type="button"
                onClick={() => setShowCreateGuardianModal(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewGuardian} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej: María Pérez García"
                  value={newGuardianForm.nombre_completo} 
                  onChange={e => setNewGuardianForm({ ...newGuardianForm, nombre_completo: e.target.value })} 
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono / WhatsApp *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej: 3101234567"
                    value={newGuardianForm.telefono} 
                    onChange={e => setNewGuardianForm({ ...newGuardianForm, telefono: e.target.value })} 
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Parentesco</label>
                  <select 
                    value={newGuardianForm.parentesco} 
                    onChange={e => setNewGuardianForm({ ...newGuardianForm, parentesco: e.target.value })} 
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
                  >
                    <option value="Madre">Madre</option>
                    <option value="Padre">Padre</option>
                    <option value="Abuela / Abuelo">Abuela / Abuelo</option>
                    <option value="Tía / Tío">Tía / Tío</option>
                    <option value="Hermana / Hermano">Hermana / Hermano</option>
                    <option value="Tutor Legal">Tutor Legal</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dirección de Residencia *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej: Cra 8 # 12-34 Barrio Centro"
                  value={newGuardianForm.direccion} 
                  onChange={e => setNewGuardianForm({ ...newGuardianForm, direccion: e.target.value })} 
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" 
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateGuardianModal(false)} 
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 font-bold text-sm"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isCreatingGuardian}
                  className="px-5 py-2.5 bg-[#fc7609] text-white font-bold rounded-xl shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isCreatingGuardian ? 'Guardando...' : 'Guardar y Asignar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown hack */}
      {showDropdown && <div className="fixed inset-0 z-0" onClick={() => setShowDropdown(false)}></div>}
    </div>
  );
}
