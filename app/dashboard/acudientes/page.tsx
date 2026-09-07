"use client";

import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit, ShieldCheck, X, User as UserIcon, Link2, ExternalLink, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Student, Guardian } from '@/lib/db-schema';
import { getStudents, saveStudent } from '@/lib/actions/student.actions';
import { getGuardians, saveGuardian } from '@/lib/actions/guardian.actions';
import { toast } from 'sonner';
import { EditGuardianModal } from '@/components/guardians/GuardianModals';
import Link from 'next/link';

export default function AcudientesPage() {
  const [dbStudents, setDbStudents] = useState<Student[]>([]);
  const [dbGuardians, setDbGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');

  // Filters
  const [guardianSearch, setGuardianSearch] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Modals
  const [editGuardian, setEditGuardian] = useState<Guardian | null | 'NEW'>(null);

  useEffect(() => {
    Promise.all([getStudents(), getGuardians()]).then(([students, guardians]) => {
      setDbStudents(students);
      setDbGuardians(guardians);
      setLoading(false);
    });

    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setCurrentUserRole(data.user.role);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveGuardian = async (guardian: Guardian, assignedStudents: Student[]) => {
    try {
      await saveGuardian(guardian);
      
      // Update local state
      const isNew = !dbGuardians.find(g => g.id === guardian.id);
      if (isNew) {
        setDbGuardians([...dbGuardians, guardian]);
      } else {
        setDbGuardians(dbGuardians.map(g => g.id === guardian.id ? guardian : g));
      }

      // Update student assignments
      // Students assigned to this guardian
      const assignedIds = new Set(assignedStudents.map(s => s.id));
      
      // Update all students locally and in DB
      const updatedStudents = [...dbStudents];
      
      for (let i = 0; i < updatedStudents.length; i++) {
        const s = updatedStudents[i];
        if (assignedIds.has(s.id)) {
          if (s.guardian_id !== guardian.id) {
            s.guardian_id = guardian.id;
            await saveStudent(s);
          }
        } else {
          // If a student was previously assigned to this guardian but is no longer in the list, 
          // we might want to warn or leave them without a guardian? Actually, the UI should only ADD or REMOVE.
          // If we remove them from this guardian, they become orphaned (which our DB schema might allow or not, wait, guardian_id is required!).
          // So in the UI we should probably only allow ADDING students to a guardian.
          // Or if we remove, we don't allow saving if they are orphaned?
          // For simplicity, let's just make the modal handle updating the student's guardian_id.
        }
      }
      
      setDbStudents(updatedStudents);
      setEditGuardian(null);
      toast.success(isNew ? 'Acudiente registrado exitosamente' : 'Acudiente actualizado exitosamente');
    } catch (error) {
      toast.error('Error al guardar el acudiente');
    }
  };

  const handleDeleteGuardian = async (guardianId: string) => {
    try {
      const { deleteGuardian } = await import('@/lib/actions/guardian.actions');
      const success = await deleteGuardian(guardianId);
      if (success) {
        setDbGuardians(dbGuardians.filter(g => g.id !== guardianId));
        // Remove students associated locally to reflect cascade delete
        setDbStudents(dbStudents.filter(s => s.guardian_id !== guardianId));
        setEditGuardian(null);
        toast.success('Acudiente eliminado exitosamente.');
      } else {
        toast.error('No se pudo eliminar el acudiente.');
      }
    } catch (error) {
      toast.error('Error al intentar eliminar el acudiente.');
    }
  };

  const filteredGuardians = dbGuardians.filter((guardian) => {
    return guardian.nombre_completo.toLowerCase().includes(guardianSearch.toLowerCase()) || guardian.telefono.includes(guardianSearch);
  }).sort((a, b) => a.nombre_completo.localeCompare(b.nombre_completo));

  useEffect(() => {
    setCurrentPage(1);
  }, [guardianSearch, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredGuardians.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGuardians = filteredGuardians.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Cargando datos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 font-display">Administración de Acudientes</h2>
          <p className="text-slate-500 text-sm mt-1">Gestión del directorio de padres, madres y tutores.</p>
        </div>
        <button
          onClick={() => setEditGuardian('NEW')}
          className="bg-gradient-to-r from-[#fc7609] to-orange-500 hover:to-orange-400 text-white px-4 py-2.5 rounded-xl font-bold font-display shadow-lg shadow-orange-500/20 flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Registrar Acudiente</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre completo o teléfono..."
            value={guardianSearch}
            onChange={(e) => setGuardianSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#fc7609]/20 focus:border-[#fc7609] focus:outline-none text-sm font-medium text-slate-700"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-600 text-sm">Directorio de Acudientes</h3>
          <span className="bg-orange-100 text-[#fc7609] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Total: {filteredGuardians.length} {filteredGuardians.length === 1 ? 'Acudiente' : 'Acudientes'}
          </span>
        </div>

        {/* Scrollable table container */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto relative">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10 shadow-2xs">
              <tr>
                <th className="px-6 py-4 bg-slate-50">Acudiente</th>
                <th className="px-6 py-4 bg-slate-50">Contacto</th>
                <th className="px-6 py-4 bg-slate-50">Estudiantes Asignados</th>
                <th className="px-6 py-4 bg-slate-50 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedGuardians.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic font-medium">
                    No se encontraron acudientes.
                  </td>
                </tr>
              ) : (
                paginatedGuardians.map((guardian) => {
                  const assignedStudents = dbStudents.filter(s => s.guardian_id === guardian.id);
                  return (
                    <tr key={guardian.id} className="hover:bg-orange-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-slate-400" />
                          {guardian.nombre_completo}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{guardian.parentesco}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-700 font-medium text-xs">{guardian.telefono}</div>
                        <div className="text-[10px] text-slate-500 max-w-[200px] truncate">{guardian.direccion}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {assignedStudents.length > 0 ? assignedStudents.map(s => (
                             <span key={s.id} className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md inline-block w-max">
                               {s.nombres} {s.apellidos}
                             </span>
                          )) : (
                            <span className="text-xs text-slate-400 italic">Ninguno</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setEditGuardian(guardian)}
                          className="text-[#fc7609] hover:bg-orange-100 p-2 rounded-lg transition-colors font-semibold text-xs inline-flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" /> Editar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginador */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Mostrando <span className="font-bold text-slate-800">{filteredGuardians.length > 0 ? startIndex + 1 : 0}</span> a <span className="font-bold text-slate-800">{Math.min(startIndex + itemsPerPage, filteredGuardians.length)}</span> de <span className="font-bold text-slate-800">{filteredGuardians.length}</span> acudientes
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

      {editGuardian && (
        <EditGuardianModal
          guardian={editGuardian === 'NEW' ? undefined : editGuardian}
          allStudents={dbStudents}
          canDelete={currentUserRole === 'ADMIN' || currentUserRole === 'DIRECTOR'}
          onClose={() => setEditGuardian(null)}
          onSave={handleSaveGuardian}
          onDelete={handleDeleteGuardian}
        />
      )}
    </div>
  );
}
