import { NextRequest, NextResponse } from 'next/server';
import {
  isPgConfigured,
  initPgSchema,
  dbGetUsers,
  dbGetGuardians,
  dbGetStudents,
  dbGetCourses,
  dbGetSettings,
  dbGetAttendances,
  dbGetPayments,
  query
} from '@/lib/pg-db';

export async function GET(req: NextRequest) {
  try {
    if (!isPgConfigured()) {
      return NextResponse.json({ postgres: false });
    }

    // Auto-migrate tables and run seed script if empty
    await initPgSchema();

    const [users, guardians, students, courses, settings, attendances, payments] = await Promise.all([
      dbGetUsers(),
      dbGetGuardians(),
      dbGetStudents(),
      dbGetCourses(),
      dbGetSettings(),
      dbGetAttendances(),
      dbGetPayments()
    ]);

    return NextResponse.json({
      postgres: true,
      data: {
        users,
        guardians,
        students,
        courses,
        settings,
        attendances,
        payments
      }
    });
  } catch (error: any) {
    console.error('Database Sync Endpoint GET Error:', error);
    return NextResponse.json({
      postgres: true,
      error: error.message || 'Error general en sincronización con PostgreSQL.'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isPgConfigured()) {
      return NextResponse.json({ postgres: false, message: 'PostgreSQL no está configurado.' });
    }

    // Force run initSchema
    const initialized = await initPgSchema();

    return NextResponse.json({
      success: true,
      postgres: true,
      initialized,
      message: 'Base de datos PostgreSQL inicializada / verificada con éxito.'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      postgres: true,
      error: error.message || 'Error al iniciar base de datos'
    }, { status: 500 });
  }
}

/**
 * Handle database resets directly on Postgres
 */
export async function DELETE(req: NextRequest) {
  try {
    if (!isPgConfigured()) {
      return NextResponse.json({ postgres: false });
    }

    // Clear all tables
    await query('TRUNCATE TABLE payments, attendance, students, courses, guardians, users, system_settings CASCADE');
    
    // Re-run schema initialization & seed
    await initPgSchema();

    return NextResponse.json({
      success: true,
      postgres: true,
      message: 'Base de datos PostgreSQL truncada y re-sembrada con valores de origen.'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      postgres: true,
      error: error.message || 'Error al resetear la base de datos'
    }, { status: 500 });
  }
}
