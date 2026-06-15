'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getStudentByDocument(documento: string) {
  try {
    const student = await prisma.students.findUnique({
      where: { documento_identidad: documento }
    });
    return student;
  } catch (error) {
    console.error("Error fetching student:", error);
    return null;
  }
}

export async function getStudentVideos(studentId: string) {
  try {
    const videos = await prisma.tracking_videos.findMany({
      where: { student_id: studentId },
      orderBy: { created_at: 'desc' }
    });
    return videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}
