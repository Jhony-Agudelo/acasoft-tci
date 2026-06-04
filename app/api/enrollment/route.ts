import { NextRequest, NextResponse } from 'next/server';
import { Student, Guardian, SchoolDayPeriod, StudentStatus } from '@/lib/db-schema';
import { isPgConfigured, dbSaveStudent, dbSaveGuardian, dbGetStudents } from '@/lib/pg-db';
import { getSettings } from '@/lib/actions/settings.actions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      documento_identidad,
      nombres,
      apellidos,
      edad,
      fecha_nacimiento,
      colegio_origen,
      grado_escolar,
      curso_actual,
      jornada_escolar,
      guardian_nombre_completo,
      guardian_direccion,
      guardian_telefono,
      guardian_parentesco,
      clientStudents,
    } = body;

    // Validate Student Required Fields
    if (!documento_identidad || !nombres || !apellidos || !colegio_origen || !jornada_escolar) {
      return NextResponse.json(
        { success: false, error: 'Por favor complete todos los campos requeridos del estudiante.' },
        { status: 400 }
      );
    }

    // Validate Guardian Required Fields
    if (!guardian_nombre_completo || !guardian_direccion || !guardian_telefono || !guardian_parentesco) {
      return NextResponse.json(
        { success: false, error: 'Por favor complete todos los datos requeridos del acudiente.' },
        { status: 400 }
      );
    }

    // Check unique document
    let currentStudents: Student[] = clientStudents || [];
    if (isPgConfigured()) {
      try {
        currentStudents = await dbGetStudents();
      } catch (dbErr) {
        console.error('Failed to load students from DB, defaulting to client sync array:', dbErr);
      }
    }

    const exists = currentStudents.some((s) => s.documento_identidad === documento_identidad);

    if (exists) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un estudiante registrado con este documento de identidad.' },
        { status: 400 }
      );
    }

    // Create Guardian first
    const newGuardianId = `grd_${Date.now()}`;
    const newGuardian: Guardian = {
      id: newGuardianId,
      nombre_completo: guardian_nombre_completo,
      direccion: guardian_direccion,
      telefono: guardian_telefono,
      parentesco: guardian_parentesco,
    };

    // Create Student linking Guardian ID
    const newStudentId = `std_${Date.now()}`;
    
    // Calculate dynamic deadline based on default settings
    const settings = await getSettings();
    const finalPaymentDay = settings.default_payment_day;
    const now = new Date();
    let targetMonth = now.getMonth();
    let targetYear = now.getFullYear();
    if (now.getDate() > finalPaymentDay) {
      targetMonth += 1;
      if (targetMonth > 11) {
        targetMonth = 0;
        targetYear += 1;
      }
    }
    const computedDeadline = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(finalPaymentDay).padStart(2, '0')}`;

    const newStudent: Student = {
      id: newStudentId,
      documento_identidad,
      nombres,
      apellidos,
      fecha_nacimiento: fecha_nacimiento || '',
      edad: Number(edad) || 7,
      colegio_origen,
      grado_escolar: grado_escolar || '',
      curso_actual: curso_actual || 'Kids Starter (Nivel A1.1)',
      jornada_escolar: (jornada_escolar as SchoolDayPeriod) || SchoolDayPeriod.TARDE,
      guardian_id: newGuardianId,
      // Public enrollments are always REGISTERED initially
      status: StudentStatus.REGISTERED, 
      payment_deadline_date: computedDeadline,
      payment_day: finalPaymentDay,
      course_id: null, // Public cannot assign courses
    };

    if (isPgConfigured()) {
      await dbSaveGuardian(newGuardian);
      await dbSaveStudent(newStudent);
    }

    return NextResponse.json({
      success: true,
      message: 'Prematrícula completada exitosamente.',
      student: newStudent,
      guardian: newGuardian,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
