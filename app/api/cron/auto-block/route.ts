import { NextRequest, NextResponse } from 'next/server';
import { Student, StudentStatus, Payment } from '@/lib/db-schema';
import { isPgConfigured, dbGetStudents, dbSaveStudent, dbGetPayments } from '@/lib/pg-db';

/**
 * Simulates a Scheduled Cron Task executing every day at midnight (00:00).
 * In production/cloud environments, this endpoint is configured as a native server webhook
 * triggered by Vercel Cron, Google Cloud Scheduler, or n8n workflows.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { clientStudents, customDate } = body;

    // Use current server date (or client defined date for testing)
    const todayDateObj = customDate ? new Date(customDate + 'T12:00:00') : new Date();
    const todayStr = todayDateObj.toISOString().split('T')[0];
    const currentDay = todayDateObj.getDate();

    let studentsList: Student[] = clientStudents || [];
    let paymentsList: Payment[] = [];

    if (isPgConfigured()) {
      try {
        studentsList = await dbGetStudents();
        paymentsList = await dbGetPayments();
      } catch (dbErr) {
        console.error('Failed to load DB data for Cron execution:', dbErr);
      }
    }

    if (!studentsList || !Array.isArray(studentsList)) {
      return NextResponse.json(
        { success: false, error: 'Lista de estudiantes no suministrada para la ejecución del Cron.' },
        { status: 400 }
      );
    }

    let modifiedCount = 0;
    const logDetails: string[] = [];
    const updatedStudents = [];
    
    // Calculate prefixes for current and previous months (YYYY-MM)
    const currentMonthStr = todayDateObj.toISOString().substring(0, 7);
    const prevDateObj = new Date(todayDateObj.getTime());
    prevDateObj.setDate(0); // goes to last day of previous month
    const prevMonthStr = prevDateObj.toISOString().substring(0, 7);

    for (const student of studentsList) {
      if (student.status !== StudentStatus.ACTIVE) {
        updatedStudents.push(student);
        continue;
      }

      const paymentDay = student.payment_day || 15;
      
      // Determine which month the student is required to have paid
      let requiredPaidMonth = '';
      if (currentDay >= paymentDay) {
        requiredPaidMonth = currentMonthStr; // e.g. "2026-08"
      } else {
        requiredPaidMonth = prevMonthStr; // e.g. "2026-07"
      }

      // Check if student has a payment covering that month
      const hasPaid = paymentsList.some(p => p.student_id === student.id && p.mes_pagado === requiredPaidMonth);

      if (!hasPaid) {
        modifiedCount++;
        logDetails.push(`${student.nombres} ${student.apellidos} (${student.id}): Día actual (${currentDay}) vs Día de Pago (${paymentDay}). No se encontró pago para ${requiredPaidMonth}. BLOQUEADO AUTOMÁTICAMENTE.`);
        
        const updated = {
          ...student,
          status: StudentStatus.BLOCKED,
        };

        if (isPgConfigured()) {
          try {
            await dbSaveStudent(updated);
          } catch (dbErr) {
            console.error(`Failed to save blocked student ${student.id} to PostgreSQL:`, dbErr);
          }
        }
        updatedStudents.push(updated);
      } else {
        updatedStudents.push(student);
      }
    }

    return NextResponse.json({
      success: true,
      executedAt: new Date().toISOString(),
      cronSchedule: '0 0 * * *',
      message: `[CRON 00:00] Tarea completada. Se escanearon ${studentsList.length} estudiantes. Se bloquearon ${modifiedCount} estudiantes.`,
      logs: logDetails,
      updatedStudents,
      modifiedCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error en la ejecución del Cron de Automatización' },
      { status: 500 }
    );
  }
}
