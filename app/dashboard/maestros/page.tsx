"use client";

import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit, Users, X, ArrowRight } from 'lucide-react';
import { User, UserRole, UserStatus } from '@/lib/db-schema';
import { getUsers, saveUser } from '@/lib/actions/user.actions';
import { toast } from 'sonner';
import { EditTeacherModal } from '@/components/teachers/TeacherModals';

export default function MaestrosPage() {
  const [dbUsers, setDbUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newTeacherForm, setNewTeacherForm] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: 'teacher123',
    telefono: '',
    documento_identidad: '',
    fecha_nacimiento: '',
    direccion: '',
    contacto_emergencia: '',
    parentesco_contacto: '',
  });

  useEffect(() => {
    getUsers().then(users => {
      setDbUsers(users);
      setLoading(false);
    });
  }, []);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherForm.nombres || !newTeacherForm.apellidos || !newTeacherForm.email) {
      toast.error('Complete los campos obligatorios del maestro.');
      return;
    }

    try {
      const response = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTeacherForm, clientUsers: dbUsers }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Error al crear maestro.');
        return;
      }

      setDbUsers([...dbUsers, data.teacher]);
      setShowAddTeacherModal(false);
      setNewTeacherForm({
        nombres: '', apellidos: '', email: '', password: 'teacher123', telefono: '',
        documento_identidad: '', fecha_nacimiento: '', direccion: '', contacto_emergencia: '', parentesco_contacto: '',
      });
      toast.success('¡Maestro/a creado e insertado en la base de datos relacional con éxito!');
    } catch {
      toast.error('Error de red al procesar el maestro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTeacher = async (updatedTeacher: User) => {
    try {
      await saveUser(updatedTeacher);
      setDbUsers(dbUsers.map(u => u.id === updatedTeacher.id ? updatedTeacher : u));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTeachers = dbUsers.filter((u) => {
    const isTeacherRole = u.role === UserRole.TEACHER || u.role === UserRole.ADMIN || u.role === UserRole.DIRECTOR;
    const matchesSearch = u.nombres.toLowerCase().includes(userSearch.toLowerCase()) || u.apellidos.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    return isTeacherRole && matchesSearch;
  });

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Cargando maestros...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 font-display">Maestros y Usuarios</h2>
          <p className="text-slate-500 text-sm mt-1">Gestión de roles docentes, directivos y permisos de acceso al sistema.</p>
        </div>
        <button
          onClick={() => setShowAddTeacherModal(true)}
          className="bg-gradient-to-r from-[#fc7609] to-orange-500 hover:to-orange-400 text-white px-4 py-2.5 rounded-xl font-bold font-display shadow-lg shadow-orange-500/20 flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Registrar Docente / Admin</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo electrónico..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#fc7609]/20 focus:border-[#fc7609] focus:outline-none text-sm font-medium text-slate-700"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Rol / Permisos</th>
                <th className="px-6 py-4">Estado DB</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.map((user) => (
                <tr key={user.id} className="hover:bg-orange-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#fc7609] font-bold text-xs">
                        {user.nombres[0]}{user.apellidos[0]}
                      </div>
                      <div>
                        {user.nombres} {user.apellidos}
                        <div className="text-[10px] text-slate-500 font-normal">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-700 font-medium text-xs">{user.telefono || 'Sin teléfono'}</div>
                    <div className="text-[10px] text-slate-500">ID: {user.documento_identidad || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                      ${user.role === UserRole.DIRECTOR ? 'bg-purple-100 text-purple-700' :
                        user.role === UserRole.ADMIN ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                      ${user.status === UserStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {user.status === UserStatus.ACTIVE ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditTeacher(user)}
                      className="text-[#fc7609] hover:bg-orange-100 p-2 rounded-lg transition-colors font-semibold text-xs inline-flex items-center gap-1"
                    >
                      Editar <ArrowRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editTeacher && (
        <EditTeacherModal 
          teacher={editTeacher} 
          onClose={() => setEditTeacher(null)} 
          onSave={handleUpdateTeacher} 
        />
      )}

      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
              <h3 className="font-extrabold text-xl text-slate-800 font-display flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-[#fc7609]" /> Registrar Maestro / Admin
              </h3>
              <button onClick={() => setShowAddTeacherModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTeacher} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombres *</label>
                  <input type="text" required value={newTeacherForm.nombres} onChange={e => setNewTeacherForm({...newTeacherForm, nombres: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Apellidos *</label>
                  <input type="text" required value={newTeacherForm.apellidos} onChange={e => setNewTeacherForm({...newTeacherForm, apellidos: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email (Usuario) *</label>
                  <input type="email" required value={newTeacherForm.email} onChange={e => setNewTeacherForm({...newTeacherForm, email: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña por Defecto</label>
                  <input type="text" value={newTeacherForm.password} readOnly className="w-full p-2 border border-slate-200 rounded-xl bg-slate-100 text-slate-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                  <input type="text" value={newTeacherForm.telefono} onChange={e => setNewTeacherForm({...newTeacherForm, telefono: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Documento de Identidad</label>
                  <input type="text" value={newTeacherForm.documento_identidad} onChange={e => setNewTeacherForm({...newTeacherForm, documento_identidad: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha de Nacimiento</label>
                  <input type="date" value={newTeacherForm.fecha_nacimiento} onChange={e => setNewTeacherForm({...newTeacherForm, fecha_nacimiento: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dirección Residencial</label>
                  <input type="text" value={newTeacherForm.direccion} onChange={e => setNewTeacherForm({...newTeacherForm, direccion: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contacto de Emergencia</label>
                  <input type="text" value={newTeacherForm.contacto_emergencia} onChange={e => setNewTeacherForm({...newTeacherForm, contacto_emergencia: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Parentesco del Contacto</label>
                  <input type="text" value={newTeacherForm.parentesco_contacto} onChange={e => setNewTeacherForm({...newTeacherForm, parentesco_contacto: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddTeacherModal(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-[#fc7609] text-white font-bold rounded-xl shadow-lg disabled:opacity-50">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
