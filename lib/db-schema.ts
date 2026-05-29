export enum UserRole {
  DIRECTOR = 'DIRECTOR',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum SchoolDayPeriod {
  MANANA = 'MAÑANA',
  TARDE = 'TARDE',
}

export enum StudentStatus {
  REGISTERED = 'REGISTERED',
  IN_INTERVIEW = 'IN_INTERVIEW',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

export interface User {
  id: string; // e.g. "usr_1"
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  nombres: string;
  apellidos: string;
  telefono?: string;
}

export interface Guardian {
  id: string; // e.g. "grd_1"
  nombre_completo: string;
  direccion: string;
  telefono: string;
  parentesco: string; // e.g., Madre, Padre, Abuelo/a, Tío/a, Tutor Legal
}

export interface Student {
  id: string; // e.g. "std_1"
  documento_identidad: string; // Unique
  nombres: string;
  apellidos: string;
  edad: number;
  colegio_origen: string; // From the predefined list of La Virginia, Risaralda
  curso_actual: string;
  jornada_escolar: SchoolDayPeriod;
  guardian_id: string; // Reference to Guardian
  status: StudentStatus;
  payment_deadline_date: string; // YYYY-MM-DD
  course_id?: string | null; // Foreign Key to Course (Nullable / Optional)
}

export interface CourseScheduleItem {
  day: string;
  start_time: string;
  end_time: string;
}

export interface Course {
  id: string; // e.g. "crs_1"
  nombre_curso: string;
  teacher_id: string; // Reference to User (TEACHER)
  status: 'ACTIVE' | 'INACTIVE';
  schedule?: CourseScheduleItem[];
}

export interface SystemSettings {
  id: string; // Unique, e.g. "global_settings"
  enrollment_open: boolean;
  academic_year: string;
  institution_name: string;
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  EXCUSED = 'EXCUSED',
}

export interface Attendance {
  id: string;
  student_id: string; // Foreign Key to Student
  course_id: string;  // Foreign Key to Course
  date: string;       // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface Payment {
  id: string;
  student_id: string; // Foreign Key to Student
  amount: number;
  payment_date: string; // YYYY-MM-DD
  period_covered: string; // Ej. "Junio 2026"
}

// Predefined schools in La Virginia, Risaralda, Colombia
export const COLEGIOS_LA_VIRGINIA = [
  'Institución Educativa Bernardo Arias Trujillo',
  'Institución Educativa Gabriela Mistral',
  'Institución Educativa La Virginia',
  'Institución Educativa Pedro Pablo Bello',
  'Colegio Nuestra Señora de la Presentación',
  'Liceo Integrado de La Virginia',
  'Otro / Particular',
];

// Seed Data for initial testing
export const INITIAL_USERS: User[] = [
  {
    id: 'usr_dir',
    email: 'director@translinguakids.com',
    password_hash: 'director123', // Clean text for demo/MVP purposes
    role: UserRole.DIRECTOR,
    status: UserStatus.ACTIVE,
    nombres: 'María Camila',
    apellidos: 'Gómez Restrepo',
    telefono: '3124567890',
  },
  {
    id: 'usr_adm',
    email: 'admin@translinguakids.com',
    password_hash: 'admin123',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    nombres: 'Andrés Felipe',
    apellidos: 'Ríos Cardona',
    telefono: '3159876543',
  },
  {
    id: 'usr_t1',
    email: 'teacher.ana@translinguakids.com',
    password_hash: 'teacher123',
    role: UserRole.TEACHER,
    status: UserStatus.ACTIVE,
    nombres: 'Estefanía (Ana)',
    apellidos: 'López Osorio',
    telefono: '3206543210',
  },
  {
    id: 'usr_t2',
    email: 'teacher.carlos@translinguakids.com',
    password_hash: 'teacher123',
    role: UserRole.TEACHER,
    status: UserStatus.ACTIVE,
    nombres: 'Carlos Mario',
    apellidos: 'Gutiérrez Díaz',
    telefono: '3112345678',
  },
  {
    id: 'usr_inactivo',
    email: 'inactivo@translinguakids.com',
    password_hash: 'inactivo123',
    role: UserRole.TEACHER,
    status: UserStatus.INACTIVE,
    nombres: 'Profesor Inactivo',
    apellidos: 'Prueba de Seguridad',
    telefono: '3000000000',
  }
];

export const INITIAL_GUARDIANS: Guardian[] = [
  {
    id: 'grd_1',
    nombre_completo: 'Luz Marina Arenas',
    direccion: 'Calle 10 # 5-21, Barrio Centro, La Virginia',
    telefono: '3147778899',
    parentesco: 'Madre',
  },
  {
    id: 'grd_2',
    nombre_completo: 'Jorge Eliécer Salazar',
    direccion: 'Carrera 8 # 12-45, Barrio Balsillas, La Virginia',
    telefono: '3105556677',
    parentesco: 'Padre',
  },
  {
    id: 'grd_3',
    nombre_completo: 'Alba Lucía Bermúdez',
    direccion: 'Avenida de la Ceiba # 18-09, La Virginia',
    telefono: '3183334455',
    parentesco: 'Tutor Legal (Abuela)',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std_1',
    documento_identidad: '1088456123',
    nombres: 'Samuel Alejandro',
    apellidos: 'Salazar Arenas',
    edad: 8,
    colegio_origen: 'Institución Educativa Bernardo Arias Trujillo',
    curso_actual: 'Kids Starter (Nivel A1.1)',
    jornada_escolar: SchoolDayPeriod.TARDE,
    guardian_id: 'grd_1',
    status: StudentStatus.ACTIVE,
    payment_deadline_date: '2026-06-05',
    course_id: 'crs_1',
  },
  {
    id: 'std_2',
    documento_identidad: '1099234567',
    nombres: 'Juliana María',
    apellidos: 'Salazar Arenas',
    edad: 10,
    colegio_origen: 'Institución Educativa Bernardo Arias Trujillo',
    curso_actual: 'Kids Intermediate (Nivel A1.2)',
    jornada_escolar: SchoolDayPeriod.TARDE,
    guardian_id: 'grd_1',
    status: StudentStatus.IN_INTERVIEW,
    payment_deadline_date: '2026-06-10',
    course_id: null,
  },
  {
    id: 'std_3',
    documento_identidad: '1102456789',
    nombres: 'Mateo',
    apellidos: 'Ríos Bermúdez',
    edad: 6,
    colegio_origen: 'Colegio Nuestra Señora de la Presentación',
    curso_actual: 'Preschool Explorer',
    jornada_escolar: SchoolDayPeriod.MANANA,
    guardian_id: 'grd_3',
    status: StudentStatus.REGISTERED,
    payment_deadline_date: '2026-06-15',
    course_id: null,
  },
  {
    id: 'std_4',
    documento_identidad: '1085112233',
    nombres: 'Sofía',
    apellidos: 'Velasquez Henao',
    edad: 12,
    colegio_origen: 'Institución Educativa Gabriela Mistral',
    curso_actual: 'Teens English Pre-A2',
    jornada_escolar: SchoolDayPeriod.TARDE,
    guardian_id: 'grd_2',
    status: StudentStatus.ACTIVE,
    payment_deadline_date: '2026-06-02',
    course_id: 'crs_2',
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs_1',
    nombre_curso: 'Kids English Starter - Gr. A',
    teacher_id: 'usr_t1', // Teacher Ana
    status: 'ACTIVE',
    schedule: [
      { day: 'Lunes', start_time: '14:00', end_time: '16:00' },
      { day: 'Miércoles', start_time: '14:00', end_time: '16:00' }
    ]
  },
  {
    id: 'crs_2',
    nombre_curso: 'Preschool Explorer - Gr. B',
    teacher_id: 'usr_t2', // Teacher Carlos
    status: 'ACTIVE',
    schedule: [
      { day: 'Martes', start_time: '09:00', end_time: '11:00' },
      { day: 'Jueves', start_time: '09:00', end_time: '11:00' }
    ]
  },
  {
    id: 'crs_3',
    nombre_curso: 'Kids Intermediate - Gr. A',
    teacher_id: 'usr_t1', // Teacher Ana
    status: 'ACTIVE',
    schedule: [
      { day: 'Lunes', start_time: '16:00', end_time: '18:00' },
      { day: 'Miércoles', start_time: '16:00', end_time: '18:00' }
    ]
  },
  {
    id: 'crs_4',
    nombre_curso: 'Teens English - Gr. C',
    teacher_id: 'usr_t2', // Teacher Carlos
    status: 'INACTIVE',
    schedule: [
      { day: 'Sábado', start_time: '08:00', end_time: '12:00' }
    ]
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  id: 'global_settings',
  enrollment_open: true,
  academic_year: '2026',
  institution_name: 'TCI - Taller Creativo De Inglés',
};

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    student_id: 'std_1',
    amount: 150000,
    payment_date: '2026-05-05',
    period_covered: 'Mayo 2026'
  },
  {
    id: 'pay_2',
    student_id: 'std_4',
    amount: 150000,
    payment_date: '2026-05-02',
    period_covered: 'Mayo 2026'
  }
];
