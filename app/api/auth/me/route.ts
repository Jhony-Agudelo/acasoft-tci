import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('tci_session')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const payload = await verifyJwt(token);

    if (!payload || !payload.user) {
      return NextResponse.json(
        { success: false, error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: payload.user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
