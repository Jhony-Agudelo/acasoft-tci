"use client";

import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, Search, PlusCircle, Calendar, Printer, Share2, AlertTriangle, TrendingDown, TrendingUp, Users, X } from 'lucide-react';
import { Payment, Student, Guardian, Expense, User, UserRole, StudentStatus, Transfer } from '@/lib/db-schema';
import { getPayments, savePayment } from '@/lib/actions/payment.actions';
import { getStudents, saveStudent } from '@/lib/actions/student.actions';
import { getGuardians } from '@/lib/actions/guardian.actions';
import { getExpenses, saveExpense } from '@/lib/actions/expense.actions';
import { getUsers } from '@/lib/actions/user.actions';
import { getTransfers, saveTransfer } from '@/lib/actions/transfer.actions';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoApp from '@/assets/img/logoApp.png';

export default function PagosPage() {
  const [activeTab, setActiveTab] = useState<'INGRESOS' | 'EGRESOS'>('INGRESOS');
  const [loading, setLoading] = useState(true);

  // Data
  const [dbPayments, setDbPayments] = useState<Payment[]>([]);
  const [dbStudents, setDbStudents] = useState<Student[]>([]);
  const [dbGuardians, setDbGuardians] = useState<Guardian[]>([]);
  const [dbExpenses, setDbExpenses] = useState<Expense[]>([]);
  const [dbUsers, setDbUsers] = useState<User[]>([]);
  const [dbTransfers, setDbTransfers] = useState<Transfer[]>([]);

  // Month Filter
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // States for Ingresos
  const [paymentSearch, setPaymentSearch] = useState('');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<Student | null>(null);
  const [modalStudentSearch, setModalStudentSearch] = useState('');

  // Calculate current month for initial state
  const currentMonthStrInit = new Date().toLocaleString('es-CO', { month: 'long' });
  const [newPayment, setNewPayment] = useState({ amount: '70000', period_covered: `Mensualidad ${currentMonthStrInit.charAt(0).toUpperCase() + currentMonthStrInit.slice(1)}`, payment_date: new Date().toISOString().split('T')[0], payment_method: 'Efectivo', mes_pagado: new Date().toISOString().substring(0, 7) });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for Egresos
  const [expenseSearch, setExpenseSearch] = useState('');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ amount: '', date: new Date().toISOString().split('T')[0], category: 'Servicios', description: '', recipient_name: '', teacher_id: '', payment_method: 'Efectivo' });

  // States for Transfers
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [newTransfer, setNewTransfer] = useState({ amount: '', date: new Date().toISOString().split('T')[0], from_account: 'Nequi', to_account: 'Efectivo', description: 'Traslado Interno' });

  // Receipt
  const receiptRef = useRef<HTMLDivElement>(null);
  const [currentReceiptData, setCurrentReceiptData] = useState<{ payment: Payment, student: Student } | null>(null);

  useEffect(() => {
    Promise.all([getPayments(), getStudents(), getGuardians(), getExpenses(), getUsers(), getTransfers()]).then(([payments, students, guardians, expenses, users, transfers]) => {
      setDbPayments(payments);
      setDbStudents(students);
      setDbGuardians(guardians);
      setDbExpenses(expenses);
      setDbUsers(users);
      setDbTransfers(transfers);
      setLoading(false);
    });
  }, []);

  // --- METRICS ---
  const totalIngresos = dbPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalEgresos = dbExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const balance = totalIngresos - totalEgresos;

  // --- ACTIONS: INGRESOS ---
  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPayment || !newPayment.amount || !newPayment.period_covered) {
      toast.error('Complete todos los campos del pago.');
      return;
    }
    setIsSubmitting(true);
    try {
      const paymentData = {
        student_id: selectedStudentForPayment.id,
        amount: newPayment.amount,
        period_covered: newPayment.period_covered,
        payment_date: newPayment.payment_date,
        payment_method: newPayment.payment_method,
        mes_pagado: newPayment.mes_pagado
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setDbPayments([data.payment, ...dbPayments]);
      setShowAddPaymentModal(false);
      toast.success('¡Pago registrado exitosamente!');

      // Load receipt for printing
      setCurrentReceiptData({ payment: data.payment, student: selectedStudentForPayment });

    } catch (err: any) {
      toast.error(err.message || 'Error de red.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintPOS = () => {
    window.print();
  };

  const handleShareWhatsApp = async () => {
    if (!currentReceiptData) return;
    setIsSubmitting(true);

    try {
      const paymentId = currentReceiptData.payment.id;
      const studentName = `${currentReceiptData.student.nombres} ${currentReceiptData.student.apellidos}`;
      const amount = currentReceiptData.payment.amount.toLocaleString('es-CO');

      // Buscar el teléfono del acudiente
      const guardian = dbGuardians.find(g => g.id === currentReceiptData.student.guardian_id);
      let phoneParam = '';

      if (guardian && guardian.telefono) {
        // Limpiar el número de teléfono (quitar espacios, guiones, etc.)
        const cleanPhone = guardian.telefono.replace(/\D/g, '');
        // Asumiendo Colombia si tiene 10 dígitos y empieza por 3
        if (cleanPhone.length === 10 && cleanPhone.startsWith('3')) {
          phoneParam = `57${cleanPhone}`;
        } else {
          phoneParam = cleanPhone;
        }
      }

      const baseUrl = window.location.origin;
      const receiptLink = `${baseUrl}/recibo/${paymentId}`;

      const text = `¡Hola! Confirmamos el registro de tu pago por valor de $${amount} para el estudiante ${studentName}. 
      
Puedes visualizar y descargar tu comprobante oficial (PDF) en el siguiente enlace:
${receiptLink}

¡Gracias por confiar en Taller Creativo de Inglés!`;

      // Si hay teléfono válido, usa el endpoint con el teléfono, sino el genérico
      const waLink = phoneParam
        ? `https://wa.me/${phoneParam}?text=${encodeURIComponent(text)}`
        : `https://wa.me/?text=${encodeURIComponent(text)}`;

      window.open(waLink, '_blank');
      toast.success('Se ha abierto WhatsApp con el recibo.');
    } catch (error: any) {
      console.error("WhatsApp Link Error:", error);
      toast.error('Error generando enlace: ' + (error?.message || String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const runMoraCronJob = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/cron/auto-block', { method: 'POST' });
      const data = await response.json();
      toast.success(data.message || 'Cron job ejecutado');
      // Refresh students
      const freshStudents = await getStudents();
      setDbStudents(freshStudents);
    } catch {
      toast.error('Error ejecutando job de mora');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ACTIONS: EGRESOS ---
  const handleRegisterExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.category || !newExpense.description) {
      toast.error('Complete los datos obligatorios del egreso');
      return;
    }
    setIsSubmitting(true);
    try {
      const expId = `exp_${Date.now()}`;
      const expenseObj = {
        ...newExpense,
        id: expId,
        amount: parseFloat(newExpense.amount),
        teacher_id: newExpense.category === 'Nómina' && newExpense.teacher_id ? newExpense.teacher_id : null,
        recipient_name: newExpense.category !== 'Nómina' && newExpense.recipient_name ? newExpense.recipient_name : null,
      };
      await saveExpense(expenseObj);
      setDbExpenses([expenseObj, ...dbExpenses]);
      setShowAddExpenseModal(false);
      setNewExpense({ amount: '', date: new Date().toISOString().split('T')[0], category: 'Servicios', description: '', recipient_name: '', teacher_id: '', payment_method: 'Efectivo' });
      toast.success('Egreso registrado');
    } catch (error: any) {
      console.error("Expense Save Error:", error);
      toast.error('Error guardando egreso: ' + (error?.message || String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ACTIONS: TRANSFERS ---
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransfer.amount || !newTransfer.from_account || !newTransfer.to_account || newTransfer.from_account === newTransfer.to_account) {
      toast.error('Datos inválidos para el traslado.');
      return;
    }
    setIsSubmitting(true);
    try {
      const transId = `trn_${Date.now()}`;
      const transferObj = {
        ...newTransfer,
        id: transId,
        amount: parseFloat(newTransfer.amount),
      };
      await saveTransfer(transferObj);
      setDbTransfers([transferObj, ...dbTransfers]);
      setShowTransferModal(false);
      setNewTransfer({ amount: '', date: new Date().toISOString().split('T')[0], from_account: 'Nequi', to_account: 'Efectivo', description: 'Traslado Interno' });
      toast.success('Traslado registrado exitosamente');
    } catch (error: any) {
      console.error("Transfer Error:", error);
      toast.error('Error guardando traslado: ' + (error?.message || String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWalletBalance = (method: string) => {
    const ing = dbPayments.filter(p => (p.payment_method || 'Efectivo') === method).reduce((acc, p) => acc + Number(p.amount), 0);
    const eg = dbExpenses.filter(e => (e.payment_method || 'Efectivo') === method).reduce((acc, e) => acc + Number(e.amount), 0);
    const out = dbTransfers.filter(t => t.from_account === method).reduce((acc, t) => acc + Number(t.amount), 0);
    const inc = dbTransfers.filter(t => t.to_account === method).reduce((acc, t) => acc + Number(t.amount), 0);
    return ing - eg - out + inc;
  };

  const filteredPayments = dbPayments.filter((p) => {
    const student = dbStudents.find(s => s.id === p.student_id);
    const searchLower = paymentSearch.toLowerCase();
    const matchesSearch = student?.nombres.toLowerCase().includes(searchLower) || student?.documento_identidad.includes(searchLower);

    const invoiceLower = invoiceSearch.toLowerCase().replace('n°', '').trim();
    const displayId = p.id.split('_')[1] || '';
    const matchesInvoice = displayId.toLowerCase().includes(invoiceLower) || p.id.toLowerCase().includes(invoiceLower);

    const matchesMonth = selectedMonth ? p.payment_date.startsWith(selectedMonth) : true;
    return matchesSearch && matchesInvoice && matchesMonth;
  });

  const filteredExpenses = dbExpenses.filter((e) => {
    const matchesSearch = e.description.toLowerCase().includes(expenseSearch.toLowerCase()) || e.category.toLowerCase().includes(expenseSearch.toLowerCase());
    const matchesMonth = selectedMonth ? e.date.startsWith(selectedMonth) : true;
    return matchesSearch && matchesMonth;
  });

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Cargando módulo financiero...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 font-display">Módulo Financiero</h2>
          <p className="text-slate-500 text-sm mt-1">Control integral de recaudos, nómina y facturación.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={() => setShowTransferModal(true)} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Trasladar Dinero
          </button>
          <button onClick={runMoraCronJob} disabled={isSubmitting} className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Actualizar Estados de Mora
          </button>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <TrendingUp className="h-5 w-5" />
            <h3 className="font-bold uppercase tracking-wider text-[10px]">Total Ingresos</h3>
          </div>
          <p className="text-3xl font-extrabold text-emerald-700 font-mono">${totalIngresos.toLocaleString('es-CO')}</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-rose-600 mb-2">
            <TrendingDown className="h-5 w-5" />
            <h3 className="font-bold uppercase tracking-wider text-[10px]">Total Egresos</h3>
          </div>
          <p className="text-3xl font-extrabold text-rose-700 font-mono">${totalEgresos.toLocaleString('es-CO')}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <DollarSign className="h-5 w-5" />
            <h3 className="font-bold uppercase tracking-wider text-[10px]">Balance Actual</h3>
          </div>
          <p className="text-3xl font-extrabold text-blue-700 font-mono">${balance.toLocaleString('es-CO')}</p>
        </div>
      </div>

      {/* WALLETS BREAKDOWN */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Efectivo', 'Nequi', 'Daviplata', 'Davivienda'].map(method => {
          const totalMethod = getWalletBalance(method);
          return (
            <div key={method} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-center items-center">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{method}</h4>
              <p className="text-xl font-extrabold text-[#fc7609] font-mono">${totalMethod.toLocaleString('es-CO')}</p>
            </div>
          );
        })}
      </div>

      {/* TABS & FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-100 p-1 w-full max-w-sm">
          <button onClick={() => setActiveTab('INGRESOS')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'INGRESOS' ? 'bg-[#fc7609] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
            Ingresos (Recaudo)
          </button>
          <button onClick={() => setActiveTab('EGRESOS')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'EGRESOS' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
            Egresos (Gastos)
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Filtrar por Mes:</label>
          <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="p-2 border border-slate-200 rounded-xl text-sm bg-white text-slate-700 font-bold focus:ring-2 focus:ring-orange-500/20" />
          {selectedMonth && <button onClick={() => setSelectedMonth('')} className="p-2 text-slate-400 hover:text-rose-500 bg-white rounded-xl border border-slate-200"><X className="h-4 w-4" /></button>}
        </div>
      </div>

      {activeTab === 'INGRESOS' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

          {/* PENDING PAYMENTS SECTION */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users className="h-5 w-5 text-[#fc7609]" /> Pagos Pendientes de {new Date().toLocaleString('es-CO', { month: 'long' }).charAt(0).toUpperCase() + new Date().toLocaleString('es-CO', { month: 'long' }).slice(1)}</h3>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="Buscar estudiante..." value={paymentSearch} onChange={(e) => setPaymentSearch(e.target.value)} className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm" />
                </div>
                <button
                  onClick={() => { setSelectedStudentForPayment(null); setModalStudentSearch(''); setShowAddPaymentModal(true); }}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm whitespace-nowrap transition-colors flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" /> Agregar Pago Libre
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-64 border border-slate-100 rounded-xl">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Estudiante</th>
                    <th className="px-4 py-3">Documento</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(() => {
                    const currentMonthPrefix = new Date().toISOString().substring(0, 7);
                    const pendingStudents = dbStudents.filter(s => {
                      if (s.status !== StudentStatus.ACTIVE) return false;
                      const searchLower = paymentSearch.toLowerCase();
                      if (paymentSearch && !s.nombres.toLowerCase().includes(searchLower) && !s.documento_identidad.includes(paymentSearch)) return false;
                      const hasPaidThisMonth = dbPayments.some(p => p.student_id === s.id && (p.mes_pagado === currentMonthPrefix || p.payment_date.startsWith(currentMonthPrefix)));
                      return !hasPaidThisMonth;
                    });

                    if (pendingStudents.length === 0) {
                      return (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-500 font-medium">
                            ¡Genial! No tienes pagos pendientes por recibir de estudiantes activos este mes.
                          </td>
                        </tr>
                      );
                    }

                    return pendingStudents.map(student => (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-700">{student.nombres} {student.apellidos}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{student.documento_identidad}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-[9px] rounded font-bold uppercase bg-rose-100 text-rose-700`}>
                            PENDIENTE
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => { setSelectedStudentForPayment(student); setShowAddPaymentModal(true); }} className="bg-[#fc7609] hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                            Registrar Pago
                          </button>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* HISTORY TABLE */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
              <h3 className="font-bold text-slate-600 text-sm">Historial de Pagos Recientes</h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por N° de Factura..."
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Fecha Pago</th><th className="px-6 py-4">Estudiante</th><th className="px-6 py-4">Concepto</th><th className="px-6 py-4">Medio</th><th className="px-6 py-4 text-right">Valor Pagado</th><th className="px-6 py-4 text-center">Recibo</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((payment) => {
                    const student = dbStudents.find(s => s.id === payment.student_id);
                    return (
                      <tr key={payment.id} className="hover:bg-orange-50/50">
                        <td className="px-6 py-4 text-slate-600 font-medium">{payment.id}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium"><Calendar className="h-4 w-4 inline mr-2 text-slate-400" />{payment.payment_date}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{student ? `${student.nombres} ${student.apellidos}` : 'N/A'}</td>
                        <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase">{payment.period_covered}</span></td>
                        <td className="px-6 py-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase border border-blue-100">{payment.payment_method || 'Efectivo'}</span></td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-600 font-mono">${payment.amount.toLocaleString('es-CO')}</td>
                        <td className="px-6 py-4 text-center">
                          {student && (
                            <button
                              onClick={() => setCurrentReceiptData({ payment, student })}
                              className="text-slate-400 hover:text-[#fc7609] p-1.5 rounded-md hover:bg-orange-50 transition-colors inline-flex items-center"
                              title="Ver e Imprimir Recibo"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'EGRESOS' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="text" placeholder="Buscar gasto..." value={expenseSearch} onChange={e => setExpenseSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm" />
            </div>
            <button onClick={() => setShowAddExpenseModal(true)} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-colors">
              <PlusCircle className="h-5 w-5" /> Registrar Gasto/Nómina
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users className="h-5 w-5 text-slate-800" /> Registro Rápido de Nómina</h3>
            </div>
            <div className="overflow-x-auto max-h-64 border border-slate-100 rounded-xl">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Maestro / Empleado</th>
                    <th className="px-4 py-3">Documento</th>
                    <th className="px-4 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dbUsers.filter(u => u.role === UserRole.TEACHER || u.role === UserRole.ADMIN).map(teacher => (
                    <tr key={teacher.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-700">{teacher.nombres} {teacher.apellidos}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{teacher.documento_identidad || 'N/A'}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => { setNewExpense({ amount: '', date: new Date().toISOString().split('T')[0], category: 'Nómina', description: 'Pago Nómina', recipient_name: '', teacher_id: teacher.id }); setShowAddExpenseModal(true); }} className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                          Pagar Nómina
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-600 text-sm">Historial de Egresos</h3>
            </div>
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr><th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Categoría</th><th className="px-6 py-4">Descripción / Destinatario</th><th className="px-6 py-4">Medio</th><th className="px-6 py-4 text-right">Valor Gasto</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((exp) => {
                  const teacher = dbUsers.find(u => u.id === exp.teacher_id);
                  return (
                    <tr key={exp.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-600 font-medium">{exp.date}</td>
                      <td className="px-6 py-4"><span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-[10px] font-bold uppercase">{exp.category}</span></td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{exp.description}</div>
                        <div className="text-[10px] text-slate-500">{exp.teacher_id ? `Nómina Docente: ${teacher?.nombres} ${teacher?.apellidos}` : exp.recipient_name}</div>
                      </td>
                      <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase border border-slate-200">{exp.payment_method || 'Efectivo'}</span></td>
                      <td className="px-6 py-4 text-right font-bold text-rose-600 font-mono">-${exp.amount.toLocaleString('es-CO')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TRANSFERS HISTORY */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 mt-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><DollarSign className="h-5 w-5 text-[#fc7609]" /> Historial de Traslados Internos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr><th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Origen</th><th className="px-6 py-4">Destino</th><th className="px-6 py-4">Motivo</th><th className="px-6 py-4 text-right">Monto</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dbTransfers.map((trn) => (
                    <tr key={trn.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-600 font-medium">{trn.date}</td>
                      <td className="px-6 py-4"><span className="bg-rose-50 text-rose-600 px-2 py-1 rounded text-[10px] font-bold uppercase border border-rose-100">{trn.from_account}</span></td>
                      <td className="px-6 py-4"><span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold uppercase border border-emerald-100">{trn.to_account}</span></td>
                      <td className="px-6 py-4 font-bold text-slate-800">{trn.description}</td>
                      <td className="px-6 py-4 text-right font-bold text-blue-600 font-mono">${trn.amount.toLocaleString('es-CO')}</td>
                    </tr>
                  ))}
                  {dbTransfers.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No hay traslados registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-50 border-b border-slate-100 p-6 shrink-0">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-lg text-slate-800 font-display">Registrar Recaudo</h3>
                <button onClick={() => setShowAddPaymentModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
              </div>
              {selectedStudentForPayment ? (
                <div className="flex justify-between items-center mt-2 bg-orange-50 p-3 rounded-xl border border-orange-100">
                  <p className="text-sm text-slate-600">Estudiante: <span className="font-bold text-[#fc7609]">{selectedStudentForPayment.nombres} {selectedStudentForPayment.apellidos}</span></p>
                  <button onClick={() => setSelectedStudentForPayment(null)} className="text-xs font-bold text-blue-500 hover:text-blue-600 underline">Cambiar</button>
                </div>
              ) : (
                <p className="text-sm text-slate-500 mt-1">Busca y selecciona un estudiante</p>
              )}
            </div>

            <div className="overflow-y-auto p-6">
              {!selectedStudentForPayment ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar por documento o nombre..."
                      value={modalStudentSearch}
                      onChange={e => setModalStudentSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#fc7609]/20"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {dbStudents.filter(s => s.nombres.toLowerCase().includes(modalStudentSearch.toLowerCase()) || s.apellidos.toLowerCase().includes(modalStudentSearch.toLowerCase()) || s.documento_identidad.includes(modalStudentSearch)).slice(0, 20).map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStudentForPayment(s)}
                        className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50 transition-colors flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-slate-700 text-sm">{s.nombres} {s.apellidos}</p>
                          <p className="text-xs text-slate-500 font-mono">{s.documento_identidad}</p>
                        </div>
                        <span className={`px-2 py-1 text-[9px] rounded font-bold uppercase ${s.status === StudentStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {s.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterPayment} className="space-y-4">
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">Valor a pagar ($)</label><input type="number" required value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">Concepto / Descripción</label><input type="text" required value={newPayment.period_covered} onChange={e => setNewPayment({ ...newPayment, period_covered: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">Mes a Pagar</label><input type="month" required value={newPayment.mes_pagado} onChange={e => {
                    const mes = e.target.value;
                    if (mes) {
                      const mesName = new Date(mes + '-02T12:00:00').toLocaleDateString('es-CO', { month: 'long' });
                      setNewPayment({ ...newPayment, mes_pagado: mes, period_covered: `Mensualidad ${mesName.charAt(0).toUpperCase() + mesName.slice(1)}` });
                    } else {
                      setNewPayment({ ...newPayment, mes_pagado: mes });
                    }
                  }} className="w-full p-2 border rounded-xl bg-slate-50" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">Medio de Pago</label>
                    <select required value={newPayment.payment_method} onChange={e => setNewPayment({ ...newPayment, payment_method: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50">
                      <option value="Efectivo">Efectivo</option>
                      <option value="Nequi">Nequi</option>
                      <option value="Daviplata">Daviplata</option>
                      <option value="Davivienda">Davivienda</option>
                    </select>
                  </div>
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">Fecha</label><input type="date" required value={newPayment.payment_date} onChange={e => setNewPayment({ ...newPayment, payment_date: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50" /></div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={() => setShowAddPaymentModal(false)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancelar</button>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 font-bold text-white bg-[#fc7609] rounded-lg">Guardar Pago</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-6">
              <h3 className="font-extrabold text-lg text-slate-800 font-display">Registrar Egreso/Gasto</h3>
            </div>
            <form onSubmit={handleRegisterExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Categoría</label>
                <select value={newExpense.category} onChange={e => setNewExpense({ ...newExpense, category: e.target.value, teacher_id: '' })} className="w-full p-2 border rounded-xl bg-slate-50">
                  <option value="Servicios">Servicios Generales</option>
                  <option value="Materiales">Materiales Académicos</option>
                  <option value="Nómina">Nómina a Maestros</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              {newExpense.category === 'Nómina' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Seleccionar Maestro</label>
                  <select required value={newExpense.teacher_id} onChange={e => setNewExpense({ ...newExpense, teacher_id: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50">
                    <option value="">Seleccione...</option>
                    {dbUsers.filter(u => u.role === UserRole.TEACHER || u.role === UserRole.ADMIN).map(t => (
                      <option key={t.id} value={t.id}>{t.nombres} {t.apellidos}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Destinatario / Proveedor</label><input type="text" value={newExpense.recipient_name} onChange={e => setNewExpense({ ...newExpense, recipient_name: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50" /></div>
              )}
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Descripción</label><input type="text" required value={newExpense.description} onChange={e => setNewExpense({ ...newExpense, description: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Medio de Pago</label>
                <select required value={newExpense.payment_method} onChange={e => setNewExpense({ ...newExpense, payment_method: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50">
                  <option value="Efectivo">Efectivo</option>
                  <option value="Nequi">Nequi</option>
                  <option value="Daviplata">Daviplata</option>
                  <option value="Davivienda">Davivienda</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Valor ($)</label><input type="number" required value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Fecha</label><input type="date" required value={newExpense.date} onChange={e => setNewExpense({ ...newExpense, date: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50" /></div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowAddExpenseModal(false)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 font-bold text-white bg-slate-800 rounded-lg">Guardar Egreso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BEAUTIFUL A4 INVOICE MODAL & HIDDEN CANVAS AREA */}
      {currentReceiptData && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Modal Actions */}
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative print:hidden">
            <button onClick={() => setCurrentReceiptData(null)} className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="h-5 w-5" /></button>

            <div className="text-center mb-8 mt-4">
              <div className="bg-emerald-100 text-emerald-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Printer className="h-8 w-8" />
              </div>
              <h3 className="font-extrabold text-2xl text-slate-800 font-display">Factura Generada</h3>
              <p className="text-slate-500 text-sm mt-2">La factura ha sido diseñada en alta calidad. Selecciona una opción para continuar.</p>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={handleShareWhatsApp} disabled={isSubmitting} className="w-full bg-[#fc7609] hover:bg-orange-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-500/30">
                <Share2 className="h-5 w-5" /> Enviar recibo
              </button>
              <button onClick={handlePrintPOS} disabled={isSubmitting} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-slate-900/20">
                <Printer className="h-5 w-5" /> Imprimir Factura
              </button>
            </div>
          </div>

          {/* HIDDEN INVOICE FOR HTML2CANVAS (WHATSAPP) */}
          <div className="absolute top-0 left-0 -z-50 pointer-events-none opacity-0">
            <div ref={receiptRef} className="bg-[#ffffff] text-[#1e293b] w-[600px] h-auto relative flex flex-col" style={{ boxSizing: 'border-box', padding: '40px' }}>
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
                  <p className="text-xl font-extrabold text-[#1e293b]">{currentReceiptData.payment.id.split('_')[1]}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#94a3b8] uppercase tracking-wider">Fecha</p>
                  <p className="text-lg font-bold text-[#475569]">{currentReceiptData.payment.payment_date}</p>
                </div>
              </div>

              {/* CLIENT INFO */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3">Facturado a:</h3>
                <div className="bg-[#ffffff] border-l-4 border-[#fc7609] pl-4">
                  <p className="font-extrabold text-2xl text-[#1e293b] mb-1">{currentReceiptData.student.nombres} {currentReceiptData.student.apellidos}</p>
                  <p className="text-[#475569] text-base"><span className="font-semibold text-[#94a3b8]">Documento:</span> {currentReceiptData.student.documento_identidad}</p>
                  <p className="text-[#475569] text-base"><span className="font-semibold text-[#94a3b8]">Acudiente:</span> {dbGuardians.find(g => g.id === currentReceiptData.student.guardian_id)?.nombre_completo || 'N/A'}</p>
                </div>
              </div>

              {/* MES Y TOTAL */}
              <div className="bg-[#ffedd5] p-6 rounded-3xl border border-[#fed7aa] mb-8 text-center">
                <h3 className="text-sm font-bold text-[#fb923c] uppercase tracking-widest mb-1">Mes de Pago</h3>
                <p className="font-extrabold text-2xl text-[#fc7609] capitalize mb-5">
                  {currentReceiptData.payment.mes_pagado
                    ? new Date(currentReceiptData.payment.mes_pagado + '-02T12:00:00').toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
                    : new Date(currentReceiptData.payment.payment_date + 'T12:00:00').toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
                </p>

                <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#fed7aa] flex flex-col items-center justify-center w-full relative z-10">
                  <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-1">Concepto</p>
                  <p className="font-bold text-lg text-[#334155] mb-5 text-center">{currentReceiptData.payment.period_covered}</p>

                  <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-1">Medio de Pago</p>
                  <p className="font-bold text-lg text-[#334155] mb-5 text-center">{currentReceiptData.payment.payment_method || 'Efectivo'}</p>

                  <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-1">Total Pagado</p>
                  <p className="text-4xl font-extrabold text-[#fc7609] text-center">${currentReceiptData.payment.amount.toLocaleString('es-CO')}</p>
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-auto pt-6 text-center border-t border-[#e2e8f0]">
                <p className="font-extrabold text-[#1e293b] text-base mb-1">¡Gracias por confiar en Taller Creativo De Inglés!</p>
                <p className="text-[#64748b] text-sm font-medium">Conserve este recibo digital para cualquier duda.</p>
              </div>
            </div>
          </div>

          {/* POS INVOICE FOR PHYSICAL PRINTER */}
          <div id="pos-receipt" className="hidden print:block absolute top-0 left-0 bg-white text-black w-full max-w-[300px]" style={{ fontFamily: 'monospace', padding: '10px' }}>
            <div className="text-center mb-4 border-b border-black pb-2 border-dashed">
              <h1 className="font-bold text-xl uppercase">Taller Creativo</h1>
              <h2 className="font-bold text-lg uppercase">De Inglés</h2>
              <p className="text-xs">NIT. 1.007.220.836</p>
            </div>
            <div className="mb-4 text-sm border-b border-black pb-2 border-dashed">
              <p><strong>Factura:</strong> N° {currentReceiptData.payment.id.split('_')[1]}</p>
              <p><strong>Fecha:</strong> {currentReceiptData.payment.payment_date}</p>
            </div>
            <div className="mb-4 text-sm border-b border-black pb-2 border-dashed">
              <p><strong>Estudiante:</strong> {currentReceiptData.student.nombres} {currentReceiptData.student.apellidos}</p>
              <p><strong>Documento:</strong> {currentReceiptData.student.documento_identidad}</p>
            </div>
            <div className="mb-4 text-sm border-b border-black pb-2 border-dashed">
              <p><strong>Acudiente:</strong> {dbGuardians.find(g => g.id === currentReceiptData.student.guardian_id)?.nombre_completo || 'N/A'}</p>
            </div>
            <div className="mb-4 text-sm border-b border-black pb-2 border-dashed">
              <p><strong>Concepto:</strong> {currentReceiptData.payment.period_covered}</p>
              <p><strong>Medio:</strong> {currentReceiptData.payment.payment_method || 'Efectivo'}</p>
              <p className="mt-2 text-right text-lg font-bold">TOTAL: ${currentReceiptData.payment.amount.toLocaleString('es-CO')}</p>
            </div>
            <div className="text-center text-xs">
              <p className="font-bold text-lg">¡Gracias por confiar en Taller Creativo De Inglés!</p>
              <p className="text-[#64748b] text-sm font-medium">Conserve este recibo digital para cualquier duda.</p>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-6">
              <h3 className="font-extrabold text-lg text-slate-800 font-display">Trasladar Dinero</h3>
            </div>
            <form onSubmit={handleTransfer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Cuenta Origen (Sale)</label>
                <select value={newTransfer.from_account} onChange={e => setNewTransfer({ ...newTransfer, from_account: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50">
                  <option value="Efectivo">Efectivo</option>
                  <option value="Nequi">Nequi</option>
                  <option value="Daviplata">Daviplata</option>
                  <option value="Davivienda">Davivienda</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Cuenta Destino (Entra)</label>
                <select value={newTransfer.to_account} onChange={e => setNewTransfer({ ...newTransfer, to_account: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50">
                  <option value="Efectivo">Efectivo</option>
                  <option value="Nequi">Nequi</option>
                  <option value="Daviplata">Daviplata</option>
                  <option value="Davivienda">Davivienda</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Valor a trasladar ($)</label><input type="number" required value={newTransfer.amount} onChange={e => setNewTransfer({ ...newTransfer, amount: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Motivo (Opcional)</label><input type="text" value={newTransfer.description} onChange={e => setNewTransfer({ ...newTransfer, description: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Fecha</label><input type="date" required value={newTransfer.date} onChange={e => setNewTransfer({ ...newTransfer, date: e.target.value })} className="w-full p-2 border rounded-xl bg-slate-50" /></div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowTransferModal(false)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 font-bold text-white bg-slate-800 rounded-lg">Registrar Traslado</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #pos-receipt, #pos-receipt * { visibility: visible; }
          #pos-receipt { position: absolute; left: 0; top: 0; margin: 0; padding: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
