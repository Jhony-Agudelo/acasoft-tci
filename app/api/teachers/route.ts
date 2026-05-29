import { NextRequest, NextResponse } from 'next/server';
import { User, UserRole, UserStatus } from '@/lib/db-schema';
import { isPgConfigured, dbSaveUser, dbGetUsers } from '@/lib/pg-db';

export async function GET(req: NextRequest) {
  try {
    if (isPgConfigured()) {
      const users = await dbGetUsers();
      const teachers = users.filter((u) => u.role === UserRole.TEACHER);
      return NextResponse.json({ success: true, teachers });
    }
    return NextResponse.json({ success: true, message: 'Endpoint de Maestros Activo' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombres, apellidos, email, password, telefono, clientUsers } = body;

    if (!nombres || !apellidos || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Por favor complete todos los campos obligatorios.' },
        { status: 400 }
      );
    }

    let currentUsers: User[] = clientUsers || [];
    if (isPgConfigured()) {
      try {
        currentUsers = await dbGetUsers();
      } catch (dbErr) {
        console.error('Failed to load users from DB during teacher creation fallback to clientUsers:', dbErr);
      }
    }

    const exists = currentUsers.some(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (exists) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un usuario registrado con este correo electrónico.' },
        { status: 400 }
      );
    }

    // Create new Teacher
    const newTeacher: User = {
      id: `usr_${Date.now()}`,
      email: email.toLowerCase().trim(),
      password_hash: password, // Raw password for representation
      role: UserRole.TEACHER,
      status: UserStatus.ACTIVE,
      nombres,
      apellidos,
      telefono: telefono || '',
    };

    if (isPgConfigured()) {
      await dbSaveUser(newTeacher);
    }

    return NextResponse.json({
      success: true,
      message: 'Maestro creado con éxito',
      teacher: newTeacher,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
