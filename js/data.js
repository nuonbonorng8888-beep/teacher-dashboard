/**
 * Data Storage & State Management for Teacher Bonorng Dashboard
 */

const STORAGE_KEY = 'BONORNG_NGS_DASHBOARD_DATA_V1';

const defaultData = {
  profile: {
    name: 'នួន បូណង',
    username: 'Bonorng11',
    role: 'គ្រូបង្រៀន',
    subject: 'គណិតវិទ្យា',
    schoolName: 'វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី',
    academicYear: '២០២៦-២០២៧',
    phone: '012 345 678',
    email: 'bonorng@ngs.edu.kh',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bonorng11',
    streak: 12
  },

  // Daily Tasks logged
  tasks: [
    {
      id: 1,
      type: 'ប្រជុំ',
      note: 'ប្រជុំបច្ចេកទេសក្រុមគណិតវិទ្យា NGS ប្រចាំខែតុលា',
      date: '2026-10-28',
      time: '02:30 PM',
      done: true
    },
    {
      id: 2,
      type: 'ជួយសិស្ស',
      note: 'បំប៉នសិស្សខ្សោយលើមេរៀនអនុគមន៍ត្រីកោណមាត្រ',
      date: '2026-10-29',
      time: '04:15 PM',
      done: true
    },
    {
      id: 3,
      type: 'ប្រចាំការ',
      note: 'ប្រចាំការពេលព្រឹក ត្រួតពិនិត្យវិន័យ និងអនាម័យសិស្ស',
      date: '2026-10-30',
      time: '07:00 AM',
      done: true
    }
  ],

  // Teaching Schedule (Timetable)
  schedule: [
    { id: 1, day: 'ចន្ទ', period: 'ម៉ោងទី ១ (០៧:០០ - ០៧:៥០)', class: 'ថ្នាក់ទី 10A', subject: 'គណិតវិទ្យា', room: 'បន្ទប់ ២០១' },
    { id: 2, day: 'ចន្ទ', period: 'ម៉ោងទី ២ (០៧:៥០ - ០៨:៤០)', class: 'ថ្នាក់ទី 10A', subject: 'គណិតវិទ្យា', room: 'បន្ទប់ ២០១' },
    { id: 3, day: 'ចន្ទ', period: 'ម៉ោងទី ៤ (០៩:៤០ - ១០:៣០)', class: 'ថ្នាក់ទី 11B', subject: 'គណិតវិទ្យា', room: 'បន្ទប់ ៣០២' },
    { id: 4, day: 'អង្គារ', period: 'ម៉ោងទី ១ (០៧:០០ - ០៧:៥០)', class: 'ថ្នាក់ទី 12A', subject: 'គណិតវិទ្យា', room: 'បន្ទប់ ៤០១' },
    { id: 5, day: 'អង្គារ', period: 'ម៉ោងទី ២ (០៧:៥០ - ០៨:៤០)', class: 'ថ្នាក់ទី 12A', subject: 'គណិតវិទ្យា', room: 'បន្ទប់ ៤០១' },
    { id: 6, day: 'ពុធ', period: 'ម៉ោងទី ៣ (០៨:៥០ - ០៩:៤០)', class: 'ថ្នាក់ទី 10A', subject: 'គណិតវិទ្យា', room: 'បន្ទប់ ២០១' },
    { id: 7, day: 'ព្រហស្បតិ៍', period: 'ម៉ោងទី ២ (០៧:៥០ - ០៨:៤០)', class: 'ថ្នាក់ទី 11B', subject: 'គណិតវិទ្យា', room: 'បន្ទប់ ៣០២' },
    { id: 8, day: 'ព្រហស្បតិ៍', period: 'ម៉ោងទី ៣ (០៨:៥០ - ០៩:៤០)', class: 'ថ្នាក់ទី 11B', subject: 'គណិតវិទ្យា', room: 'បន្ទប់ ៣០២' },
    { id: 9, day: 'សុក្រ', period: 'ម៉ោងទី ១ (០៧:០០ - ០៧:៥០)', class: 'ថ្នាក់ទី 12A', subject: 'គណិតវិទ្យា', room: 'បន្ទប់ ៤០១' },
    { id: 10, day: 'សុក្រ', period: 'ម៉ោងទី ២ (០៧:៥០ - ០៨:៤០)', class: 'ថ្នាក់ទី 12A', subject: 'គណិតវិទ្យា', room: 'បន្ទប់ ៤០១' },
    { id: 11, day: 'សៅរ៍', period: 'ម៉ោងទី ៤ (០៩:៤០ - ១០:៣០)', class: 'PLC & ប្រជុំក្រុម', subject: 'គរុកោសល្យ', room: 'បន្ទប់ប្រជុំ NGS' }
  ],

  // Student Roster (36 Students Sample)
  students: [
    { id: 'NGS-001', name: 'ចាន់ សុខា', sex: 'ប្រុស', class: '10A', q1: 18, q2: 19, midterm: 45, final: 48, note: 'ពូកែ' },
    { id: 'NGS-002', name: 'ស៊ន ធីតា', sex: 'ស្រី', class: '10A', q1: 19, q2: 20, midterm: 48, final: 50, note: 'ឆ្នើម' },
    { id: 'NGS-003', name: 'គង់ វិបុល', sex: 'ប្រុស', class: '10A', q1: 14, q2: 15, midterm: 38, final: 40, note: 'មធ្យម' },
    { id: 'NGS-004', name: 'ឃុត វណ្ណា', sex: 'ប្រុស', class: '10A', q1: 17, q2: 18, midterm: 42, final: 44, note: 'ល្អ' },
    { id: 'NGS-005', name: 'ង៉ែត រស្មី', sex: 'ស្រី', class: '10A', q1: 20, q2: 20, midterm: 49, final: 50, note: 'ឆ្នើម' },
    { id: 'NGS-006', name: 'ចេង ពិសី', sex: 'ស្រី', class: '10A', q1: 16, q2: 17, midterm: 40, final: 42, note: 'ល្អ' },
    { id: 'NGS-007', name: 'ឈុន បញ្ញា', sex: 'ប្រុស', class: '10A', q1: 15, q2: 16, midterm: 39, final: 41, note: 'ល្អបង្គួរ' },
    { id: 'NGS-008', name: 'ញ៉ែម កុលាប', sex: 'ស្រី', class: '10A', q1: 18, q2: 18, midterm: 44, final: 46, note: 'ល្អ' },
    { id: 'NGS-009', name: 'ដួង វាសនា', sex: 'ប្រុស', class: '10A', q1: 13, q2: 14, midterm: 35, final: 37, note: 'មធ្យម' },
    { id: 'NGS-010', name: 'ឌិត ម៉ាលី', sex: 'ស្រី', class: '10A', q1: 19, q2: 19, midterm: 46, final: 48, note: 'ល្អណាស់' },
    { id: 'NGS-011', name: 'តាំង គឹមហុង', sex: 'ប្រុស', class: '10A', q1: 20, q2: 19, midterm: 47, final: 49, note: 'ល្អណាស់' },
    { id: 'NGS-012', name: 'ថៃ សុផាត', sex: 'ប្រុស', class: '10A', q1: 14, q2: 13, midterm: 32, final: 35, note: 'ត្រូវការជួយ' },
    { id: 'NGS-013', name: 'ទូច ស្រីពៅ', sex: 'ស្រី', class: '10A', q1: 17, q2: 18, midterm: 41, final: 43, note: 'ល្អ' },
    { id: 'NGS-014', name: 'ធឿន ដានី', sex: 'ស្រី', class: '10A', q1: 18, q2: 19, midterm: 45, final: 47, note: 'ល្អ' },
    { id: 'NGS-015', name: 'នី រតនា', sex: 'ប្រុស', class: '10A', q1: 16, q2: 17, midterm: 39, final: 40, note: 'ល្អបង្គួរ' },
    { id: 'NGS-016', name: 'ប៉ែន សុភាព', sex: 'ប្រុស', class: '10A', q1: 15, q2: 15, midterm: 36, final: 38, note: 'មធ្យម' },
    { id: 'NGS-017', name: 'ផល្លា ចិន្តា', sex: 'ស្រី', class: '10A', q1: 19, q2: 20, midterm: 48, final: 49, note: 'ល្អណាស់' },
    { id: 'NGS-018', name: 'ពៅ សំបូរ', sex: 'ប្រុស', class: '10A', q1: 14, q2: 15, midterm: 37, final: 39, note: 'មធ្យម' },
    { id: 'NGS-019', name: 'ភិន ស្រីនិច', sex: 'ស្រី', class: '10A', q1: 18, q2: 18, midterm: 43, final: 45, note: 'ល្អ' },
    { id: 'NGS-020', name: 'ម៉េង ហុងលី', sex: 'ប្រុស', class: '10A', q1: 20, q2: 20, midterm: 50, final: 50, note: 'ឆ្នើម' },
    { id: 'NGS-021', name: 'យ៉ុន សុជាតិ', sex: 'ប្រុស', class: '10A', q1: 16, q2: 16, midterm: 40, final: 41, note: 'ល្អបង្គួរ' },
    { id: 'NGS-022', name: 'រស់ ពិសាល', sex: 'ប្រុស', class: '10A', q1: 17, q2: 17, midterm: 42, final: 43, note: 'ល្អ' },
    { id: 'NGS-023', name: 'លីណា សោភា', sex: 'ស្រី', class: '10A', q1: 19, q2: 19, midterm: 46, final: 48, note: 'ល្អណាស់' },
    { id: 'NGS-024', name: 'វ៉ាន់ វីរៈ', sex: 'ប្រុស', class: '10A', q1: 15, q2: 16, midterm: 38, final: 40, note: 'ល្អបង្គួរ' },
    { id: 'NGS-025', name: 'ស សុភ័ក្រ', sex: 'ប្រុស', class: '10A', q1: 18, q2: 18, midterm: 44, final: 45, note: 'ល្អ' },
    { id: 'NGS-026', name: 'ហាក់ សុខហេង', sex: 'ប្រុស', class: '10A', q1: 19, q2: 18, midterm: 45, final: 46, note: 'ល្អណាស់' },
    { id: 'NGS-027', name: 'ឡុង ច័ន្ទរិទ្ធ', sex: 'ប្រុស', class: '10A', q1: 16, q2: 17, midterm: 41, final: 42, note: 'ល្អ' },
    { id: 'NGS-028', name: 'អ៊ុយ ធារ៉ា', sex: 'ប្រុស', class: '10A', q1: 17, q2: 16, midterm: 40, final: 41, note: 'ល្អ' },
    { id: 'NGS-029', name: 'គឹម សៀវម៉ី', sex: 'ស្រី', class: '10A', q1: 20, q2: 20, midterm: 49, final: 50, note: 'ឆ្នើម' },
    { id: 'NGS-030', name: 'ជា បូរ៉ា', sex: 'ប្រុស', class: '10A', q1: 14, q2: 15, midterm: 35, final: 36, note: 'មធ្យម' },
    { id: 'NGS-031', name: 'តុប វិចិត្រ', sex: 'ប្រុស', class: '10A', q1: 18, q2: 19, midterm: 45, final: 47, note: 'ល្អ' },
    { id: 'NGS-032', name: 'នេត្រ សោភ័ណ', sex: 'ស្រី', class: '10A', q1: 19, q2: 19, midterm: 46, final: 47, note: 'ល្អណាស់' },
    { id: 'NGS-033', name: 'ស៊ាង មួយហ្គិច', sex: 'ស្រី', class: '10A', q1: 17, q2: 18, midterm: 42, final: 44, note: 'ល្អ' },
    { id: 'NGS-034', name: 'ហុក គឹមសាន', sex: 'ប្រុស', class: '10A', q1: 15, q2: 15, midterm: 37, final: 38, note: 'មធ្យម' },
    { id: 'NGS-035', name: 'អាន ចាន់នី', sex: 'ស្រី', class: '10A', q1: 18, q2: 19, midterm: 45, final: 46, note: 'ល្អ' },
    { id: 'NGS-036', name: 'សៅ ឧត្តម', sex: 'ប្រុស', class: '10A', q1: 20, q2: 19, midterm: 48, final: 49, note: 'ល្អណាស់' }
  ],

  // Attendance Records
  attendance: {
    // '2026-10-30': { 'NGS-001': 'P', 'NGS-002': 'A', ... }
  },

  // Lesson Plans (កិច្ចតែងការបង្រៀន)
  lessonPlans: [
    {
      id: 1,
      title: 'កិច្ចតែងការទី ០១៖ ត្រីកោណមាត្រ និងអនុវត្តន៍',
      grade: 'ថ្នាក់ទី 10A',
      subject: 'គណិតវិទ្យា',
      week: 'សប្ដាហ៍ទី ០១',
      date: '2026-10-15',
      status: 'បានផ្ទៀងផ្ទាត់',
      stepsCount: 5,
      score: 48,
      driveLink: 'https://drive.google.com/'
    },
    {
      id: 2,
      title: 'កិច្ចតែងការទី ០២៖ ផលគុណស្កាលែក្នុងលំហ',
      grade: 'ថ្នាក់ទី 12A',
      subject: 'គណិតវិទ្យា',
      week: 'សប្ដាហ៍ទី ០២',
      date: '2026-10-22',
      status: 'បានផ្ទៀងផ្ទាត់',
      stepsCount: 5,
      score: 49,
      driveLink: 'https://drive.google.com/'
    },
    {
      id: 3,
      title: 'កិច្ចតែងការទី ០៣៖ លីមីត និងភាពជាប់នៃអនុគមន៍',
      grade: 'ថ្នាក់ទី 12A',
      subject: 'គណិតវិទ្យា',
      week: 'សប្ដាហ៍ទី ០៣',
      date: '2026-10-29',
      status: 'រង់ចាំការពិនិត្យ',
      stepsCount: 5,
      score: 0,
      driveLink: 'https://drive.google.com/'
    }
  ],

  // Teacher Observation & Quality (កម្រិតគុណភាពបង្រៀន NGS ៥០ពិន្ទុ)
  observations: [
    {
      id: 1,
      observer: 'គណៈគ្រប់គ្រង NGS',
      class: 'ថ្នាក់ទី 10A',
      date: '2026-10-12',
      score: 48,
      level: 'ល្អប្រសើរ',
      feedback: 'ការគ្រប់គ្រងថ្នាក់ល្អ សិស្សចូលរួមសកម្ម ៥ជំហានអនុវត្តបានពេញលេញ'
    },
    {
      id: 2,
      observer: 'ប្រធានក្រុមបច្ចេកទេស',
      class: 'ថ្នាក់ទី 12A',
      date: '2026-10-25',
      score: 46,
      level: 'ល្អណាស់',
      feedback: 'វិធីសាស្ត្របង្រៀនទំនើប មានការប្រើប្រាស់បច្ចេកវិទ្យា និងលំហាត់ស៊ីជម្រៅ'
    }
  ],

  // Portfolios & Achievements
  portfolios: [
    {
      id: 1,
      title: 'វិញ្ញាបនបត្របណ្ដុះបណ្ដាលវិធីសាស្ត្របង្រៀនបែបទំនើប (STEM/NGS)',
      year: '២០២៥-២០២៦',
      category: 'វិញ្ញាបនបត្រ',
      description: 'បានបញ្ចប់វគ្គបណ្ដុះបណ្ដាលគរុកោសល្យសតវត្សរ៍ទី២១ ប្រកបដោយជោគជ័យ'
    },
    {
      id: 2,
      title: 'ការបង្កើតកម្រងលំហាត់គណិតវិទ្យាត្រៀមប្រឡងបាក់ឌុបថ្នាក់ជាតិ',
      year: '២០២៥-២០២៦',
      category: 'ស្នាដៃស្រាវជ្រាវ',
      description: 'បានចងក្រង និងចែករំលែកដល់សិស្សានុសិស្សថ្នាក់ទី១២ ទទួលបានលទ្ធផលនិទ្ទេស A ជាច្រើននាក់'
    }
  ],

  // Weekly teaching hours for the bar chart
  weeklyHours: {
    Mon: 5.5,
    Tue: 6.0,
    Wed: 5.0,
    Thu: 5.5,
    Fri: 5.0,
    Sat: 4.0,
    Sun: 0.0
  }
};

class DashboardStore {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading localStorage', e);
    }
    this.save(defaultData);
    return defaultData;
  }

  save(dataToSave = null) {
    if (dataToSave) this.data = dataToSave;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(defaultData));
    this.save();
    return this.data;
  }

  exportJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.data, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `NGS_Teacher_Bonorng_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.profile) {
        this.data = parsed;
        this.save();
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON', e);
    }
    return false;
  }
}

window.appStore = new DashboardStore();

