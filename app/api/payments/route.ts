import { NextRequest, NextResponse } from 'next/server';
import { Payment, Student, StudentStatus } from '@/lib/db-schema';
import { isPgConfigured, dbSavePayment, dbSaveStudent, dbGetStudents } from '@/lib/pg-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { student_id, amount, payment_date, period_covered, clientStudents } = body;

    if (!student_id || !amount || !period_covered) {
      return NextResponse.json(
        { success: false, error: 'Por favor, complete todos los campos obligatorios (Estudiante, Monto y Periodo a pagar).' },
        { status: 400 }
      );
    }

    let studentsList: Student[] = clientStudents || [];
    if (isPgConfigured()) {
      try {
        studentsList = await dbGetStudents();
      } catch (dbErr) {
        console.error('Failed to load students from DB for payments endpoint, falling back to clientSync:', dbErr);
      }
    }

    const student = studentsList.find((s) => s.id === student_id);

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'El estudiante seleccionado no se encuentra en el sistema.' },
        { status: 404 }
      );
    }

    // 1. Create a Payment record
    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      student_id,
      amount: Number(amount),
      payment_date: payment_date || new Date().toISOString().split('T')[0],
      period_covered,
    };

    // 2. Update Student Deadline: add exactly one month
    let originalDeadline = student.payment_deadline_date;
    let deadlineDateObj = new Date(originalDeadline + 'T12:00:00'); // set mid-day to avoid timezone shifting issues
    if (isNaN(deadlineDateObj.getTime())) {
      deadlineDateObj = new Date();
    }
    
    // Add 1 month to the deadline
    deadlineDateObj.setMonth(deadlineDateObj.getMonth() + 1);
    const newDeadline = deadlineDateObj.toISOString().split('T')[0];
    
    // Create copy of student with mutations
    const updatedStudent: Student = {
      ...student,
      payment_deadline_date: newDeadline,
    };

    // 3. Unblock if BLOCKED
    if (updatedStudent.status === StudentStatus.BLOCKED) {
      updatedStudent.status = StudentStatus.ACTIVE;
    }

    if (isPgConfigured()) {
      await dbSavePayment(newPayment);
      await dbSaveStudent(updatedStudent);
    }

    return NextResponse.json({
      success: true,
      message: 'Pago guardado con éxito. El límite de pago del estudiante se ha extendido y se ha activado si estaba bloqueado.',
      payment: newPayment,
      student: updatedStudent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
