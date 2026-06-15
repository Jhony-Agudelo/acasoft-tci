"use client";

import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Video, Trash2, ExternalLink } from 'lucide-react';
import { Student, TrackingVideo } from '@/lib/db-schema';
import { getStudents } from '@/lib/actions/student.actions';
import { getTrackingVideos, saveTrackingVideo, deleteTrackingVideo } from '@/lib/actions/tracking.actions';
import { toast } from 'sonner';

export default function SeguimientoPage() {
  const [dbStudents, setDbStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentVideos, setStudentVideos] = useState<TrackingVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  // New Video Form
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getStudents().then((students) => {
      setDbStudents(students);
      setLoading(false);
    });
  }, []);

  const handleSelectStudent = async (student: Student) => {
    setSelectedStudent(student);
    setIsLoadingVideos(true);
    try {
      const videos = await getTrackingVideos(student.id);
      setStudentVideos(videos as TrackingVideo[]);
    } catch (error) {
      toast.error('Error cargando videos.');
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    if (!newTitle.trim() || !newUrl.trim()) {
      toast.error('Completa el título y el enlace.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newVideo: TrackingVideo = {
        id: `trk_${Date.now()}`,
        student_id: selectedStudent.id,
        title: newTitle.trim(),
        video_url: newUrl.trim()
      };
      
      const saved = await saveTrackingVideo(newVideo);
      setStudentVideos([saved as TrackingVideo, ...studentVideos]);
      setNewTitle('');
      setNewUrl('');
      toast.success('Video añadido correctamente.');
    } catch (error) {
      toast.error('Error al guardar el video.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este video?')) return;
    
    try {
      await deleteTrackingVideo(id);
      setStudentVideos(studentVideos.filter(v => v.id !== id));
      toast.success('Video eliminado.');
    } catch (error) {
      toast.error('Error al eliminar.');
    }
  };

  const filteredStudents = dbStudents.filter(s => 
    s.nombres.toLowerCase().includes(search.toLowerCase()) || 
    s.apellidos.toLowerCase().includes(search.toLowerCase()) ||
    s.documento_identidad.includes(search)
  ).sort((a, b) => a.nombres.localeCompare(b.nombres));

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Cargando módulo de seguimiento...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 font-display">Videos de Seguimiento</h2>
        <p className="text-slate-500 text-sm mt-1">Configura los enlaces de videos mensuales (Drive/Photos) para cada estudiante.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lado izquierdo: Lista de estudiantes */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:col-span-1 flex flex-col h-[600px]">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar estudiante..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#fc7609]/20 focus:outline-none"
            />
          </div>
          <div className="overflow-y-auto flex-1 space-y-2 pr-1">
            {filteredStudents.map(student => (
              <button
                key={student.id}
                onClick={() => handleSelectStudent(student)}
                className={`w-full text-left p-3 rounded-xl border transition-colors flex items-center justify-between
                  ${selectedStudent?.id === student.id 
                    ? 'bg-orange-50 border-orange-200 text-[#fc7609]' 
                    : 'bg-slate-50 border-transparent hover:bg-slate-100 text-slate-700'
                  }`}
              >
                <div>
                  <p className="font-bold text-sm line-clamp-1">{student.nombres} {student.apellidos}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{student.documento_identidad}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lado derecho: Gestión de videos del estudiante */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:col-span-2">
          {!selectedStudent ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Video className="h-12 w-12 mb-4 text-slate-300" />
              <p className="font-medium text-center">Selecciona un estudiante de la lista<br/>para gestionar sus videos.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-extrabold text-xl text-slate-800">
                  {selectedStudent.nombres} {selectedStudent.apellidos}
                </h3>
                <p className="text-slate-500 text-sm">Gestionando videos de seguimiento</p>
              </div>

              {/* Formulario Añadir */}
              <form onSubmit={handleAddVideo} className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título / Mes</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Junio 2026" 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div className="flex-1 w-full sm:flex-[2]">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Enlace (URL)</label>
                  <input 
                    type="url" 
                    placeholder="https://drive.google.com/... o https://photos.app.goo.gl/..." 
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#fc7609] hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
                >
                  <PlusCircle className="h-4 w-4" /> Añadir
                </button>
              </form>

              {/* Lista de Videos */}
              <div className="flex-1">
                <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide">Historial de Videos</h4>
                {isLoadingVideos ? (
                  <p className="text-sm text-slate-500 italic">Cargando...</p>
                ) : studentVideos.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 text-center">
                    <p className="text-slate-500 text-sm">No hay videos registrados para este estudiante.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {studentVideos.map(video => (
                      <div key={video.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-orange-200 transition-colors">
                        <div>
                          <p className="font-bold text-slate-800">{video.title}</p>
                          <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1">
                            <ExternalLink className="h-3 w-3" /> Abrir enlace original
                          </a>
                        </div>
                        <button 
                          onClick={() => handleDeleteVideo(video.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Eliminar Video"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
