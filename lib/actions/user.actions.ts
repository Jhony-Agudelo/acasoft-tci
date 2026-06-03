"use server";

import { prisma } from '../prisma';
import { User, UserRole, UserStatus } from '../db-schema';

function mapUser(prismaUser: any): User {
  return {
    id: prismaUser.id,
    email: prismaUser.email,
    password_hash: prismaUser.password_hash,
    role: prismaUser.role as UserRole,
    status: prismaUser.status as UserStatus,
    nombres: prismaUser.nombres,
    apellidos: prismaUser.apellidos,
    telefono: prismaUser.telefono || undefined,
    documento_identidad: prismaUser.documento_identidad || undefined,
    fecha_nacimiento: prismaUser.fecha_nacimiento || undefined,
    direccion: prismaUser.direccion || undefined,
    contacto_emergencia: prismaUser.contacto_emergencia || undefined,
    parentesco_contacto: prismaUser.parentesco_contacto || undefined,
  };
}

export async function getUsers(): Promise<User[]> {
  try {
    const users = await prisma.users.findMany({
      orderBy: { nombres: 'asc' },
    });
    return users.map(mapUser);
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function saveUser(user: User): Promise<boolean> {
  try {
    await prisma.users.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        password_hash: user.password_hash,
        role: user.role,
        status: user.status,
        nombres: user.nombres,
        apellidos: user.apellidos,
        telefono: user.telefono || null,
        documento_identidad: user.documento_identidad || null,
        fecha_nacimiento: user.fecha_nacimiento || null,
        direccion: user.direccion || null,
        contacto_emergencia: user.contacto_emergencia || null,
        parentesco_contacto: user.parentesco_contacto || null,
      },
      create: {
        id: user.id,
        email: user.email,
        password_hash: user.password_hash,
        role: user.role,
        status: user.status,
        nombres: user.nombres,
        apellidos: user.apellidos,
        telefono: user.telefono || null,
        documento_identidad: user.documento_identidad || null,
        fecha_nacimiento: user.fecha_nacimiento || null,
        direccion: user.direccion || null,
        contacto_emergencia: user.contacto_emergencia || null,
        parentesco_contacto: user.parentesco_contacto || null,
      },
    });
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
}
