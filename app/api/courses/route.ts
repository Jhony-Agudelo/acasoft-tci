import { NextRequest, NextResponse } from 'next/server';
import { Course } from '@/lib/db-schema';
import { isPgConfigured, dbSaveCourse, dbGetCourses } from '@/lib/pg-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre_curso, teacher_id, schedule, clientCourses } = body;

    if (!nombre_curso || !teacher_id) {
      return NextResponse.json(
        { success: false, error: 'Por favor proporcione el nombre del curso y el maestro asignado.' },
        { status: 400 }
      );
    }

    let currentCourses: Course[] = clientCourses || [];
    if (isPgConfigured()) {
      try {
        currentCourses = await dbGetCourses();
      } catch (dbErr) {
        console.error('Failed to load courses from database, falling back:', dbErr);
      }
    }

    const exists = currentCourses.some(
      (c) => c.nombre_curso.toLowerCase().trim() === nombre_curso.toLowerCase().trim()
    );

    if (exists) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un curso registrado con este nombre.' },
        { status: 400 }
      );
    }

    // Create new Course
    const newCourse: Course = {
      id: `crs_${Date.now()}`,
      nombre_curso,
      teacher_id,
      status: 'ACTIVE',
      schedule: schedule || [],
    };

    if (isPgConfigured()) {
      await dbSaveCourse(newCourse);
    }

    return NextResponse.json({
      success: true,
      message: 'Curso creado e impartido con éxito',
      course: newCourse,
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
    const { id, nombre_curso, teacher_id, schedule, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Por favor proporcione el ID del curso a actualizar.' },
        { status: 400 }
      );
    }

    if (!nombre_curso || !teacher_id) {
      return NextResponse.json(
        { success: false, error: 'Por favor complete todos los datos requeridos del curso.' },
        { status: 400 }
      );
    }

    const updatedCourse: Course = {
      id,
      nombre_curso,
      teacher_id,
      status: status || 'ACTIVE',
      schedule: schedule || [],
    };

    if (isPgConfigured()) {
      await dbSaveCourse(updatedCourse);
    }

    return NextResponse.json({
      success: true,
      message: 'Curso actualizado con éxito',
      course: updatedCourse,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
