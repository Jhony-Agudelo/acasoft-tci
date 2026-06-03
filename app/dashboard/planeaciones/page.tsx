"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, PlusCircle, Search, Trash2, Edit, Check, X, Bookmark } from 'lucide-react';
import { LessonPlan } from '@/lib/db-schema';
import { getLessonPlanTemplates, saveLessonPlan, deleteLessonPlan } from '@/lib/actions/lesson_plan.actions';
import { toast } from 'sonner';

export default function PlaneacionesPage() {
  const [templates, setTemplates] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'Basico' | 'Intermedio' | 'Avanzado' | 'Todos'>('Todos');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    topic: '',
    description: '',
    level: 'Basico' as 'Basico' | 'Intermedio' | 'Avanzado',
  });
  const [resources, setResources] = useState<Array<{ type: string; url: string; title: string }>>([]);

  const loadTemplates = async () => {
    setLoading(true);
    const data = await getLessonPlanTemplates();
    setTemplates(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleOpenModal = (plan?: LessonPlan) => {
    if (plan) {
      setEditId(plan.id);
      setForm({
        topic: plan.topic,
        description: plan.description,
        level: (plan.level as 'Basico' | 'Intermedio' | 'Avanzado') || 'Basico',
      });
      setResources(plan.resources || []);
    } else {
      setEditId(null);
      setForm({ topic: '', description: '', level: 'Basico' });
      setResources([]);
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic || !form.description) {
      toast.error('Tema y descripción son obligatorios.');
      return;
    }

    setIsSubmitting(true);
    const newPlan: LessonPlan = {
      id: editId || `tpl_${Date.now()}`,
      topic: form.topic,
      description: form.description,
      level: form.level,
      resources: resources,
    };

    const success = await saveLessonPlan(newPlan);
    if (success) {
      toast.success(editId ? 'Plantilla actualizada' : 'Plantilla guardada exitosamente');
      setShowModal(false);
      loadTemplates();
    } else {
      toast.error('Error al guardar la plantilla');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta plantilla del banco de planeaciones?')) {
      const success = await deleteLessonPlan(id);
      if (success) {
        toast.success('Plantilla eliminada');
        setTemplates(templates.filter(t => t.id !== id));
      } else {
        toast.error('Error al eliminar');
      }
    }
  };

  const addResource = () => {
    setResources([...resources, { type: 'video', url: '', title: '' }]);
  };

  const updateResource = (idx: number, field: string, value: string) => {
    const newR = [...resources];
    newR[idx] = { ...newR[idx], [field]: value };
    setResources(newR);
  };

  const removeResource = (idx: number) => {
    setResources(resources.filter((_, i) => i !== idx));
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.topic.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'Todos' || t.level === activeTab;
    return matchesSearch && matchesTab;
  });

  if (loading) return <div className="p-10 font-bold text-slate-500 text-center">Cargando planeaciones...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 font-display">Banco de Planeaciones</h2>
          <p className="text-slate-500 text-sm mt-1">Crea y administra plantillas maestras para asignar a los cursos.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="h-5 w-5" />
          Nueva Planeación
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por tema..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none text-sm font-medium text-slate-700"
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['Todos', 'Basico', 'Intermedio', 'Avanzado'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === tab ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'Todos' ? 'Todos' : tab.replace('Basico', 'Básico')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full bg-white p-10 text-center rounded-3xl border border-slate-100 shadow-sm text-slate-400 font-medium">
            No hay planeaciones guardadas para esta categoría.
          </div>
        ) : (
          filteredTemplates.map(plan => (
            <div key={plan.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col h-full overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Bookmark className="h-5 w-5" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                    ${plan.level === 'Avanzado' ? 'bg-purple-100 text-purple-700' : 
                      plan.level === 'Intermedio' ? 'bg-orange-100 text-orange-700' : 
                      'bg-blue-100 text-blue-700'}`}>
                    {plan.level || 'Básico'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 font-display mb-2 line-clamp-2">
                  {plan.topic}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-3 mb-4">
                  {plan.description}
                </p>
                <div className="mt-auto border-t border-slate-100 pt-4 flex gap-2 text-xs font-bold text-slate-400">
                  <span>{plan.resources?.length || 0} Recursos adjuntos</span>
                </div>
              </div>
              <div className="bg-slate-50 border-t border-slate-100 p-3 flex gap-2 mt-auto">
                <button 
                  onClick={() => handleOpenModal(plan)}
                  className="flex-1 bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-emerald-600 py-2 rounded-lg text-xs font-bold transition-colors flex justify-center items-center gap-1.5"
                >
                  <Edit className="h-3.5 w-3.5" /> Editar
                </button>
                <button 
                  onClick={() => handleDelete(plan.id)}
                  className="bg-white hover:bg-red-50 border border-slate-200 text-slate-400 hover:text-red-500 px-3 rounded-lg transition-colors flex justify-center items-center"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
              <h3 className="font-extrabold text-xl text-slate-800 font-display flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-emerald-500" /> 
                {editId ? 'Editar Planeación' : 'Nueva Planeación'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tema / Título *</label>
                  <input type="text" required value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nivel</label>
                  <select value={form.level} onChange={e => setForm({...form, level: e.target.value as any})} className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium">
                    <option value="Basico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción e Instrucciones *</label>
                <textarea required rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-sm" placeholder="Instrucciones para el maestro, resumen de la clase..."></textarea>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Recursos Adjuntos</label>
                  <button type="button" onClick={addResource} className="text-xs font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
                    <PlusCircle className="h-3 w-3" /> Agregar Recurso
                  </button>
                </div>
                <div className="space-y-3">
                  {resources.map((res, idx) => (
                    <div key={idx} className="flex gap-2 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex-1 space-y-2">
                        <input type="text" placeholder="Título (ej. Video de Youtube)" value={res.title} onChange={e => updateResource(idx, 'title', e.target.value)} className="w-full p-2 text-xs border border-slate-200 rounded-lg" required />
                        <div className="flex gap-2">
                          <select value={res.type} onChange={e => updateResource(idx, 'type', e.target.value)} className="p-2 text-xs border border-slate-200 rounded-lg w-28 shrink-0">
                            <option value="video">Video</option>
                            <option value="link">Enlace</option>
                            <option value="document">Doc</option>
                          </select>
                          <input type="url" placeholder="URL (https://...)" value={res.url} onChange={e => updateResource(idx, 'url', e.target.value)} className="w-full p-2 text-xs border border-slate-200 rounded-lg" required />
                        </div>
                      </div>
                      <button type="button" onClick={() => removeResource(idx)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {resources.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4 italic border-2 border-dashed border-slate-100 rounded-xl">No hay recursos adjuntos</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2 transition-colors">
                  <Check className="h-4 w-4" /> {isSubmitting ? 'Guardando...' : 'Guardar Plantilla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
