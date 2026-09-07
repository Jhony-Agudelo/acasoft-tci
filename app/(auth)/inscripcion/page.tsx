"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, GraduationCap } from 'lucide-react';
import { EnrollmentForm } from '@/components/public/EnrollmentForm';
import { Student, Guardian } from '@/lib/db-schema';
import { getStudents } from '@/lib/actions/student.actions';
import { getSettings } from '@/lib/actions/settings.actions';

export default function InscripcionPage() {
  const [dbStudents, setDbStudents] = useState<Student[]>([]);
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publicEnrollmentSuccess, setPublicEnrollmentSuccess] = useState<boolean>(false);
  const [registeredStudentInfo, setRegisteredStudentInfo] = useState<{ student: Student; guardian: Guardian } | null>(null);

  useEffect(() => {
    Promise.all([getStudents(), getSettings()]).then(([students, settings]) => {
      setDbStudents(students);
      setEnrollmentOpen(settings?.enrollment_open ?? false);
      setLoading(false);
    });
  }, []);

  const handleEnrollmentSuccess = (student: Student, guardian: Guardian) => {
    setRegisteredStudentInfo({ student, guardian });
    setPublicEnrollmentSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-slate-500 font-bold">Cargando formulario...</div>;
  }

  return (
    <>
      {publicEnrollmentSuccess ? (
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 font-display mb-2">¡Inscripción Exitosa!</h2>
          <p className="text-slate-500 mb-6">Hemos registrado los datos de manera relacional en el sistema.</p>
          {registeredStudentInfo && (
            <div className="bg-slate-50 p-6 rounded-2xl text-left border border-slate-100 mb-8 inline-block w-full max-w-md mx-auto">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Detalles del Registro</p>
              <div className="space-y-2 text-sm font-medium">
                <p className="text-slate-700 flex justify-between">
                  <span className="text-slate-500">Estudiante:</span>
                  <span>{registeredStudentInfo.student.nombres} {registeredStudentInfo.student.apellidos}</span>
                </p>
                <p className="text-slate-700 flex justify-between">
                  <span className="text-slate-500">Documento:</span>
                  <span className="font-mono">{registeredStudentInfo.student.documento_identidad}</span>
                </p>
                <p className="text-slate-700 flex justify-between">
                  <span className="text-slate-500">Acudiente:</span>
                  <span>{registeredStudentInfo.guardian.nombre_completo}</span>
                </p>
              </div>
            </div>
          )}
          <Link href="/login" className="inline-block px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors shadow-lg">
            Ir al Inicio de Sesión
          </Link>
        </div>
      ) : enrollmentOpen ? (
        <EnrollmentForm onSuccess={handleEnrollmentSuccess} dbStudents={dbStudents} />
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center shadow-xl border border-slate-100 max-w-md mx-auto">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 font-display mb-2">Inscripciones Cerradas</h3>
          <p className="text-slate-500 text-sm">El proceso de matrícula pública no está disponible en este momento. Por favor contacte a la administración del Taller Creativo De Inglés.</p>
        </div>
      )}
    </>
  );
}
