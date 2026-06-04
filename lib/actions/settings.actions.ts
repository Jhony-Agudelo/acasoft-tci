"use server";

import { prisma } from '../prisma';
import { SystemSettings, INITIAL_SETTINGS } from '../db-schema';

export async function getSettings(): Promise<SystemSettings> {
  try {
    const settings = await prisma.system_settings.findFirst();
    if (!settings) {
      return INITIAL_SETTINGS;
    }
    return {
      id: settings.id,
      enrollment_open: settings.enrollment_open,
      academic_year: settings.academic_year,
      institution_name: settings.institution_name,
      default_payment_day: settings.default_payment_day || 15,
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return INITIAL_SETTINGS;
  }
}

export async function saveSettings(settings: SystemSettings): Promise<boolean> {
  try {
    await prisma.system_settings.upsert({
      where: { id: settings.id },
      update: {
        enrollment_open: settings.enrollment_open,
        academic_year: settings.academic_year,
        institution_name: settings.institution_name,
        default_payment_day: settings.default_payment_day,
      },
      create: {
        id: settings.id,
        enrollment_open: settings.enrollment_open,
        academic_year: settings.academic_year,
        institution_name: settings.institution_name,
        default_payment_day: settings.default_payment_day,
      },
    });
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}
