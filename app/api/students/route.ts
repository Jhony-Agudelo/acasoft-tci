import { NextRequest, NextResponse } from 'next/server';
import { Student, Guardian, SchoolDayPeriod, StudentStatus } from '@/lib/db-schema';
import { isPgConfigured, dbSaveStudent, dbSaveGuardian, dbGetStudents } from '@/lib/pg-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      documento_identidad,
      nombres,
      apellidos,
      edad,
      colegio_origen,
      curso_actual,
      jornada_escolar,
      course_id,
      status,
      payment_deadline_date,
      // Guardian details
      guardian_nombre_completo,
      guardian_direccion,
      guardian_telefono,
      guardian_parentesco,
      // State sync
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

    // Check unique document in synchronized state
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

    // Create Student linking Guardian ID and Course ID
    const newStudentId = `std_${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      documento_identidad,
      nombres,
      apellidos,
      edad: Number(edad) || 7,
      colegio_origen,
      curso_actual: curso_actual || 'Kids Starter (Nivel A1.1)',
      jornada_escolar: (jornada_escolar as SchoolDayPeriod) || SchoolDayPeriod.TARDE,
      guardian_id: newGuardianId,
      status: (status as StudentStatus) || StudentStatus.REGISTERED,
      payment_deadline_date: payment_deadline_date || '2026-06-30',
      course_id: course_id || null, // Nullable/Optional assignment
    };

    if (isPgConfigured()) {
      await dbSaveGuardian(newGuardian);
      await dbSaveStudent(newStudent);
    }

    return NextResponse.json({
      success: true,
      message: 'Estudiante y Acudiente registrados exitosamente en la base de datos.',
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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      documento_identidad,
      nombres,
      apellidos,
      edad,
      colegio_origen,
      curso_actual,
      jornada_escolar,
      course_id,
      status,
      payment_deadline_date,
      // Guardian details
      guardian_id,
      guardian_nombre_completo,
      guardian_direccion,
      guardian_telefono,
      guardian_parentesco,
    } = body;

    // Validate Student ID
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Por favor proporcione el ID del estudiante a actualizar.' },
        { status: 400 }
      );
    }

    // Validate Student Required Fields
    if (!documento_identidad || !nombres || !apellidos || !colegio_origen || !jornada_escolar) {
      return NextResponse.json(
        { success: false, error: 'Por favor complete todos los campos requeridos del estudiante.' },
        { status: 400 }
      );
    }

    // Prepare updated Student object
    const updatedStudent: Student = {
      id,
      documento_identidad,
      nombres,
      apellidos,
      edad: Number(edad) || 7,
      colegio_origen,
      curso_actual: curso_actual || 'Kids Starter (Nivel A1.1)',
      jornada_escolar: (jornada_escolar as SchoolDayPeriod) || SchoolDayPeriod.TARDE,
      guardian_id: guardian_id || `grd_${Date.now()}`,
      status: (status as StudentStatus) || StudentStatus.ACTIVE,
      payment_deadline_date: payment_deadline_date || '2026-06-30',
      course_id: course_id !== undefined ? course_id : null,
    };

    // Prepare updated Guardian object
    let updatedGuardian: Guardian | null = null;
    if (guardian_id && guardian_nombre_completo) {
      updatedGuardian = {
        id: guardian_id,
        nombre_completo: guardian_nombre_completo,
        direccion: guardian_direccion || '',
        telefono: guardian_telefono || '',
        parentesco: guardian_parentesco || '',
      };
    }

    if (isPgConfigured()) {
      if (updatedGuardian) {
        await dbSaveGuardian(updatedGuardian);
      }
      await dbSaveStudent(updatedStudent);
    }

    return NextResponse.json({
      success: true,
      message: 'Estudiante y Acudiente actualizados exitosamente en la base de datos.',
      student: updatedStudent,
      guardian: updatedGuardian,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
