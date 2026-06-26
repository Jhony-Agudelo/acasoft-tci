"use server";

import { prisma } from '../prisma';
import { Student, StudentStatus, SchoolDayPeriod } from '../db-schema';

// Maps Prisma output to the expected Student interface
function mapStudent(prismaStudent: any): Student {
  return {
    id: prismaStudent.id,
    documento_identidad: prismaStudent.documento_identidad,
    nombres: prismaStudent.nombres,
    apellidos: prismaStudent.apellidos,
    fecha_nacimiento: prismaStudent.fecha_nacimiento || undefined,
    edad: prismaStudent.edad,
    colegio_origen: prismaStudent.colegio_origen,
    grado_escolar: prismaStudent.grado_escolar || undefined,
    curso_actual: prismaStudent.curso_actual,
    jornada_escolar: prismaStudent.jornada_escolar as SchoolDayPeriod,
    guardian_id: prismaStudent.guardian_id,
    status: prismaStudent.status as StudentStatus,
    payment_deadline_date: prismaStudent.payment_deadline_date,
    payment_day: prismaStudent.payment_day,
    course_id: prismaStudent.course_id || null,
  };
}

export async function getStudents(): Promise<Student[]> {
  try {
    const students = await prisma.students.findMany({
      orderBy: { apellidos: 'asc' },
    });
    return students.map(mapStudent);
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
  try {
    const student = await prisma.students.findUnique({
      where: { id },
    });
    if (!student) return null;
    return mapStudent(student);
  } catch (error) {
    console.error('Error fetching student by id:', error);
    return null;
  }
}

export async function saveStudent(student: Student): Promise<boolean> {
  try {
    await prisma.students.upsert({
      where: { id: student.id },
      update: {
        documento_identidad: student.documento_identidad,
        nombres: student.nombres,
        apellidos: student.apellidos,
        fecha_nacimiento: student.fecha_nacimiento || null,
        edad: student.edad,
        colegio_origen: student.colegio_origen,
        grado_escolar: student.grado_escolar || null,
        curso_actual: student.curso_actual,
        jornada_escolar: student.jornada_escolar,
        guardian_id: student.guardian_id,
        status: student.status,
        payment_deadline_date: student.payment_deadline_date,
        payment_day: student.payment_day,
        course_id: student.course_id || null,
      },
      create: {
        id: student.id,
        documento_identidad: student.documento_identidad,
        nombres: student.nombres,
        apellidos: student.apellidos,
        fecha_nacimiento: student.fecha_nacimiento || null,
        edad: student.edad,
        colegio_origen: student.colegio_origen,
        grado_escolar: student.grado_escolar || null,
        curso_actual: student.curso_actual,
        jornada_escolar: student.jornada_escolar,
        guardian_id: student.guardian_id,
        status: student.status,
        payment_deadline_date: student.payment_deadline_date,
        payment_day: student.payment_day,
        course_id: student.course_id || null,
      },
    });
    return true;
  } catch (error) {
    console.error('Error saving student:', error);
    return false;
  }
}
