import { PrismaClient } from '@prisma/client';
import { INITIAL_USERS, INITIAL_SETTINGS } from '../lib/db-schema';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de sembrado (seeding)...');

  // Insertar Usuarios Iniciales
  for (const user of INITIAL_USERS) {
    const exists = await prisma.users.findUnique({ where: { id: user.id } });
    if (!exists) {
      await prisma.users.create({
        data: {
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
          avatar_url: user.avatar_url || null,
        }
      });
      console.log(`Usuario creado: ${user.email}`);
    } else {
      console.log(`Usuario ya existe: ${user.email}`);
    }
  }

  // Insertar Configuración Inicial
  const settingsExist = await prisma.system_settings.findUnique({ where: { id: INITIAL_SETTINGS.id } });
  if (!settingsExist) {
    await prisma.system_settings.create({
      data: {
        id: INITIAL_SETTINGS.id,
        enrollment_open: INITIAL_SETTINGS.enrollment_open,
        academic_year: INITIAL_SETTINGS.academic_year,
        institution_name: INITIAL_SETTINGS.institution_name,
        default_payment_day: INITIAL_SETTINGS.default_payment_day,
      }
    });
    console.log('Configuración inicial guardada.');
  }

  console.log('¡Sembrado completado con éxito!');
}

main()
  .catch((e) => {
    console.error('Error durante el sembrado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
