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
  RETIRED = 'RETIRED',
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
  documento_identidad?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  contacto_emergencia?: string;
  parentesco_contacto?: string;
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
  fecha_nacimiento?: string;
  edad: number;
  colegio_origen: string; // From the predefined list of La Virginia, Risaralda
  grado_escolar?: string;
  curso_actual: string;
  jornada_escolar: SchoolDayPeriod;
  guardian_id: string; // Reference to Guardian
  status: StudentStatus;
  payment_deadline_date: string; // YYYY-MM-DD
  payment_day: number;
  course_id?: string | null; // Foreign Key to Course (Nullable / Optional)
}

export interface CourseScheduleItem {
  day: string;
  start_time: string;
  end_time: string;
  main_teacher_id: string; // Reference to User
  support_teacher_1_id?: string; // Optional reference
  support_teacher_2_id?: string; // Optional reference
}

export interface Course {
  id: string; // e.g. "crs_1"
  nombre_curso: string;
  status: 'ACTIVE' | 'INACTIVE';
  schedule?: CourseScheduleItem[];
}

export interface SystemSettings {
  id: string; // Unique, e.g. "global_settings"
  enrollment_open: boolean;
  academic_year: string;
  institution_name: string;
  default_payment_day: number;
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
  id: string; // e.g. "pay_1"
  student_id: string; // Reference to Student
  amount: number;
  payment_date: string; // YYYY-MM-DD
  period_covered: string; // e.g., "Junio 2024"
}

export interface LessonPlanResource {
  title: string;
  url: string;
  type: 'video' | 'document' | 'activity' | 'other';
}

export interface LessonPlan {
  id: string;
  course_id?: string;
  week_start?: string;
  week_end?: string;
  topic: string;
  description: string;
  resources?: LessonPlanResource[];
  level?: string; // "Basico", "Intermedio", "Avanzado"
}

// Predefined schools in La Virginia, Risaralda, Colombia
export const COLEGIOS_LA_VIRGINIA = [
  // Públicos (Instituciones Educativas Oficiales)
  'Institución Educativa Bernardo Arias Trujillo',
  'Institución Educativa Liceo Gabriela Mistral',
  'Institución Educativa Alfonso López Pumarejo',
  'Institución Educativa Pedro Pablo Bello',
  'Liceo Integrado de La Virginia',
  'Centro Educativo Bachillerato en Bienestar Rural',

  // Privados / Colegios
  'Colegio Nuestra Señora de la Presentación',
  'Colegio La Real Academia',

  // Jardines Infantiles / Preescolar
  'Hogar Infantil Comunitario La Virginia (ICBF)',
  'Jardines del Renacer',
  'Preescolar Instituto Feducar',

  // Otros
  'Otro / Particular',
];

// Seed Data for initial testing
export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    email: 'jhony.agudelo@tci.com',
    password_hash: '$2b$10$kD5xMDkIXEWt0YGDEPvnDe2merErxYB3hK.vGVFseqSh7xnGGzGZ6', // 1004627290
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    nombres: 'Jhony Estevan',
    apellidos: 'Agudelo',
    telefono: '3174682253',
    documento_identidad: '1004627290',
    fecha_nacimiento: '14/06/1998',
    direccion: 'Calle 16A #8-75 El Prado',
    contacto_emergencia: '3197927849',
    parentesco_contacto: 'Esposa Admin'
  },
  {
    id: 'usr_t1',
    email: 'sara.fernandez@tci.com',
    password_hash: '$2b$10$cqgKpLj8Tv/MuaB.RpyJROn.WIIXCQiBmKjkZBeIi8PD0ogqMVYEa', // 1087550216
    role: UserRole.TEACHER,
    status: UserStatus.ACTIVE,
    nombres: 'Sara',
    apellidos: 'Fernández Sánchez',
    telefono: '3137814442',
    documento_identidad: '1087550216',
    fecha_nacimiento: '27/octubre/2006',
    direccion: 'Carrera 6a #6-42 Barrio Bavaria',
    contacto_emergencia: '3126222311',
    parentesco_contacto: 'Mamá Maestro'
  },
  {
    id: 'usr_t2',
    email: 'mariana.usuga@tci.com',
    password_hash: '$2b$10$q5IKfGH7H7b7JLXXYH2II.a/hIlyGoAOY5vmucZDa5ORnMCVHgT5m', // 1088240764
    role: UserRole.TEACHER,
    status: UserStatus.ACTIVE,
    nombres: 'Mariana',
    apellidos: 'Usuga Marmolejo',
    telefono: '3103752612',
    documento_identidad: '1088240764',
    fecha_nacimiento: '1/julio/2004',
    direccion: 'CRA 21 #3-14 Los libertadores',
    contacto_emergencia: '3182430900',
    parentesco_contacto: 'Mamá maestro'
  },
  {
    id: 'usr_t3',
    email: 'isabella.castaneda@tci.com',
    password_hash: '$2b$10$AzyhKo6paXNPJ3ACF5Un0.wxDs6Q77if9U4TqG4JUTVc9SfEyzvtS', // 1086635038
    role: UserRole.TEACHER,
    status: UserStatus.ACTIVE,
    nombres: 'Isabella',
    apellidos: 'Castañeda Galvis',
    telefono: '3148450317',
    documento_identidad: '1086635038',
    fecha_nacimiento: '27/noviembre/2007',
    direccion: 'Calle 19a # 11-22 Expansion norte',
    contacto_emergencia: '3215678861',
    parentesco_contacto: 'Mamá Maestro'
  },
  {
    id: 'usr_t4',
    email: 'luisa.canizales@tci.com',
    password_hash: '$2b$10$qOnduLpWheUEqO5tArom6ehi5Okm0RbE.pZ0bQE7XTn4wKPwvLyUW', // 1007220836
    role: UserRole.DIRECTOR,
    status: UserStatus.ACTIVE,
    nombres: 'Luisa Fernanda',
    apellidos: 'Cañizales Ossa',
    telefono: '3197927849',
    documento_identidad: '1007220836',
    fecha_nacimiento: '1/junio/1999',
    direccion: 'Calle 16A #8-75 El Prado',
    contacto_emergencia: '3174682253',
    parentesco_contacto: 'Esposo directora'
  }
];

export const INITIAL_GUARDIANS: Guardian[] = [
  {
    id: 'grd_martin',
    nombre_completo: 'Daniela Cañizales',
    direccion: 'Cra 10 18 b 61',
    telefono: '3228052848',
    parentesco: 'Mamá',
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std_martin',
    documento_identidad: '1089638020',
    nombres: 'Martín',
    apellidos: 'Hincapié Cañizales',
    fecha_nacimiento: '14/3/2019',
    edad: 6,
    colegio_origen: 'Colegio Nuestra Señora de la Presentación',
    grado_escolar: 'Primero',
    curso_actual: 'Kids Starter',
    jornada_escolar: SchoolDayPeriod.TARDE,
    guardian_id: 'grd_martin',
    status: StudentStatus.ACTIVE,
    payment_deadline_date: '2026-06-30',
    payment_day: 15,
    course_id: 'c1',
  }
];

export const INITIAL_COURSES: Course[] = [];

export const INITIAL_SETTINGS: SystemSettings = {
  id: 'global_settings',
  enrollment_open: true,
  academic_year: '2026',
  institution_name: 'TCI - Taller Creativo De Inglés',
};

export const INITIAL_PAYMENTS: Payment[] = [];
