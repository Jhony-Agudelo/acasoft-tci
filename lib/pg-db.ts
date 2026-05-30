import { Pool } from 'pg';
import {
  User,
  Guardian,
  Student,
  Course,
  SystemSettings,
  Attendance,
  Payment,
  INITIAL_USERS,
  INITIAL_GUARDIANS,
  INITIAL_STUDENTS,
  INITIAL_COURSES,
  INITIAL_SETTINGS,
  INITIAL_PAYMENTS,
  UserRole,
  UserStatus,
  StudentStatus,
  SchoolDayPeriod,
  AttendanceStatus
} from './db-schema';

let pool: Pool | null = null;

export function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

export function isPgConfigured(): boolean {
  return !!getDatabaseUrl();
}

export function getPool(): Pool {
  if (!pool) {
    const dbUrl = getDatabaseUrl();
    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is not defined');
    }
    pool = new Pool({
      connectionString: dbUrl,
      ssl: dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1') ? false : { rejectUnauthorized: false }
    });
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const client = getPool();
  return client.query(text, params);
}

/**
 * Initializes the database tables and seeds them with INITIAL_* data if they are empty
 */
export async function initPgSchema(): Promise<boolean> {
  if (!isPgConfigured()) {
    return false;
  }

  try {
    // 1. Create tables
    await query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id VARCHAR(100) PRIMARY KEY,
        enrollment_open BOOLEAN NOT NULL,
        academic_year VARCHAR(50) NOT NULL,
        institution_name VARCHAR(255) NOT NULL
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        nombres VARCHAR(255) NOT NULL,
        apellidos VARCHAR(255) NOT NULL,
        telefono VARCHAR(100),
        documento_identidad VARCHAR(100),
        fecha_nacimiento VARCHAR(50),
        direccion TEXT,
        contacto_emergencia VARCHAR(100),
        parentesco_contacto VARCHAR(100)
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS guardians (
        id VARCHAR(100) PRIMARY KEY,
        nombre_completo VARCHAR(255) NOT NULL,
        direccion TEXT NOT NULL,
        telefono VARCHAR(100) NOT NULL,
        parentesco VARCHAR(100) NOT NULL
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(100) PRIMARY KEY,
        nombre_curso VARCHAR(255) NOT NULL,
        teacher_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL,
        schedule JSONB
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(100) PRIMARY KEY,
        documento_identidad VARCHAR(100) UNIQUE NOT NULL,
        nombres VARCHAR(255) NOT NULL,
        apellidos VARCHAR(255) NOT NULL,
        fecha_nacimiento VARCHAR(50),
        edad INTEGER NOT NULL,
        colegio_origen VARCHAR(255) NOT NULL,
        grado_escolar VARCHAR(100),
        curso_actual VARCHAR(255) NOT NULL,
        jornada_escolar VARCHAR(50) NOT NULL,
        guardian_id VARCHAR(100) NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL,
        payment_deadline_date VARCHAR(50) NOT NULL,
        course_id VARCHAR(100) REFERENCES courses(id) ON DELETE SET NULL
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id VARCHAR(100) PRIMARY KEY,
        student_id VARCHAR(100) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        course_id VARCHAR(100) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        date VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(100) PRIMARY KEY,
        student_id VARCHAR(100) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        amount DOUBLE PRECISION NOT NULL,
        payment_date VARCHAR(50) NOT NULL,
        period_covered VARCHAR(100) NOT NULL
      );
    `);

    // 2. Seeding
    // System Settings Setup
    const settingsCheck = await query('SELECT count(*) FROM system_settings');
    if (parseInt(settingsCheck.rows[0].count, 10) === 0) {
      await query(
        'INSERT INTO system_settings (id, enrollment_open, academic_year, institution_name) VALUES ($1, $2, $3, $4)',
        [INITIAL_SETTINGS.id, INITIAL_SETTINGS.enrollment_open, INITIAL_SETTINGS.academic_year, INITIAL_SETTINGS.institution_name]
      );
    }

    // Users seed
    const usersCheck = await query('SELECT count(*) FROM users');
    if (parseInt(usersCheck.rows[0].count, 10) === 0) {
      for (const u of INITIAL_USERS) {
        await query(
          'INSERT INTO users (id, email, password_hash, role, status, nombres, apellidos, telefono, documento_identidad, fecha_nacimiento, direccion, contacto_emergencia, parentesco_contacto) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
          [u.id, u.email, u.password_hash, u.role, u.status, u.nombres, u.apellidos, u.telefono || '', u.documento_identidad || null, u.fecha_nacimiento || null, u.direccion || null, u.contacto_emergencia || null, u.parentesco_contacto || null]
        );
      }
    }

    // Guardians seed
    const guardiansCheck = await query('SELECT count(*) FROM guardians');
    if (parseInt(guardiansCheck.rows[0].count, 10) === 0) {
      for (const g of INITIAL_GUARDIANS) {
        await query(
          'INSERT INTO guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ($1, $2, $3, $4, $5)',
          [g.id, g.nombre_completo, g.direccion, g.telefono, g.parentesco]
        );
      }
    }

    // Courses seed
    const coursesCheck = await query('SELECT count(*) FROM courses');
    if (parseInt(coursesCheck.rows[0].count, 10) === 0) {
      for (const c of INITIAL_COURSES) {
        await query(
          'INSERT INTO courses (id, nombre_curso, teacher_id, status, schedule) VALUES ($1, $2, $3, $4, $5)',
          [c.id, c.nombre_curso, c.teacher_id, c.status, JSON.stringify(c.schedule || [])]
        );
      }
    }

    // Students seed
    const studentsCheck = await query('SELECT count(*) FROM students');
    if (parseInt(studentsCheck.rows[0].count, 10) === 0) {
      for (const s of INITIAL_STUDENTS) {
        await query(
          'INSERT INTO students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
          [
            s.id,
            s.documento_identidad,
            s.nombres,
            s.apellidos,
            s.fecha_nacimiento || null,
            s.edad,
            s.colegio_origen,
            s.grado_escolar || null,
            s.curso_actual,
            s.jornada_escolar,
            s.guardian_id,
            s.status,
            s.payment_deadline_date,
            s.course_id || null
          ]
        );
      }
    }

    // Payments seed
    const paymentsCheck = await query('SELECT count(*) FROM payments');
    if (parseInt(paymentsCheck.rows[0].count, 10) === 0) {
      for (const p of INITIAL_PAYMENTS) {
        await query(
          'INSERT INTO payments (id, student_id, amount, payment_date, period_covered) VALUES ($1, $2, $3, $4, $5)',
          [p.id, p.student_id, p.amount, p.payment_date, p.period_covered]
        );
      }
    }

    return true;
  } catch (err) {
    console.error('Error initializing PostgreSQL tables or seeding data:', err);
    return false;
  }
}

// --- DATABASE FETCH AGENTS ---

export async function dbGetUsers(): Promise<User[]> {
  const res = await query('SELECT * FROM users');
  return res.rows.map((row) => ({
    id: row.id,
    email: row.email,
    password_hash: row.password_hash,
    role: row.role as UserRole,
    status: row.status as UserStatus,
    nombres: row.nombres,
    apellidos: row.apellidos,
    telefono: row.telefono || undefined,
    documento_identidad: row.documento_identidad || undefined,
    fecha_nacimiento: row.fecha_nacimiento || undefined,
    direccion: row.direccion || undefined,
    contacto_emergencia: row.contacto_emergencia || undefined,
    parentesco_contacto: row.parentesco_contacto || undefined,
  }));
}

export async function dbSaveUser(user: User): Promise<void> {
  await query(
    `INSERT INTO users (id, email, password_hash, role, status, nombres, apellidos, telefono, documento_identidad, fecha_nacimiento, direccion, contacto_emergencia, parentesco_contacto)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     ON CONFLICT (id) DO UPDATE SET
       email = EXCLUDED.email,
       password_hash = EXCLUDED.password_hash,
       role = EXCLUDED.role,
       status = EXCLUDED.status,
       nombres = EXCLUDED.nombres,
       apellidos = EXCLUDED.apellidos,
       telefono = EXCLUDED.telefono,
       documento_identidad = EXCLUDED.documento_identidad,
       fecha_nacimiento = EXCLUDED.fecha_nacimiento,
       direccion = EXCLUDED.direccion,
       contacto_emergencia = EXCLUDED.contacto_emergencia,
       parentesco_contacto = EXCLUDED.parentesco_contacto`,
    [user.id, user.email, user.password_hash, user.role, user.status, user.nombres, user.apellidos, user.telefono || null, user.documento_identidad || null, user.fecha_nacimiento || null, user.direccion || null, user.contacto_emergencia || null, user.parentesco_contacto || null]
  );
}

export async function dbGetGuardians(): Promise<Guardian[]> {
  const res = await query('SELECT * FROM guardians');
  return res.rows.map((row) => ({
    id: row.id,
    nombre_completo: row.nombre_completo,
    direccion: row.direccion,
    telefono: row.telefono,
    parentesco: row.parentesco,
  }));
}

export async function dbSaveGuardian(guardian: Guardian): Promise<void> {
  await query(
    `INSERT INTO guardians (id, nombre_completo, direccion, telefono, parentesco)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET
       nombre_completo = EXCLUDED.nombre_completo,
       direccion = EXCLUDED.direccion,
       telefono = EXCLUDED.telefono,
       parentesco = EXCLUDED.parentesco`,
    [guardian.id, guardian.nombre_completo, guardian.direccion, guardian.telefono, guardian.parentesco]
  );
}

export async function dbGetStudents(): Promise<Student[]> {
  const res = await query('SELECT * FROM students');
  return res.rows.map((row) => ({
    id: row.id,
    documento_identidad: row.documento_identidad,
    nombres: row.nombres,
    apellidos: row.apellidos,
    fecha_nacimiento: row.fecha_nacimiento || undefined,
    edad: row.edad,
    colegio_origen: row.colegio_origen,
    grado_escolar: row.grado_escolar || undefined,
    curso_actual: row.curso_actual,
    jornada_escolar: row.jornada_escolar as SchoolDayPeriod,
    guardian_id: row.guardian_id,
    status: row.status as StudentStatus,
    payment_deadline_date: row.payment_deadline_date,
    course_id: row.course_id || null,
  }));
}

export async function dbSaveStudent(student: Student): Promise<void> {
  await query(
    `INSERT INTO students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     ON CONFLICT (id) DO UPDATE SET
       documento_identidad = EXCLUDED.documento_identidad,
       nombres = EXCLUDED.nombres,
       apellidos = EXCLUDED.apellidos,
       fecha_nacimiento = EXCLUDED.fecha_nacimiento,
       edad = EXCLUDED.edad,
       colegio_origen = EXCLUDED.colegio_origen,
       grado_escolar = EXCLUDED.grado_escolar,
       curso_actual = EXCLUDED.curso_actual,
       jornada_escolar = EXCLUDED.jornada_escolar,
       guardian_id = EXCLUDED.guardian_id,
       status = EXCLUDED.status,
       payment_deadline_date = EXCLUDED.payment_deadline_date,
       course_id = EXCLUDED.course_id`,
    [
      student.id,
      student.documento_identidad,
      student.nombres,
      student.apellidos,
      student.fecha_nacimiento || null,
      student.edad,
      student.colegio_origen,
      student.grado_escolar || null,
      student.curso_actual,
      student.jornada_escolar,
      student.guardian_id,
      student.status,
      student.payment_deadline_date,
      student.course_id || null
    ]
  );
}

export async function dbGetCourses(): Promise<Course[]> {
  const res = await query('SELECT * FROM courses');
  return res.rows.map((row) => ({
    id: row.id,
    nombre_curso: row.nombre_curso,
    teacher_id: row.teacher_id,
    status: row.status as 'ACTIVE' | 'INACTIVE',
    schedule: typeof row.schedule === 'string' ? JSON.parse(row.schedule) : (row.schedule || []),
  }));
}

export async function dbSaveCourse(course: Course): Promise<void> {
  await query(
    `INSERT INTO courses (id, nombre_curso, teacher_id, status, schedule)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET
       nombre_curso = EXCLUDED.nombre_curso,
       teacher_id = EXCLUDED.teacher_id,
       status = EXCLUDED.status,
       schedule = EXCLUDED.schedule`,
    [course.id, course.nombre_curso, course.teacher_id, course.status, JSON.stringify(course.schedule || [])]
  );
}

export async function dbGetSettings(): Promise<SystemSettings> {
  const res = await query('SELECT * FROM system_settings LIMIT 1');
  if (res.rows.length === 0) {
    return INITIAL_SETTINGS;
  }
  return {
    id: res.rows[0].id,
    enrollment_open: res.rows[0].enrollment_open,
    academic_year: res.rows[0].academic_year,
    institution_name: res.rows[0].institution_name,
  };
}

export async function dbSaveSettings(settings: SystemSettings): Promise<void> {
  await query(
    `INSERT INTO system_settings (id, enrollment_open, academic_year, institution_name)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET
       enrollment_open = EXCLUDED.enrollment_open,
       academic_year = EXCLUDED.academic_year,
       institution_name = EXCLUDED.institution_name`,
    [settings.id, settings.enrollment_open, settings.academic_year, settings.institution_name]
  );
}

export async function dbGetAttendances(): Promise<Attendance[]> {
  const res = await query('SELECT * FROM attendance');
  return res.rows.map((row) => ({
    id: row.id,
    student_id: row.student_id,
    course_id: row.course_id,
    date: row.date,
    status: row.status as AttendanceStatus,
  }));
}

export async function dbSaveAttendances(attendances: Attendance[]): Promise<void> {
  for (const att of attendances) {
    await query(
      `INSERT INTO attendance (id, student_id, course_id, date, status)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET
         student_id = EXCLUDED.student_id,
         course_id = EXCLUDED.course_id,
         date = EXCLUDED.date,
         status = EXCLUDED.status`,
      [att.id, att.student_id, att.course_id, att.date, att.status]
    );
  }
}

export async function dbGetPayments(): Promise<Payment[]> {
  const res = await query('SELECT * FROM payments');
  return res.rows.map((row) => ({
    id: row.id,
    student_id: row.student_id,
    amount: row.amount,
    payment_date: row.payment_date,
    period_covered: row.period_covered,
  }));
}

export async function dbSavePayment(payment: Payment): Promise<void> {
  await query(
    `INSERT INTO payments (id, student_id, amount, payment_date, period_covered)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET
       student_id = EXCLUDED.student_id,
       amount = EXCLUDED.amount,
       payment_date = EXCLUDED.payment_date,
       period_covered = EXCLUDED.period_covered`,
    [payment.id, payment.student_id, payment.amount, payment.payment_date, payment.period_covered]
  );
}
