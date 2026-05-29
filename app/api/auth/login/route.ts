import { NextRequest, NextResponse } from 'next/server';
import { User, UserStatus, INITIAL_USERS } from '@/lib/db-schema';
import { validateUserStatus } from '@/lib/auth-middleware';
import { isPgConfigured, dbGetUsers } from '@/lib/pg-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, clientUsers } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Por favor complete todos los campos.' },
        { status: 400 }
      );
    }

    // Attempt to read users from PostgreSQL if configured
    let usersList: User[] = [];
    if (isPgConfigured()) {
      try {
        usersList = await dbGetUsers();
      } catch (dbErr: any) {
        console.error('Failed to query users from PostgreSQL, falling back:', dbErr);
        usersList = clientUsers && clientUsers.length > 0 ? clientUsers : INITIAL_USERS;
      }
    } else {
      // Use users from custom client-state sync if provided, otherwise fallback to standard list
      // This allows visual adjustments the user makes in the browser to instantly reflect in server controllers!
      usersList = clientUsers && clientUsers.length > 0 ? clientUsers : INITIAL_USERS;
    }
    
    let user = usersList.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    // Hard fallback if still not found and database wasn't used or returned nothing
    if (!user) {
      user = INITIAL_USERS.find(
        (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas: Correo electrónico no registrado.' },
        { status: 401 }
      );
    }

    // Simple plain password match for MVP
    if (user.password_hash !== password) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas: Contraseña incorrecta.' },
        { status: 401 }
      );
    }

    // STRICT VALIDATION MANDATE: Reject INACTIVE users immediately
    const statusCheck = validateUserStatus(user);
    if (!statusCheck.eligible) {
      return NextResponse.json(
        { success: false, error: statusCheck.error },
        { status: 403 }
      );
    }

    // Successful login
    return NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        nombres: user.nombres,
        apellidos: user.apellidos,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
