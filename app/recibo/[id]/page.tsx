"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { getPaymentById } from '@/lib/actions/payment.actions';
import { getStudentById } from '@/lib/actions/student.actions';
import { getGuardianById } from '@/lib/actions/guardian.actions';
import { Payment, Student, Guardian, Course } from '@/lib/db-schema';
import { getCourses } from '@/lib/actions/course.actions';
import { Printer, Download, CheckCircle } from 'lucide-react';
import logoApp from '@/assets/img/logoApp.png';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PublicReceiptPage() {
  const { id } = useParams() as { id: string };
  const [payment, setPayment] = useState<Payment | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [guardian, setGuardian] = useState<Guardian | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const getCourseName = (std?: Student | null) => {
    if (!std) return '';
    const courseId = std.course_id || std.curso_actual;
    if (!courseId || courseId === 'N/A') return '';
    const course = courses.find(c => c.id === courseId || c.nombre_curso === courseId);
    if (course) return course.nombre_curso;
    return !courseId.startsWith('crs_') ? courseId : '';
  };

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const [p, allCourses] = await Promise.all([
        getPaymentById(id),
        getCourses()
      ]);
      setCourses(allCourses);
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

  const printPOSReceipt = (receiptHtml: string) => {
    let iframe = document.getElementById('pos-print-iframe') as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'pos-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '58mm';
      iframe.style.height = '100px';
      iframe.style.border = '0';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      iframe.style.zIndex = '-9999';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>Factura POS</title>
          <style>
            @page {
              size: 58mm auto;
              margin: 0mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              color: #000000 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            html, body {
              width: 58mm !important;
              max-width: 58mm !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #000000 !important;
              font-family: 'Courier New', Courier, monospace !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            #pos-receipt {
              display: block !important;
              width: 48mm !important;
              max-width: 48mm !important;
              margin: 0 !important;
              padding: 1mm 0 3mm 0 !important;
              color: #000000 !important;
              background: #ffffff !important;
              font-family: 'Courier New', Courier, monospace !important;
              font-size: 8.5px;
              line-height: 1.25;
            }
            #pos-receipt * {
              color: #000000 !important;
              border-color: #000000 !important;
            }
          </style>
        </head>
        <body>
          <div id="pos-receipt">
            ${receiptHtml}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      try {
        iframe?.contentWindow?.focus();
        iframe?.contentWindow?.print();
      } catch (e) {
        console.error('Print error:', e);
        window.print();
      }
    }, 250);
  };

  const handlePrintPOS = () => {
    const receiptEl = document.getElementById('pos-receipt-content');
    if (receiptEl) {
      printPOSReceipt(receiptEl.innerHTML);
    } else {
      window.print();
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
      <div className="max-w-[600px] w-full mb-6 flex flex-col sm:flex-row gap-3 print:hidden">
        <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
          <p className="text-sm text-emerald-800 font-medium">
            El pago por <strong className="font-extrabold text-emerald-900">${payment.amount.toLocaleString('es-CO')}</strong> ha sido registrado exitosamente.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrintPOS}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 transition-all active:scale-95 shrink-0 text-sm cursor-pointer"
            title="Imprimir Factura POS"
          >
            <Printer className="h-4 w-4" />
            Imprimir Factura POS
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="bg-[#fc7609] hover:bg-orange-600 text-white font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait shrink-0 text-sm cursor-pointer"
          >
            <Download className="h-4 w-4" />
            {downloading ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>
      </div>

      {/* Visual Receipt Wrapper */}
      <div className="w-full max-w-[600px] bg-white shadow-xl rounded-3xl overflow-hidden print:hidden border border-slate-100">

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

      {/* POS INVOICE FOR PHYSICAL 80mm PRINTER */}
      {(() => {
        const receiptId = payment.id.split('_')[1] || payment.id;
        const mesPagado = payment.mes_pagado
          ? new Date(payment.mes_pagado + '-02T12:00:00').toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
          : null;
        const courseName = getCourseName(student);

        return (
          <div id="pos-receipt-content" style={{ display: 'none' }}>
            {/* ENCABEZADO */}
            <div style={{ textAlign: 'center', marginBottom: '3px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '10.5px', textTransform: 'uppercase', lineHeight: '1.2' }}>
                TALLER CREATIVO<br />DE INGLÉS
              </div>
              <div style={{ fontSize: '8px', marginTop: '1px' }}>NIT. 1.007.220.836</div>
              <div style={{ fontSize: '8px' }}>La Virginia, Risaralda</div>
              <div
                style={{
                  fontSize: '8.5px',
                  fontWeight: 'bold',
                  marginTop: '3px',
                  borderTop: '1px dashed #000',
                  borderBottom: '1px dashed #000',
                  padding: '2px 0',
                  textTransform: 'uppercase',
                }}
              >
                Factura de Venta / Recibo
              </div>
            </div>

            {/* DATOS DE FACTURA Y CLIENTE */}
            <div style={{ fontSize: '8.5px', marginBottom: '3px', borderBottom: '1px dashed #000', paddingBottom: '3px', lineHeight: '1.25' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Factura:</strong> #{receiptId}</span>
                <span><strong>Fecha:</strong> {payment.payment_date}</span>
              </div>
              <div style={{ marginTop: '1px', wordBreak: 'break-word' }}>
                <strong>Estudiante:</strong> {student.nombres} {student.apellidos}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1px' }}>
                <span><strong>Doc:</strong> {student.documento_identidad}</span>
                {courseName && (
                  <span style={{ maxWidth: '55%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={courseName}>
                    <strong>Curso:</strong> {courseName}
                  </span>
                )}
              </div>
              {guardian && (
                <div style={{ marginTop: '1px' }}>
                  <div style={{ wordBreak: 'break-word' }}>
                    <strong>Acudiente:</strong> {guardian.nombre_completo}
                  </div>
                  {guardian.telefono && (
                    <div><strong>Tel:</strong> {guardian.telefono}</div>
                  )}
                </div>
              )}
            </div>

            {/* TABLA DE DETALLES (FORMATO FACTURA POS COMPACTO) */}
            <div style={{ marginBottom: '3px', borderBottom: '1px dashed #000', paddingBottom: '3px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '8.5px', borderBottom: '1px solid #000', paddingBottom: '1px', marginBottom: '2px' }}>
                <span>CANT / DESCRIPCIÓN</span>
                <span>TOTAL</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '3px', fontSize: '8.5px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ wordBreak: 'break-word' }}>1 x {payment.period_covered}</div>
                  {mesPagado && (
                    <div style={{ fontSize: '8px', textTransform: 'capitalize' }}>
                      Mes: {mesPagado}
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  ${payment.amount.toLocaleString('es-CO')}
                </div>
              </div>
            </div>

            {/* TOTALES */}
            <div style={{ fontSize: '8.5px', marginBottom: '3px', borderBottom: '1px dashed #000', paddingBottom: '3px', lineHeight: '1.25' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
                <span>Subtotal:</span>
                <span>${payment.amount.toLocaleString('es-CO')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
                <span>Descuento:</span>
                <span>$0</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  borderTop: '1px solid #000',
                  paddingTop: '2px',
                  marginTop: '2px',
                }}
              >
                <span>TOTAL PAGADO:</span>
                <span>${payment.amount.toLocaleString('es-CO')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', fontSize: '8px' }}>
                <span>Medio: {payment.payment_method || 'Efectivo'}</span>
                <span>Estado: PAGADO</span>
              </div>
            </div>

            {/* PIE DE FACTURA */}
            <div style={{ textAlign: 'center', fontSize: '8px', lineHeight: '1.2', marginTop: '3px' }}>
              <div style={{ fontWeight: 'bold' }}>¡Gracias por confiar en TCI!</div>
              <div>Conserve este comprobante para cualquier duda.</div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
