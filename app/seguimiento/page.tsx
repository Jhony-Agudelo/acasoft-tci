"use client";

import React, { useState } from 'react';
import { Search, Video, FileText, ArrowRight, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { Student, TrackingVideo } from '@/lib/db-schema';
import Image from 'next/image';
import logoApp from '@/assets/img/logoApp.png';

// Server Action call (We will create this next)
import { getStudentByDocument, getStudentVideos } from './actions';

export default function PublicSeguimientoPage() {
  const [documento, setDocumento] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [videos, setVideos] = useState<TrackingVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documento.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const foundStudent = await getStudentByDocument(documento.trim());
      if (!foundStudent) {
        setError('No se encontró ningún estudiante con ese documento.');
        setIsLoading(false);
        return;
      }
      
      const foundVideos = await getStudentVideos(foundStudent.id);
      setStudent(foundStudent);
      setVideos(foundVideos);
    } catch (err) {
      setError('Ocurrió un error al buscar la información.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper para convertir enlaces de Drive a formato embed
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('drive.google.com/file/d/')) {
      // Extraer el ID del archivo
      const match = url.match(/\/d\/(.*?)\//);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    return null; // Si no es drive embebible, retorna null
  };

  if (student) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 font-sans">
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => { setStudent(null); setDocumento(''); }}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200"
            >
              <ArrowLeft className="h-4 w-4" /> Volver
            </button>
            <Image src={logoApp} alt="TCI Logo" width={50} height={50} className="object-contain drop-shadow-sm" priority />
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-[#fc7609] to-orange-500 p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {student.avatar_url ? (
                    <img src={student.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-md" />
                  ) : (
                    <div className="w-16 h-16 rounded-full border-2 border-white bg-orange-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {student.nombres.charAt(0)}{student.apellidos.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-orange-100 font-bold uppercase tracking-widest text-xs mb-1">Seguimiento Académico</p>
                    <h1 className="text-3xl font-extrabold font-display">{student.nombres} {student.apellidos}</h1>
                  </div>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/30 text-center">
                  <p className="text-xs text-orange-50 uppercase tracking-wider font-bold">Grado</p>
                  <p className="font-bold">{student.curso_actual}</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                <Video className="h-6 w-6 text-[#fc7609]" />
                Historial de Videos
              </h2>
              
              {videos.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Aún no hay videos de seguimiento disponibles.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map(video => {
                    const embedUrl = getEmbedUrl(video.video_url);
                    const isExpanded = expandedVideoId === video.id;
                    
                    return (
                      <div key={video.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-orange-300">
                        <button 
                          onClick={() => setExpandedVideoId(isExpanded ? null : video.id)}
                          className="w-full p-4 bg-slate-50 flex justify-between items-center text-left hover:bg-orange-50/50 transition-colors"
                        >
                          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            {video.title}
                          </h3>
                          <div className="text-[#fc7609] bg-orange-100 px-3 py-1 rounded-full text-xs font-bold uppercase">
                            {isExpanded ? 'Ocultar' : 'Ver Video'}
                          </div>
                        </button>
                        
                        {isExpanded && (
                          <div className="p-1 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                            {embedUrl ? (
                              <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden">
                                <iframe 
                                  src={embedUrl} 
                                  className="absolute top-0 left-0 w-full h-full border-0" 
                                  allow="autoplay"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            ) : (
                              <div className="p-8 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl m-3 border border-slate-200 border-dashed">
                                <Video className="h-12 w-12 text-[#fc7609] mb-4 opacity-50" />
                                <p className="text-slate-600 font-medium mb-4 max-w-md">Este video está alojado en Google Photos o en un formato protegido. Haz clic en el botón para abrirlo de forma segura.</p>
                                <a 
                                  href={video.video_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-[#fc7609] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/30 transition-transform active:scale-95"
                                >
                                  Ver Video <ArrowRight className="h-4 w-4" />
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de Login
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans selection:bg-orange-100 selection:text-orange-900">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-8 flex flex-col items-center text-center border-b border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100">
          <Image src={logoApp} alt="TCI Logo" width={80} height={80} className="mb-4 drop-shadow-md" priority />
          <h1 className="text-2xl font-extrabold text-slate-800 font-display">Portal de Padres</h1>
          <p className="text-slate-500 text-sm mt-2">Consulta los videos de seguimiento académico de tu hijo(a).</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-400" />
              Documento del Estudiante
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={documento}
                onChange={e => setDocumento(e.target.value)}
                placeholder="Ingresa el número de documento"
                className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:border-[#fc7609] focus:ring-4 focus:ring-[#fc7609]/10 outline-none transition-all font-bold text-slate-700 text-lg"
                autoComplete="off"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
            </div>
            {error && <p className="text-rose-500 text-xs font-bold mt-2 flex items-center gap-1">*{error}</p>}
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#fc7609] to-orange-500 hover:to-orange-400 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Buscando...' : 'Acceder al Seguimiento'}
            {!isLoading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
}
