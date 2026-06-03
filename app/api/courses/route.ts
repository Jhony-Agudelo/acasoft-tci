import { NextRequest, NextResponse } from 'next/server';
import { Course } from '@/lib/db-schema';
import { saveCourse, getCourses } from '@/lib/actions/course.actions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre_curso, schedule } = body;

    if (!nombre_curso) {
      return NextResponse.json(
        { success: false, error: 'Por favor proporcione el nombre del curso.' },
        { status: 400 }
      );
    }

    const currentCourses = await getCourses();

    const exists = currentCourses.some(
      (c) => c.nombre_curso.toLowerCase().trim() === nombre_curso.toLowerCase().trim()
    );

    if (exists) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un curso registrado con este nombre.' },
        { status: 400 }
      );
    }

    const newCourse: Course = {
      id: `crs_${Date.now()}`,
      nombre_curso,
      status: 'ACTIVE',
      schedule: schedule || [],
    };

    await saveCourse(newCourse);

    return NextResponse.json({
      success: true,
      message: 'Curso creado con éxito',
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
    const { id, nombre_curso, schedule, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Por favor proporcione el ID del curso a actualizar.' },
        { status: 400 }
      );
    }

    if (!nombre_curso) {
      return NextResponse.json(
        { success: false, error: 'Por favor complete todos los datos requeridos del curso.' },
        { status: 400 }
      );
    }

    const updatedCourse: Course = {
      id,
      nombre_curso,
      status: status || 'ACTIVE',
      schedule: schedule || [],
    };

    await saveCourse(updatedCourse);

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
