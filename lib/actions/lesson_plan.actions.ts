"use server";

import { prisma } from '../prisma';
import { LessonPlan } from '../db-schema';

function mapLessonPlan(prismaPlan: any): LessonPlan {
  return {
    id: prismaPlan.id,
    course_id: prismaPlan.course_id || undefined,
    week_start: prismaPlan.week_start || undefined,
    week_end: prismaPlan.week_end || undefined,
    topic: prismaPlan.topic,
    description: prismaPlan.description,
    resources: typeof prismaPlan.resources === 'string' ? JSON.parse(prismaPlan.resources) : (prismaPlan.resources || []),
    level: prismaPlan.level || undefined,
  };
}

export async function getLessonPlansByCourse(courseId: string): Promise<LessonPlan[]> {
  try {
    const plans = await prisma.lesson_plans.findMany({
      where: { course_id: courseId },
      orderBy: { week_start: 'desc' },
    });
    return plans.map(mapLessonPlan);
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    return [];
  }
}

export async function getLessonPlanTemplates(): Promise<LessonPlan[]> {
  try {
    const plans = await prisma.lesson_plans.findMany({
      where: { course_id: null },
      orderBy: { topic: 'asc' },
    });
    return plans.map(mapLessonPlan);
  } catch (error) {
    console.error('Error fetching lesson plan templates:', error);
    return [];
  }
}

export async function saveLessonPlan(plan: LessonPlan): Promise<boolean> {
  try {
    await prisma.lesson_plans.upsert({
      where: { id: plan.id },
      update: {
        week_start: plan.week_start || null,
        week_end: plan.week_end || null,
        topic: plan.topic,
        description: plan.description,
        resources: plan.resources as any,
        level: plan.level || null,
      },
      create: {
        id: plan.id,
        course_id: plan.course_id || null,
        week_start: plan.week_start || null,
        week_end: plan.week_end || null,
        topic: plan.topic,
        description: plan.description,
        resources: plan.resources as any,
        level: plan.level || null,
      },
    });
    return true;
  } catch (error) {
    console.error('Error saving lesson plan:', error);
    return false;
  }
}

export async function deleteLessonPlan(planId: string): Promise<boolean> {
  try {
    await prisma.lesson_plans.delete({
      where: { id: planId },
    });
    return true;
  } catch (error) {
    console.error('Error deleting lesson plan:', error);
    return false;
  }
}
