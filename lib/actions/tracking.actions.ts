'use server';

import { PrismaClient } from '@prisma/client';
import { TrackingVideo } from '../db-schema';

const prisma = new PrismaClient();

export async function getTrackingVideos(student_id: string) {
  const videos = await prisma.tracking_videos.findMany({
    where: { student_id },
    orderBy: { created_at: 'desc' },
  });
  return videos;
}

export async function saveTrackingVideo(video: TrackingVideo) {
  const { id, student_id, title, video_url } = video;
  
  const saved = await prisma.tracking_videos.upsert({
    where: { id },
    update: { title, video_url },
    create: { id, student_id, title, video_url },
  });
  
  return saved;
}

export async function deleteTrackingVideo(id: string) {
  await prisma.tracking_videos.delete({
    where: { id },
  });
  return { success: true };
}
