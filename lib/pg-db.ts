import { getUsers, saveUser } from './actions/user.actions';
import { getStudents, saveStudent } from './actions/student.actions';
import { getCourses, saveCourse } from './actions/course.actions';
import { getGuardians, saveGuardian } from './actions/guardian.actions';
import { getSettings, saveSettings } from './actions/settings.actions';
import { getAttendances, saveAttendances } from './actions/attendance.actions';
import { getPayments, savePayment } from './actions/payment.actions';

export function isPgConfigured() {
  return !!process.env.DATABASE_URL;
}

export const dbGetUsers = getUsers;
export const dbSaveUser = saveUser;

export const dbGetStudents = getStudents;
export const dbSaveStudent = saveStudent;

export const dbGetCourses = getCourses;
export const dbSaveCourse = saveCourse;

export const dbGetGuardians = getGuardians;
export const dbSaveGuardian = saveGuardian;

export const dbGetSettings = getSettings;
export const dbSaveSettings = saveSettings;

export const dbGetAttendances = getAttendances;
export const dbSaveAttendance = async (attendance: any) => saveAttendances([attendance]);
export const dbSaveAttendances = saveAttendances;
export const dbSaveAttendancesBatch = saveAttendances;

export const dbGetPayments = getPayments;
export const dbSavePayment = savePayment;

export async function dbReset() {
  console.log("Resetting DB via API is not allowed in production.");
}

export async function initPgSchema() {
  return true;
}

export async function query(q: string, params?: any[]) {
  console.log("Raw query called, ignoring for Prisma:", q);
  return { rows: [] };
}
