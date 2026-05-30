import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('tci_session');

    return NextResponse.json({
      success: true,
      message: 'Sesión cerrada exitosamente',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
