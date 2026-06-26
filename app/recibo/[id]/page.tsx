"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { getPaymentById } from '@/lib/actions/payment.actions';
import { getStudentById } from '@/lib/actions/student.actions';
import { getGuardianById } from '@/lib/actions/guardian.actions';
import { Payment, Student, Guardian } from '@/lib/db-schema';
import { Printer, Download, CheckCircle } from 'lucide-react';
import logoApp from '@/assets/img/logoApp.png';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PublicReceiptPage() {
  const { id } = useParams() as { id: string };
  const [payment, setPayment] = useState<Payment | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [guardian, setGuardian] = useState<Guardian | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const p = await getPaymentById(id);
      if (p) {
        setPayment(p);
        const s = await getStudentById(p.student_id);
        setStudent(s);
        if (s && s.guardian_id) {
          const g = await getGuardianById(s.guardian_id);
          setGuardian(g);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!payment || !student || !receiptRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const allElements = clonedDoc.querySelectorAll('*');
          Array.from(allElements).forEach((el: any) => {
            const computed = clonedDoc.defaultView?.getComputedStyle(el);
            if (!computed) return;
            ['borderColor', 'backgroundColor', 'color', 'textDecorationColor', 'outlineColor', 'borderBottomColor', 'borderTopColor', 'borderLeftColor', 'borderRightColor'].forEach(prop => {
              if (computed[prop as any] && computed[prop as any].includes('oklch')) {
                el.style[prop] = prop === 'color' ? '#000000' : 'transparent';
              }
            });
          });
        }
      });
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = canvas.width / 2;
      const pdfHeight = canvas.height / 2;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [pdfWidth, pdfHeight] });
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Factura_TCI_${payment.id.split('_')[1]}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert('Hubo un error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-bold animate-pulse">Cargando recibo...</p>
      </div>
    );
  }

  if (!payment || !student) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="font-bold text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Recibo no encontrado</h2>
          <p className="text-slate-500 text-sm">El comprobante que buscas no existe o el enlace es incorrecto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      {/* Action Buttons */}
      <div className="max-w-[600px] w-full mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
          <p className="text-sm text-emerald-800 font-medium">
            El pago por <strong className="font-extrabold text-emerald-900">${payment.amount.toLocaleString('es-CO')}</strong> ha sido registrado exitosamente.
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="bg-[#fc7609] hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait shrink-0"
        >
          <Download className="h-5 w-5" />
          {downloading ? 'Generando PDF...' : 'Descargar PDF'}
        </button>
      </div>

      {/* Visual Receipt Wrapper */}
      <div className="w-full max-w-[600px] bg-white shadow-xl rounded-3xl overflow-hidden print:shadow-none border border-slate-100">

        {/* The actual element that is rendered into the PDF */}
        <div ref={receiptRef} className="bg-[#ffffff] text-[#1e293b] w-full h-auto relative flex flex-col" style={{ boxSizing: 'border-box', padding: '40px' }}>
          {/* HEADER */}
          <div className="flex flex-col items-center border-b-[3px] border-[#fc7609] pb-6 mb-8 text-center">
            <img src={logoApp.src} alt="TCI Logo" className="w-28 h-auto object-contain mb-4" />
            <h1 className="text-3xl font-extrabold text-[#fc7609] tracking-tight">TALLER CREATIVO</h1>
            <h2 className="text-xl font-bold text-[#334155] tracking-[0.2em] mt-1">DE INGLÉS</h2>
            <p className="text-[#64748b] mt-1 font-medium">NIT. 1.007.220.836</p>
          </div>

          {/* FACTURA INFO */}
          <div className="flex justify-between items-center bg-[#f8fafc] p-4 rounded-2xl mb-8 border border-[#f1f5f9]">
            <div>
              <p className="text-sm font-bold text-[#94a3b8] uppercase tracking-wider">Factura N°</p>
              <p className="text-xl font-extrabold text-[#1e293b]">{payment.id.split('_')[1]}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#94a3b8] uppercase tracking-wider">Fecha</p>
              <p className="text-lg font-bold text-[#475569]">{payment.payment_date}</p>
            </div>
          </div>

          {/* STUDENT INFO */}
          <div className="mb-8">
            <h3 className="text-lg font-extrabold text-[#1e293b] mb-4 border-b border-[#e2e8f0] pb-2">Información del Estudiante</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Nombre Completo</p>
                <p className="font-medium text-[#334155]">{student.nombres} {student.apellidos}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Documento</p>
                <p className="font-medium text-[#334155]">{student.documento_identidad}</p>
              </div>
              <div className="col-span-2 mt-2">
                <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Acudiente</p>
                <p className="font-medium text-[#334155]">
                  {guardian ? `${guardian.nombre_completo} (${guardian.parentesco})` : 'No registrado'}
                </p>
              </div>
            </div>
          </div>

          {/* PAYMENT DETAILS */}
          <div className="mb-8">
            <h3 className="text-lg font-extrabold text-[#1e293b] mb-4 border-b border-[#e2e8f0] pb-2">Detalles del Pago</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#e2e8f0]">
                  <th className="py-3 font-bold text-[#64748b] uppercase tracking-wider text-xs">Concepto</th>
                  <th className="py-3 font-bold text-[#64748b] uppercase tracking-wider text-xs text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#f1f5f9]">
                  <td className="py-4 text-[#334155] font-medium">{payment.period_covered}</td>
                  <td className="py-4 text-[#334155] font-bold text-right">${payment.amount.toLocaleString('es-CO')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TOTAL */}
          <div className="flex justify-center mb-12">
            <div className="bg-[#fc7609] text-white px-8 py-4 rounded-2xl shadow-md">
              <p className="text-sm font-bold opacity-90 uppercase tracking-wider mb-1">Total Pagado</p>
              <p className="text-3xl font-extrabold">${payment.amount.toLocaleString('es-CO')}</p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-auto pt-8 border-t border-[#e2e8f0] text-center">
            <p className="text-[#64748b] font-medium mb-1">¡Gracias por confiar en Taller Creativo de Inglés!</p>
            <p className="text-[#94a3b8] text-sm">Este documento es un comprobante de pago electrónico.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
