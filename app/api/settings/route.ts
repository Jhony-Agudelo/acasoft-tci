import { NextRequest, NextResponse } from 'next/server';
import { SystemSettings } from '@/lib/db-schema';
import { isPgConfigured, dbSaveSettings } from '@/lib/pg-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, enrollment_open, academic_year, institution_name, default_payment_day } = body as SystemSettings;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Falta el ID de configuración' }, { status: 400 });
    }

    const newSettings: SystemSettings = {
      id,
      enrollment_open: Boolean(enrollment_open),
      academic_year,
      institution_name,
      default_payment_day: default_payment_day || 15,
    };

    if (isPgConfigured()) {
      await dbSaveSettings(newSettings);
    }

    return NextResponse.json({ success: true, settings: newSettings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
