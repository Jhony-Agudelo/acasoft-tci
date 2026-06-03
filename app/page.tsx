'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import logoApp from '../assets/img/logoApp.png';
import { 
  User, 
  Guardian, 
  Student, 
  Course, 
  SystemSettings, 
  Attendance, 
  Payment,
  UserRole,
  UserStatus,
  StudentStatus,
  SchoolDayPeriod,
  CourseScheduleItem,
  COLEGIOS_LA_VIRGINIA,
  AttendanceStatus,
  INITIAL_SETTINGS
} from '@/lib/db-schema';
import { getUsers, saveUser } from '@/lib/actions/user.actions';
import { getStudents, saveStudent } from '@/lib/actions/student.actions';
import { getGuardians, saveGuardian } from '@/lib/actions/guardian.actions';
import { getCourses, saveCourse } from '@/lib/actions/course.actions';
import { getSettings, saveSettings } from '@/lib/actions/settings.actions';
import { getAttendances, saveAttendances } from '@/lib/actions/attendance.actions';
import { getPayments, savePayment } from '@/lib/actions/payment.actions';
import { simulateMiddlewareCheck, validateUserStatus } from '@/lib/auth-middleware';
import {
  GraduationCap,
  Users,
  BookOpen,
  Settings,
  ShieldCheck,
  Database,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  School,
  Calendar,
  DollarSign,
  UserCheck,
  FileCode,
  Copy,
  Check,
  MapPin,
  User as UserIcon,
  Phone,
  ArrowRight,
  Menu,
  X,
  Home as HomeIcon,
  Sparkles,
  Edit2,
  Printer,
} from 'lucide-react';

