import { NextRequest, NextResponse } from 'next/server';
import { Attendance, AttendanceStatus } from '@/lib/db-schema';
import { isPgConfigured, dbSaveAttendances } from '@/lib/pg-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { course_id, date, records } = body;

    if (!course_id || !date || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { success: false, error: 'Por favor complete todos los campos obligatorios y proporcione los registros de asistencia.' },
        { status: 400 }
      );
    }

    // records expect to have: { student_id: string, status: AttendanceStatus }
    const newAttendances: Attendance[] = records.map((rec: any, idx: number) => {
      return {
        id: `att_${Date.now()}_${idx}_${Math.floor(Math.random() * 1000)}`,
        student_id: rec.student_id,
        course_id: course_id,
        date: date,
        status: rec.status as AttendanceStatus,
      };
    });

    if (isPgConfigured()) {
      await dbSaveAttendances(newAttendances);
    }

    return NextResponse.json({
      success: true,
      message: 'Registros de asistencia creados exitosamente.',
      attendances: newAttendances,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
