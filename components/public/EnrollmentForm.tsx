"use client";

import React, { useState } from 'react';
import { BookOpen, MapPin, Phone, User as UserIcon, Calendar, GraduationCap, ChevronRight, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Student, Guardian, SchoolDayPeriod, COLEGIOS_LA_VIRGINIA, StudentStatus } from '@/lib/db-schema';
import { toast } from 'sonner';

interface EnrollmentFormProps {
  onSuccess: (student: Student, guardian: Guardian) => void;
  dbStudents: Student[];
}

export function EnrollmentForm({ onSuccess, dbStudents }: EnrollmentFormProps) {
  const [form, setForm] = useState({
    documento_identidad: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    edad: 8,
    colegio_origen: COLEGIOS_LA_VIRGINIA[0],
    grado_escolar: 'Primero',
    curso_actual: 'Kids Starter (Nivel A1.1)',
    jornada_escolar: SchoolDayPeriod.TARDE,
    guardian_nombre_completo: '',
    guardian_direccion: '',
    guardian_telefono: '',
    guardian_parentesco: 'Madre',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.documento_identidad || !form.nombres || !form.apellidos || !form.guardian_nombre_completo || !form.guardian_direccion || !form.guardian_telefono) {
      toast.error('Por favor complete todos los datos obligatorios.');
      return;
    }

    const duplicate = dbStudents.find((s) => s.documento_identidad === form.documento_identidad);
    if (duplicate) {
      toast.error('Ya existe un estudiante registrado con este Documento de Identidad.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          course_id: null,
          payment_deadline_date: '2026-06-30',
          clientStudents: dbStudents,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al procesar inscripción');
      }

      onSuccess(data.student, data.guardian);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
        <h3 className="font-display font-extrabold text-slate-800 flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#fc7609] flex items-center justify-center">
            <UserIcon className="w-4 h-4" />
          </div>
          1. Datos del Estudiante
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Documento de Identidad (TI/RC/CC) *</label>
            <input type="text" required value={form.documento_identidad} onChange={(e) => setForm({ ...form, documento_identidad: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700" placeholder="Ej: 1088123456" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Nombres *</label>
            <input type="text" required value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700" placeholder="Nombres del estudiante" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Apellidos *</label>
            <input type="text" required value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700" placeholder="Apellidos del estudiante" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fecha de Nacimiento</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="date" value={form.fecha_nacimiento} onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Edad Actual</label>
            <input type="number" min="4" max="99" value={form.edad} onChange={(e) => setForm({ ...form, edad: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700" />
          </div>
        </div>
      </div>

      {/* Info Académica */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
        <h3 className="font-display font-extrabold text-slate-800 flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          2. Información Académica
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Colegio de Origen (La Virginia)</label>
            <select value={form.colegio_origen} onChange={(e) => setForm({ ...form, colegio_origen: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700">
              {COLEGIOS_LA_VIRGINIA.map(col => <option key={col} value={col}>{col}</option>)}
              <option value="Otro">Otro / Fuera del Municipio</option>
            </select>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Año o Grado Escolar</label>
            <select value={form.grado_escolar} onChange={(e) => setForm({ ...form, grado_escolar: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700">
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
            </select>
          </div>
        </div>
      </div>

      {/* Datos del Acudiente */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
        <h3 className="font-display font-extrabold text-slate-800 flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          3. Datos del Acudiente Principal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Nombre Completo del Acudiente *</label>
            <input type="text" required value={form.guardian_nombre_completo} onChange={(e) => setForm({ ...form, guardian_nombre_completo: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700" placeholder="Ej: María Rodríguez" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Dirección de Residencia *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" required value={form.guardian_direccion} onChange={(e) => setForm({ ...form, guardian_direccion: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700" placeholder="Barrio / Conjunto / Calle" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Teléfono / WhatsApp *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="tel" required value={form.guardian_telefono} onChange={(e) => setForm({ ...form, guardian_telefono: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700" placeholder="320 123 4567" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Parentesco</label>
            <select value={form.guardian_parentesco} onChange={(e) => setForm({ ...form, guardian_parentesco: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700">
              <option value="Madre">Madre</option>
              <option value="Padre">Padre</option>
              <option value="Abuelo/a">Abuelo/a</option>
              <option value="Tío/a">Tío/a</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
        <div className="mt-0.5">
          <input type="checkbox" required className="w-4 h-4 text-[#fc7609] border-slate-300 rounded focus:ring-[#fc7609]" />
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Declaro que la información ingresada es verídica y autorizo el tratamiento de mis datos personales para fines institucionales en el Taller Creativo De Inglés - TCI.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-[#fc7609] to-orange-500 hover:to-orange-400 text-white rounded-xl font-bold font-display shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Procesando...' : (
          <>
            <span>Enviar Formulario de Inscripción</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
