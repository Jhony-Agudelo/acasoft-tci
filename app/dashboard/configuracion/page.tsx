"use client";

import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { SystemSettings, INITIAL_SETTINGS } from '@/lib/db-schema';
import { getSettings, saveSettings } from '@/lib/actions/settings.actions';
import { toast } from 'sonner';

export default function ConfiguracionPage() {
  const [dbSettings, setDbSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [editedSettings, setEditedSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings().then(settings => {
      setDbSettings(settings);
      setEditedSettings(settings);
      setLoading(false);
    });
  }, []);

  const handleUpdateSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedSettings),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Error al guardar configuración.');
        return;
      }

      setDbSettings(data.settings);
      setEditedSettings(data.settings);
      toast.success('Configuración actualizada en PostgreSQL.');
    } catch {
      toast.error('Error de conexión.');
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Cargando configuración...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 font-display">Configuración del Sistema</h2>
        <p className="text-slate-500 text-sm mt-1">Ajustes globales, inscripciones y parámetros de la academia.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 max-w-2xl">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-[#fc7609]" /> Parámetros Generales
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div>
              <p className="font-bold text-slate-800 text-sm">Inscripciones Públicas</p>
              <p className="text-xs text-slate-500 mt-0.5">Permite a los padres registrar estudiantes desde la vista principal.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={editedSettings.enrollment_open}
                onChange={(e) => setEditedSettings({ ...editedSettings, enrollment_open: e.target.checked })}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#fc7609]"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
              Año Académico
            </label>
            <input
              type="text"
              value={editedSettings.academic_year}
              onChange={(e) => setEditedSettings({ ...editedSettings, academic_year: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
              Día Límite de Pago Mensual (Por Defecto)
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={editedSettings.default_payment_day}
              onChange={(e) => setEditedSettings({ ...editedSettings, default_payment_day: parseInt(e.target.value) || 15 })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">Este será el día de pago predeterminado al matricular un nuevo estudiante.</p>
          </div>

          <button
            onClick={handleUpdateSettings}
            className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
