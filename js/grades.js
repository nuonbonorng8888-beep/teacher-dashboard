/**
 * Student Grade Management & Attendance Processing
 */

class GradeManager {
  constructor() {
    this.selectedClass = '10A';
  }

  calculateStudentScore(student) {
    const q1 = parseFloat(student.q1) || 0;
    const q2 = parseFloat(student.q2) || 0;
    const midterm = parseFloat(student.midterm) || 0;
    const final = parseFloat(student.final) || 0;

    // Total out of 100 or customized standard
    // E.g. (q1 + q2)/2 * 0.2 + midterm * 0.3 + final * 0.5 or direct sum
    // Let's do standard Cambodian high school 100 points scale:
    // Monthly tests (20) + Midterm (40) + Final (40) or simple sum / 1.38
    // Let's use clean total:
    const total = q1 + q2 + midterm + final; // Max ~ 138 or normalized to 100
    const score100 = Math.min(100, Math.round((total / 140) * 100));

    let letterGrade = 'F';
    let khmerGrade = 'ខ្សោយ';

    if (score100 >= 85) {
      letterGrade = 'A';
      khmerGrade = 'ឆ្នើម';
    } else if (score100 >= 75) {
      letterGrade = 'B';
      khmerGrade = 'ល្អណាស់';
    } else if (score100 >= 65) {
      letterGrade = 'C';
      khmerGrade = 'ល្អ';
    } else if (score100 >= 55) {
      letterGrade = 'D';
      khmerGrade = 'ល្អបង្គួរ';
    } else if (score100 >= 45) {
      letterGrade = 'E';
      khmerGrade = 'មធ្យម';
    } else {
      letterGrade = 'F';
      khmerGrade = 'ធ្លាក់';
    }

    return {
      total,
      score100,
      letterGrade,
      khmerGrade
    };
  }

  getRankedStudents(classList = null) {
    const students = (classList || window.appStore.data.students).map(s => {
      const calc = this.calculateStudentScore(s);
      return { ...s, ...calc };
    });

    // Sort descending by score100
    students.sort((a, b) => b.score100 - a.score100);

    // Assign rank
    let currentRank = 1;
    for (let i = 0; i < students.length; i++) {
      if (i > 0 && students[i].score100 < students[i - 1].score100) {
        currentRank = i + 1;
      }
      students[i].rank = currentRank;
    }

    return students;
  }

  exportCSV(students) {
    const header = ['ល.រ', 'អត្តលេខ', 'គោត្តនាម-នាម', 'ភេទ', 'ថ្នាក់', 'តេស្ត១ (២០)', 'តេស្ត២ (២០)', 'ឆមាស១ (៥០)', 'ឆមាស២ (៥០)', 'សរុប (១០០)', 'និទ្ទេស', 'ចំណាត់ថ្នាក់', 'សម្គាល់'];
    const rows = students.map((s, idx) => [
      idx + 1,
      s.id,
      `"${s.name}"`,
      s.sex,
      s.class,
      s.q1,
      s.q2,
      s.midterm,
      s.final,
      s.score100,
      s.letterGrade,
      s.rank,
      `"${s.khmerGrade}"`
    ]);

    const csvContent = '\uFEFF' + [header.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `បញ្ជីពិន្ទុសិស្ស_ថ្នាក់_${this.selectedClass}_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  }
}

window.gradeManager = new GradeManager();

