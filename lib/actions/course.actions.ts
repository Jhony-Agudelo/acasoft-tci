"use server";

import { prisma } from '../prisma';
import { Course } from '../db-schema';

function mapCourse(prismaCourse: any): Course {
  let schedule = typeof prismaCourse.schedule === 'string' ? JSON.parse(prismaCourse.schedule) : (prismaCourse.schedule || []);
  
  schedule = schedule.map((s: any) => {
    if (s.support_teacher_1_id !== undefined || s.support_teacher_2_id !== undefined) {
      const support_teachers = [];
      if (s.support_teacher_1_id) support_teachers.push(s.support_teacher_1_id);
      if (s.support_teacher_2_id) support_teachers.push(s.support_teacher_2_id);
      
      const newS = { ...s, support_teachers };
      delete newS.support_teacher_1_id;
      delete newS.support_teacher_2_id;
      return newS;
    }
    if (!s.support_teachers) s.support_teachers = [];
    return s;
  });

  return {
    id: prismaCourse.id,
    nombre_curso: prismaCourse.nombre_curso,
    status: prismaCourse.status as 'ACTIVE' | 'INACTIVE',
    schedule: schedule,
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
        status: course.status,
        schedule: course.schedule ? (course.schedule as any) : [],
      },
      create: {
        id: course.id,
        nombre_curso: course.nombre_curso,
        status: course.status,
        schedule: course.schedule ? (course.schedule as any) : [],
      },
    });
    return true;
  } catch (error) {
    console.error('Error saving course:', error);
    return false;
  }
}
