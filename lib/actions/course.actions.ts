"use server";

import { prisma } from '../prisma';
import { Course } from '../db-schema';

function mapCourse(prismaCourse: any): Course {
  return {
    id: prismaCourse.id,
    nombre_curso: prismaCourse.nombre_curso,
    teacher_id: prismaCourse.teacher_id,
    status: prismaCourse.status as 'ACTIVE' | 'INACTIVE',
    schedule: typeof prismaCourse.schedule === 'string' ? JSON.parse(prismaCourse.schedule) : (prismaCourse.schedule || []),
  };
}

export async function getCourses(): Promise<Course[]> {
  try {
    const courses = await prisma.courses.findMany({
      orderBy: { nombre_curso: 'asc' },
    });
    return courses.map(mapCourse);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function saveCourse(course: Course): Promise<boolean> {
  try {
    await prisma.courses.upsert({
      where: { id: course.id },
      update: {
        nombre_curso: course.nombre_curso,
        teacher_id: course.teacher_id,
        status: course.status,
        schedule: course.schedule ? JSON.stringify(course.schedule) : '[]',
      },
      create: {
        id: course.id,
        nombre_curso: course.nombre_curso,
        teacher_id: course.teacher_id,
        status: course.status,
        schedule: course.schedule ? JSON.stringify(course.schedule) : '[]',
      },
    });
    return true;
  } catch (error) {
    console.error('Error saving course:', error);
    return false;
  }
}