export default function Home() {
  // --- DATABASE STATE ---
  const [dbUsers, setDbUsers] = useState<User[]>([]);
  const [dbGuardians, setDbGuardians] = useState<Guardian[]>([]);
  const [dbStudents, setDbStudents] = useState<Student[]>([]);
  const [dbCourses, setDbCourses] = useState<Course[]>([]);
  const [dbSettings, setDbSettings] = useState<SystemSettings | null>(null);
  const [dbAttendances, setDbAttendances] = useState<Attendance[]>([]);
  const [dbPayments, setDbPayments] = useState<Payment[]>([]);

  useEffect(() => {
    getUsers().then(setDbUsers);
    getGuardians().then(setDbGuardians);
    getStudents().then(setDbStudents);
    getCourses().then(setDbCourses);
    getSettings().then(setDbSettings);
    getAttendances().then(setDbAttendances);
    getPayments().then(setDbPayments);
  }, []);

  // --- UI STATES ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Sidebar navigation selection
  const [selectedSidebarView, setSelectedSidebarView] = useState<'inicio' | 'estudiantes' | 'maestros' | 'cursos' | 'configuracion' | 'pagos'>('inicio');

  // --- PAYMENT / FINANCIAL STATES ---
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [paymentStudentId, setPaymentStudentId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('150000');
  const [paymentPeriod, setPaymentPeriod] = useState('Junio 2026');
  const [paymentDateInput, setPaymentDateInput] = useState(() => new Date().toISOString().split('T')[0]);
  const [registeringPayment, setRegisteringPayment] = useState(false);
  const [paymentSearch, setPaymentSearch] = useState('');

  // --- CRON JOB WORKSPACE SIMULATION ---
  const [runningCron, setRunningCron] = useState(false);
  const [cronCustomDate, setCronCustomDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Subutility schemas view
  const [sqlView, setSqlView] = useState<'prisma' | 'sql'>('prisma');

  // --- LOGIN FORM STATE ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- SEARCH AND FILTERS ---
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilterStatus, setStudentFilterStatus] = useState<string>('TODOS');

  // --- MIDDLEWARE LOG CONSOLE ---
  const [middlewareLogs, setMiddlewareLogs] = useState<Array<{ time: string; action: string; status: 'SUCCESS' | 'DENIED' | 'INFO'; msg: string }>>(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return [{ time: timeStr, action: 'System Startup', status: 'INFO', msg: 'Base de datos simulada de TCI - Taller Creativo De Inglés inicializada con éxito.' }];
  });

  // Adding form dialogs toggles
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingStudentGuardianId, setEditingStudentGuardianId] = useState<string>('');
  const [selectedCourseDetailId, setSelectedCourseDetailId] = useState<string | null>(null);
  const [isEditingCourse, setIsEditingCourse] = useState<boolean>(false);
  const [editCourseForm, setEditCourseForm] = useState({
    nombre_curso: '',
    teacher_id: '',
    status: 'ACTIVE',
  });
  const [editCourseSchedule, setEditCourseSchedule] = useState<Array<{ day: string; start_time: string; end_time: string }>>([]);
  const [selectedTeacherCourseViewStudentsId, setSelectedTeacherCourseViewStudentsId] = useState<string | null>(null);
  const [courseStudentSearch, setCourseStudentSearch] = useState('');
  const [paymentPeriodFilter, setPaymentPeriodFilter] = useState<string>('General');
  const [activePosReceipt, setActivePosReceipt] = useState<Payment | null>(null);

  // --- NEW TEACHER FORM STATE ---
  const [newTeacherForm, setNewTeacherForm] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: 'teacher123',
    telefono: '',
    documento_identidad: '',
    fecha_nacimiento: '',
    direccion: '',
    contacto_emergencia: '',
    parentesco_contacto: '',
  });

  // --- NEW COURSE FORM STATE ---
  const [newCourseForm, setNewCourseForm] = useState({
    nombre_curso: '',
    teacher_id: '',
  });
  const [newCourseSchedule, setNewCourseSchedule] = useState<Array<{ day: string; start_time: string; end_time: string }>>([
    { day: 'Lunes', start_time: '14:00', end_time: '16:00' }
  ]);

  // --- NEW STUDENT & GUARDIAN CORE FORM STATE ---
  const [newStudentForm, setNewStudentForm] = useState({
    // Student fields
    documento_identidad: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    edad: 8,
    colegio_origen: COLEGIOS_LA_VIRGINIA[0],
    grado_escolar: 'Primero',
    curso_actual: 'Kids Starter (Nivel A1.1)',
    jornada_escolar: SchoolDayPeriod.TARDE,
    course_id: '', // optional course link
    status: StudentStatus.REGISTERED,
    payment_deadline_date: '2026-06-30',
    // Guardian fields
    guardian_nombre_completo: '',
    guardian_direccion: '',
    guardian_telefono: '',
    guardian_parentesco: 'Madre',
  });

  const [editedSettings, setEditedSettings] = useState<SystemSettings>(dbSettings || INITIAL_SETTINGS);
  useEffect(() => { if (dbSettings) setEditedSettings(dbSettings); }, [dbSettings]);

  // --- PUBLIC ENROLLMENT STATES ---
  const [unauthView, setUnauthView] = useState<'login' | 'public_enrollment'>('public_enrollment');
  const [publicEnrollmentForm, setPublicEnrollmentForm] = useState({
    documento_identidad: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    edad: 8,
    colegio_origen: COLEGIOS_LA_VIRGINIA[0],
    grado_escolar: 'Primero',
    curso_actual: 'Kids Starter (Nivel A1.1)',
    jornada_escolar: SchoolDayPeriod.TARDE,
    guardian_nombre_completo: '',
    guardian_direccion: '',
    guardian_telefono: '',
    guardian_parentesco: 'Madre',
  });
  const [publicEnrollmentSuccess, setPublicEnrollmentSuccess] = useState<boolean>(false);
  const [registeredStudentInfo, setRegisteredStudentInfo] = useState<{ student: Student; guardian: Guardian } | null>(null);

  // --- TEACHER WORKSPACE STATES ---
  const [selectedTeacherCourse, setSelectedTeacherCourse] = useState<Course | null>(null);
  const [attendanceDate, setAttendanceDate] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [attendanceRecords, setAttendanceRecords] = useState<{ [studentId: string]: AttendanceStatus }>({});
  const [submittingAttendance, setSubmittingAttendance] = useState(false);

  // Helper to add log in real-time console
  const addLog = (action: string, status: 'SUCCESS' | 'DENIED' | 'INFO', msg: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setMiddlewareLogs((prev) => [{ time: timeStr, action, status, msg }, ...prev.slice(0, 49)]);
  };

  // Load database from Local Storage
  const loadDatabase = async () => {
    const users = await getUsers();
    const guardians = await getGuardians();
    const students = await getStudents();
    const courses = await getCourses();
    const settings = await getSettings();
    const attendances = await getAttendances();
    const payments = await getPayments();

    setDbUsers(users);
    setDbGuardians(guardians);
    setDbStudents(students);
    setDbCourses(courses);
    setDbSettings(settings);
    setEditedSettings(settings);
    setDbAttendances(attendances);
    setDbPayments(payments);
  };

  useEffect(() => {
    // Fetch secure session from HTTP-Only cookie via backend on mount
    if (typeof window !== 'undefined') {
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setCurrentUser(data.user);
            const now = new Date();
            const timeStr = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setMiddlewareLogs((prev) => [
              ...prev,
              { time: timeStr, action: 'Session Restore', status: 'SUCCESS', msg: `Sesión JWT restaurada para ${data.user.email} (${data.user.role})` }
            ]);
          }
        })
        .catch(err => console.error('Error fetching session:', err));
    }

    // Attempt to synchronize with real PostgreSQL database if it is configured
    const syncWithDatabase = async () => {
      try {
        const response = await fetch('/api/db-sync');
        if (response.ok) {
          const result = await response.json();
          if (result.postgres && result.data) {
            const { users, guardians, students, courses, settings, attendances, payments } = result.data;

            // Sync client states
            setDbUsers(users);
            setDbGuardians(guardians);
            setDbStudents(students);
            setDbCourses(courses);
            setDbSettings(settings);
            setEditedSettings(settings);
            setDbAttendances(attendances);
            setDbPayments(payments);

            // Also synchronize client localStorage so LocalDbStore stays updated!
            // Synced directly with Prisma via actions
            // Synced directly with Prisma via actions
            // Synced directly with Prisma via actions
            // Synced directly with Prisma via actions
            // Synced directly with Prisma via actions
            // Synced directly with Prisma via actions
            // Synced directly with Prisma via actions

            addLog('Database Sync', 'SUCCESS', 'Conectado a PostgreSQL y sincronizado en tiempo real. ¡Felicitaciones!');
          } else {
            addLog('Database Sync', 'INFO', 'Ejecutando en modo local (Almacenamiento del Navegador). Configure DATABASE_URL para usar PostgreSQL.');
          }
        }
      } catch (err: any) {
        console.error('Failure synchronizing with server database:', err);
        addLog('Database Sync', 'DENIED', 'Error al sincronizar con PostgreSQL. Usando modo offline.');
      }
    };

    syncWithDatabase();
  }, []);

  // --- LOGIN HANDLER ---
  const handleLogin = async (e?: React.FormEvent, customCredentials?: { email: string; pass: string }) => {
    if (e) e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);
    setLoading(true);

    const email = customCredentials ? customCredentials.email : loginEmail;
    const password = customCredentials ? customCredentials.pass : loginPassword;

    if (!email || !password) {
      setLoginError('Por favor complete todos los campos.');
      setLoading(false);
      addLog('Login Attempt', 'DENIED', 'Intento fallido: campos incompletos.');
      return;
    }

    try {
      // API call with 450ms latency simulation
      await new Promise((resolve) => setTimeout(resolve, 450));

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          clientUsers: dbUsers,
        }),
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.error('Failed to parse login response JSON:', responseText);
        throw new Error(`Respuesta inválida del servidor (Status ${response.status})`);
      }

      if (!response.ok) {
        setLoginError(data.error || `Error del servidor (${response.status})`);
        addLog('Login Controller Reject', 'DENIED', `Rechazado: ${data.error || 'Credenciales inválidas'}`);
        setLoading(false);
        return;
      }

      setLoginSuccess(`Acceso autorizado. ¡Bienvenido/a, ${data.user.nombres}!`);
      addLog('Login Controller Grant', 'SUCCESS', `Sesión iniciada correctamente para ${data.user.email} con rol [${data.user.role}]`);

      setTimeout(() => {
        setCurrentUser(data.user);
        setSelectedSidebarView('inicio'); // Reset views to clean default to avoid module structure leak
        setLoginEmail('');
        setLoginPassword('');
        setLoading(false);
      }, 500);

    } catch (err: any) {
      const errMsg = err?.message || 'Error de red con el middleware de autenticación.';
      setLoginError(`No se pudo conectar con el servidor: ${errMsg}`);
      addLog('Login Controller Fail', 'DENIED', `Error de red: ${errMsg}`);
      setLoading(false);
    }
  };

  // --- FAST ROLE LOGINS ---
  const handleFastLogin = (role: UserRole, email: string, isInactive = false) => {
    const password = isInactive
      ? 'inactivo123'
      : role === UserRole.DIRECTOR
        ? 'director123'
        : role === UserRole.ADMIN
          ? 'admin123'
          : 'teacher123';
    setLoginEmail(email);
    setLoginPassword(password);
    handleLogin(undefined, { email, pass: password });
  };

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    if (currentUser) {
      addLog('Logout Action', 'INFO', `Cierre de sesión seguro para ${currentUser.email}`);
    }
    setCurrentUser(null);
    setLoginSuccess(null);
    setMobileMenuOpen(false);
    setSelectedSidebarView('inicio'); // Reset view state immediately to avoid module leaking
    fetch('/api/auth/logout', { method: 'POST' }).catch(e => console.error(e));
  };

  // --- TEACHER CRUD (REGISTER MAESTRO) ---
  const handleRegisterTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Check authorization prior to execution
    const authCheck = simulateMiddlewareCheck(currentUser, '/admin/teachers/register');
    addLog('Middleware Router Guard', authCheck.authorized ? 'SUCCESS' : 'DENIED', authCheck.reason);

    if (!authCheck.authorized) {
      alert(`Acceso Denegado: Su rol de ${currentUser.role} no tiene permisos para realizar esta acción.`);
      return;
    }

    if (!newTeacherForm.nombres || !newTeacherForm.apellidos || !newTeacherForm.email || !newTeacherForm.password) {
      alert('Por favor complete todos los campos obligatorios del maestro/a.');
      return;
    }

    try {
      const response = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTeacherForm,
          clientUsers: dbUsers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error al crear maestro.');
        addLog('Teacher Registration Failed', 'DENIED', `Rechazado por backend: ${data.error}`);
        return;
      }

      const updatedUsers = [...dbUsers, data.teacher];
      setDbUsers(updatedUsers);
      Promise.all(updatedUsers.map(saveUser))
      setShowAddTeacherModal(false);

      // Reset form
      setNewTeacherForm({
        nombres: '',
        apellidos: '',
        email: '',
        password: 'teacher123',
        telefono: '',
        documento_identidad: '',
        fecha_nacimiento: '',
        direccion: '',
        contacto_emergencia: '',
        parentesco_contacto: '',
      });

      addLog('Teacher DB Write', 'SUCCESS', `Maestro/a ${data.teacher.nombres} ${data.teacher.apellidos} registrado exitosamente y sincronizado en el estado local.`);
      alert(`¡Maestro/a creado e insertado en la base de datos relacional con éxito!`);
    } catch (err: any) {
      alert('Error de red al procesar el maestro.');
    }
  };

  // --- COURSE CRUD (REGISTER CURSO + ASIGNAR MAESTRO) ---
  const handleRegisterCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const authCheck = simulateMiddlewareCheck(currentUser, '/admin/courses/register');
    addLog('Middleware Router Guard', authCheck.authorized ? 'SUCCESS' : 'DENIED', authCheck.reason);

    if (!authCheck.authorized) {
      alert(`Acceso Denegado: Su rol de ${currentUser.role} no tiene permisos para crear cursos.`);
      return;
    }

    const resolvedTeacherId = newCourseForm.teacher_id || dbUsers.find((u) => u.role === UserRole.TEACHER && u.status === UserStatus.ACTIVE)?.id || '';

    if (!newCourseForm.nombre_curso || !resolvedTeacherId) {
      alert('Por favor complete todos los datos del curso.');
      return;
    }

    // Verify assigned teacher is active
    const selectedTeacher = dbUsers.find((t) => t.id === resolvedTeacherId);
    if (!selectedTeacher || selectedTeacher.status !== UserStatus.ACTIVE) {
      alert('Error de Integridad: Debe seleccionar un Maestro Activo en el sistema.');
      addLog('Course Ref Integrity Failed', 'DENIED', `Intento de asignar curso a maestro inactivo: ${resolvedTeacherId}`);
      return;
    }

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCourseForm,
          teacher_id: resolvedTeacherId,
          schedule: newCourseSchedule,
          clientCourses: dbCourses,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error al crear curso.');
        addLog('Course Registration Failed', 'DENIED', `Rechazado por backend: ${data.error}`);
        return;
      }

      const updatedCourses = [...dbCourses, data.course];
      setDbCourses(updatedCourses);
      Promise.all(updatedCourses.map(saveCourse))
      setShowAddCourseModal(false);

      // Reset Course form and schedule
      setNewCourseForm({
        nombre_curso: '',
        teacher_id: dbUsers.find((u) => u.role === UserRole.TEACHER && u.status === UserStatus.ACTIVE)?.id || '',
      });
      setNewCourseSchedule([
        { day: 'Lunes', start_time: '14:00', end_time: '16:00' }
      ]);

      addLog('Course DB Write', 'SUCCESS', `Curso relacional [${data.course.nombre_curso}] asignado correctamente a Maestro ID: ${data.course.teacher_id}`);
      alert(`¡Curso registrado de manera exitosa en el Taller Creativo De Inglés!`);
    } catch (error: any) {
      alert('Error al enviar la solicitud de creación de curso.');
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedCourseDetailId) return;

    const authCheck = simulateMiddlewareCheck(currentUser, '/admin/courses/update');
    addLog('Middleware Router Guard', authCheck.authorized ? 'SUCCESS' : 'DENIED', authCheck.reason);

    if (!authCheck.authorized) {
      alert(`Acceso Denegado: Su rol de ${currentUser.role} no tiene permisos para actualizar cursos.`);
      return;
    }

    if (!editCourseForm.nombre_curso || !editCourseForm.teacher_id) {
      alert('Por favor complete todos los datos del curso.');
      return;
    }

    // Verify assigned teacher is active
    const selectedTeacher = dbUsers.find((t) => t.id === editCourseForm.teacher_id);
    if (!selectedTeacher || selectedTeacher.status !== UserStatus.ACTIVE) {
      alert('Error de Integridad: Debe seleccionar un Maestro Activo en el sistema.');
      return;
    }

    try {
      const response = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedCourseDetailId,
          ...editCourseForm,
          schedule: editCourseSchedule,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error al actualizar curso.');
        return;
      }

      const updatedCourses = dbCourses.map((c) => c.id === data.course.id ? data.course : c);
      setDbCourses(updatedCourses);
      Promise.all(updatedCourses.map(saveCourse))
      setIsEditingCourse(false);

      addLog('Course DB Update', 'SUCCESS', `Curso relacional [${data.course.nombre_curso}] actualizado con éxito.`);
      alert('¡El curso ha sido actualizado correctamente!');
    } catch {
      alert('Error de conexión al procesar los datos del curso.');
    }
  };

  const handleToggleStudentCourseAssignment = async (student: Student, shouldAssign: boolean) => {
    if (!selectedCourseDetailId) return;
    const targetCourseId = shouldAssign ? selectedCourseDetailId : null;
    try {
      const guardian = dbGuardians.find((g) => g.id === student.guardian_id);
      const response = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...student,
          course_id: targetCourseId,
          guardian_id: student.guardian_id,
          guardian_nombre_completo: guardian ? guardian.nombre_completo : '',
          guardian_direccion: guardian ? guardian.direccion : '',
          guardian_telefono: guardian ? guardian.telefono : '',
          guardian_parentesco: guardian ? guardian.parentesco : 'Madre',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error al cambiar la asignación del estudiante.');
        return;
      }

      const updatedStudents = dbStudents.map((s) => s.id === data.student.id ? data.student : s);
      setDbStudents(updatedStudents);
      Promise.all(updatedStudents.map(saveStudent))
      addLog('Student Course Direct Bind', 'SUCCESS', `Estudiante ${student.nombres} fue ${shouldAssign ? 'vinculado al' : 'desvinculado del'} curso.`);
    } catch {
      alert('Error de conexión al cambiar la asignación del estudiante.');
    }
  };

  // --- STUDENT MANUAL INSCRIPTION CRUD (STUDENT + GUARDIAN VINCULATION) ---
  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const isEdit = !!editingStudentId;
    const authCheck = simulateMiddlewareCheck(currentUser, isEdit ? '/admin/students/update' : '/admin/students/register');
    addLog('Middleware Router Guard', authCheck.authorized ? 'SUCCESS' : 'DENIED', authCheck.reason);

    if (!authCheck.authorized) {
      alert(`Acceso Denegado: Su rol de ${currentUser.role} no tiene permisos para ${isEdit ? 'modificar/actualizar' : 'matricular'} estudiantes.`);
      return;
    }

    // Basic required validations
    if (
      !newStudentForm.documento_identidad ||
      !newStudentForm.nombres ||
      !newStudentForm.apellidos ||
      !newStudentForm.guardian_nombre_completo ||
      !newStudentForm.guardian_direccion ||
      !newStudentForm.guardian_telefono
    ) {
      alert('Por favor diligencie todos los campos requeridos tanto del estudiante como de su acudiente.');
      return;
    }

    const resolvedCourseId = newStudentForm.course_id || null;

    try {
      const response = await fetch('/api/students', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newStudentForm,
          id: editingStudentId,
          guardian_id: editingStudentGuardianId,
          course_id: resolvedCourseId,
          clientStudents: dbStudents,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error de validación de matrícula de estudiante.');
        addLog(isEdit ? 'Student Update Failed' : 'Student Matricula Failed', 'DENIED', `Rechazado por backend: ${data.error}`);
        return;
      }

      let updatedStudents;
      let updatedGuardians;

      if (isEdit) {
        updatedStudents = dbStudents.map((s) => s.id === data.student.id ? data.student : s);
        updatedGuardians = dbGuardians.map((g) => g.id === data.guardian.id ? data.guardian : g);
      } else {
        updatedStudents = [...dbStudents, data.student];
        updatedGuardians = [...dbGuardians, data.guardian];
      }

      setDbStudents(updatedStudents);
      setDbGuardians(updatedGuardians);

      Promise.all(updatedStudents.map(saveStudent))
      Promise.all(updatedGuardians.map(saveGuardian))

      setShowAddStudentForm(false);
      setEditingStudentId(null);
      setEditingStudentGuardianId('');

      // Reset fields
      setNewStudentForm({
        documento_identidad: '',
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        edad: 8,
        colegio_origen: COLEGIOS_LA_VIRGINIA[0],
        grado_escolar: 'Primero',
        curso_actual: 'Kids Starter (Nivel A1.1)',
        jornada_escolar: SchoolDayPeriod.TARDE,
        course_id: dbCourses.find((c) => c.status === 'ACTIVE')?.id || '',
        status: StudentStatus.REGISTERED,
        payment_deadline_date: '2026-06-30',
        guardian_nombre_completo: '',
        guardian_direccion: '',
        guardian_telefono: '',
        guardian_parentesco: 'Madre',
      });

      addLog(
        isEdit ? 'Student DB Update' : 'Student Core DB Matricula',
        'SUCCESS',
        isEdit
          ? `Estudiante ${data.student.nombres} actualizado correctamente junto con su acudiente (${data.guardian.nombre_completo})`
          : `Estudiante ${data.student.nombres} registrado e insertado vinculando la llave foránea de su acudiente (${data.guardian.nombre_completo})`
      );
      alert(isEdit ? '¡Estudiante y acudiente editados exitosamente!' : '¡Matrícula manual guardada exitosamente! Se han instanciado y vinculado ambos modelos en cascada.');
    } catch {
      alert('Error de conexión al procesar los datos del estudiante.');
    }
  };

  const handleStartEditStudent = (student: Student) => {
    const guardian = dbGuardians.find((g) => g.id === student.guardian_id);
    setEditingStudentId(student.id);
    setEditingStudentGuardianId(student.guardian_id || '');
    setNewStudentForm({
      documento_identidad: student.documento_identidad,
      nombres: student.nombres,
      apellidos: student.apellidos,
      fecha_nacimiento: student.fecha_nacimiento || '',
      edad: student.edad,
      colegio_origen: student.colegio_origen,
      grado_escolar: student.grado_escolar || 'Primero',
      curso_actual: student.curso_actual,
      jornada_escolar: student.jornada_escolar,
      course_id: student.course_id || '',
      status: student.status,
      payment_deadline_date: student.payment_deadline_date,
      guardian_nombre_completo: guardian ? guardian.nombre_completo : '',
      guardian_direccion: guardian ? guardian.direccion : '',
      guardian_telefono: guardian ? guardian.telefono : '',
      guardian_parentesco: guardian ? guardian.parentesco : 'Madre',
    });
    setShowAddStudentForm(true);
  };

  const handleStartRegisterStudent = () => {
    setEditingStudentId(null);
    setEditingStudentGuardianId('');
    setNewStudentForm({
      documento_identidad: '',
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      edad: 8,
      colegio_origen: COLEGIOS_LA_VIRGINIA[0],
      grado_escolar: 'Primero',
      curso_actual: 'Kids Starter (Nivel A1.1)',
      jornada_escolar: SchoolDayPeriod.TARDE,
      course_id: dbCourses.find((c) => c.status === 'ACTIVE')?.id || '',
      status: StudentStatus.REGISTERED,
      payment_deadline_date: '2026-06-30',
      guardian_nombre_completo: '',
      guardian_direccion: '',
      guardian_telefono: '',
      guardian_parentesco: 'Madre',
    });
    setShowAddStudentForm(true);
  };

  // --- PUBLIC ENROLLMENT LANDING PAGE INSCRIPTION HANDLER ---
  const handlePublicEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dbSettings?.enrollment_open) {
      alert('Lo sentimos, el proceso de inscripciones públicas no está disponible en este momento.');
      return;
    }

    if (
      !publicEnrollmentForm.documento_identidad ||
      !publicEnrollmentForm.nombres ||
      !publicEnrollmentForm.apellidos ||
      !publicEnrollmentForm.guardian_nombre_completo ||
      !publicEnrollmentForm.guardian_direccion ||
      !publicEnrollmentForm.guardian_telefono
    ) {
      alert('Por favor complete todos los datos obligatorios del estudiante y del acudiente (dirección y teléfono incluidos).');
      return;
    }

    // Check if student with document already exists
    const duplicate = dbStudents.find((s) => s.documento_identidad === publicEnrollmentForm.documento_identidad);
    if (duplicate) {
      alert('Error de Integridad: Ya existe un estudiante registrado con este Documento de Identidad.');
      addLog('Public Enrollment Ref Integrity Failed', 'DENIED', `Intento de duplicar documento: ${publicEnrollmentForm.documento_identidad}`);
      return;
    }

    try {
      const response = await fetch('/api/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...publicEnrollmentForm,
          course_id: null, // default to null as requested
          payment_deadline_date: '2026-06-30', // default deadline reference
          clientStudents: dbStudents,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al procesar inscripción');
      }

      const { student, guardian } = data;

      // Update local db state
      const updatedGuardians = [...dbGuardians, guardian];
      const updatedStudents = [...dbStudents, student];

      setDbGuardians(updatedGuardians);
      setDbStudents(updatedStudents);

      Promise.all(updatedGuardians.map(saveGuardian))
      Promise.all(updatedStudents.map(saveStudent))

      addLog('Public Enrollment Success', 'SUCCESS', `Estudiante ${student.nombres} ${student.apellidos} inscrito públicamente (Pre-estado REGISTERED).`);

      setRegisteredStudentInfo({ student, guardian });
      setPublicEnrollmentSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Error al procesar la inscripción');
      addLog('Public Enrollment Error', 'DENIED', err.message || 'Error desconocido');
    }
  };

  // --- TEACHER SUBMIT BULK ATTENDANCE HANDLER ---
  const handleSubmitAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherCourse) {
      alert('Por favor seleccione un curso válido.');
      return;
    }
    if (!attendanceDate) {
      alert('Por favor seleccione una fecha de asistencia.');
      return;
    }

    // Filter students: strictly course_id === selected course and status is ACTIVE or BLOCKED
    const activeCourseStudents = dbStudents.filter(
      (st) => st.course_id === selectedTeacherCourse.id && (st.status === StudentStatus.ACTIVE || st.status === StudentStatus.BLOCKED)
    );

    if (activeCourseStudents.length === 0) {
      alert('No hay estudiantes con estado ACTIVO o BLOQUEADO (Mata. Suspendida) asignados a este curso para realizar la asistencia.');
      return;
    }

    // Build the bulk records block
    const records = activeCourseStudents.map((st) => {
      // Default to PRESENT for active students, and ABSENT for BLOCKED students
      const defaultStatus = st.status === StudentStatus.BLOCKED ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT;
      const status = attendanceRecords[st.id] || defaultStatus;
      return {
        student_id: st.id,
        status: status,
      };
    });

    setSubmittingAttendance(true);

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: selectedTeacherCourse.id,
          date: attendanceDate,
          records: records,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al guardar asistencia.');
      }

      // Save to client-side DB and preserve
      const newAttendances = data.attendances as Attendance[];

      // Filter out any older attendances submitted of same course on same date to override/re-set attendance cleanly
      const existingFiltered = dbAttendances.filter(
        (att) => !(att.course_id === selectedTeacherCourse.id && att.date === attendanceDate)
      );

      const updatedAttendances = [...existingFiltered, ...newAttendances];

      setDbAttendances(updatedAttendances);
      saveAttendances(updatedAttendances)

      addLog(
        'Attendance Registered',
        'SUCCESS',
        `Tomada de asistencia en bloque para ${selectedTeacherCourse.nombre_curso} el ${attendanceDate}. (${newAttendances.length} alumnos procesados)`
      );

      alert(`¡Asistencia guardada exitosamente para ${selectedTeacherCourse.nombre_curso}!`);
      setSelectedTeacherCourse(null);
      setAttendanceRecords({});
    } catch (err: any) {
      alert(err.message || 'Error al guardar asistencia');
      addLog('Attendance Submitting Error', 'DENIED', err.message || 'Error desconocido');
    } finally {
      setSubmittingAttendance(false);
    }
  };

  // --- TOGGLE USER STATUS (ACTIVE/INACTIVE) ---
  const handleToggleUserStatus = (userId: string) => {
    const updatedUsers = dbUsers.map((u) => {
      if (u.id === userId) {
        const nextStatus = u.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;

        if (currentUser && currentUser.id === userId && nextStatus === UserStatus.INACTIVE) {
          setTimeout(() => {
            handleLogout();
            alert('Has desactivado tu propia cuenta. El middleware de autorización te ha deslogueado automáticamente.');
          }, 300);
        }

        addLog('Database Modified', 'INFO', `Usuario [${u.email}] cambiado a estado: ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    });

    setDbUsers(updatedUsers);
    Promise.all(updatedUsers.map(saveUser))
  };

  // --- UPDATE SYSTEM SETTINGS ---
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const authCheck = simulateMiddlewareCheck(currentUser, '/admin/settings/edit');
    addLog('Middleware Route Scan', authCheck.authorized ? 'SUCCESS' : 'DENIED', authCheck.reason);

    if (!authCheck.authorized) {
      alert(authCheck.reason);
      return;
    }

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedSettings),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al guardar la configuración');
      }

      setDbSettings(editedSettings);
      addLog('SystemSettings Update', 'SUCCESS', `Ajustes guardados. Inscripciones abiertas: ${editedSettings.enrollment_open}`);
      alert('Configuración global del TCI actualizada.');
    } catch (err: any) {
      alert(`Error de red: ${err.message}`);
      addLog('SystemSettings Update', 'DENIED', `Fallo al guardar: ${err.message}`);
    }
  };

  // --- RESET DATABASE TO DEFAULT SEED ---
  const handleResetDb = async () => {
    if (confirm('¿Está seguro de que desea restablecer la base de datos a sus valores semilla de fábrica para TCI - Taller Creativo De Inglés? Se perderán los cambios locales.')) {
      try {
        const response = await fetch('/api/db-sync', { method: 'DELETE' });
        const result = await response.json();
        if (result.postgres) {
          // Sync client states with newly truncated database
          const syncRes = await fetch('/api/db-sync');
          if (syncRes.ok) {
            const syncResult = await syncRes.json();
            if (syncResult.data) {
              const { users, guardians, students, courses, settings, attendances, payments } = syncResult.data;
              setDbUsers(users);
              setDbGuardians(guardians);
              setDbStudents(students);
              setDbCourses(courses);
              setDbSettings(settings);
              setEditedSettings(settings);
              setDbAttendances(attendances);
              setDbPayments(payments);
            }
          }
          addLog('Seed Reset', 'SUCCESS', 'Base de datos PostgreSQL restablecida a semilla de fábrica con éxito.');
        } else {
          // Reset DB no longer applicable locally
          loadDatabase();
          addLog('Seed Reset', 'SUCCESS', 'Base de datos local de TCI restablecida a semilla de fábrica.');
        }
      } catch (err) {
        console.error('Error resetting database:', err);
        // Reset DB no longer applicable locally
        loadDatabase();
        addLog('Seed Reset', 'SUCCESS', 'Base de datos local restablecida a semilla de fábrica.');
      }
    }
  };

  // --- FINANCIAL MODULE RECORD A MANUAL PAYMENT ---
  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentStudentId || !paymentAmount || !paymentPeriod) {
      alert('Por favor complete todos los campos obligatorios del pago.');
      return;
    }

    setRegisteringPayment(true);
    addLog('Payment Register Admin', 'INFO', `Registrando pago manual de $${paymentAmount} para el alumno IDs: ${paymentStudentId}...`);

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: paymentStudentId,
          amount: Number(paymentAmount),
          payment_date: paymentDateInput,
          period_covered: paymentPeriod,
          clientStudents: dbStudents,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update students state
        const updatedStudents = dbStudents.map((s) => {
          if (s.id === data.student.id) {
            return data.student;
          }
          return s;
        });

        // Add payment to local history
        const newPayments = [data.payment, ...dbPayments];

        // Save safely in LocalDbStore
        Promise.all(updatedStudents.map(saveStudent))
        Promise.all(newPayments.map(savePayment))

        // Update active React state
        setDbStudents(updatedStudents);
        setDbPayments(newPayments);

        // Reset state for manual form
        setPaymentStudentId('');
        setShowAddPaymentModal(false);
        setActivePosReceipt(data.payment);

        addLog('Payment Register Admin', 'SUCCESS', `Pago procesado para ${data.student.nombres} ${data.student.apellidos}. Nuevo vencimiento: ${data.student.payment_deadline_date}`);
        alert(`¡Pago registrado con éxito!\n\nSe abrirá el Recibo POS para su impresión.`);
      } else {
        addLog('Payment Register Admin', 'DENIED', `Fallo de registro de pago: ${data.error}`);
        alert(`Error al registrar el pago: ${data.error}`);
      }
    } catch (error: any) {
      addLog('Payment Register Admin', 'DENIED', `Error de red en registro de pago: ${error.message}`);
      alert(`Error de red al registrar el pago: ${error.message}`);
    } finally {
      setRegisteringPayment(false);
    }
  };

  // --- AUTOMATIC SHIELD AUTO-BLOCK CRON ( virtuales 00:00 ) ---
  const handleTriggerCron = async () => {
    setRunningCron(true);
    addLog('CronJob Automatic Lockout Init', 'INFO', `Ejecutando CronJob diario programado para las 00:00 (Corte: ${cronCustomDate})...`);

    try {
      const response = await fetch('/api/cron/auto-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientStudents: dbStudents,
          customDate: cronCustomDate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Sync modified students in local storage database
        Promise.all(data.updatedStudents.map(saveStudent))
        setDbStudents(data.updatedStudents);

        addLog('CronJob Completion success', 'SUCCESS', data.message);

        if (data.modifiedCount > 0) {
          alert(`[Cron a las 00:00 Ejecutado]\n\nSe escanearon todos los estudiantes contra la fecha de corte [${cronCustomDate}].\nSe bloquearon (BLOCKED) automáticamente ${data.modifiedCount} estudiantes morosos.`);
        } else {
          alert(`[Cron a las 00:00 Ejecutado]\n\nCero estudiantes morosos detectados para la fecha de corte ${cronCustomDate}. Todo al día.`);
        }
      } else {
        addLog('CronJob Failure', 'DENIED', `Error en la automatización: ${data.error}`);
        alert(`Fallo del CronJob: ${data.error}`);
      }
    } catch (error: any) {
      addLog('CronJob Server Error', 'DENIED', `Error general en Cron: ${error.message}`);
      alert(`Error general de comunicación con el Cron: ${error.message}`);
    } finally {
      setRunningCron(false);
    }
  };

  // --- COPY CODE CLIPS ---
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // --- PRISMA SCHEMA AND SQL CODES WITH REVISED MODELS (FK course_id nullable on Student) ---
  const PRISMA_SCHEMA_CODE = `// prisma/schema.prisma
// Modelos de datos para TCI - Taller Creativo De Inglés - Fase 2 CRUDs

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  DIRECTOR
  ADMIN
  TEACHER
}

enum UserStatus {
  ACTIVE
  INACTIVE
}

enum Jornada {
  MANANA // MAÑANA
  TARDE
}

enum StudentStatus {
  REGISTERED
  IN_INTERVIEW
  ACTIVE
  BLOCKED
}

model User {
  id            String     @id @default(uuid())
  email         String     @unique
  password_hash String
  role          Role       @default(TEACHER)
  status        UserStatus @default(ACTIVE)
  nombres       String
  apellidos     String
  telefono      String?
  courses       Course[]   // Relación Uno a Muchos con cursos asignados

  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model Guardian {
  id              String    @id @default(uuid())
  nombre_completo String
  direccion       String
  telefono        String
  parentesco      String
  students        Student[] // Relación Uno a Muchos con Estudiantes a cargo

  createdAt       DateTime  @default(now())
}

model Student {
  id                    String        @id @default(uuid())
  documento_identidad   String        @unique
  nombres               String
  apellidos             String
  edad                  Int
  colegio_origen        String        // Colegios de La Virginia, Risaralda
  curso_actual          String
  jornada_escolar       Jornada
  status                StudentStatus @default(REGISTERED)
  payment_deadline_date DateTime
  
  guardian_id           String
  guardian              Guardian      @relation(fields: [guardian_id], references: [id])

  // FASE 2: Llave foránea course_id (Nulable en principio)
  course_id             String?
  course                Course?       @relation(fields: [course_id], references: [id])

  createdAt             DateTime      @default(now())
}`;

  const SQL_DDL_CODE = `-- SQL DDL para TCI - Taller Creativo De Inglés - Fase 2
-- Creación e integración de llaves foráneas

CREATE TABLE system_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'global_settings',
    enrollment_open BOOLEAN DEFAULT TRUE,
    academic_year VARCHAR(10) DEFAULT '2026',
    institution_name VARCHAR(150) DEFAULT 'TCI - Taller Creativo De Inglés'
);

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('DIRECTOR', 'ADMIN', 'TEACHER')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(30)
);

CREATE TABLE courses (
    id VARCHAR(50) PRIMARY KEY,
    nombre_curso VARCHAR(150) NOT NULL,
    teacher_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE guardians (
    id VARCHAR(50) PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    parentesco VARCHAR(50) NOT NULL
);

CREATE TABLE students (
    id VARCHAR(50) PRIMARY KEY,
    documento_identidad VARCHAR(50) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    edad INTEGER NOT NULL,
    colegio_origen VARCHAR(255) NOT NULL,
    curso_actual VARCHAR(150) NOT NULL,
    jornada_escolar VARCHAR(20) NOT NULL CHECK (jornada_escolar IN ('MAÑANA', 'TARDE')),
    status VARCHAR(30) NOT NULL DEFAULT 'REGISTERED' CHECK (status IN ('REGISTERED', 'IN_INTERVIEW', 'ACTIVE', 'BLOCKED')),
    payment_deadline_date DATE NOT NULL,
    guardian_id VARCHAR(50) NOT NULL,
    
    -- FASE 2: Llave foránea course_id (Nulable en principio)
    course_id VARCHAR(50),
    FOREIGN KEY (guardian_id) REFERENCES guardians(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);`;

  // Filter students based on search and status tabs
  const filteredStudents = dbStudents.filter((st) => {
    const matchesSearch =
      st.nombres.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.apellidos.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.documento_identidad.includes(studentSearch);

    const matchesStatus = studentFilterStatus === 'TODOS' || st.status === studentFilterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="app_root_layout">
      {/* HEADER PRINCIPAL */}
      <header className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between" id="header_container">
        <div className="flex items-center gap-3" id="brand_title_wrapper">
          <div className="h-10 w-10 rounded-xl bg-[#fc7609] flex items-center justify-center text-white font-display text-xl font-bold tracking-tight shadow-md shadow-orange-500/20" id="header_badge_logo">
            TCI
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg md:text-xl text-slate-800 flex items-center gap-1.5" id="header_title">
              <span className="text-[#fc7609] font-black">Taller Creativo De Inglés</span>
            </h1>
          </div>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-4 py-1" id="logged_in_wrapper">
            {/* Hamburger for mobile sidebar */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-[#fc7609]"
              id="mobile_hamburger"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden md:flex flex-col items-end text-right" id="user_session_info">
              <span className="font-semibold text-xs text-slate-700 font-display flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {currentUser.nombres} {currentUser.apellidos}
              </span>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider font-mono mt-0.5
                ${currentUser.role === UserRole.DIRECTOR ? 'bg-orange-55 text-[#fc7609] border border-orange-200' :
                  currentUser.role === UserRole.ADMIN ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                    'bg-purple-100 text-purple-700 border border-purple-200'}`}>
                {currentUser.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-[#fc7609] transition-all px-3 py-1.5 rounded-lg border border-slate-200 hover:border-orange-200 text-xs font-semibold cursor-pointer"
              id="logout_btn"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-450 font-mono font-medium" id="unauthenticated_badge">
            <Lock className="h-3.5 w-3.5 text-slate-300" />
            <span>ACCESO PROTEGIDO</span>
          </div>
        )}
      </header>

      {/* CUERPO PRINCIPAL */}
      <div className="flex-1 flex flex-col md:flex-row" id="main_layout_body">
        {currentUser ? (
          /* ========================================================
             2. PANEL ACADÉMICO AUTENTICADO CON SIDEBAR INTEGRADO
             ======================================================== */
          <>
            {/* SIDEBAR CONTAINER */}
            <aside className={`w-64 bg-white border-r border-slate-100 shrink-0 md:block ${mobileMenuOpen ? 'block fixed inset-y-0 left-0 z-50 shadow-xl' : 'hidden'}`} id="dashboard_sidebar_nav">
              <div className="p-4 flex justify-between items-center md:hidden border-b border-slate-150">
                <span className="font-bold text-[#fc7609] font-display">TCI Nav</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar Menu Links */}
              <nav className="p-4 space-y-1.5 h-full flex flex-col justify-between" id="sidebar_links_navigation">
                <div className="space-y-1">
                  {currentUser.role === UserRole.TEACHER ? (
                    <>
                      <button
                        onClick={() => { setSelectedSidebarView('inicio'); setMobileMenuOpen(false); }}
                        className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold font-display transition-all text-left cursor-pointer
                          ${selectedSidebarView === 'inicio' ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        id="sidebar_link_inicio"
                      >
                        <BookOpen className="h-4 w-4 shrink-0" />
                        <span>Mis Grupos</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setSelectedSidebarView('inicio'); setMobileMenuOpen(false); }}
                        className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold font-display transition-all text-left cursor-pointer
                          ${selectedSidebarView === 'inicio' ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        id="sidebar_link_inicio"
                      >
                        <HomeIcon className="h-4 w-4 shrink-0" />
                        <span>Inicio</span>
                      </button>

                      <button
                        onClick={() => { setSelectedSidebarView('estudiantes'); setMobileMenuOpen(false); }}
                        className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold font-display transition-all text-left cursor-pointer
                          ${selectedSidebarView === 'estudiantes' ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        id="sidebar_link_estudiantes"
                      >
                        <GraduationCap className="h-4 w-4 shrink-0" />
                        <span>Estudiantes (Core)</span>
                      </button>

                      <button
                        onClick={() => { setSelectedSidebarView('maestros'); setMobileMenuOpen(false); }}
                        className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold font-display transition-all text-left cursor-pointer
                          ${selectedSidebarView === 'maestros' ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        id="sidebar_link_maestros"
                      >
                        <Users className="h-4 w-4 shrink-0" />
                        <span>Maestros (Usuarios)</span>
                      </button>

                      <button
                        onClick={() => { setSelectedSidebarView('cursos'); setMobileMenuOpen(false); }}
                        className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold font-display transition-all text-left cursor-pointer
                          ${selectedSidebarView === 'cursos' ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        id="sidebar_link_cursos"
                      >
                        <BookOpen className="h-4 w-4 shrink-0" />
                        <span>Cursos / Grupos</span>
                      </button>

                      <button
                        onClick={() => { setSelectedSidebarView('pagos'); setMobileMenuOpen(false); }}
                        className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold font-display transition-all text-left cursor-pointer
                          ${selectedSidebarView === 'pagos' ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        id="sidebar_link_pagos"
                      >
                        <DollarSign className="h-4 w-4 shrink-0" />
                        <span>Módulo Financiero</span>
                      </button>

                      <button
                        onClick={() => { setSelectedSidebarView('configuracion'); setMobileMenuOpen(false); }}
                        className={`nav-button-sidebar w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold font-display transition-all text-left cursor-pointer
                          ${selectedSidebarView === 'configuracion' ? 'bg-orange-50 text-[#fc7609]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        id="sidebar_link_settings"
                      >
                        <Settings className="h-4 w-4 shrink-0" />
                        <span>Configuración</span>
                      </button>
                    </>
                  )}
                </div>

                {/* DB Stats info indicator in sidebar bottom */}
                <div className="pt-4 border-t border-slate-100 space-y-2 mt-auto" id="sidebar_status_metrix">
                  <span className="text-[9px] font-mono font-bold text-slate-400 block tracking-widest uppercase">Estatus Base de Datos</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-400 block">Estudiantes</span>
                      <span className="font-bold text-slate-800">{dbStudents.length}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-400 block">Grupos</span>
                      <span className="font-bold text-slate-800">{dbCourses.length}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleResetDb}
                    className="w-full py-1 text-[10px] text-slate-400 hover:text-rose-500 font-mono flex items-center justify-center gap-1 bg-slate-50 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Sincronizar Semilla
                  </button>
                </div>
              </nav>
            </aside>

            {/* MAIN PORTAL AREA */}
            <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto max-w-(screen-md) xl:max-w-7xl mx-auto" id="developer_workspace_workspace">
              {/* WELCOME BANNER */}
              <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="greeting_banner">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider bg-orange-100 text-[#fc7609]">PORTAL ACADÉMICO TCI</span>
                    <span className="text-xs text-slate-400">Año Lectivo: {dbSettings?.academic_year || '2026'}</span>
                  </div>
                  <h2 className="font-display font-extrabold text-2xl text-slate-800">¡Bienvenido al panel, {currentUser.nombres}! 👋</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Estás controlando el sistema educativo bajo el acceso administrativo de <b>{currentUser.role}</b>.</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-600 uppercase font-mono">Conexión Segura Middleware</span>
                </div>
              </div>

              {/* ========================================================
                 PORTAL VIEWS DE ACUERDO AL LINK SELECCIONADO EN SIDEBAR
                 ======================================================== */}
              <AnimatePresence mode="wait">
                {/* 1. SECCIÓN INICIO - VISIÓN GENERAL Y PRUEBAS RÁPIDAS DE MIDDLEWARE */}
                {selectedSidebarView === 'inicio' && (
                  currentUser.role === UserRole.TEACHER ? (
                    <motion.div
                      key="view_inicio_teacher"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      {/* Course Selection list for TEACHER */}
                      {selectedTeacherCourseViewStudentsId !== null ? (() => {
                        const course = dbCourses.find(c => c.id === selectedTeacherCourseViewStudentsId);
                        const activeAndRegisteredStudents = dbStudents.filter(st => st.course_id === selectedTeacherCourseViewStudentsId);
                        return (
                          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-3">
                              <div>
                                <span className="text-[#fc7609] text-[10px] font-mono tracking-widest font-black uppercase">Listado de Mi Grupo Inglés</span>
                                <h3 className="font-display font-extrabold text-xl text-slate-800 flex items-center gap-2">
                                  <Users className="h-5 w-5 text-[#fc7609]" />
                                  <span>{course?.nombre_curso}</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">Ref ID: <span className="font-mono text-[9px] font-bold bg-slate-50 px-1 py-0.5 rounded">{course?.id}</span></p>
                              </div>
                              <button
                                onClick={() => setSelectedTeacherCourseViewStudentsId(null)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 self-start"
                              >
                                <ArrowRight className="h-4 w-4 rotate-180" />
                                <span>Volver a Grupos</span>
                              </button>
                            </div>

                            {/* Horario info section */}
                            <div className="bg-[#fc7609]/5 rounded-2xl p-4 border border-[#fc7609]/10">
                              <span className="text-[10px] font-bold font-mono uppercase text-[#fc7609] block mb-2">Horario Estructurado de Clases</span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {course?.schedule && course.schedule.length > 0 ? (
                                  course.schedule.map((item, index) => (
                                    <div key={index} className="bg-white p-2.5 rounded-xl border border-slate-100 text-xs shadow-3xs">
                                      <span className="font-extrabold text-slate-800 block text-[11px]">{item.day}</span>
                                      <span className="font-mono text-slate-500 font-medium text-[10px] block mt-0.5">{item.start_time} - {item.end_time}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="col-span-full py-1 text-slate-400 italic text-xs">No se ha cargado un horario estructurado. Contacte al directivo admin.</div>
                                )}
                              </div>
                            </div>

                            {/* Table listing students */}
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-700 uppercase font-mono">Listado de Estudiantes y Contactos de Emergencia</span>
                                <span className="text-[10px] font-mono text-[#fc7609] font-bold">Inscritos: {activeAndRegisteredStudents.length}</span>
                              </div>

                              <div className="overflow-x-auto rounded-xl">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="bg-slate-50 text-slate-500 font-mono text-[9px] uppercase font-bold tracking-wider border-b border-slate-100">
                                      <th className="p-3">NOMBRE ESTUDIANTE</th>
                                      <th className="p-3">IDENTIFICACIÓN / EDAD</th>
                                      <th className="p-3">DATOS DEL ACUDIENTE (EMERGENCIA)</th>
                                      <th className="p-3">PARENTESCO / DIRECCIÓN</th>
                                      <th className="p-3 text-center">ESTADO</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {activeAndRegisteredStudents.length === 0 ? (
                                      <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-450 italic bg-slate-50/20">
                                          No hay estudiantes matriculados en este grupo.
                                        </td>
                                      </tr>
                                    ) : (
                                      activeAndRegisteredStudents.map((st) => {
                                        const guardian = dbGuardians.find((g) => g.id === st.guardian_id);
                                        return (
                                          <tr key={st.id} className="hover:bg-slate-50/20 transition-colors">
                                            <td className="p-3">
                                              <span className="font-extrabold text-slate-800 text-sm block leading-none">{st.nombres} {st.apellidos}</span>
                                              <span className="font-mono text-[9px] text-[#fc7609] font-bold block mt-1 uppercase">ID: {st.id}</span>
                                            </td>
                                            <td className="p-3 font-medium">
                                              <div className="text-slate-705">{st.edad} años</div>
                                              <div className="text-slate-400 text-[10px] font-mono mt-0.5">Doc: {st.documento_identidad}</div>
                                            </td>
                                            <td className="p-3">
                                              {guardian ? (
                                                <div className="space-y-0.5">
                                                  <div className="font-bold text-slate-800 text-xs">{guardian.nombre_completo}</div>
                                                  <div className="text-[#fc7609] font-mono text-[11px] font-bold">📞 Tel: {guardian.telefono}</div>
                                                </div>
                                              ) : (
                                                <span className="text-rose-500 italic text-[10px] font-bold">⚠️ Sin acudiente</span>
                                              )}
                                            </td>
                                            <td className="p-3 text-slate-500 text-xs text-left">
                                              {guardian ? (
                                                <div className="space-y-0.5">
                                                  <div className="font-medium text-slate-600 block">{guardian.parentesco || 'N/D'}</div>
                                                  <div className="text-[10px] text-slate-400 block break-words mt-0.5">📍 Dir: {guardian.direccion}</div>
                                                </div>
                                              ) : (
                                                '--'
                                              )}
                                            </td>
                                            <td className="p-3 text-center">
                                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider
                                                ${st.status === StudentStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600' :
                                                  st.status === StudentStatus.REGISTERED ? 'bg-indigo-50 text-indigo-600' :
                                                    st.status === StudentStatus.IN_INTERVIEW ? 'bg-amber-50 text-amber-600' :
                                                      'bg-rose-50 text-rose-600'}`}>
                                                {st.status}
                                              </span>
                                            </td>
                                          </tr>
                                        );
                                      })
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        );
                      })() : selectedTeacherCourse === null ? (
                        <div className="space-y-6" id="teacher_course_selection_panel">
                          <div>
                            <h3 className="font-display font-extrabold text-xl text-slate-800">Tus Grupos Asignados</h3>
                            <p className="text-xs text-slate-500 mt-1">
                              A continuación se muestran los grupos del Taller Creativo que tienes a cargo para el año lectivo actual. Haz clic en uno para tomar asistencia.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="teacher_courses_grid">
                            {dbCourses.filter((c) => c.teacher_id === currentUser.id).length === 0 ? (
                              <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-dotted border-slate-200" id="no_courses_placeholder">
                                <span className="text-3xl">🗓️</span>
                                <h4 className="font-bold text-slate-700 mt-2 text-sm">No tienes cursos asignados</h4>
                                <p className="text-xs text-slate-400 mt-0.5">Por favor solicita a la administración que te asigne tus English Groups correspondientes.</p>
                              </div>
                            ) : (
                              dbCourses
                                .filter((c) => c.teacher_id === currentUser.id)
                                .map((course) => {
                                  const activeStudents = dbStudents.filter(
                                    (st) => st.course_id === course.id && st.status === StudentStatus.ACTIVE
                                  );

                                  return (
                                    <div
                                      key={course.id}
                                      className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                                      id={`course_card_${course.id}`}
                                    >
                                      <div>
                                        <div className="flex justify-between items-start mb-4">
                                          <span className="text-xs font-mono font-bold tracking-widest text-[#fc7609] select-none bg-orange-50 px-2 py-1 rounded-lg">
                                            {course.id.toUpperCase()}
                                          </span>
                                          <span
                                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${course.status === 'ACTIVE'
                                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                              : 'bg-rose-50 text-rose-600 border border-rose-100'
                                              }`}
                                          >
                                            {course.status === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO'}
                                          </span>
                                        </div>

                                        <h4 className="font-display font-extrabold text-slate-800 text-base mb-2">
                                          {course.nombre_curso}
                                        </h4>

                                        <div className="text-xs text-slate-500 flex items-center gap-2 mb-4">
                                          <Users className="h-4 w-4 text-slate-400" />
                                          <span>{activeStudents.length} Estudiantes Activos</span>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        {course.status === 'ACTIVE' ? (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSelectedTeacherCourse(course);
                                              const initialRecs: { [sid: string]: AttendanceStatus } = {};
                                              activeStudents.forEach((st) => {
                                                initialRecs[st.id] = AttendanceStatus.PRESENT;
                                              });
                                              setAttendanceRecords(initialRecs);
                                            }}
                                            className="w-full py-2 bg-[#fc7609] hover:bg-orange-600 active:scale-98 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                            id={`btn_attendance_${course.id}`}
                                          >
                                            <Calendar className="h-4 w-4" />
                                            <span>Tomar Asistencia 📝</span>
                                          </button>
                                        ) : (
                                          <div className="w-full py-2 text-center text-[11px] text-slate-400 bg-slate-50 rounded-xl cursor-not-allowed border border-slate-150 font-medium">
                                            Grupo Inactivo por Administración
                                          </div>
                                        )}

                                        <button
                                          type="button"
                                          onClick={() => setSelectedTeacherCourseViewStudentsId(course.id)}
                                          className="w-full py-2 bg-slate-55 hover:bg-slate-100 text-slate-705 border border-slate-200 hover:border-slate-350 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                                          id={`btn_view_students_${course.id}`}
                                        >
                                          <Eye className="h-3.5 w-3.5 text-[#fc7609]" />
                                          <span>Ver Alumnos y Horario 👁️</span>
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })
                            )}
                          </div>

                          {/* Historical Submissions Viewer */}
                          <div className="mt-8" id="attendance_history_wrapper">
                            <h4 className="font-display font-extrabold text-slate-800 text-sm mb-4">Registros Recientes de Asistencia</h4>
                            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
                              {dbAttendances.filter((att) =>
                                dbCourses.some((c) => c.teacher_id === currentUser.id && c.id === att.course_id)
                              ).length === 0 ? (
                                <div className="p-8 text-center text-xs text-slate-400">
                                  No has registrado asistencias recientemente en el sistema.
                                </div>
                              ) : (
                                <div className="overflow-x-auto font-sans">
                                  <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                      <tr className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">
                                        <th className="p-4 border-b border-slate-100">Fecha</th>
                                        <th className="p-4 border-b border-slate-100">Curso</th>
                                        <th className="p-4 border-b border-slate-100">Estudiante</th>
                                        <th className="p-4 border-b border-slate-100 text-center">Estado</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                      {dbAttendances
                                        .filter((att) =>
                                          dbCourses.some((c) => c.teacher_id === currentUser.id && c.id === att.course_id)
                                        )
                                        .slice(-10)
                                        .reverse()
                                        .map((att) => {
                                          const crs = dbCourses.find((c) => c.id === att.course_id);
                                          const std = dbStudents.find((s) => s.id === att.student_id);

                                          return (
                                            <tr key={att.id} className="hover:bg-slate-50/50">
                                              <td className="p-4 font-mono font-medium text-slate-600">{att.date}</td>
                                              <td className="p-4 font-bold text-slate-800">{crs?.nombre_curso || att.course_id}</td>
                                              <td className="p-4 font-medium text-slate-700">{std ? `${std.nombres} ${std.apellidos}` : att.student_id}</td>
                                              <td className="p-4 text-center">
                                                <span
                                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${att.status === AttendanceStatus.PRESENT
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : att.status === AttendanceStatus.ABSENT
                                                      ? 'bg-rose-50 text-rose-600'
                                                      : 'bg-amber-50 text-amber-600'
                                                    }`}
                                                >
                                                  {att.status === AttendanceStatus.PRESENT
                                                    ? 'PRESENTE'
                                                    : att.status === AttendanceStatus.ABSENT
                                                      ? 'AUSENTE'
                                                      : 'EXCUSADO'}
                                                </span>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Attendance Tracker Panel Checklist Form */
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6" id="attendance_tracker_panel">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
                            <div>
                              <button
                                type="button"
                                onClick={() => setSelectedTeacherCourse(null)}
                                className="text-[#fc7609] hover:text-orange-600 text-xs font-bold font-display cursor-pointer flex items-center gap-1 mb-2"
                              >
                                &larr; Regresar a cursos
                              </button>
                              <h3 className="font-display font-extrabold text-xl text-slate-800">
                                Toma de Asistencia: {selectedTeacherCourse.nombre_curso}
                              </h3>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Registre la asistencia para los alumnos activos asignados al grupo.
                              </p>
                            </div>

                            <div className="flex flex-col">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                                Fecha de la Clase 📅
                              </label>
                              <input
                                type="date"
                                value={attendanceDate}
                                onChange={(e) => setAttendanceDate(e.target.value)}
                                className="px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-white font-mono"
                              />
                            </div>
                          </div>

                          <form onSubmit={handleSubmitAttendance} className="space-y-6">
                            <div className="divide-y divide-slate-100">
                              {dbStudents.filter(
                                (st) => st.course_id === selectedTeacherCourse.id && (st.status === StudentStatus.ACTIVE || st.status === StudentStatus.BLOCKED)
                              ).length === 0 ? (
                                <div className="py-12 bg-slate-50 text-center rounded-2xl border border-dashed border-slate-150">
                                  <p className="text-xs text-slate-500 font-medium">
                                    No hay estudiantes con estado de vinculación <b>ACTIVO</b> o <b>BLOQUEADO</b> asignados a este curso.
                                  </p>
                                  <p className="text-[11px] text-slate-400 mt-0.5">
                                    Para registrar la asistencia, el estudiante debe estar matriculado y en estado activo o temporalmente suspendido.
                                  </p>
                                </div>
                              ) : (
                                dbStudents
                                  .filter((st) => st.course_id === selectedTeacherCourse.id && (st.status === StudentStatus.ACTIVE || st.status === StudentStatus.BLOCKED))
                                  .map((student, idx) => {
                                    const isBlocked = student.status === StudentStatus.BLOCKED;
                                    const currentStatus = isBlocked ? AttendanceStatus.ABSENT : (attendanceRecords[student.id] || AttendanceStatus.PRESENT);

                                    return (
                                      <div
                                        key={student.id}
                                        className={`py-4 px-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-4 transition-all duration-200 border border-transparent ${isBlocked
                                          ? 'bg-rose-50/60 border-rose-100/80 my-1.5'
                                          : 'hover:bg-slate-50/55'
                                          }`}
                                      >
                                        <div className="flex gap-3 items-start">
                                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-mono font-bold text-xs select-none shrink-0 ${isBlocked ? 'bg-rose-100 text-rose-750' : 'bg-slate-100 text-slate-650'
                                            }`}>
                                            {idx + 1}
                                          </div>
                                          <div>
                                            <h4 className="font-bold text-slate-800 text-sm flex items-center flex-wrap gap-2">
                                              {student.nombres} {student.apellidos}
                                              {isBlocked && (
                                                <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-rose-100 text-rose-700 border border-rose-200 rounded-lg uppercase tracking-wider flex items-center gap-1 shrink-0 animate-pulse">
                                                  Bloqueado por Mora 🚫
                                                </span>
                                              )}
                                            </h4>
                                            <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                                              Doc: {student.documento_identidad} • Edad: {student.edad} años
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl p-1 w-max">
                                          <button
                                            type="button"
                                            disabled={isBlocked}
                                            onClick={() =>
                                              setAttendanceRecords((prev) => ({
                                                ...prev,
                                                [student.id]: AttendanceStatus.PRESENT,
                                              }))
                                            }
                                            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${isBlocked
                                              ? 'opacity-30 cursor-not-allowed text-slate-400'
                                              : currentStatus === AttendanceStatus.PRESENT
                                                ? 'bg-emerald-600 text-white shadow-xs cursor-pointer'
                                                : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                                              }`}
                                          >
                                            PRESENTE
                                          </button>
                                          <button
                                            type="button"
                                            disabled={isBlocked}
                                            onClick={() =>
                                              setAttendanceRecords((prev) => ({
                                                ...prev,
                                                [student.id]: AttendanceStatus.ABSENT,
                                              }))
                                            }
                                            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${isBlocked
                                              ? 'bg-rose-600 text-white opacity-80 cursor-not-allowed font-medium shadow-xs'
                                              : currentStatus === AttendanceStatus.ABSENT
                                                ? 'bg-rose-600 text-white shadow-xs cursor-pointer'
                                                : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                                              }`}
                                          >
                                            AUSENTE
                                          </button>
                                          <button
                                            type="button"
                                            disabled={isBlocked}
                                            onClick={() =>
                                              setAttendanceRecords((prev) => ({
                                                ...prev,
                                                [student.id]: AttendanceStatus.EXCUSED,
                                              }))
                                            }
                                            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${isBlocked
                                              ? 'opacity-30 cursor-not-allowed text-slate-400'
                                              : currentStatus === AttendanceStatus.EXCUSED
                                                ? 'bg-amber-500 text-white shadow-xs cursor-pointer'
                                                : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                                              }`}
                                          >
                                            EXCUSADO
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })
                              )}
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => setSelectedTeacherCourse(null)}
                                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                disabled={
                                  submittingAttendance ||
                                  dbStudents.filter(
                                    (st) =>
                                      st.course_id === selectedTeacherCourse.id && (st.status === StudentStatus.ACTIVE || st.status === StudentStatus.BLOCKED)
                                  ).length === 0
                                }
                                className="px-5 py-2.5 bg-[#fc7609] hover:bg-orange-600 active:scale-98 disabled:opacity-50 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
                              >
                                {submittingAttendance ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    <span>Guardando registros...</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4" />
                                    <span>Guardar Registro de Asistencia</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view_inicio"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                    >
                      <div className="lg:col-span-8 space-y-6">
                        {/* STATS GENERAL CARDS */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                            <span className="text-[10px] font-bold font-mono uppercase text-slate-400 block tracking-widest">Matrículas Totales</span>
                            <span className="text-3xl font-black text-slate-800 mt-1 block font-display">{dbStudents.length}</span>
                            <span className="text-xs text-slate-500 mt-0.5 block">Estudiantes de La Virginia</span>
                          </div>
                          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                            <span className="text-[10px] font-bold font-mono uppercase text-slate-400 block tracking-widest">Docentes Activos</span>
                            <span className="text-3xl font-black text-slate-800 mt-1 block font-display">
                              {dbUsers.filter((u) => u.role === UserRole.TEACHER && u.status === UserStatus.ACTIVE).length}
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5 block">Capacitados para asignar</span>
                          </div>
                          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                            <span className="text-[10px] font-bold font-mono uppercase text-slate-400 block tracking-widest">Cursos dictados</span>
                            <span className="text-3xl font-black text-slate-800 mt-1 block font-display">
                              {dbCourses.filter((c) => c.status === 'ACTIVE').length}
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5 block">Grupos en aulas</span>
                          </div>
                        </div>

                        {/* MIDDLEWARE SIMULATION CARD BOARD */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                          <div>
                            <h3 className="font-display font-extrabold text-lg text-slate-800 flex items-center gap-2">
                              <Lock className="h-5 w-5 text-[#fc7609]" />
                              Garantías del Middleware de Acceso
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Compruebe el comportamiento transaccional del middleware autenticador simulando llamadas a las rutas de producción restringidas.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                              <div>
                                <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-orange-100 text-[#fc7609] uppercase block w-max mb-2">SOLO DIRECTOR</span>
                                <h4 className="font-bold text-xs text-slate-800">Cierre Financiero</h4>
                                <p className="text-[11px] text-slate-500 mt-1">Inspección de balances de ingresos de matrículas escolares.</p>
                              </div>
                              <button
                                onClick={() => {
                                  const auth = simulateMiddlewareCheck(currentUser, '/director/financials/budget');
                                  addLog('Call REST Financials', auth.authorized ? 'SUCCESS' : 'DENIED', auth.reason);
                                  alert(auth.authorized ? `✓ ACCESO GRANTED!\n\n${auth.reason}` : `✗ REJECTED:\n\n${auth.reason}`);
                                }}
                                className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                              >
                                Consultar Caja
                              </button>
                            </div>

                            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                              <div>
                                <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-blue-100 text-blue-700 uppercase block w-max mb-2">DIRECTOR Y ADMIN</span>
                                <h4 className="font-bold text-xs text-slate-800">Control de Matriculados</h4>
                                <p className="text-[11px] text-slate-500 mt-1">Configuración y apertura del ciclo de admisiones globales.</p>
                              </div>
                              <button
                                onClick={() => {
                                  const auth = simulateMiddlewareCheck(currentUser, '/admin/enroll/toggle');
                                  addLog('Call REST Admissions', auth.authorized ? 'SUCCESS' : 'DENIED', auth.reason);
                                  alert(auth.authorized ? `✓ ACCESO GRANTED!\n\n${auth.reason}` : `✗ REJECTED:\n\n${auth.reason}`);
                                }}
                                className="mt-4 w-full py-2 bg-[#fc7609] hover:bg-orange-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                              >
                                Configurar Campañas
                              </button>
                            </div>

                            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                              <div>
                                <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-purple-100 text-purple-700 uppercase block w-max mb-2">TODOS LOS ACCESOS</span>
                                <h4 className="font-bold text-xs text-slate-800">Libro de Novedades</h4>
                                <p className="text-[11px] text-slate-500 mt-1">Observaciones académicas periódicas de los alumnos inscritos.</p>
                              </div>
                              <button
                                onClick={() => {
                                  const auth = simulateMiddlewareCheck(currentUser, '/teacher/grades/update');
                                  addLog('Call REST Observaciones', auth.authorized ? 'SUCCESS' : 'DENIED', auth.reason);
                                  alert(auth.authorized ? `✓ ACCESO GRANTED!\n\n${auth.reason}` : `✗ REJECTED:\n\n${auth.reason}`);
                                }}
                                className="mt-4 w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                              >
                                Ver Observaciones
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* MOSTRAR MAPA RELACIONAL DEL DIAGRAMA PARA ANALISIS RAPIDO */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
                          <div className="mb-4">
                            <h3 className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                              <Database className="h-4.5 w-4.5 text-orange-500" />
                              Mapa Relacional de Entidades Actualizado (Fase 2)
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Contiene la relación <code>Course.teacher_id</code> (1-M) y el nuevo campo nulable/opcional <code>Student.course_id</code> vinculando el salón.
                            </p>
                          </div>
                          <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-2xl flex items-center justify-center overflow-x-auto">
                            <svg viewBox="0 0 860 360" className="w-full max-w-[800px] text-slate-700">
                              <defs>
                                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
                                </marker>
                                <marker id="circle" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4">
                                  <circle cx="5" cy="5" r="5" fill="#475569" />
                                </marker>
                              </defs>

                              {/* USER */}
                              <g transform="translate(10, 10)">
                                <rect width="190" height="110" rx="10" fill="white" stroke="#c084fc" strokeWidth="2" />
                                <rect width="190" height="28" rx="8" fill="#faf5ff" />
                                <text x="10" y="18" className="font-display text-[11px] font-black fill-purple-900">👤 User (Director/Maestros)</text>
                                <text x="12" y="48" className="font-mono text-[9px] fill-slate-700 font-bold">id (PK) : String</text>
                                <text x="12" y="62" className="font-mono text-[9px] fill-slate-700">email : String (UNIQUE)</text>
                                <text x="12" y="76" className="font-mono text-[9px] fill-red-500 font-bold">status : [ACTIVE, INACTIVE]</text>
                                <text x="12" y="90" className="font-mono text-[9px] fill-[#fc7609]">role : [DIR, ADM, TEACH]</text>
                              </g>

                              {/* COURSE */}
                              <g transform="translate(10, 185)">
                                <rect width="190" height="100" rx="10" fill="white" stroke="#38bdf8" strokeWidth="2" />
                                <rect width="190" height="28" rx="8" fill="#f0f9ff" />
                                <text x="10" y="18" className="font-display text-[11px] font-black fill-sky-900">📚 Course (Salón de Inglés)</text>
                                <text x="12" y="48" className="font-mono text-[9px] fill-slate-700 font-bold">id (PK) : String</text>
                                <text x="12" y="62" className="font-mono text-[9px] fill-slate-700">nombre_curso : String</text>
                                <text x="12" y="76" className="font-mono text-[9px] fill-purple-600 font-bold">teacher_id (FK User.id)</text>
                                <text x="12" y="90" className="font-mono text-[9px] fill-slate-400">status : String</text>
                              </g>

                              {/* STUDENT */}
                              <g transform="translate(305, 55)">
                                <rect width="240" height="230" rx="10" fill="white" stroke="#fc7609" strokeWidth="3" />
                                <rect width="240" height="32" rx="8" fill="#fff7ed" />
                                <text x="10" y="20" className="font-display text-[11px] font-black fill-orange-950">🎒 Student (Estudiante - Core)</text>
                                <text x="12" y="55" className="font-mono text-[9px] fill-slate-700 font-bold">id (PK) : String</text>
                                <text x="12" y="70" className="font-mono text-[9px] fill-emerald-600 font-bold">documento_identidad (UNIQ)</text>
                                <text x="12" y="85" className="font-mono text-[9px] fill-slate-650">nombres, apellidos : String</text>
                                <text x="12" y="100" className="font-mono text-[9px] fill-slate-500">edad : Int</text>
                                <text x="12" y="115" className="font-mono text-[9px] fill-slate-550 italic">colegio_origen : String (Virginia)</text>
                                <text x="12" y="130" className="font-mono text-[9px] fill-blue-600 font-bold">guardian_id (FK Guardian.id)</text>

                                <text x="12" y="155" className="font-mono text-[9px] fill-[#fc7609] font-bold">course_id (FK Course.id - Nulable)</text>
                                <text x="12" y="170" className="font-mono text-[9px] fill-emerald-700 font-bold">status: REGISTERED | ACTIVE..</text>
                              </g>

                              {/* GUARDIAN */}
                              <g transform="translate(620, 150)">
                                <rect width="210" height="120" rx="10" fill="white" stroke="#059669" strokeWidth="2" />
                                <rect width="210" height="28" rx="8" fill="#ecfdf5" />
                                <text x="10" y="18" className="font-display text-[11px] font-black fill-emerald-900">🤝 Guardian (Tutor Acudiente)</text>
                                <text x="12" y="48" className="font-mono text-[9px] fill-slate-700 font-bold">id (PK) : String</text>
                                <text x="12" y="62" className="font-mono text-[9px] fill-slate-800 font-bold">nombre_completo : String</text>
                                <text x="12" y="76" className="font-mono text-[9px] fill-slate-500">telefono : String</text>
                                <text x="12" y="90" className="font-mono text-[9px] fill-slate-500">parentesco, direccion : String</text>
                              </g>

                              {/* ARROWS */}
                              <path d="M 100,120 L 100,185" fill="none" stroke="#a855f7" strokeWidth="2" markerStart="url(#circle)" markerEnd="url(#arrow)" />
                              <path d="M 620,210 L 545,210" fill="none" stroke="#10b981" strokeWidth="2" markerStart="url(#circle)" markerEnd="url(#arrow)" />
                              <path d="M 200,235 L 305,235" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4" markerStart="url(#circle)" markerEnd="url(#arrow)" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-4 space-y-6">
                        {/* REAL-TIME MIDDLEWARE LOG CONSOLE */}
                        <div className="bg-slate-900 rounded-3xl p-5 text-slate-200 shadow-md border border-slate-800">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-2.5 mb-3">
                            <div className="flex items-center gap-1.5">
                              <span className="h-2.5 w-2.5 rounded-full bg-[#fc7609] animate-pulse inline-block" />
                              <span className="font-display font-extrabold text-[10px] tracking-wider text-slate-400 uppercase">AUDITORÍA DE MIDDLEWARES TCI</span>
                            </div>
                            <button
                              onClick={() => setMiddlewareLogs([])}
                              className="text-[9px] text-slate-500 hover:text-slate-350 font-mono font-bold"
                            >
                              Limpiar
                            </button>
                          </div>

                          <div className="space-y-3 max-h-[350px] overflow-y-auto font-mono text-[10px]">
                            {middlewareLogs.length === 0 ? (
                              <span className="text-slate-600 italic block text-center py-6">Consola despejada. Interactúe con el portal para generar logs de eventos relacionales.</span>
                            ) : (
                              middlewareLogs.map((log, idx) => (
                                <div key={idx} className="border-b border-slate-800/80 pb-2 last:border-0">
                                  <div className="flex justify-between text-[9px]">
                                    <span className="text-slate-500">{log.time}</span>
                                    <span className={`px-1 rounded font-bold uppercase ${log.status === 'SUCCESS' ? 'bg-emerald-950/50 text-emerald-400' :
                                      log.status === 'DENIED' ? 'bg-rose-950/50 text-rose-400 font-black' :
                                        'bg-blue-950/50 text-blue-400'
                                      }`}>
                                      {log.status}
                                    </span>
                                  </div>
                                  <span className="text-[#fc7609] font-bold block mt-0.5">{log.action}</span>
                                  <p className="text-slate-300 mt-0.5 leading-normal">{log.msg}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* SIMULADOR DE ROLES / SELECCION QUICK PASS */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                          <span className="text-[10px] font-bold font-mono uppercase text-slate-400 tracking-wider block">CONMUTAR CUENTAS DE CONTROL</span>
                          <div className="grid grid-cols-1 gap-2">
                            <button
                              onClick={() => handleFastLogin(UserRole.DIRECTOR, 'director@translinguakids.com')}
                              className="w-full p-2.5 bg-orange-50/40 hover:bg-orange-50 text-slate-700 rounded-xl text-left text-xs font-semibold flex items-center justify-between border border-orange-100/50 transition-all cursor-pointer"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-orange-500 inline-block" />
                                Director Principal
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 font-bold">director123</span>
                            </button>

                            <button
                              onClick={() => handleFastLogin(UserRole.ADMIN, 'admin@translinguakids.com')}
                              className="w-full p-2.5 bg-blue-50/40 hover:bg-blue-50 text-slate-700 rounded-xl text-left text-xs font-semibold flex items-center justify-between border border-blue-100/50 transition-all cursor-pointer"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
                                Administrador
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 font-bold">admin123</span>
                            </button>

                            <button
                              onClick={() => handleFastLogin(UserRole.TEACHER, 'teacher.ana@translinguakids.com')}
                              className="w-full p-2.5 bg-purple-50/40 hover:bg-purple-50 text-slate-700 rounded-xl text-left text-xs font-semibold flex items-center justify-between border border-purple-100/50 transition-all cursor-pointer"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-purple-500 inline-block" />
                                Profesor/a Ana
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 font-bold">teacher123</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}

                {/* 2. SECCIÓN ESTUDIANTES - EL CORE CON TABLA, BUSCADOR, FILTROS Y FORMULARIO DIVIDIDO */}
                {selectedSidebarView === 'estudiantes' && (
                  <motion.div
                    key="view_estudiantes"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* BARRA DE FILTROS Y AGREGAR */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between gap-4">
                      {/* Search & Selector */}
                      <div className="flex-1 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Buscar por nombres, apellidos o documento..."
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] text-xs bg-slate-50/50"
                          />
                        </div>

                        {/* Status dropdown filter */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-slate-450 uppercase font-mono tracking-wider">Estado:</span>
                          <select
                            value={studentFilterStatus}
                            onChange={(e) => setStudentFilterStatus(e.target.value)}
                            className="px-2.5 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#fc7609]"
                          >
                            <option value="TODOS">Todos los alumnos</option>
                            <option value="REGISTERED">REGISTERED (Registrado)</option>
                            <option value="IN_INTERVIEW">IN_INTERVIEW (Con entrevista)</option>
                            <option value="ACTIVE">ACTIVE (Matriculado Activo)</option>
                            <option value="BLOCKED">BLOCKED (Bloqueado)</option>
                          </select>
                        </div>
                      </div>

                      {/* Inscription Action Toggle */}
                      <button
                        onClick={() => {
                          const authCheck = simulateMiddlewareCheck(currentUser, '/admin/students/register');
                          addLog('Inscripcion Form Access', authCheck.authorized ? 'SUCCESS' : 'DENIED', authCheck.reason);
                          if (authCheck.authorized) {
                            handleStartRegisterStudent();
                          } else {
                            alert(`Acceso denegado: Su rol de ${currentUser.role} no tiene permisos de matrícula.`);
                          }
                        }}
                        className="py-2 px-4 bg-[#fc7609] hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/10 shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Inscripción Manual Estudiante</span>
                      </button>
                    </div>

                    {/* MANUAL STUDENT AND GUARDIAN MOUNT FORM */}
                    <AnimatePresence>
                      {showAddStudentForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <form onSubmit={handleRegisterStudent} className="bg-white rounded-3xl p-6 border border-dashed border-orange-300 shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                              <div>
                                <h4 className="font-display font-extrabold text-base text-slate-800">
                                  {editingStudentId ? 'Editar Estudiante y Acudiente' : 'Formulario Relacional de Matrícula'}
                                </h4>
                                <p className="text-xs text-slate-500">
                                  {editingStudentId ? 'Modifique los datos personales, del colegio o del acudiente.' : 'Registre un estudiante vinculando datos de su acudiente de forma segura.'}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddStudentForm(false);
                                  setEditingStudentId(null);
                                  setEditingStudentGuardianId('');
                                }}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-xs font-semibold cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* SECCIÓN A: DATOS DEL ESTUDIANTE */}
                              <div className="space-y-4">
                                <h5 className="font-display font-black text-xs text-[#fc7609] uppercase tracking-wide flex items-center gap-2 border-b border-orange-50 pb-1.5">
                                  <GraduationCap className="h-4.5 w-4.5 text-[#fc7609]" />
                                  1. Datos Básicos del Estudiante
                                </h5>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                  <div>
                                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Identificación Documento *</label>
                                    <input
                                      type="text"
                                      required
                                      placeholder="Ej: 1088456123"
                                      value={newStudentForm.documento_identidad}
                                      onChange={(e) => setNewStudentForm({ ...newStudentForm, documento_identidad: e.target.value })}
                                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#fc7609] focus:outline-none text-xs"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Fecha de Nacimiento *</label>
                                    <input
                                      type="date"
                                      required
                                      value={newStudentForm.fecha_nacimiento}
                                      onChange={(e) => setNewStudentForm({ ...newStudentForm, fecha_nacimiento: e.target.value })}
                                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#fc7609] focus:outline-none text-xs"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

                                  <div>
                                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Edad (Años)</label>
                                    <input
                                      type="number"
                                      min="4"
                                      max="17"
                                      value={newStudentForm.edad}
                                      onChange={(e) => setNewStudentForm({ ...newStudentForm, edad: parseInt(e.target.value) || 8 })}
                                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#fc7609] focus:outline-none text-xs"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3.5">
                                  <div>
                                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Nombres *</label>
                                    <input
                                      type="text"
                                      required
                                      value={newStudentForm.nombres}
                                      onChange={(e) => setNewStudentForm({ ...newStudentForm, nombres: e.target.value })}
                                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#fc7609] focus:outline-none text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Apellidos *</label>
                                    <input
                                      type="text"
                                      required
                                      value={newStudentForm.apellidos}
                                      onChange={(e) => setNewStudentForm({ ...newStudentForm, apellidos: e.target.value })}
                                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#fc7609] focus:outline-none text-xs"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                  <div>
                                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1 font-semibold">Colegio de origen (La Virginia) *</label>
                                    <select
                                      value={newStudentForm.colegio_origen}
                                      onChange={(e) => setNewStudentForm({ ...newStudentForm, colegio_origen: e.target.value })}
                                      className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#fc7609]"
                                    >
                                      {COLEGIOS_LA_VIRGINIA.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Grado Escolar</label>
                                    <select
                                      value={newStudentForm.grado_escolar}
                                      onChange={(e) => setNewStudentForm({ ...newStudentForm, grado_escolar: e.target.value })}
                                      className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#fc7609]"
                                    >
                                      {['Preescolar', 'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo', 'Once'].map(grado => (
                                        <option key={grado} value={grado}>{grado}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                  <div>
                                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Jornada escolar ordinaria</label>
                                    <select
                                      value={newStudentForm.jornada_escolar}
                                      onChange={(e) => setNewStudentForm({ ...newStudentForm, jornada_escolar: e.target.value as SchoolDayPeriod })}
                                      className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-[#fc7609] focus:ring-2"
                                    >
                                      <option value={SchoolDayPeriod.MANANA}>MAÑANA</option>
                                      <option value={SchoolDayPeriod.TARDE}>TARDE</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                                  <div>
                                    <label className="block text-[10px] font-bold font-mono uppercase text-[#fc7609] mb-1 font-bold">Asignar a Curso Abierto (Fase 2)</label>
                                    <select
                                      value={newStudentForm.course_id}
                                      onChange={(e) => setNewStudentForm({ ...newStudentForm, course_id: e.target.value })}
                                      className="w-full p-2 border border-orange-200 rounded-xl text-xs bg-white font-bold text-slate-700 focus:outline-[#fc7609] focus:ring-2 focus:ring-[#fc7609]"
                                    >
                                      <option value="">-- Sin asignar aula aún (Nulable en DB) --</option>
                                      {dbCourses.filter(c => c.status === 'ACTIVE').map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre_curso}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Próxima Fecha De Pago</label>
                                    <input
                                      type="date"
                                      value={newStudentForm.payment_deadline_date}
                                      onChange={(e) => setNewStudentForm({ ...newStudentForm, payment_deadline_date: e.target.value })}
                                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3.5 pt-1">
                                  <div>
                                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Estado del Estudiante *</label>
                                    <select
                                      value={newStudentForm.status}
                                      onChange={(e) => setNewStudentForm({ ...newStudentForm, status: e.target.value as StudentStatus })}
                                      className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white p-2.5 focus:outline-[#fc7609] focus:ring-2 focus:ring-[#fc7609]"
                                    >
                                      <option value={StudentStatus.REGISTERED}>PRE-REGISTRADO (REGISTERED)</option>
                                      <option value={StudentStatus.IN_INTERVIEW}>EN ENTREVISTA (IN_INTERVIEW)</option>
                                      <option value={StudentStatus.ACTIVE}>ACTIVO (ACTIVE)</option>
                                      <option value={StudentStatus.BLOCKED}>BLOQUEADO (BLOCKED)</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* SECCIÓN B: DATOS DEL ACUDIENTE */}
                              <div className="space-y-4">
                                <h5 className="font-display font-black text-xs text-emerald-600 uppercase tracking-wide flex items-center gap-2 border-b border-emerald-50 pb-1.5">
                                  <Users className="h-4.5 w-4.5 text-emerald-500" />
                                  2. Información del Tutor (Acudiente Legal)
                                </h5>

                                <div>
                                  <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Nombre Completo del Responsable *</label>
                                  <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                      type="text"
                                      required
                                      placeholder="Ej: Luz Marina Arenas"
                                      value={newStudentForm.guardian_nombre_completo}
                                      onChange={(e) => setNewStudentForm({ ...newStudentForm, guardian_nombre_completo: e.target.value })}
                                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                  <div>
                                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Parentesco Familiar *</label>
                                    <select
                                      value={newStudentForm.guardian_parentesco}
                                      onChange={(e) => setNewStudentForm({ ...newStudentForm, guardian_parentesco: e.target.value })}
                                      className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white"
                                    >
                                      <option value="Madre">Madre</option>
                                      <option value="Padre">Padre</option>
                                      <option value="Abuelo/a">Abuelo/a</option>
                                      <option value="Tío/a">Tío/a</option>
                                      <option value="Tutor Legal">Tutor Legal u Otro</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Celular de Contacto *</label>
                                    <div className="relative">
                                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                      <input
                                        type="tel"
                                        required
                                        placeholder="Ej: 3147778899"
                                        value={newStudentForm.guardian_telefono}
                                        onChange={(e) => setNewStudentForm({ ...newStudentForm, guardian_telefono: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Dirección de Residencia *</label>
                                  <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                      type="text"
                                      required
                                      placeholder="Ej: Barrio Centro, La Virginia"
                                      value={newStudentForm.guardian_direccion}
                                      onChange={(e) => setNewStudentForm({ ...newStudentForm, guardian_direccion: e.target.value })}
                                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs"
                                    />
                                  </div>
                                </div>

                                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-[11px] text-slate-600 block leading-relaxed">
                                  <b>💡 Operación Relacional Segura:</b> Al guardar este formulario, el backend instanciará de forma atómica y relacional la entidad del Acudiente Principal y la enlazará en cascada al registro del estudiante mediante sus referencias respectivas.
                                </div>
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-display text-xs rounded-xl transition-all shadow-md shadow-emerald-500/15 cursor-pointer text-center block"
                            >
                              Registrar Estudiante y Acudiente de Forma Relacional
                            </button>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* TABLE WORKSPACE OF STUDENTS */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-700 uppercase">Listado General De Matrícula</span>
                        <span className="text-xs text-slate-400 font-mono">Mostrando {filteredStudents.length} de {dbStudents.length} resultados</span>
                      </div>

                      <div className="overflow-x-auto rounded-xl">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 font-mono text-[9px] font-bold border-b border-slate-100 uppercase">
                              <th className="p-3">IDENTIFICACIÓN / ESTUDIANTE</th>
                              <th className="p-3">EDAD</th>
                              <th className="p-3">COLEGIO (LA VIRGINIA)</th>
                              <th className="p-3">CURSO / GRUPO</th>
                              <th className="p-3">CONTRATO / ACUDIENTE VINCULADO</th>
                              <th className="p-3 text-center">ESTADO</th>
                              <th className="p-3 text-right">ACCIONES</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="p-8 text-center text-slate-400 italic">No se encontraron resultados consistentes con la consulta activa.</td>
                              </tr>
                            ) : (
                              filteredStudents.map((st) => {
                                const guardian = dbGuardians.find((g) => g.id === st.guardian_id);
                                const assignedCourse = dbCourses.find((c) => c.id === st.course_id);

                                return (
                                  <tr key={st.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                                    <td className="p-3">
                                      <span className="font-extrabold text-slate-800 font-display block leading-none">{st.nombres} {st.apellidos}</span>
                                      <span className="font-mono text-[9px] text-[#fc7609] font-bold block mt-1 uppercase">Doc: {st.documento_identidad}</span>
                                      {st.fecha_nacimiento && <span className="font-mono text-[9px] text-slate-400 font-bold block mt-0.5">Nacimiento: {st.fecha_nacimiento}</span>}
                                    </td>
                                    <td className="p-3 font-semibold text-slate-700">
                                      {st.edad} años
                                      <span className="block text-[10px] text-slate-400 font-mono uppercase font-bold">{st.jornada_escolar}</span>
                                    </td>
                                    <td className="p-3 text-slate-500">
                                      {st.colegio_origen}
                                      {st.grado_escolar && <span className="block text-[10px] text-slate-400 font-mono uppercase font-bold mt-1">Grado: {st.grado_escolar}</span>}
                                    </td>
                                    <td className="p-3 font-medium text-slate-700">
                                      {assignedCourse ? (
                                        <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded text-[10px] border border-sky-100">
                                          {assignedCourse.nombre_curso}
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 italic text-[10px]">Sin asignar grupo (Nulo)</span>
                                      )}
                                      <span className="block text-[10px] text-slate-400 mt-0.5">{st.curso_actual}</span>
                                    </td>
                                    <td className="p-3">
                                      {guardian ? (
                                        <div>
                                          <span className="font-semibold text-slate-800 block">{guardian.nombre_completo}</span>
                                          <span className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                            <span className="bg-slate-100 px-1 py-0.1 font-bold text-[9px] rounded text-slate-500">{guardian.parentesco}</span>
                                            <span>📞 {guardian.telefono}</span>
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-rose-500 italic text-[10px] font-bold font-mono">⚠️ ERROR DE FK: Huérfano</span>
                                      )}
                                    </td>
                                    <td className="p-3 text-center">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider
                                        ${st.status === StudentStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600' :
                                          st.status === StudentStatus.REGISTERED ? 'bg-indigo-50 text-indigo-600' :
                                            st.status === StudentStatus.IN_INTERVIEW ? 'bg-amber-50 text-amber-600' :
                                              'bg-rose-50 text-rose-600'}`}>
                                        ● {st.status}
                                      </span>
                                    </td>
                                    <td className="p-3 text-right">
                                      <button
                                        onClick={() => handleStartEditStudent(st)}
                                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 hover:border-[#fc7609] text-slate-700 hover:text-[#fc7609] hover:bg-orange-50/10 font-bold text-[11px] rounded-lg cursor-pointer transition-all inline-flex items-center gap-1"
                                      >
                                        <Edit2 className="h-3 w-3" />
                                        <span>Editar</span>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. SECCIÓN MAESTROS - MAESTROS CRUD */}
                {selectedSidebarView === 'maestros' && (
                  <motion.div
                    key="view_maestros"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                  >
                    {/* ENLACE TABLA MAESTROS */}
                    <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div>
                          <h4 className="font-display font-extrabold text-slate-800 text-sm">Nómina de Maestros y Docentes</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Profesionales de inglés asignados a las clases semanales dirigidas.</p>
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded-xl">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-400 font-mono text-[9px] font-bold">
                              <th className="p-3">REF ID</th>
                              <th className="p-3">NOMBRE DOCENTE</th>
                              <th className="p-3">DIRECCIÓN CORREO</th>
                              <th className="p-3">TELÉFONO</th>
                              <th className="p-3">ESTADO MIDDLEWARE</th>
                              <th className="p-3 text-center">CONTROL DE ACCESO</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dbUsers.filter(u => u.role === UserRole.TEACHER).map((t) => (
                              <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="p-3 font-mono text-slate-400 font-semibold">{t.id}</td>
                                <td className="p-3 font-bold text-slate-800">{t.nombres} {t.apellidos}</td>
                                <td className="p-3 font-mono text-slate-600 font-medium">{t.email}</td>
                                <td className="p-3 text-slate-500 font-mono">{t.telefono || 'Sin registrar phone'}</td>
                                <td className="p-3">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider font-mono ${t.status === UserStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                                    }`}>
                                    ● {t.status}
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <button
                                    onClick={() => handleToggleUserStatus(t.id)}
                                    className={`py-1 px-2.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer border ${t.status === UserStatus.ACTIVE
                                      ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                                      : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                                      }`}
                                  >
                                    {t.status === UserStatus.ACTIVE ? 'Desactivar Cuenta' : 'Activar Cuenta'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* REGISTRO NUEVO MAESTRO FORM */}
                    <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                      <div>
                        <h4 className="font-display font-extrabold text-[#fc7609] text-sm">Registrar Nuevo Maestro</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">La creación de profesores valida la autenticidad e inserta de forma instantánea en el middleware.</p>
                      </div>

                      <form onSubmit={handleRegisterTeacher} className="space-y-3.5">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-600 font-mono mb-1">Nombres *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ej: Estefanía"
                              value={newTeacherForm.nombres}
                              onChange={(e) => setNewTeacherForm({ ...newTeacherForm, nombres: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#fc7609] text-xs focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-600 font-mono mb-1">Apellidos *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ej: López Osorio"
                              value={newTeacherForm.apellidos}
                              onChange={(e) => setNewTeacherForm({ ...newTeacherForm, apellidos: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#fc7609] text-xs focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-600 font-mono mb-1">Doc. Identidad *</label>
                            <input
                              type="text"
                              required
                              value={newTeacherForm.documento_identidad}
                              onChange={(e) => setNewTeacherForm({ ...newTeacherForm, documento_identidad: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#fc7609] text-xs focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-600 font-mono mb-1">Fecha Nacimiento</label>
                            <input
                              type="date"
                              value={newTeacherForm.fecha_nacimiento}
                              onChange={(e) => setNewTeacherForm({ ...newTeacherForm, fecha_nacimiento: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#fc7609] text-xs focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-600 font-mono mb-1">Correo Docente *</label>
                          <input
                            type="email"
                            required
                            placeholder="teacher@tallertaller.com"
                            value={newTeacherForm.email}
                            onChange={(e) => setNewTeacherForm({ ...newTeacherForm, email: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#fc7609] text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-600 font-mono mb-1">Teléfono Móvil</label>
                          <input
                            type="text"
                            placeholder="Ej: 3206543210"
                            value={newTeacherForm.telefono}
                            onChange={(e) => setNewTeacherForm({ ...newTeacherForm, telefono: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#fc7609] text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-600 font-mono mb-1">Dirección</label>
                          <input
                            type="text"
                            value={newTeacherForm.direccion}
                            onChange={(e) => setNewTeacherForm({ ...newTeacherForm, direccion: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#fc7609] text-xs focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-600 font-mono mb-1">Contacto Emerg.</label>
                            <input
                              type="text"
                              value={newTeacherForm.contacto_emergencia}
                              onChange={(e) => setNewTeacherForm({ ...newTeacherForm, contacto_emergencia: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#fc7609] text-xs focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-600 font-mono mb-1">Parentesco</label>
                            <input
                              type="text"
                              value={newTeacherForm.parentesco_contacto}
                              onChange={(e) => setNewTeacherForm({ ...newTeacherForm, parentesco_contacto: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#fc7609] text-xs focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-600 font-mono mb-1">Contraseña de Prueba</label>
                          <input
                            type="text"
                            required
                            value={newTeacherForm.password}
                            onChange={(e) => setNewTeacherForm({ ...newTeacherForm, password: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl cursor-pointer"
                        >
                          Crear Maestro en Base de Datos
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* 4. SECCIÓN CURSOS - CREAR CURSO Y ASIGNAR MAESTRO */}
                {selectedSidebarView === 'cursos' && (() => {
                  const courseDetail = dbCourses.find((c) => c.id === selectedCourseDetailId);
                  const teacherDetail = courseDetail ? dbUsers.find((u) => u.id === courseDetail.teacher_id) : null;
                  const enrolledStudents = courseDetail ? dbStudents.filter((st) => st.course_id === courseDetail.id) : [];

                  return selectedCourseDetailId ? (
                    <motion.div
                      key="view_curso_detalle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full"
                    >
                      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-3">
                          <div>
                            <span className="text-[#fc7609] text-[10px] font-mono tracking-widest font-black uppercase">
                              {isEditingCourse ? 'Edición Avanzada ' : 'Detalle Completo De Aula'}
                            </span>
                            <h3 className="font-display font-extrabold text-xl text-slate-800 flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-[#fc7609]" />
                              <span>{courseDetail?.nombre_curso}</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Ref ID: <span className="font-mono text-[10px] font-bold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{courseDetail?.id}</span></p>
                          </div>
                          <div className="flex flex-wrap gap-2 self-start">
                            {!isEditingCourse ? (
                              <button
                                onClick={() => {
                                  if (courseDetail) {
                                    setEditCourseForm({
                                      nombre_curso: courseDetail.nombre_curso,
                                      teacher_id: courseDetail.teacher_id,
                                      status: courseDetail.status || 'ACTIVE',
                                    });
                                    setEditCourseSchedule(courseDetail.schedule || []);
                                    setCourseStudentSearch('');
                                    setIsEditingCourse(true);
                                  }
                                }}
                                className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                                <span>Editar Curso & Alumnos</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setIsEditingCourse(false)}
                                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                              >
                                <span>Cancelar Edición</span>
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedCourseDetailId(null);
                                setIsEditingCourse(false);
                              }}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-705 hover:text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <ArrowRight className="h-4 w-4 rotate-180" />
                              <span>Volver a la Lista</span>
                            </button>
                          </div>
                        </div>

                        {/* EDIT FORM OR STATIC DETAIL INFO */}
                        {isEditingCourse ? (
                          <form onSubmit={handleUpdateCourse} className="bg-orange-50/10 p-5 rounded-3xl border border-dashed border-orange-350 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="font-mono text-[10px] font-black uppercase text-[#fc7609] tracking-wide border-b border-orange-100 pb-1">
                                1. Información Básica del Curso
                              </h4>
                              <div>
                                <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Nombre De Curso / Grupo *</label>
                                <input
                                  type="text"
                                  required
                                  value={editCourseForm.nombre_curso}
                                  onChange={(e) => setEditCourseForm({ ...editCourseForm, nombre_curso: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#fc7609] text-xs focus:outline-none bg-white"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Reasignar Maestro Activo *</label>
                                <select
                                  value={editCourseForm.teacher_id}
                                  onChange={(e) => setEditCourseForm({ ...editCourseForm, teacher_id: e.target.value })}
                                  className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 font-medium focus:outline-[#fc7609] focus:ring-2 focus:ring-[#fc7609]"
                                >
                                  <option value="">-- Seleccionar Maestro/a --</option>
                                  {dbUsers
                                    .filter((u) => u.role === UserRole.TEACHER && u.status === UserStatus.ACTIVE)
                                    .map((doc) => (
                                      <option key={doc.id} value={doc.id}>
                                        {doc.nombres} {doc.apellidos}
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Estatus del Aula</label>
                                <select
                                  value={editCourseForm.status}
                                  onChange={(e) => setEditCourseForm({ ...editCourseForm, status: e.target.value })}
                                  className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 font-medium focus:outline-[#fc7609] focus:ring-2 focus:ring-[#fc7609]"
                                >
                                  <option value="ACTIVE">ACTIVO (ACTIVE)</option>
                                  <option value="INACTIVE">INACTIVO (INACTIVE)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-mono text-[10px] font-black uppercase text-[#fc7609] tracking-wide border-b border-orange-100 pb-1">
                                2. Configurar Horario Semanal
                              </h4>
                              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {editCourseSchedule.map((sched, idx) => (
                                  <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-100">
                                    <select
                                      value={sched.day}
                                      onChange={(e) => {
                                        const next = [...editCourseSchedule];
                                        next[idx].day = e.target.value;
                                        setEditCourseSchedule(next);
                                      }}
                                      className="p-1 border border-slate-200 rounded-lg text-[11px] bg-white text-slate-755"
                                    >
                                      <option value="Lunes">Lunes</option>
                                      <option value="Martes">Martes</option>
                                      <option value="Miércoles">Miércoles</option>
                                      <option value="Jueves">Jueves</option>
                                      <option value="Viernes">Viernes</option>
                                      <option value="Sábado">Sábado</option>
                                      <option value="Domingo">Domingo</option>
                                    </select>
                                    <input
                                      type="text"
                                      value={sched.start_time}
                                      onChange={(e) => {
                                        const next = [...editCourseSchedule];
                                        next[idx].start_time = e.target.value;
                                        setEditCourseSchedule(next);
                                      }}
                                      className="w-14 p-1 border border-slate-200 rounded-lg text-[11px] text-center"
                                    />
                                    <span className="text-slate-400 text-xs">a</span>
                                    <input
                                      type="text"
                                      value={sched.end_time}
                                      onChange={(e) => {
                                        const next = [...editCourseSchedule];
                                        next[idx].end_time = e.target.value;
                                        setEditCourseSchedule(next);
                                      }}
                                      className="w-14 p-1 border border-slate-200 rounded-lg text-[11px] text-center"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (editCourseSchedule.length > 1) {
                                          setEditCourseSchedule(editCourseSchedule.filter((_, i) => i !== idx));
                                        }
                                      }}
                                      className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-md font-bold text-xs"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center justify-between pt-1">
                                <button
                                  type="button"
                                  onClick={() => setEditCourseSchedule([...editCourseSchedule, { day: 'Martes', start_time: '14:00', end_time: '16:00' }])}
                                  className="text-[10px] text-[#fc7609] hover:underline font-bold cursor-pointer"
                                >
                                  + Agregar otro bloque horario
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                                >
                                  Guardar Datos del Curso
                                </button>
                              </div>
                            </div>
                          </form>
                        ) : (
                          /* Static info cards */
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-orange-50/25 rounded-2xl p-4 border border-orange-100/50 space-y-2">
                              <span className="text-[9px] font-bold font-mono uppercase text-orange-600 block">Maestro / Impartidor Asignado</span>
                              {teacherDetail ? (
                                <div>
                                  <span className="font-extrabold text-slate-800 text-sm block">{teacherDetail.nombres} {teacherDetail.apellidos}</span>
                                  <span className="text-slate-500 text-[11px] block mt-1">✉️ {teacherDetail.email}</span>
                                  <span className="text-slate-500 text-[11px] block mt-1">📞 {teacherDetail.telefono || 'Sin registrar'}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-rose-500 italic font-bold">⚠️ No hay docente asignado</span>
                              )}
                            </div>

                            <div className="bg-sky-50/25 rounded-2xl p-4 border border-sky-100/50 space-y-2">
                              <span className="text-[9px] font-bold font-mono uppercase text-sky-600 block">Horario Semanal Completo</span>
                              <div className="space-y-1">
                                {courseDetail?.schedule && courseDetail.schedule.length > 0 ? (
                                  courseDetail.schedule.map((item, index) => (
                                    <div key={index} className="flex justify-between text-xs text-slate-755">
                                      <span className="font-extrabold text-slate-700">{item.day}:</span>
                                      <span className="font-mono font-medium text-slate-600">{item.start_time} - {item.end_time}</span>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-xs text-slate-400 italic block">No se ha establecido un horario estructurado.</span>
                                )}
                              </div>
                            </div>

                            <div className="bg-emerald-50/25 rounded-2xl p-4 border border-emerald-100/50 space-y-2">
                              <span className="text-[9px] font-bold font-mono uppercase text-emerald-600 block">Capacidad Activa del Aula</span>
                              <div>
                                <span className="font-black text-3xl text-emerald-700 block mt-1">{enrolledStudents.length}</span>
                                <span className="text-[10px] text-slate-500 block uppercase font-mono mt-1 font-bold">Estudiantes Matriculados</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* LIST OF STUDENTS (DYNAMIC SECTIONS ACCORDING TO MODE) */}
                        {isEditingCourse ? (
                          /* DUAL / SPLIT VIEW TO ADD OR REMOVE STUDENTS IN REAL TIME */
                          <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-2.5">
                              <div>
                                <span className="text-[10px] font-mono uppercase font-black text-[#fc7609]">Gestor de Estudiantes del Curso</span>
                                <h4 className="font-display font-extrabold text-xs text-slate-700 uppercase">Transferir & Asignar Alumnos</h4>
                              </div>
                              <div className="relative mt-2 sm:mt-0 w-full sm:w-60">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <input
                                  type="text"
                                  placeholder="Buscar estudiante..."
                                  value={courseStudentSearch}
                                  onChange={(e) => setCourseStudentSearch(e.target.value)}
                                  className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#fc7609] text-xs bg-white"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {/* Left Column: Enrolled Students */}
                              <div className="bg-emerald-50/10 p-4 rounded-2xl border border-emerald-100 space-y-3.5">
                                <div className="flex justify-between items-center text-xs border-b border-emerald-100/60 pb-1.5">
                                  <span className="font-bold text-emerald-800 font-mono uppercase">Inscritos en esta Aula ({enrolledStudents.length})</span>
                                </div>
                                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                  {enrolledStudents.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic p-4 text-center">Nigún alumno inscrito aún.</p>
                                  ) : (
                                    enrolledStudents
                                      .filter(st => {
                                        const query = courseStudentSearch.toLowerCase().trim();
                                        if (!query) return true;
                                        return (
                                          st.nombres.toLowerCase().includes(query) ||
                                          st.apellidos.toLowerCase().includes(query) ||
                                          st.documento_identidad.includes(query)
                                        );
                                      })
                                      .map(st => (
                                        <div key={st.id} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-xs">
                                          <div>
                                            <span className="font-bold text-slate-800 text-xs block leading-tight">{st.nombres} {st.apellidos}</span>
                                            <span className="text-[10px] text-[#fc7609] font-mono mt-0.5 block">C.C. {st.documento_identidad}</span>
                                          </div>
                                          <button
                                            onClick={() => handleToggleStudentCourseAssignment(st, false)}
                                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold border border-red-150 transition-colors cursor-pointer"
                                          >
                                            Quitar
                                          </button>
                                        </div>
                                      ))
                                  )}
                                </div>
                              </div>

                              {/* Right Column: Other Students */}
                              <div className="bg-slate-50/40 p-4 rounded-2xl border border-slate-105 space-y-3.5">
                                <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-1.5">
                                  <span className="font-bold text-slate-650 font-mono uppercase">Otros Estudiantes o Sin Aula</span>
                                </div>
                                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                  {dbStudents.filter(st => st.course_id !== selectedCourseDetailId).length === 0 ? (
                                    <p className="text-xs text-slate-400 italic p-4 text-center">No hay alumnos disponibles fuera del curso.</p>
                                  ) : (
                                    dbStudents
                                      .filter(st => st.course_id !== selectedCourseDetailId)
                                      .filter(st => {
                                        const query = courseStudentSearch.toLowerCase().trim();
                                        if (!query) return true;
                                        return (
                                          st.nombres.toLowerCase().includes(query) ||
                                          st.apellidos.toLowerCase().includes(query) ||
                                          st.documento_identidad.includes(query)
                                        );
                                      })
                                      .map(st => {
                                        const otherCourse = dbCourses.find(c => c.id === st.course_id);
                                        return (
                                          <div key={st.id} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-xs">
                                            <div>
                                              <span className="font-bold text-slate-800 text-xs block leading-tight">{st.nombres} {st.apellidos}</span>
                                              <span className="text-[10px] text-slate-450 font-mono mt-0.5 block">
                                                C.C. {st.documento_identidad} {otherCourse ? `(${otherCourse.nombre_curso})` : '(Sin Grupo)'}
                                              </span>
                                            </div>
                                            <button
                                              onClick={() => handleToggleStudentCourseAssignment(st, true)}
                                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-150 transition-colors cursor-pointer"
                                            >
                                              Asignar
                                            </button>
                                          </div>
                                        );
                                      })
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Static Enrolled Students List */
                          <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                              <span className="text-xs font-bold text-slate-700 uppercase font-mono">Alumnos Inscritos en esta Aula</span>
                              <span className="text-[10px] font-mono text-slate-450 font-bold">Total: {enrolledStudents.length}</span>
                            </div>

                            <div className="overflow-x-auto rounded-xl">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="bg-slate-50 text-slate-500 font-mono text-[9px] font-bold uppercase border-b border-slate-100">
                                    <th className="p-3">IDENTIFICACIÓN / ESTUDIANTE</th>
                                    <th className="p-3">EDAD</th>
                                    <th className="p-3">COLEGIO (LA VIRGINIA)</th>
                                    <th className="p-3 font-mono">JORNADA</th>
                                    <th className="p-3">ACUDIENTE / REFERENCIA CONTACTO</th>
                                    <th className="p-3 text-center">ESTADO</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {enrolledStudents.length === 0 ? (
                                    <tr>
                                      <td colSpan={6} className="p-8 text-center text-slate-450 italic bg-slate-50/30">
                                        No se encuentran estudiantes asignados activamente a este curso.
                                      </td>
                                    </tr>
                                  ) : (
                                    enrolledStudents.map((st) => {
                                      const guardian = dbGuardians.find((g) => g.id === st.guardian_id);
                                      return (
                                        <tr key={st.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/35">
                                          <td className="p-3">
                                            <span className="font-extrabold text-slate-800 font-display block leading-none">{st.nombres} {st.apellidos}</span>
                                            <span className="font-mono text-[9px] text-[#fc7609] font-bold block mt-1 uppercase">Doc: {st.documento_identidad}</span>
                                            {st.fecha_nacimiento && <span className="font-mono text-[9px] text-slate-400 font-bold block mt-0.5">Nacimiento: {st.fecha_nacimiento}</span>}
                                          </td>
                                          <td className="p-3 font-semibold text-slate-700">
                                            {st.edad} años
                                          </td>
                                          <td className="p-3 text-slate-500">
                                            {st.colegio_origen}
                                            {st.grado_escolar && <span className="block text-[10px] text-slate-400 font-mono uppercase font-bold mt-1">Grado: {st.grado_escolar}</span>}
                                          </td>
                                          <td className="p-3 uppercase font-mono font-bold text-slate-400">
                                            {st.jornada_escolar}
                                          </td>
                                          <td className="p-3">
                                            {guardian ? (
                                              <div>
                                                <span className="font-semibold text-slate-800 block text-xs">{guardian.nombre_completo}</span>
                                                <span className="text-[10px] text-slate-500 block mt-1">📞 Cel: {guardian.telefono}</span>
                                              </div>
                                            ) : (
                                              <span className="text-rose-500 italic text-[10px] font-bold">⚠️ Sin acudiente</span>
                                            )}
                                          </td>
                                          <td className="p-3 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider
                                              ${st.status === StudentStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600' :
                                                st.status === StudentStatus.REGISTERED ? 'bg-indigo-50 text-indigo-600' :
                                                  st.status === StudentStatus.IN_INTERVIEW ? 'bg-amber-50 text-amber-600' :
                                                    'bg-rose-50 text-rose-600'}`}>
                                              ● {st.status}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view_cursos"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                    >
                      {/* TABLA DE CURSOS ACTIVOS */}
                      <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                        <div>
                          <h4 className="font-display font-extrabold text-slate-800 text-sm">Clases y Aulas en TCI</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Control de salones e impartidores asignados por el directivo.</p>
                        </div>

                        <div className="overflow-x-auto rounded-xl">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-slate-50 text-slate-400 font-mono text-[9px] font-bold uppercase">
                                <th className="p-3">CURSO ID</th>
                                <th className="p-3">NOMBRE CURSO ASIGNADO</th>
                                <th className="p-3">MAESTRO / TEACHER ENLAZADO</th>
                                <th className="p-3">ESTADO CURSO</th>
                                <th className="p-3">ESTUDIANTES INSCRITOS</th>
                                <th className="p-3 text-right">ACCIONES</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dbCourses.map((crs) => {
                                const tDocente = dbUsers.find((u) => u.id === crs.teacher_id);
                                const countStudents = dbStudents.filter((st) => st.course_id === crs.id).length;

                                return (
                                  <tr key={crs.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                    <td className="p-3 font-mono font-bold text-slate-400">{crs.id}</td>
                                    <td className="p-3 font-black text-slate-850">{crs.nombre_curso}</td>
                                    <td className="p-3">
                                      {tDocente ? (
                                        <div>
                                          <span className="font-semibold text-slate-700 block text-xs">{tDocente.nombres} {tDocente.apellidos}</span>
                                          <span className="font-mono text-[9px] text-[#fc7609] block uppercase">Ref ID: {crs.teacher_id}</span>
                                        </div>
                                      ) : (
                                        <span className="text-[10px] text-rose-500 italic block font-bold">⚠️ MAESTRO NO ENCONTRADO</span>
                                      )}
                                    </td>
                                    <td className="p-3">
                                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${crs.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {crs.status}
                                      </span>
                                    </td>
                                    <td className="p-3 font-bold text-center text-slate-800 font-mono text-xs">
                                      {countStudents} Estudiante{countStudents !== 1 ? 's' : ''}
                                    </td>
                                    <td className="p-3 text-right">
                                      <button
                                        onClick={() => setSelectedCourseDetailId(crs.id)}
                                        className="px-2.5 py-1 bg-white border border-slate-200 hover:border-[#fc7609] text-slate-700 hover:text-[#fc7609] hover:bg-orange-50/10 font-bold text-[11px] rounded-lg cursor-pointer transition-all inline-flex items-center gap-1"
                                      >
                                        <Eye className="h-3.5 w-3.5 text-[#fc7609]" />
                                        <span>Ver Detalle</span>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* CREACIÓN DE CURSO Y ASIGNACIÓN DE MAESTRO */}
                      <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                        <div>
                          <h4 className="font-display font-extrabold text-[#fc7609] text-sm">Registrar Nuevo Curso</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Asigne el aula a un docente activo de la base de datos de manera relacional.</p>
                        </div>

                        <form onSubmit={handleRegisterCourse} className="space-y-4">
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-650 font-mono mb-1">Nombre De Curso / Grupo *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ej: Teens Advanced - Gr. D"
                              value={newCourseForm.nombre_curso}
                              onChange={(e) => setNewCourseForm({ ...newCourseForm, nombre_curso: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#fc7609] text-xs focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-650 font-mono mb-1">Asignar Maestro Activo *</label>
                            <select
                              value={newCourseForm.teacher_id}
                              onChange={(e) => setNewCourseForm({ ...newCourseForm, teacher_id: e.target.value })}
                              className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 font-medium focus:outline-none"
                              id="teacher_select_assign"
                            >
                              <option value="">-- Seleccionar Maestro/a --</option>
                              {dbUsers
                                .filter((u) => u.role === UserRole.TEACHER && u.status === UserStatus.ACTIVE)
                                .map((doc) => (
                                  <option key={doc.id} value={doc.id}>
                                    {doc.nombres} {doc.apellidos}
                                  </option>
                                ))}
                            </select>
                            <p className="text-[10px] text-slate-400 italic mt-1 font-semibold">
                              * Solo se listan maestros activos de acuerdo con el estatus y la seguridad relacional.
                            </p>
                          </div>

                          {/* Gestor de Horarios */}
                          <div className="space-y-2 border-t border-slate-100 pt-3">
                            <label className="block text-[9px] font-bold uppercase text-slate-650 font-mono">Horario del Curso (Días y Rango de Horas)</label>
                            <div className="space-y-2">
                              {newCourseSchedule.map((sched, idx) => (
                                <div key={idx} className="flex gap-1.5 items-center">
                                  <select
                                    value={sched.day}
                                    onChange={(e) => {
                                      const next = [...newCourseSchedule];
                                      next[idx].day = e.target.value;
                                      setNewCourseSchedule(next);
                                    }}
                                    className="p-1.5 border border-slate-200 rounded-lg text-[11px] bg-white text-slate-700"
                                  >
                                    <option value="Lunes">Lunes</option>
                                    <option value="Martes">Martes</option>
                                    <option value="Miércoles">Miércoles</option>
                                    <option value="Jueves">Jueves</option>
                                    <option value="Viernes">Viernes</option>
                                    <option value="Sábado">Sábado</option>
                                    <option value="Domingo">Domingo</option>
                                  </select>
                                  <input
                                    type="text"
                                    placeholder="14:00"
                                    value={sched.start_time}
                                    onChange={(e) => {
                                      const next = [...newCourseSchedule];
                                      next[idx].start_time = e.target.value;
                                      setNewCourseSchedule(next);
                                    }}
                                    className="w-16 p-1.5 border border-slate-200 rounded-lg text-[11px] text-center"
                                  />
                                  <span className="text-slate-400 text-xs">a</span>
                                  <input
                                    type="text"
                                    placeholder="16:00"
                                    value={sched.end_time}
                                    onChange={(e) => {
                                      const next = [...newCourseSchedule];
                                      next[idx].end_time = e.target.value;
                                      setNewCourseSchedule(next);
                                    }}
                                    className="w-16 p-1.5 border border-slate-200 rounded-lg text-[11px] text-center"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (newCourseSchedule.length > 1) {
                                        setNewCourseSchedule(newCourseSchedule.filter((_, i) => i !== idx));
                                      }
                                    }}
                                    className="p-1 px-2 text-rose-500 hover:bg-rose-50 rounded-md text-xs font-bold cursor-pointer"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setNewCourseSchedule([...newCourseSchedule, { day: 'Martes', start_time: '14:00', end_time: '16:00' }])}
                              className="text-[10px] text-[#fc7609] hover:underline font-bold cursor-pointer inline-block"
                            >
                              + Agregar otro día/bloque
                            </button>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-white font-semibold text-xs rounded-xl cursor-pointer mt-2"
                          >
                            Crear y Abrir Aula de Inglés
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* 5. SECCIÓN CONFIGURACIÓN - CONFIGURACIÓN DEL SISTEMA Y RE-ESTABLECIMIENTO */}
                {selectedSidebarView === 'configuracion' && (
                  <motion.div
                    key="view_configuracion"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 animate-fade-in"
                  >
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                      <div>
                        <span className="text-[#fc7609] text-[10px] font-mono tracking-widest font-black uppercase">Global Ajustes</span>
                        <h4 className="font-display font-extrabold text-slate-800 text-lg">Configuraciones Generales del Sistema</h4>
                        <p className="text-xs text-slate-500">Gestione el año lectivo y el estado general de admisiones del Taller Creativo De Inglés.</p>
                      </div>

                      <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 md:grid-cols-3 gap-4" id="settings_config_group_form">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Nombre de la Institución</label>
                          <input
                            type="text"
                            value={editedSettings.institution_name}
                            onChange={(e) => setEditedSettings({ ...editedSettings, institution_name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none bg-slate-50/50"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Año Lectivo</label>
                          <input
                            type="text"
                            value={editedSettings.academic_year}
                            onChange={(e) => setEditedSettings({ ...editedSettings, academic_year: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none bg-slate-50/50"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Inscripciones Abiertas / Cerradas</label>
                          <select
                            value={editedSettings.enrollment_open ? 'open' : 'closed'}
                            onChange={(e) => setEditedSettings({ ...editedSettings, enrollment_open: e.target.value === 'open' })}
                            className="w-full px-2 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none bg-white"
                          >
                            <option value="open">Abiertas (Matrículas Disponibles)</option>
                            <option value="closed">Cerradas</option>
                          </select>
                        </div>
                        <div className="md:col-span-3 pt-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#fc7609] hover:bg-orange-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                          >
                            <Check className="h-4 w-4" />
                            Guardar Parámetros de TCI
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* DIAGRAMS PRISMA SOURCE VIEWER */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <h4 className="font-display font-extrabold text-slate-800 text-sm">Entregable de Base de Datos (Esquema Completo)</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Esquema físico e interfaces estructuradas de Sequelize / Prisma listos para exportación.</p>
                        </div>

                        <div className="flex bg-slate-150 p-1 rounded-lg">
                          <button
                            onClick={() => setSqlView('prisma')}
                            className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer ${sqlView === 'prisma' ? 'bg-white text-slate-850 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                          >
                            Prisma Schema
                          </button>
                          <button
                            onClick={() => setSqlView('sql')}
                            className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer ${sqlView === 'sql' ? 'bg-white text-slate-850 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                          >
                            Postgre SQL DDL
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => copyToClipboard(sqlView === 'prisma' ? PRISMA_SCHEMA_CODE : SQL_DDL_CODE)}
                          className="absolute right-3 top-3 p-1 rounded bg-slate-800 text-slate-350 select-none text-[10px] flex items-center gap-1 hover:text-white"
                        >
                          {copiedText ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedText ? 'Copiado' : 'Copiar'}</span>
                        </button>
                        <pre className="p-4 bg-slate-900 text-slate-350 rounded-2xl overflow-x-auto text-[10px] font-mono leading-relaxed max-h-[300px]">
                          {sqlView === 'prisma' ? PRISMA_SCHEMA_CODE : SQL_DDL_CODE}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 6. SECCIÓN FINANCIERA - MÓDULO DE PAGOS Y AUTOMATIZACIÓN CRON */}
                {selectedSidebarView === 'pagos' && (() => {
                  const filteredPayments = dbPayments.filter((p) => {
                    if (paymentPeriodFilter === 'General') return true;
                    return p.period_covered === paymentPeriodFilter;
                  });

                  return (
                    <motion.div
                      key="view_pagos"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 animate-fade-in text-slate-800"
                    >
                      {/* ENCABEZADO DE TÍTULO */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs" id="pagos_header_card">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-orange-100 text-[#fc7609] rounded-lg uppercase tracking-wider">
                              Finanzas y Automatización
                            </span>
                          </div>
                          <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1.5" id="pagos_title_text">
                            Módulo Financiero Directivo 💰
                          </h2>
                          <p className="text-xs text-slate-500 mt-1">
                            Audite la cartera académica de alumnos, registre abonos o matrículas y simule el sistema automatizado de bloqueo por morosidad de TCI.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                          <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Filtrar por Periodo:</label>
                            <select
                              value={paymentPeriodFilter}
                              onChange={(e) => setPaymentPeriodFilter(e.target.value)}
                              className="p-1 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 font-bold focus:outline-none min-w-[120px] cursor-pointer"
                              id="payment_period_filter_dropdown"
                            >
                              <option value="General">General (Todos)</option>
                              <option value="Enero 2026">Enero 2026</option>
                              <option value="Febrero 2026">Febrero 2026</option>
                              <option value="Marzo 2026">Marzo 2026</option>
                              <option value="Abril 2026">Abril 2026</option>
                              <option value="Mayo 2026">Mayo 2026</option>
                              <option value="Junio 2026">Junio 2026</option>
                              <option value="Julio 2026">Julio 2026</option>
                            </select>
                          </div>

                          <button
                            onClick={() => {
                              setPaymentStudentId('');
                              setPaymentAmount('150000');
                              setPaymentPeriod('Junio 2026');
                              setPaymentDateInput(new Date().toISOString().split('T')[0]);
                              setShowAddPaymentModal(true);
                            }}
                            className="px-5 py-2.5 bg-[#fc7609] hover:bg-orange-600 active:scale-98 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md shadow-orange-500/10 transition-all font-display shrink-0"
                            id="btn_trigger_payment_modal"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Registrar Pago Manual</span>
                          </button>
                        </div>
                      </div>

                      {/* METRIC CARD GRID (BENTO STYLE) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="pagos_bento_grid">
                        {/* CARD 1 - RECAUDO ACUMULADO */}
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
                          <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Total de Ingresos ($)</span>
                            <span className="text-xl font-black text-slate-800 block mt-0.5 font-display">
                              ${filteredPayments.reduce((acc, p) => acc + p.amount, 0).toLocaleString('es-CO')} COP
                            </span>
                          </div>
                        </div>

                        {/* CARD 2 - TOTAL PAGOS */}
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
                          <div className="h-10 w-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#fc7609] shrink-0">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Total de Facturas Emitidas</span>
                            <span className="text-xl font-black text-slate-800 block mt-0.5 font-display">
                              {filteredPayments.length} Recibo{filteredPayments.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        {/* CARD 3 - ALUMNOS SOLVENTES */}
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
                          <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                            <UserCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Alumnos Activos</span>
                            <span className="text-xl font-black text-slate-800 block mt-0.5 font-display">
                              {dbStudents.filter(s => s.status === StudentStatus.ACTIVE).length} Alumnos
                            </span>
                          </div>
                        </div>

                        {/* CARD 4 - MOROSIDAD CRÍTICA */}
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
                          <div className="h-10 w-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                            <AlertTriangle className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Morosos (Bloqueados)</span>
                            <span className="text-xl font-black text-rose-605 block mt-0.5 font-display">
                              {dbStudents.filter(s => s.status === StudentStatus.BLOCKED).length} Retenidos
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* VIRTUAL CRON SIMULATOR PANEL */}
                      <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl border border-slate-850 shadow-md">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-[10px] font-mono tracking-wider font-extrabold text-orange-400 uppercase">
                                AUTOMATIZACIÓN INTEGRADA (CRON DIARIO 00:00)
                              </span>
                            </div>
                            <h3 className="text-base font-bold font-display text-white">
                              Simulador Automatizado de Cartera (Bloqueo Morosos) 📅
                            </h3>
                            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                              El sistema registra una tarea de fondo (CronJob/Webhook) que corre cada medianoche. Escanea a todos los estudiantes y, si la fecha de pago límite ha expirado (es menor a hoy), actualiza el estado a <b>BLOCKED</b>. Modifique la fecha virtual para probar cómo funciona.
                            </p>
                          </div>

                          {/* CONTROLES SIMULACION */}
                          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/85 flex flex-col sm:flex-row items-end gap-3 shrink-0">
                            <div className="w-full sm:w-auto">
                              <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">
                                Fecha del Sistema (Simulada):
                              </label>
                              <input
                                type="date"
                                value={cronCustomDate}
                                onChange={(e) => setCronCustomDate(e.target.value)}
                                className="px-3 py-1.5 text-xs text-white bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#fc7609] font-mono w-full"
                              />
                            </div>

                            <button
                              onClick={handleTriggerCron}
                              disabled={runningCron}
                              className="px-4 py-2 bg-[#fc7609] hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-all text-center w-full sm:w-auto shrink-0 justify-center"
                            >
                              {runningCron ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <span>Ejecutar Cron (00:00) ⚡</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* MIDDLEWARE LOG CONSOLE LOG LINKED */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-[11px] font-mono text-slate-550 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded bg-slate-200 text-slate-600 font-bold font-mono">LOG DE COMUNICACIONES:</span>
                          <span>Último estado de cartera verificado por middleware de TCI.</span>
                        </div>
                        <span className="font-bold text-[#fc7609]">{middlewareLogs[0]?.time} - {middlewareLogs[0]?.action} [{middlewareLogs[0]?.status}]</span>
                      </div>

                      {/* TABLE OF STUDENTS AND PAYMENT STATUS */}
                      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40">
                          <div>
                            <h3 className="font-bold text-slate-800 text-sm">
                              Control General de Estudiantes e Historial de Cuotas
                            </h3>
                            <p className="text-xs text-slate-450 mt-0.5">
                              Verifique plazos de mensualidades, consulte estados financieros y registre adelantos.
                            </p>
                          </div>

                          {/* SEARCH AND FILTER TOOLS */}
                          <div className="flex flex-wrap gap-2.5 items-center">
                            {/* Search */}
                            <div className="relative">
                              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                              <input
                                type="text"
                                placeholder="Buscar estudiante..."
                                value={paymentSearch}
                                onChange={(e) => setPaymentSearch(e.target.value)}
                                className="pl-8.5 pr-4 py-1.5 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-white w-48 font-display font-medium text-slate-750"
                              />
                            </div>

                            {/* Status */}
                            <select
                              value={studentFilterStatus}
                              onChange={(e) => setStudentFilterStatus(e.target.value)}
                              className="px-3 py-1.5 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-white font-mono font-bold text-slate-600 cursor-pointer"
                            >
                              <option value="TODOS">TODOS LOS ESTADOS</option>
                              <option value="ACTIVE">ACTIVO (SOLVENTE)</option>
                              <option value="BLOCKED">BLOQUEADO (MOROSO)</option>
                            </select>
                          </div>
                        </div>

                        {/* DATA TABLE */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 bg-slate-50/70">
                                <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450">Fila / ID</th>
                                <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450">Estudiante Académico</th>
                                <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450">Curso Matriculado</th>
                                <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450">Estado Financiero</th>
                                <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450">Límite Lím. de Pago 🗓️</th>
                                <th className="p-4 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450 text-right">Fórmula de Cartera</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                              {dbStudents
                                .filter((student) => {
                                  const fullname = `${student.nombres} ${student.apellidos} ${student.documento_identidad}`.toLowerCase();
                                  const matchesSearch = fullname.includes(paymentSearch.toLowerCase());
                                  const matchesStatus = studentFilterStatus === 'TODOS' || student.status === studentFilterStatus;
                                  return matchesSearch && matchesStatus;
                                })
                                .map((student, index) => {
                                  const isBlocked = student.status === StudentStatus.BLOCKED;
                                  const course = dbCourses.find((c) => c.id === student.course_id);

                                  return (
                                    <tr
                                      key={student.id}
                                      className={`transition-colors duration-150 ${isBlocked
                                        ? 'bg-rose-50/30 hover:bg-rose-50/50'
                                        : 'hover:bg-slate-50/60'
                                        }`}
                                    >
                                      <td className="p-4 font-mono text-[10px] text-slate-400">
                                        {index + 1} ({student.id})
                                      </td>
                                      <td className="p-4">
                                        <div className="flex flex-col">
                                          <span className="font-bold text-slate-800 text-sm">
                                            {student.nombres} {student.apellidos}
                                          </span>
                                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                                            Doc: {student.documento_identidad}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="p-4">
                                        {course ? (
                                          <span className="px-2.5 py-1 bg-slate-100 text-slate-750 font-bold rounded-lg text-[10px]">
                                            {course.nombre_curso}
                                          </span>
                                        ) : (
                                          <span className="text-slate-400 italic">No asignado aún</span>
                                        )}
                                      </td>
                                      <td className="p-4">
                                        {isBlocked ? (
                                          <span className="px-2.5 py-1 bg-red-100 text-red-700 font-extrabold text-[10px] uppercase rounded-full tracking-wider border border-red-200 inline-flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                            BLOQUEADO (MOROSO)
                                          </span>
                                        ) : (
                                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-extrabold text-[10px] uppercase rounded-full tracking-wider border border-emerald-200 inline-flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            ACTIVO (AL DÍA)
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-4">
                                        <div className="flex items-center gap-1.5">
                                          <Calendar className={`h-3.5 w-3.5 ${isBlocked ? 'text-red-500' : 'text-slate-400'}`} />
                                          <span className={`font-semibold font-mono ${isBlocked ? 'text-red-650 font-bold' : 'text-slate-700'}`}>
                                            {student.payment_deadline_date}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="p-4 text-right">
                                        <button
                                          onClick={() => {
                                            setPaymentStudentId(student.id);
                                            setPaymentAmount('150000');
                                            setPaymentPeriod('Junio 2026');
                                            setPaymentDateInput(new Date().toISOString().split('T')[0]);
                                            setShowAddPaymentModal(true);
                                          }}
                                          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#fc7609] hover:bg-orange-50/30 text-slate-700 hover:text-[#fc7609] font-bold text-[11px] rounded-lg cursor-pointer transition-all inline-flex items-center gap-1"
                                        >
                                          <DollarSign className="h-3 w-3" />
                                          <span>Registrar Pago</span>
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              {dbStudents.filter((student) => {
                                const fullname = `${student.nombres} ${student.apellidos} ${student.documento_identidad}`.toLowerCase();
                                return fullname.includes(paymentSearch.toLowerCase()) && (studentFilterStatus === 'TODOS' || student.status === studentFilterStatus);
                              }).length === 0 && (
                                  <tr>
                                    <td colSpan={6} className="text-center py-12 text-slate-400 italic">
                                      No se encontraron estudiantes para la búsqueda actual en la base de datos de TCI.
                                    </td>
                                  </tr>
                                )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                            <h3 className="font-display font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                              Historial de Recibos (Módulo Financiero)
                            </h3>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Consulte todas las transacciones históricas registradas en TCI. Use el filtro superior por Mes o consulte el historial General para auditoría.
                          </p>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-mono text-[9px] font-bold uppercase">
                                <th className="p-3">FECHA PAGO</th>
                                <th className="p-3">ESTUDIANTE / MATRÍCULA</th>
                                <th className="p-3">ACUDIENTE / RESPONSABLE</th>
                                <th className="p-3">MES PAGADO (PERIODO)</th>
                                <th className="p-3">VALOR TRANSACCIÓN</th>
                                <th className="p-3 text-center">ACCIONES</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-display">
                              {filteredPayments.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="p-8 text-center text-slate-400 italic bg-slate-50/20">
                                    No se encontraron registros de recibos de pago para el periodo o criterio seleccionado.
                                  </td>
                                </tr>
                              ) : (
                                filteredPayments.map((p) => {
                                  const student = dbStudents.find((s) => s.id === p.student_id);
                                  const guardian = student ? dbGuardians.find((g) => g.id === student.guardian_id) : null;
                                  return (
                                    <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                                      <td className="p-3 font-mono text-slate-600 font-semibold">
                                        {p.payment_date}
                                      </td>
                                      <td className="p-3">
                                        {student ? (
                                          <div>
                                            <span className="font-extrabold text-slate-800 block text-[13px]">{student.nombres} {student.apellidos}</span>
                                            <span className="text-[10px] font-mono text-[#fc7609] font-bold block mt-0.5 uppercase">Doc: {student.documento_identidad}</span>
                                          </div>
                                        ) : (
                                          <span className="text-slate-405 italic">ID Alumno: {p.student_id}</span>
                                        )}
                                      </td>
                                      <td className="p-3 text-slate-600 font-semibold">
                                        {guardian ? (
                                          <div>
                                            <span className="text-slate-800 font-bold block text-xs">{guardian.nombre_completo}</span>
                                            <span className="text-[10px] text-slate-450 block mt-0.5">{guardian.parentesco} • Cel: {guardian.telefono}</span>
                                          </div>
                                        ) : (
                                          <span className="text-rose-500 italic text-[10px] font-bold">Sin acudiente registrado</span>
                                        )}
                                      </td>
                                      <td className="p-3">
                                        <span className="px-2 py-0.5 bg-orange-50 text-[#fc7609] border border-orange-100 rounded-md text-[10px] font-mono uppercase tracking-wide font-black">
                                          {p.period_covered}
                                        </span>
                                      </td>
                                      <td className="p-3">
                                        <span className="font-mono text-emerald-655 font-extrabold bg-emerald-50 px-2 py-1 rounded text-xs">
                                          +${p.amount.toLocaleString('es-CO')} COP
                                        </span>
                                      </td>
                                      <td className="p-3 text-center">
                                        <button
                                          title="Imprimir Recibo POS"
                                          onClick={() => setActivePosReceipt(p)}
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-[#fc7609] text-slate-600 hover:text-[#fc7609] hover:bg-orange-50 font-bold text-[10px] rounded-lg cursor-pointer transition-all duration-150"
                                          id={`btn_print_receipt_${p.id}`}
                                        >
                                          <Printer className="h-3.5 w-3.5" />
                                          <span>Imprimir Recibo POS</span>
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </main>
          </>
        ) : (
          /* ========================================================
             1. PANTALLA NO AUTENTICADA (PORTAL PÚBLICO O LOGIN)
             ======================================================== */
          <div className="flex-1 flex flex-col justify-center items-center w-full bg-slate-50 py-12 px-4 animate-fade-in" id="unauthenticated_panel_box">
            {/* Sleek navigation switcher inside unauth panel */}
            <div className="w-full max-w-sm bg-white p-1 rounded-2xl border border-slate-100 flex items-center shadow-xs mb-8">
              <button
                type="button"
                onClick={() => { setUnauthView('public_enrollment'); setPublicEnrollmentSuccess(false); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl font-display transition-all cursor-pointer ${unauthView === 'public_enrollment' ? 'bg-[#fc7609] text-white shadow-md shadow-orange-500/10' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Inscripciones Públicas 📝
              </button>
              <button
                type="button"
                onClick={() => setUnauthView('login')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl font-display transition-all cursor-pointer ${unauthView === 'login' ? 'bg-[#fc7609] text-white shadow-md shadow-orange-500/10' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Acceso Docentes 🔐
              </button>
            </div>

            <AnimatePresence mode="wait">
              {unauthView === 'public_enrollment' ? (
                /* --- A: PUBLIC ENROLLMENT LANDING VIEW --- */
                <motion.div
                  key="public_enrollment_landing_view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Left Side: Editorial Banner */}
                  <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                    <div className="h-14 w-14 rounded-2xl bg-[#fc7609] flex items-center justify-center text-white font-display text-2xl font-bold shadow-md shadow-orange-500/20">
                      TCI
                    </div>
                    <div>
                      <h2 className="font-display text-3xl font-black text-slate-800 leading-tight">
                        <span className="text-[#fc7609]">Taller Creativo De Inglés</span>
                      </h2>
                      <p className="text-xs text-slate-400 font-mono tracking-wider font-bold uppercase mt-1">
                        Inscripción de Alumnos 2026
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      ¡Inscribe hoy a tus hijos en el Taller Creativo De Inglés! Nuestro sistema didáctico fomenta el aprendizaje natural mediante metodologías activas y lúdica aplicada en La Virginia, Risaralda.
                    </p>

                    <div className="p-4 bg-orange-50/70 border border-orange-100 rounded-2xl space-y-2">
                      <span className="text-[10px] font-mono font-bold text-[#fc7609] uppercase tracking-wider block">Estado de Admisiones</span>
                      {dbSettings?.enrollment_open ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                          <span>Cupos Disponibles Abiertos</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <span className="h-2 w-2 rounded-full bg-slate-350 inline-block"></span>
                          <span>Cupos Cerrados</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Smart Form or Success Screen */}
                  <div className="lg:col-span-8 bg-white rounded-3xl border border-orange-100/60 shadow-lg overflow-hidden p-6 md:p-8 w-full">
                    {publicEnrollmentSuccess && registeredStudentInfo ? (
                      /* Success Overlay Panel */
                      <div className="text-center py-6 space-y-6" id="public_enrollment_success_panel">
                        <div className="h-16 w-16 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                          ✓
                        </div>
                        <div>
                          <h3 className="font-display font-extrabold text-xl text-slate-850">¡Inscripción Recibida Exitosamente! 🚀</h3>
                          <p className="text-xs text-slate-450 mt-1 max-w-md mx-auto">
                            Los datos del estudiante y acudiente se han registrado en nuestro sistema relacional del Taller Creativo De Inglés.
                          </p>
                        </div>

                        {/* Summary of what has been saved */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-3 font-sans">
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Resumen del Estudiante Registrado</span>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-slate-400 block pb-0.5">Nombres y Apellidos</span>
                              <span className="font-bold text-slate-800">{registeredStudentInfo.student.nombres} {registeredStudentInfo.student.apellidos}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block pb-0.5">Doc. Identidad</span>
                              <span className="font-mono font-bold text-slate-800">{registeredStudentInfo.student.documento_identidad}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block pb-0.5">Estado de Matrícula</span>
                              <span className="inline-flex px-2 py-0.5 bg-sky-50 text-sky-600 font-bold rounded text-[10px] uppercase font-sans">
                                {registeredStudentInfo.student.status}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block pb-0.5">Grupo Pre-Asignado</span>
                              <span className="font-bold text-slate-650">Nulo (Por Asignar)</span>
                            </div>
                          </div>

                          <div className="border-t border-slate-150 pt-3 space-y-1">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Acudiente Ligado Legal</span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-slate-400">Nombre Completo:</span>
                                <span className="font-semibold text-slate-700 block">{registeredStudentInfo.guardian.nombre_completo}</span>
                              </div>
                              <div>
                                <span className="text-slate-400">Teléfono:</span>
                                <span className="font-semibold text-slate-700 block">{registeredStudentInfo.guardian.telefono}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPublicEnrollmentSuccess(false);
                              setRegisteredStudentInfo(null);
                              setPublicEnrollmentForm({
                                documento_identidad: '',
                                nombres: '',
                                apellidos: '',
                                fecha_nacimiento: '',
                                edad: 8,
                                colegio_origen: COLEGIOS_LA_VIRGINIA[0],
                                grado_escolar: 'Primero',
                                curso_actual: 'Kids Starter (Nivel A1.1)',
                                jornada_escolar: SchoolDayPeriod.TARDE,
                                guardian_nombre_completo: '',
                                guardian_direccion: '',
                                guardian_telefono: '',
                                guardian_parentesco: 'Madre',
                              });
                            }}
                            className="px-5 py-2.5 bg-[#fc7609] hover:bg-orange-600 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shadow-orange-500/10"
                          >
                            Inscribir Otro Estudiante
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Active Inscription Area */
                      <div className="space-y-6">
                        {!dbSettings?.enrollment_open ? (
                          /* Closed admissions info banner */
                          <div className="py-12 text-center space-y-4" id="admissions_closed_card">
                            <span className="text-4xl">🗓️</span>
                            <h4 className="font-display font-extrabold text-[#fc7609] text-lg">Admisiones Cerradas Temporalmente</h4>
                            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                              Lo sentimos, las inscripciones públicas virtuales para el periodo actual no se encuentran habilitadas por capacidad completa en las instalaciones del instituto.
                            </p>
                            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                              Por favor regrese más tarde o manténgase en contacto con secretaría general para más información.
                            </p>
                          </div>
                        ) : (
                          /* Active Registration Form */
                          <form onSubmit={handlePublicEnrollment} className="space-y-6" id="public_enrollment_inputs_form">
                            <div>
                              <h3 className="font-display font-extrabold text-slate-800 text-base">Formulario de Prematrícula Estudiantil</h3>
                              <p className="text-xs text-slate-400 mt-0.5">Registre la información de forma precisa. Toda inscripción requiere un tutor legal asociado.</p>
                            </div>

                            {/* Section 1: Student Data */}
                            <div className="space-y-4 border-t border-slate-100 pt-4">
                              <span className="text-[10px] font-mono font-bold text-[#fc7609] uppercase tracking-wider block">1. Datos Personales del Estudiante</span>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                                    Nombres Completos*
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ej: David Ignacio"
                                    value={publicEnrollmentForm.nombres}
                                    onChange={(e) => setPublicEnrollmentForm(prev => ({ ...prev, nombres: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-slate-50/50"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                                    Apellidos*
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ej: Restrepo Bermúdez"
                                    value={publicEnrollmentForm.apellidos}
                                    onChange={(e) => setPublicEnrollmentForm(prev => ({ ...prev, apellidos: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-slate-50/50"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                                    Documento de Identidad (Id)*
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ej: 1144002345"
                                    value={publicEnrollmentForm.documento_identidad}
                                    onChange={(e) => setPublicEnrollmentForm(prev => ({ ...prev, documento_identidad: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-slate-50/50 font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                                    Fecha de Nacimiento*
                                  </label>
                                  <input
                                    type="date"
                                    required
                                    value={publicEnrollmentForm.fecha_nacimiento}
                                    onChange={(e) => setPublicEnrollmentForm(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-slate-50/50 font-mono"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                                    Edad (Años)*
                                  </label>
                                  <input
                                    type="number"
                                    required
                                    min={4}
                                    max={18}
                                    value={publicEnrollmentForm.edad}
                                    onChange={(e) => setPublicEnrollmentForm(prev => ({ ...prev, edad: parseInt(e.target.value) || 8 }))}
                                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-slate-50/50 font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                                    Jornada Escolar
                                  </label>
                                  <select
                                    value={publicEnrollmentForm.jornada_escolar}
                                    onChange={(e) => setPublicEnrollmentForm(prev => ({ ...prev, jornada_escolar: e.target.value as SchoolDayPeriod }))}
                                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-slate-50/50"
                                  >
                                    <option value={SchoolDayPeriod.MANANA}>Mañana</option>
                                    <option value={SchoolDayPeriod.TARDE}>Tarde</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                                    Colegio de Origen (La Virginia)*
                                  </label>
                                  <select
                                    value={publicEnrollmentForm.colegio_origen}
                                    onChange={(e) => setPublicEnrollmentForm(prev => ({ ...prev, colegio_origen: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-slate-50/50"
                                  >
                                    {COLEGIOS_LA_VIRGINIA.map((col) => (
                                      <option key={col} value={col}>{col}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                                    Grado Escolar
                                  </label>
                                  <select
                                    value={publicEnrollmentForm.grado_escolar}
                                    onChange={(e) => setPublicEnrollmentForm(prev => ({ ...prev, grado_escolar: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-slate-50/50"
                                  >
                                    {['Preescolar', 'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo', 'Once'].map(grado => (
                                      <option key={grado} value={grado}>{grado}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Section 2: Guardian Data */}
                            <div className="space-y-4 border-t border-slate-100 pt-4">
                              <span className="text-[10px] font-mono font-bold text-[#fc7609] uppercase tracking-wider block">2. Información del Acudiente Legal (Tutor)</span>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                                    Nombre Completo del Acudiente*
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ej: María Camila Bermúdez"
                                    value={publicEnrollmentForm.guardian_nombre_completo}
                                    onChange={(e) => setPublicEnrollmentForm(prev => ({ ...prev, guardian_nombre_completo: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-slate-50/50"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                                    Parentesco o Relación*
                                  </label>
                                  <select
                                    value={publicEnrollmentForm.guardian_parentesco}
                                    onChange={(e) => setPublicEnrollmentForm(prev => ({ ...prev, guardian_parentesco: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-slate-50/50"
                                  >
                                    <option value="Madre">Madre</option>
                                    <option value="Padre">Padre</option>
                                    <option value="Abuelo/a">Abuelo/a</option>
                                    <option value="Tío/a">Tío/a</option>
                                    <option value="Tutor Legal">Tutor Legal</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                                    Dirección de Residencia*
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ej: Calle 15 # 8-45, Barrio Centro"
                                    value={publicEnrollmentForm.guardian_direccion}
                                    onChange={(e) => setPublicEnrollmentForm(prev => ({ ...prev, guardian_direccion: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-slate-50/50"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                                    Número de Teléfono Movil/Fijo*
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ej: 3127891234"
                                    value={publicEnrollmentForm.guardian_telefono}
                                    onChange={(e) => setPublicEnrollmentForm(prev => ({ ...prev, guardian_telefono: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] bg-slate-50/50 font-mono"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10.5px] text-slate-400 select-none">Todos los campos marcados con (*) son estrictamente requeridos.</span>
                              <button
                                type="submit"
                                className="px-5 py-2.5 bg-[#fc7609] hover:bg-orange-600 active:scale-98 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shadow-orange-500/10 flex items-center gap-1.5 transition-all"
                              >
                                <Sparkles className="h-4 w-4" />
                                <span>Realizar Inscripción Virtual</span>
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* --- B: ADMINISTRATIVE LOGIN VIEW --- */
                <motion.div
                  key="login_page_frame"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto py-4 px-4 w-full"
                  id="login_grid_wrapper"
                >
                  {/* LEFT BOARD PRE-TEXTS */}
                  <div className="lg:col-span-7 space-y-6 text-center lg:text-left" id="login_left_panel">
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-[#fc7609] rounded-full px-4 py-1.5 text-xs font-bold w-max mx-auto lg:mx-0">
                      <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                      <span>Nivel de Clases e Inglés Creativo Infantil</span>
                    </div>

                    <h2 className="font-display text-4xl md:text-5xl font-black text-slate-850 leading-tight">
                      Donde aprender <br />
                      <span className="text-[#fc7609] relative inline-block">
                        inglés es un juego creativo
                        <span className="absolute bottom-0.5 left-0 w-full h-1 bg-orange-200" />
                      </span>.
                    </h2>

                    <p className="text-slate-500 font-medium text-xs leading-relaxed max-w-lg mx-auto lg:mx-0">
                      TCI - Taller Creativo De Inglés simplifica el control relacional de matrículas, vinculación con tutores acudientes legales, y la asignación de grupos de inglés en La Virginia, Risaralda.
                    </p>

                    <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-100 max-w-md mx-auto lg:mx-0 shadow-sm" id="indicators">
                      <div className="text-center p-1">
                        <span className="block text-2xl font-black text-[#fc7609] font-display">1M-M</span>
                        <span className="text-[10px] text-slate-400 font-mono tracking-wider font-bold uppercase">FORÁNEAS</span>
                      </div>
                      <div className="text-center p-1 border-x border-slate-100">
                        <span className="block text-2xl font-black text-[#fc7609]-505 font-display">Fase 3</span>
                        <span className="text-[10px] text-slate-400 font-mono tracking-wider font-bold uppercase">COMPLETADA</span>
                      </div>
                      <div className="text-center p-1">
                        <span className="block text-2xl font-black text-emerald-600 font-display">Seguro</span>
                        <span className="text-[10px] text-slate-400 font-mono tracking-wider font-bold uppercase">CON ASISTENCIA</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT LOGIN CARD */}
                  <div className="lg:col-span-5" id="login_form_region">
                    <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6 md:p-8" id="login_card">
                      {/* LOGO SPACE PRE-POPULATED */}
                      <div className="flex flex-col items-center mb-6 text-center">
                        <div className="w-full max-w-[210px] h-[70px] relative overflow-hidden">
                          <Image src={logoApp} alt="Taller Creativo Logo" className="object-contain" fill priority />
                        </div>
                      </div>

                      <div className="mb-6 text-center">
                        <h3 className="font-display text-lg font-extrabold text-slate-850">Acceso al Panel TCI</h3>
                        <p className="text-xs text-slate-450 mt-1">Ingrese sus credenciales registradas de maestro, administrador o directivo.</p>
                      </div>

                      {/* ERROR PANEL */}
                      {loginError && (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-600"
                        >
                          <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{loginError}</span>
                        </motion.div>
                      )}

                      {/* SUCCESS PANEL */}
                      {loginSuccess && (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="mb-4 p-3 bg-emerald-50 border border-emerald-250 rounded-xl flex items-start gap-2 text-xs text-emerald-600"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{loginSuccess}</span>
                        </motion.div>
                      )}

                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-600 mb-1.5 uppercase tracking-widest">
                            Correo Electrónico
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type="email"
                              required
                              placeholder="director@translinguakids.com"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#fc7609] text-xs bg-slate-50/50"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-600 mb-1.5 uppercase tracking-widest">
                            Contraseña
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              placeholder="••••••••"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="w-full pl-9 pr-10 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#fc7609] text-xs bg-slate-50/50"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg flex items-center justify-center text-slate-450 hover:text-slate-600"
                            >
                              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2.5 rounded-xl text-white font-semibold text-xs transition-transform bg-[#fc7609] shadow-md hover:scale-98 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {loading ? (
                            <>
                              <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                              <span>Validando credenciales...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="h-4.5 w-4.5" />
                              <span>Ingresar Seguro</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 7. MODAL REGISTRO DE PAGO MANUAL CON AUTOCOMPLETE */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="payment_modal_overlay">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl border border-slate-100 overflow-hidden transform scale-98 transition-all animate-scale-up" id="payment_modal_content">
            <div className="bg-[#fc7609] p-6 text-white" id="payment_modal_header">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black font-display text-white">Registrar Pago Académico Manual</h3>
                  <p className="text-xs text-orange-100 mt-1">
                    Cargue el recibo a la base de datos de TCI para actualizar cuotas y vigencias.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPaymentModal(false)}
                  className="p-1 rounded-lg bg-orange-600/50 hover:bg-orange-600 text-white cursor-pointer transition-all"
                  id="btn_close_payment_modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleRegisterPayment} className="p-6 space-y-4" id="form_payment_manual">
              {/* ESTUDIANTE CON AUTOCOMPLETE */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                  Estudiante Académico (Búsqueda por nombres/doc) <span className="text-red-500">*</span>
                </label>

                {/* Visual Autocomplete input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Escriba nombres, apellidos o documento..."
                    value={paymentStudentId ? (
                      (() => {
                        const std = dbStudents.find(s => s.id === paymentStudentId);
                        return std ? `${std.nombres} ${std.apellidos} (${std.documento_identidad})` : '';
                      })()
                    ) : paymentSearch}
                    onChange={(e) => {
                      setPaymentSearch(e.target.value);
                      if (paymentStudentId) {
                        setPaymentStudentId(''); // reset selection to type again
                      }
                    }}
                    className="pl-9.5 pr-10 py-2 w-full border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] font-medium text-slate-800 bg-white"
                  />
                  {paymentStudentId && (
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentStudentId('');
                        setPaymentSearch('');
                      }}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-[#fc7609]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Dropdown list of matched autocomplete students */}
                {!paymentStudentId && paymentSearch.trim().length > 0 && (
                  <div className="border border-slate-150 bg-white shadow-xl rounded-2xl max-h-40 overflow-y-auto divide-y divide-slate-50 z-20 absolute mt-17 w-full font-sans border-t-0 top-14 left-0">
                    {dbStudents
                      .filter((s) => {
                        const searchStr = `${s.nombres} ${s.apellidos} ${s.documento_identidad}`.toLowerCase();
                        return searchStr.includes(paymentSearch.toLowerCase());
                      })
                      .map((student) => (
                        <div
                          key={student.id}
                          onClick={() => {
                            setPaymentStudentId(student.id);
                            setPaymentSearch(`${student.nombres} ${student.apellidos}`);
                          }}
                          className="px-4 py-2.5 text-xs hover:bg-orange-50/80 cursor-pointer text-slate-700 flex flex-col justify-center transition-colors"
                        >
                          <span className="font-bold text-slate-800">
                            {student.nombres} {student.apellidos}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Doc: {student.documento_identidad} • ID: {student.id} • Límite Lím: {student.payment_deadline_date}
                          </span>
                        </div>
                      ))}
                    {dbStudents.filter((s) => {
                      const searchStr = `${s.nombres} ${s.apellidos} ${s.documento_identidad}`.toLowerCase();
                      return searchStr.includes(paymentSearch.toLowerCase());
                    }).length === 0 && (
                        <div className="p-3 text-center text-xs text-slate-400 italic">No hay resultados coincidentes en TCI.</div>
                      )}
                  </div>
                )}
              </div>

              {/* MONTO TRASLADO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                    Monto de Matrícula/Pensión (COP) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2 py-0.5 text-xs text-slate-400 font-bold font-mono">$</span>
                    <input
                      type="number"
                      required
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Monto de Pensión"
                      className="pl-7.5 pr-3 py-2 w-full border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] font-mono font-bold text-slate-850"
                    />
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setPaymentAmount('150000')}
                      className="px-2 py-0.5 text-[9px] font-mono font-bold text-[#fc7609] bg-orange-50 rounded border border-orange-100 hover:bg-orange-100 cursor-pointer"
                    >
                      Pensión: 150k
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentAmount('250000')}
                      className="px-2 py-0.5 text-[9px] font-mono font-bold text-slate-650 bg-slate-50 rounded border border-slate-150 hover:bg-slate-100 cursor-pointer"
                    >
                      Matrícula: 250k
                    </button>
                  </div>
                </div>

                {/* PERIODO CORRESPONDIENTE */}
                <div className="flex flex-col gap-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                    Periodo que cubre <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={paymentPeriod}
                    onChange={(e) => setPaymentPeriod(e.target.value)}
                    className="p-2 w-full border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] font-display font-medium text-slate-750 cursor-pointer bg-white"
                  >
                    <option value="Mayo 2026">Mayo 2026</option>
                    <option value="Junio 2026">Junio 2026</option>
                    <option value="Julio 2026">Julio 2026</option>
                    <option value="Agosto 2026">Agosto 2026</option>
                    <option value="Septiembre 2026">Septiembre 2026</option>
                    <option value="Octubre 2026">Octubre 2026</option>
                    <option value="Noviembre 2026">Noviembre 2026</option>
                  </select>
                </div>
              </div>

              {/* FECHA DEL PAGO */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                  Fecha de Transacción 📅
                </label>
                <input
                  type="date"
                  value={paymentDateInput}
                  onChange={(e) => setPaymentDateInput(e.target.value)}
                  className="p-2 w-full border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fc7609] font-mono bg-white"
                />
              </div>

              {/* MENSAJE DE REACCION DEL SISTEMA */}
              {paymentStudentId && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-[11px] text-emerald-850 leading-relaxed font-sans space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-650 shrink-0" />
                    Consecuencias de la Transacción en TCI:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-650 ml-1">
                    <li>Se creará una nueva entrada de la entidad <b>Payment</b>.</li>
                    <li>Suma 1 Mes adicional de gracia a la fecha límite del pago.</li>
                    <li>Si el estado del alumno es <b>BLOQUEADO</b>, se reactiva a <b>ACTIVO</b>.</li>
                  </ul>
                </div>
              )}

              {/* SUMBIT BUTTON */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3" id="payment_modal_actions font-display">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-4 py-2 border border-[#eaeaea] hover:bg-slate-50 text-slate-500 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={registeringPayment || !paymentStudentId}
                  className="px-5 py-2.5 bg-[#fc7609] hover:bg-orange-600 active:scale-98 disabled:opacity-50 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
                >
                  {registeringPayment ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Registrando Pago...</span>
                    </>
                  ) : (
                    <span>Confirmar Registro</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 8. COMPONENTE DE RECIBO POS (IMPRESIÓN TÉRMICA) */}
      {activePosReceipt && (() => {
        const student = dbStudents.find(s => s.id === activePosReceipt.student_id);
        const guardian = dbGuardians.find(g => g.id === student?.guardian_id);
        const receiptTime = "14:45:22 UTC-5";

        return (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in no-print" id="pos_receipt_modal_overlay">
            <style>{`
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #pos-receipt-print-area, #pos-receipt-print-area * {
                  visibility: visible !important;
                }
                #pos-receipt-print-area {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 80mm !important;
                  max-width: 80mm !important;
                  margin: 0 !important;
                  padding: 4mm !important;
                  font-size: 11px !important;
                  line-height: 1.3 !important;
                  font-family: monospace !important;
                  color: #000 !important;
                  background: #fff !important;
                }
              }
            `}</style>

            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all font-sans" id="pos_receipt_modal_content">
              {/* Header inside modal preview */}
              <div className="bg-slate-900 p-5 text-white flex items-center justify-between no-print">
                <div className="flex items-center gap-2">
                  <Printer className="h-4 w-4 text-[#fc7609]" />
                  <span className="text-xs font-bold font-display text-white">Vista Previa Impresión POS</span>
                </div>
                <button
                  onClick={() => setActivePosReceipt(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  id="btn_close_receipt_modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* The printable Thermal Receipt area */}
              <div className="p-6 bg-slate-50 border-b border-slate-100 max-h-[420px] overflow-y-auto flex justify-center no-print">
                {/* Physical boundary to look exacty like an 80mm roll receipt */}
                <div
                  className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm text-center font-mono text-[10.5px] leading-relaxed text-black w-full max-w-[80mm]"
                  style={{ fontFamily: 'Courier New, Courier, monospace', color: '#000000' }}
                >
                  {/* Header */}
                  <h4 className="font-extrabold text-xs uppercase tracking-tight text-center leading-5 text-black">
                    TCI - TALLER CREATIVO<br />DE INGLÉS
                  </h4>
                  <p className="text-[9px] text-center mt-1 text-slate-700 leading-3">
                    La Virginia, Risaralda, Colombia<br />
                    Dirección: Cl. 10 # 7-42<br />
                    Teléfono: +57 312 854 9901<br />
                    NIT: 901.423.882-1
                  </p>

                  <div className="border-t border-dashed border-slate-400 my-3"></div>

                  <p className="font-bold text-center text-[10px] text-black">
                    ** COMPROBANTE DE COMPRA POS **
                  </p>

                  <div className="text-left mt-3 space-y-1 text-slate-800 text-[10px]">
                    <div><b>ID RECIBO:</b> {activePosReceipt.id.toUpperCase()}</div>
                    <div><b>FECHA PAGO:</b> {activePosReceipt.payment_date}</div>
                    <div><b>HORA COMPR:</b> {receiptTime}</div>
                  </div>

                  <div className="border-t border-dashed border-slate-400 my-3"></div>

                  {/* Body details */}
                  <div className="text-left space-y-2 text-slate-900 text-[10px]">
                    <div>
                      <span className="text-slate-700">ESTUDIANTE:</span><br />
                      <span className="font-extrabold text-black">{student ? `${student.nombres} ${student.apellidos}`.toUpperCase() : 'N/D'}</span>
                    </div>
                    {student && (
                      <div>
                        <span className="text-slate-700">DOCUMENTO:</span> {student.documento_identidad}
                      </div>
                    )}
                    <div>
                      <span className="text-slate-705">ACUDIENTE:</span><br />
                      <span className="font-bold text-black">{guardian?.nombre_completo.toUpperCase() || 'N/D'}</span>
                    </div>
                    {guardian?.telefono && (
                      <div>
                        <span className="text-slate-700">TELÉFONO AC.:</span> {guardian.telefono}
                      </div>
                    )}
                    <div>
                      <span className="text-slate-700 font-bold">PERIODO PAGADO:</span><br />
                      <span className="font-extrabold bg-slate-100 px-1 py-0.5 rounded text-black">{activePosReceipt.period_covered.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-slate-400 my-3"></div>

                  {/* Totals */}
                  <div className="text-left space-y-1 text-black text-[11px]">
                    <div className="flex justify-between font-bold">
                      <span>VALOR TOTAL:</span>
                      <span>${activePosReceipt.amount.toLocaleString('es-CO')} COP</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-700">
                      <span>MÉTODO:</span>
                      <span>EFECTIVO REGISTRO</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-slate-400 my-3"></div>

                  {/* Footer */}
                  <p className="text-[8.5px] text-center text-slate-650 leading-3">
                    Estudiante Solventado para Inglés TCI.<br />
                    ¡Gracias por su puntualidad!<br />
                    Desarrollando el Potencial de tus Hijos.<br />
                    TCI - Taller Creativo De Inglés 2026
                  </p>
                </div>
              </div>

              {/* HIDDEN IN WEB VIEWS, ONLY VISIBLE IN PRINT MODE FOR THERMAL PRINTERS */}
              <div
                id="pos-receipt-print-area"
                className="hidden"
                style={{ fontFamily: 'Courier New, Courier, monospace', width: '80mm', color: '#000000', margin: '0', padding: '15px' }}
              >
                <div style={{ textAlign: 'center', fontSize: '11px', lineHeight: '1.3' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 5px 0' }}>TCI - TALLER CREATIVO DE INGLÉS</h3>
                  <p style={{ fontSize: '9px', margin: '0 0 8px 0' }}>
                    La Virginia, Risaralda, Colombia<br />
                    Dirección: Cl. 10 # 7-42<br />
                    Teléfono: +57 312 854 9901<br />
                    NIT: 901.423.882-1
                  </p>

                  <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }}></div>

                  <p style={{ fontWeight: 'bold', margin: '4px 0', fontSize: '10px' }}>** COMPROBANTE DE COMPRA POS **</p>

                  <div style={{ textAlign: 'left', margin: '8px 0', fontSize: '9.5px', wordBreak: 'break-all' }}>
                    <div><b>ID RECIBO:</b> {activePosReceipt.id.toUpperCase()}</div>
                    <div><b>FECHA PAGO:</b> {activePosReceipt.payment_date}</div>
                    <div><b>HORA COMPR:</b> {receiptTime}</div>
                    <div><b>ESTUDIANTE:</b> {student ? `${student.nombres} ${student.apellidos}`.toUpperCase() : 'N/D'}</div>
                    {student && <div><b>DOCUMENTO:</b> {student.documento_identidad}</div>}
                    <div><b>ACUDIENTE:</b> {guardian?.nombre_completo.toUpperCase() || 'N/D'}</div>
                    {guardian && <div><b>TELÉFONO AC.:</b> {guardian.telefono}</div>}
                    <div><b>PERIODO PAGADO:</b> {activePosReceipt.period_covered.toUpperCase()}</div>
                  </div>

                  <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }}></div>

                  <div style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>VALOR TOTAL:</span>
                      <span>${activePosReceipt.amount.toLocaleString('es-CO')} COP</span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }}></div>

                  <p style={{ fontSize: '8.5px', margin: '5px 0 0 0', lineHeight: '1.2' }}>
                    Estudiante Solventado para Inglés TCI.<br />
                    ¡Gracias por su puntualidad!<br />
                    Desarrollando el Potencial de tus Hijos.<br />
                    TCI - Taller Creativo De Inglés 2026
                  </p>
                </div>
              </div>

              {/* Actions below within modal */}
              <div className="p-4 bg-white flex gap-3 justify-end no-print">
                <button
                  type="button"
                  onClick={() => setActivePosReceipt(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cerrar Vista
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-[#fc7609] hover:bg-orange-600 font-bold text-white text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/10"
                >
                  <Printer className="h-4 w-4" />
                  <span>Imprimir Recibo 🖨️</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 relative overflow-hidden" id="footer_section">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent opacity-50"></div>
        <div className="max-w-5xl mx-auto py-10 px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#fc7609] to-orange-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <span className="font-display font-bold text-xs tracking-wider">TCI</span>
                </div>
                <h3 className="font-display font-bold text-slate-800 text-sm">Taller Creativo De Inglés</h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                © 2026 TCI — La Virginia, Risaralda
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-[#fc7609] transition-colors p-2 bg-slate-50 hover:bg-orange-50 rounded-full border border-slate-100 hover:border-orange-100">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-[#fc7609] transition-colors p-2 bg-slate-50 hover:bg-orange-50 rounded-full border border-slate-100 hover:border-orange-100">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              <p className="mt-1 text-[10px] font-mono text-slate-400">
                Todos los derechos reservados - 2026 CYA - Lab
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
