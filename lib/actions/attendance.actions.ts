"use server";

import { prisma } from '../prisma';
import { Attendance, AttendanceStatus } from '../db-schema';

function mapAttendance(prismaAttendance: any): Attendance {
  return {
    id: prismaAttendance.id,
    student_id: prismaAttendance.student_id,
    course_id: prismaAttendance.course_id,
    date: prismaAttendance.date,
    status: prismaAttendance.status as AttendanceStatus,
  };
}

export async function getAttendances(): Promise<Attendance[]> {
  try {
    const attendances = await prisma.attendance.findMany({
      orderBy: { date: 'desc' },
    });
    return attendances.map(mapAttendance);
  } catch (error) {
    console.error('Error fetching attendances:', error);
    return [];
  }
}

export async function saveAttendances(attendances: Attendance[]): Promise<boolean> {
  try {
    for (const att of attendances) {
      await prisma.attendance.upsert({
        where: { id: att.id },
        update: {
          student_id: att.student_id,
          course_id: att.course_id,
          date: att.date,
          status: att.status,
        },
        create: {
          id: att.id,
          student_id: att.student_id,
          course_id: att.course_id,
          date: att.date,
          status: att.status,
        },
      });
    }
    return true;
  } catch (error) {
    console.error('Error saving attendances:', error);
    return false;
  }
}
