"use client";

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface WhatsAppShareButtonsProps {
  variant?: 'navbar' | 'sidebar' | 'footer' | 'pill';
  className?: string;
}

export function WhatsAppShareButtons({ variant = 'navbar', className = '' }: WhatsAppShareButtonsProps) {
  const [copiedType, setCopiedType] = useState<'inscripcion' | 'seguimiento' | null>(null);

  const getShareData = (type: 'inscripcion' | 'seguimiento') => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (type === 'inscripcion') {
      const url = `${origin}/inscripcion`;
      const message = `¡Hola! 👋 Te comparto el enlace para el formulario oficial de inscripción en TCI - Taller Creativo de Inglés 🎨📚:\n${url}`;
      return { title: 'Inscripciones', url, message };
    } else {
      const url = `${origin}/seguimiento`;
      const message = `¡Hola! 👋 Te comparto el enlace para consultar el portal de seguimiento académico en TCI - Taller Creativo de Inglés 📊✨:\n${url}`;
      return { title: 'Seguimiento', url, message };
    }
  };

  const handleShareWhatsApp = (type: 'inscripcion' | 'seguimiento') => {
    const { url, message, title } = getShareData(type);
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    toast.success(`Abriendo WhatsApp y enlace de ${title.toLowerCase()} copiado al portapapeles.`);
  };

  const handleCopyLink = (type: 'inscripcion' | 'seguimiento', e: React.MouseEvent) => {
    e.stopPropagation();
    const { url, title } = getShareData(type);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
    toast.success(`¡Enlace de ${title.toLowerCase()} copiado al portapapeles!`);
  };

  if (variant === 'sidebar') {
    return (
      <div className={`p-3 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-orange-50/30 rounded-2xl border border-emerald-100/90 space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
            Compartir Enlaces
          </span>
          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
            WhatsApp
          </span>
        </div>

        <div className="space-y-1.5">
          {/* Inscripciones item */}
          <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-100 shadow-2xs hover:border-emerald-300 transition-all group">
            <button
              onClick={() => handleShareWhatsApp('inscripcion')}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 group-hover:text-emerald-700 transition-colors flex-1 text-left"
              title="Compartir link de inscripciones por WhatsApp"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="truncate">Inscripciones</span>
            </button>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleShareWhatsApp('inscripcion')}
                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Compartir por WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => handleCopyLink('inscripcion', e)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Copiar enlace"
              >
                {copiedType === 'inscripcion' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Seguimiento item */}
          <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-100 shadow-2xs hover:border-blue-300 transition-all group">
            <button
              onClick={() => handleShareWhatsApp('seguimiento')}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 group-hover:text-blue-700 transition-colors flex-1 text-left"
              title="Compartir link de seguimiento por WhatsApp"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
              <span className="truncate">Seguimiento</span>
            </button>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleShareWhatsApp('seguimiento')}
                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Compartir por WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => handleCopyLink('seguimiento', e)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Copiar enlace"
              >
                {copiedType === 'seguimiento' ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 ${className}`}>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 font-display">
          <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
          <span>Compartir enlaces por WhatsApp:</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón Inscripciones */}
          <div className="inline-flex items-center rounded-xl bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 transition-all shadow-2xs overflow-hidden group">
            <button
              onClick={() => handleShareWhatsApp('inscripcion')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
              title="Compartir enlace de inscripciones por WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Inscripciones</span>
            </button>
            <div className="w-px h-3.5 bg-emerald-200" />
            <button
              onClick={(e) => handleCopyLink('inscripcion', e)}
              className="p-1.5 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-200/60 transition-colors"
              title="Copiar enlace de inscripciones"
            >
              {copiedType === 'inscripcion' ? (
                <Check className="w-3.5 h-3.5 text-emerald-700" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Botón Seguimiento */}
          <div className="inline-flex items-center rounded-xl bg-blue-50 hover:bg-blue-100/90 border border-blue-200/90 transition-all shadow-2xs overflow-hidden group">
            <button
              onClick={() => handleShareWhatsApp('seguimiento')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-800 hover:text-blue-950 transition-colors"
              title="Compartir enlace de seguimiento por WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Seguimiento</span>
            </button>
            <div className="w-px h-3.5 bg-blue-200" />
            <button
              onClick={(e) => handleCopyLink('seguimiento', e)}
              className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-200/60 transition-colors"
              title="Copiar enlace de seguimiento"
            >
              {copiedType === 'seguimiento' ? (
                <Check className="w-3.5 h-3.5 text-blue-700" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default 'navbar' variant
  return (
    <div className={`flex items-center gap-1.5 sm:gap-2.5 ${className}`}>
      {/* Botón Inscripciones */}
      <div className="inline-flex items-center rounded-xl bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 transition-all shadow-2xs overflow-hidden group">
        <button
          onClick={() => handleShareWhatsApp('inscripcion')}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
          title="Compartir link de inscripciones por WhatsApp"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] sm:text-xs">Inscripciones</span>
        </button>
        <div className="w-px h-3.5 bg-emerald-200" />
        <button
          onClick={(e) => handleCopyLink('inscripcion', e)}
          className="p-1.5 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-200/60 transition-colors"
          title="Copiar enlace de inscripciones"
        >
          {copiedType === 'inscripcion' ? (
            <Check className="w-3 h-3 text-emerald-700" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Botón Seguimiento */}
      <div className="inline-flex items-center rounded-xl bg-blue-50 hover:bg-blue-100/90 border border-blue-200/90 transition-all shadow-2xs overflow-hidden group">
        <button
          onClick={() => handleShareWhatsApp('seguimiento')}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-blue-800 hover:text-blue-950 transition-colors"
          title="Compartir link de seguimiento por WhatsApp"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] sm:text-xs">Seguimiento</span>
        </button>
        <div className="w-px h-3.5 bg-blue-200" />
        <button
          onClick={(e) => handleCopyLink('seguimiento', e)}
          className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-200/60 transition-colors"
          title="Copiar enlace de seguimiento"
        >
          {copiedType === 'seguimiento' ? (
            <Check className="w-3 h-3 text-blue-700" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  );
}
