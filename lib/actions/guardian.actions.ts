"use server";

import { prisma } from '../prisma';
import { Guardian } from '../db-schema';

function mapGuardian(prismaGuardian: any): Guardian {
  return {
    id: prismaGuardian.id,
    nombre_completo: prismaGuardian.nombre_completo,
    direccion: prismaGuardian.direccion,
    telefono: prismaGuardian.telefono,
    parentesco: prismaGuardian.parentesco,
  };
}

export async function getGuardians(): Promise<Guardian[]> {
  try {
    const guardians = await prisma.guardians.findMany({
      orderBy: { nombre_completo: 'asc' },
    });
    return guardians.map(mapGuardian);
  } catch (error) {
    console.error('Error fetching guardians:', error);
    return [];
  }
}

export async function saveGuardian(guardian: Guardian): Promise<boolean> {
  try {
    await prisma.guardians.upsert({
      where: { id: guardian.id },
      update: {
        nombre_completo: guardian.nombre_completo,
        direccion: guardian.direccion,
        telefono: guardian.telefono,
        parentesco: guardian.parentesco,
      },
      create: {
        id: guardian.id,
        nombre_completo: guardian.nombre_completo,
        direccion: guardian.direccion,
        telefono: guardian.telefono,
        parentesco: guardian.parentesco,
      },
    });
    return true;
  } catch (error) {
    console.error('Error saving guardian:', error);
    return false;
  }
}
