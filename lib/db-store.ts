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
} from './db-schema';

export class LocalDbStore {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  static get<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser()) return defaultValue;
    try {
      const val = localStorage.getItem(`translingua_${key}`);
      return val ? JSON.parse(val) : defaultValue;
    } catch (e) {
      console.error('Error reading localStorage', e);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(`translingua_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  }

  // --- Users ---
  static getUsers(): User[] {
    const users = this.get<User[]>('users', INITIAL_USERS);
    let dirty = false;
    INITIAL_USERS.forEach((initialUser) => {
      if (!users.some((u) => u.id === initialUser.id || u.email.toLowerCase().trim() === initialUser.email.toLowerCase().trim())) {
        users.push(initialUser);
        dirty = true;
      }
    });
    if (dirty) {
      this.saveUsers(users);
    }
    return users;
  }

  static saveUsers(users: User[]): void {
    this.set<User[]>('users', users);
  }

  static saveUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    this.saveUsers(users);
  }

  static getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  // --- Guardians ---
  static getGuardians(): Guardian[] {
    const guardians = this.get<Guardian[]>('guardians', INITIAL_GUARDIANS);
    let dirty = false;
    INITIAL_GUARDIANS.forEach((initialGrd) => {
      if (!guardians.some((g) => g.id === initialGrd.id)) {
        guardians.push(initialGrd);
        dirty = true;
      }
    });
    if (dirty) {
      this.saveGuardians(guardians);
    }
    return guardians;
  }

  static saveGuardians(guardians: Guardian[]): void {
    this.set<Guardian[]>('guardians', guardians);
  }

  static saveGuardian(guardian: Guardian): void {
    const guardians = this.getGuardians();
    const idx = guardians.findIndex((g) => g.id === guardian.id);
    if (idx >= 0) {
      guardians[idx] = guardian;
    } else {
      guardians.push(guardian);
    }
    this.saveGuardians(guardians);
  }

  // --- Students ---
  static getStudents(): Student[] {
    const students = this.get<Student[]>('students', INITIAL_STUDENTS);
    let dirty = false;
    INITIAL_STUDENTS.forEach((initialStd) => {
      if (!students.some((s) => s.id === initialStd.id)) {
        students.push(initialStd);
        dirty = true;
      }
    });
    if (dirty) {
      this.saveStudents(students);
    }
    return students;
  }

  static saveStudents(students: Student[]): void {
    this.set<Student[]>('students', students);
  }

  static saveStudent(student: Student): void {
    const students = this.getStudents();
    const idx = students.findIndex((s) => s.id === student.id);
    if (idx >= 0) {
      students[idx] = student;
    } else {
      students.push(student);
    }
    this.saveStudents(students);
  }

  // --- Courses / Groups ---
  static getCourses(): Course[] {
    const courses = this.get<Course[]>('courses', INITIAL_COURSES);
    let dirty = false;
    INITIAL_COURSES.forEach((initialCrs) => {
      if (!courses.some((c) => c.id === initialCrs.id)) {
        courses.push(initialCrs);
        dirty = true;
      }
    });
    if (dirty) {
      this.saveCourses(courses);
    }
    return courses;
  }

  static saveCourses(courses: Course[]): void {
    this.set<Course[]>('courses', courses);
  }

  static saveCourse(course: Course): void {
    const courses = this.getCourses();
    const idx = courses.findIndex((c) => c.id === course.id);
    if (idx >= 0) {
      courses[idx] = course;
    } else {
      courses.push(course);
    }
    this.saveCourses(courses);
  }

  // --- System Settings ---
  static getSettings(): SystemSettings {
    return this.get<SystemSettings>('settings', INITIAL_SETTINGS);
  }

  static saveSettings(settings: SystemSettings): void {
    this.set<SystemSettings>('settings', settings);
  }

  // --- Attendances ---
  static getAttendances(): Attendance[] {
    return this.get<Attendance[]>('attendances', []);
  }

  static saveAttendances(attendances: Attendance[]): void {
    this.set<Attendance[]>('attendances', attendances);
  }

  // --- Payments ---
  static getPayments(): Payment[] {
    const payments = this.get<Payment[]>('payments', INITIAL_PAYMENTS);
    let dirty = false;
    INITIAL_PAYMENTS.forEach((initialPay) => {
      if (!payments.some((p) => p.id === initialPay.id)) {
        payments.push(initialPay);
        dirty = true;
      }
    });
    if (dirty) {
      this.savePayments(payments);
    }
    return payments;
  }

  static savePayments(payments: Payment[]): void {
    this.set<Payment[]>('payments', payments);
  }

  static savePayment(payment: Payment): void {
    const payments = this.getPayments();
    const idx = payments.findIndex((p) => p.id === payment.id);
    if (idx >= 0) {
      payments[idx] = payment;
    } else {
      payments.push(payment);
    }
    this.savePayments(payments);
  }

  // --- Reset database to seed values ---
  static resetDb(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem('translingua_users');
    localStorage.removeItem('translingua_guardians');
    localStorage.removeItem('translingua_students');
    localStorage.removeItem('translingua_courses');
    localStorage.removeItem('translingua_settings');
    localStorage.removeItem('translingua_attendances');
    localStorage.removeItem('translingua_payments');
  }
}
