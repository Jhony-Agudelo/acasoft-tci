import { NextRequest, NextResponse } from 'next/server';
import { Student, StudentStatus } from '@/lib/db-schema';
import { isPgConfigured, dbGetStudents, dbSaveStudent } from '@/lib/pg-db';

/**
 * Simulates a Scheduled Cron Task executing every day at midnight (00:00).
 * In production/cloud environments, this endpoint is configured as a native server webhook
 * triggered by Vercel Cron, Google Cloud Scheduler, or n8n workflows.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { clientStudents, customDate } = body;

    // Use current server date (or client defined date for testing timezone-sensitive expirations)
    const todayStr = customDate || new Date().toISOString().split('T')[0];

    let studentsList: Student[] = clientStudents || [];

    if (isPgConfigured()) {
      try {
        studentsList = await dbGetStudents();
      } catch (dbErr) {
        console.error('Failed to load students from DB for Cron execution:', dbErr);
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
    
    for (const student of studentsList) {
      // Rule: Check if payment_deadline_date is strictly less than today's date
      const isExpired = student.payment_deadline_date < todayStr;
      
      if (isExpired && student.status !== StudentStatus.BLOCKED) {
        modifiedCount++;
        logDetails.push(`${student.nombres} ${student.apellidos} (${student.id}): Deadline ${student.payment_deadline_date} < Hoy ${todayStr}. BLOQUEADO AUTOMÁTICAMENTE.`);
        
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
      message: `[CRON 00:00] Tarea completada. Se escanearon ${studentsList.length} estudiantes contra la fecha de corte [${todayStr}]. Se bloquearon ${modifiedCount} estudiantes.`,
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
