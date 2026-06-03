const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Remove LocalDbStore import
content = content.replace(
  "import { LocalDbStore } from '@/lib/db-store';",
  `import { getUsers, saveUser } from '@/lib/actions/user.actions';
import { getStudents, saveStudent } from '@/lib/actions/student.actions';
import { getGuardians, saveGuardian } from '@/lib/actions/guardian.actions';
import { getCourses, saveCourse } from '@/lib/actions/course.actions';
import { getSettings, saveSettings } from '@/lib/actions/settings.actions';
import { getAttendances, saveAttendances } from '@/lib/actions/attendance.actions';
import { getPayments, savePayment } from '@/lib/actions/payment.actions';`
);

// 2. Replace state initializations
content = content.replace(
  "const [dbUsers, setDbUsers] = useState<User[]>(() => LocalDbStore.getUsers());",
  "const [dbUsers, setDbUsers] = useState<User[]>([]);"
);
content = content.replace(
  "const [dbGuardians, setDbGuardians] = useState<Guardian[]>(() => LocalDbStore.getGuardians());",
  "const [dbGuardians, setDbGuardians] = useState<Guardian[]>([]);"
);
content = content.replace(
  "const [dbStudents, setDbStudents] = useState<Student[]>(() => LocalDbStore.getStudents());",
  "const [dbStudents, setDbStudents] = useState<Student[]>([]);"
);
content = content.replace(
  "const [dbCourses, setDbCourses] = useState<Course[]>(() => LocalDbStore.getCourses());",
  "const [dbCourses, setDbCourses] = useState<Course[]>([]);"
);
content = content.replace(
  "const [dbSettings, setDbSettings] = useState<SystemSettings | null>(() => LocalDbStore.getSettings());",
  "const [dbSettings, setDbSettings] = useState<SystemSettings | null>(null);"
);
content = content.replace(
  "const [dbAttendances, setDbAttendances] = useState<Attendance[]>(() => LocalDbStore.getAttendances());",
  "const [dbAttendances, setDbAttendances] = useState<Attendance[]>([]);"
);
content = content.replace(
  "const [dbPayments, setDbPayments] = useState<Payment[]>(() => LocalDbStore.getPayments());",
  "const [dbPayments, setDbPayments] = useState<Payment[]>([]);\n\n  useEffect(() => {\n    getUsers().then(setDbUsers);\n    getGuardians().then(setDbGuardians);\n    getStudents().then(setDbStudents);\n    getCourses().then(setDbCourses);\n    getSettings().then(setDbSettings);\n    getAttendances().then(setDbAttendances);\n    getPayments().then(setDbPayments);\n  }, []);"
);
content = content.replace(
  "const [editedSettings, setEditedSettings] = useState<SystemSettings>(() => LocalDbStore.getSettings());",
  "const [editedSettings, setEditedSettings] = useState<SystemSettings>(dbSettings || INITIAL_SETTINGS);\n  useEffect(() => { if (dbSettings) setEditedSettings(dbSettings); }, [dbSettings]);"
);

// 3. Replace handleLogin data fetch
content = content.replace(
  "const users = LocalDbStore.getUsers();\n    const guardians = LocalDbStore.getGuardians();\n    const students = LocalDbStore.getStudents();\n    const courses = LocalDbStore.getCourses();\n    const settings = LocalDbStore.getSettings();\n    const attendances = LocalDbStore.getAttendances();\n    const payments = LocalDbStore.getPayments();",
  "const users = await getUsers();\n    const guardians = await getGuardians();\n    const students = await getStudents();\n    const courses = await getCourses();\n    const settings = await getSettings();\n    const attendances = await getAttendances();\n    const payments = await getPayments();"
);

// 4. Remove sync lines
content = content.replace(/LocalDbStore\.set\('.*?', .*?\);/g, "// Synced directly with Prisma via actions");
content = content.replace(/LocalDbStore\.resetDb\(\);/g, "// Reset DB no longer applicable locally");

// 5. Replace save calls (which receive arrays of full items, we just map to save item by item asynchronously)
content = content.replace(/LocalDbStore\.saveUsers\((.*?)\);/g, "Promise.all($1.map(saveUser))");
content = content.replace(/LocalDbStore\.saveGuardians\((.*?)\);/g, "Promise.all($1.map(saveGuardian))");
content = content.replace(/LocalDbStore\.saveStudents\((.*?)\);/g, "Promise.all($1.map(saveStudent))");
content = content.replace(/LocalDbStore\.saveCourses\((.*?)\);/g, "Promise.all($1.map(saveCourse))");
content = content.replace(/LocalDbStore\.saveAttendances\((.*?)\);/g, "saveAttendances($1)");
content = content.replace(/LocalDbStore\.savePayments\((.*?)\);/g, "Promise.all($1.map(savePayment))");

fs.writeFileSync(pagePath, content);
console.log('page.tsx rewritten to use Prisma actions');
