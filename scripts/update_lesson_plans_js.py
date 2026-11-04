# scripts/update_lesson_plans_js.py
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

content = open('js/lesson-plans.js', encoding='utf-8').read()

# 1. Update storageKey
content = content.replace("this.storageKey = 'ngs_custom_lesson_plans_v6';", "this.storageKey = 'ngs_custom_lesson_plans_v8_2';")

# 2. Update default class in constructor
old_ctor_class = "this.savedClass = localStorage.getItem('ngs_custom_class') || (this.selectedGrade === 'ថ្នាក់ទី ៨' ? '8NGS_C1 & 8NGS_C2' : '១២A');"
new_ctor_class = """const defaultClassForGrade = (g) => {
        if (g === 'ថ្នាក់ទី ៨') return '8NGS_B2';
        if (g === 'ថ្នាក់ទី ១១') return '11NGS_P1 & 11NGS_C2';
        return '១២A & ១២B';
      };
      const gradeClassKey = 'ngs_custom_class_' + (this.selectedGrade === 'ថ្នាក់ទី ៨' ? 'g8' : (this.selectedGrade === 'ថ្នាក់ទី ១១' ? 'g11' : 'g12'));
      this.savedClass = localStorage.getItem(gradeClassKey) || localStorage.getItem('ngs_custom_class') || defaultClassForGrade(this.selectedGrade);"""
content = content.replace(old_ctor_class, new_ctor_class)

# 3. Update setGrade(grade)
old_set_grade = """      // Update default class based on grade
      if (grade === 'ថ្នាក់ទី ៨') {
        this.savedClass = localStorage.getItem('ngs_custom_class_g8') || '8NGS_C1 & 8NGS_C2';
      } else if (grade === 'ថ្នាក់ទី ១២') {
        this.savedClass = localStorage.getItem('ngs_custom_class_g12') || '១២A';
      } else {
        this.savedClass = grade.replace('ថ្នាក់ទី ', '') + 'A';
      }"""
new_set_grade = """      // Update default class based on grade
      if (grade === 'ថ្នាក់ទី ៨') {
        this.savedClass = localStorage.getItem('ngs_custom_class_g8') || '8NGS_B2';
      } else if (grade === 'ថ្នាក់ទី ១១') {
        this.savedClass = localStorage.getItem('ngs_custom_class_g11') || '11NGS_P1 & 11NGS_C2';
      } else if (grade === 'ថ្នាក់ទី ១២') {
        this.savedClass = localStorage.getItem('ngs_custom_class_g12') || '១២A & ១២B';
      } else {
        this.savedClass = grade.replace('ថ្នាក់ទី ', '') + 'A';
      }"""
content = content.replace(old_set_grade, new_set_grade)

# 4. Update onBatchClassChange(val)
old_batch_class = """      try {
        localStorage.setItem('ngs_custom_class', val);
        if (this.selectedGrade === 'ថ្នាក់ទី ៨') {
          localStorage.setItem('ngs_custom_class_g8', val);
        } else if (this.selectedGrade === 'ថ្នាក់ទី ១២') {
          localStorage.setItem('ngs_custom_class_g12', val);
        }
      } catch (e) {}"""
new_batch_class = """      try {
        localStorage.setItem('ngs_custom_class', val);
        if (this.selectedGrade === 'ថ្នាក់ទី ៨') {
          localStorage.setItem('ngs_custom_class_g8', val);
        } else if (this.selectedGrade === 'ថ្នាក់ទី ១១') {
          localStorage.setItem('ngs_custom_class_g11', val);
        } else if (this.selectedGrade === 'ថ្នាក់ទី ១២') {
          localStorage.setItem('ngs_custom_class_g12', val);
        }
      } catch (e) {}"""
content = content.replace(old_batch_class, new_batch_class)

# 5. Update applyPdfCustomStamps header whiteout & G11 footer whiteout
old_stamp_head = """      const isGrade8 = (plan.grade === 'ថ្នាក់ទី ៨' || plan.grade === 'ថ្នាក់ទី 8');
      const teacherFullName = this.getTeacherFullTitle(plan.teacher);
      const teacherPhone = this.getTeacherPhone(plan.teacher);"""
new_stamp_head = """      const isGrade8 = (plan.grade === 'ថ្នាក់ទី ៨' || plan.grade === 'ថ្នាក់ទី 8');
      const isGrade11 = (plan.grade === 'ថ្នាក់ទី ១១' || plan.grade === 'ថ្នាក់ទី 11');
      const isGrade12 = (plan.grade === 'ថ្នាក់ទី ១២' || plan.grade === 'ថ្នាក់ទី 12');
      const teacherFullName = this.getTeacherFullTitle(plan.teacher);
      const teacherPhone = this.getTeacherPhone(plan.teacher);"""
content = content.replace(old_stamp_head, new_stamp_head)

old_running_hdr = """        // --- A. RUNNING HEADER ---
        // Redact / Whiteout old header zone at top
        p.drawRectangle({
          x: 60.0,
          y: pageH - 49.0,
          width: 495.0,
          height: 44.0,
          color: PDFLib.rgb(1, 1, 1),
        });"""
new_running_hdr = """        // --- A. RUNNING HEADER ---
        // Redact / Whiteout old header zone at top
        const headerWhiteoutY = (isGrade11 || isGrade12) ? (pageH - 82.0) : (pageH - 49.0);
        const headerWhiteoutH = (isGrade11 || isGrade12) ? 62.0 : 44.0;
        p.drawRectangle({
          x: 60.0,
          y: headerWhiteoutY,
          width: 495.0,
          height: headerWhiteoutH,
          color: PDFLib.rgb(1, 1, 1),
        });"""
content = content.replace(old_running_hdr, new_running_hdr)

old_running_ftr = """        // --- B. RUNNING FOOTER ---
        // Redact / Whiteout old footer zone at bottom
        p.drawRectangle({
          x: 60.0,
          y: 8.0,
          width: 495.0,
          height: 25.0,
          color: PDFLib.rgb(1, 1, 1),
        });"""
new_running_ftr = """        // --- B. RUNNING FOOTER ---
        // In Grade 11, redact old Sisowath teacher line at bottom y=60..98
        if (isGrade11) {
          p.drawRectangle({
            x: 60.0,
            y: 60.0,
            width: 495.0,
            height: 38.0,
            color: PDFLib.rgb(1, 1, 1),
          });
        }

        // Redact / Whiteout old footer zone at bottom
        p.drawRectangle({
          x: 60.0,
          y: 8.0,
          width: 495.0,
          height: 25.0,
          color: PDFLib.rgb(1, 1, 1),
        });"""
content = content.replace(old_running_ftr, new_running_ftr)

# 6. Update Page 0 cover coordinates in applyPdfCustomStamps
old_cover_coords = """        // A. Class Name (Line 1: ថ្នាក់ទី : <value>)
        if (plan.class_name) {
          const classImg = await makeTextImg(plan.class_name, 'bold 32px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 400, 70);
          const class_y_top = plan.class_y0 || (isGrade8 ? 78.1 : 99.2);
          const class_h = 20.0;
          const class_y_bottom = pageH - class_y_top - class_h;
          const class_x = 238.0;

          // Whiteout only the value slot after the colon (x >= 238.0)
          coverPage.drawRectangle({
            x: class_x,
            y: class_y_bottom,
            width: 200.0,
            height: class_h,
            color: PDFLib.rgb(1, 1, 1),
          });
          coverPage.drawImage(classImg, {
            x: class_x,
            y: class_y_bottom,
            width: 140.0,
            height: class_h,
          });
        }

        // B. Date (Line 4: កាលបរិច្ឆេទ : <value>)
        if (plan.date_khmer) {
          const dateImg = await makeTextImg(plan.date_khmer, '30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 900, 70);
          const date_y_top = plan.box_y0 || (isGrade8 ? 141.1 : 172.0);
          const date_h = 20.0;
          const date_y_bottom = pageH - date_y_top - date_h;
          const date_x = 238.0;

          // Whiteout old date dots after the colon (x >= 238.0)
          coverPage.drawRectangle({
            x: date_x,
            y: date_y_bottom,
            width: 320.0,
            height: date_h,
            color: PDFLib.rgb(1, 1, 1),
          });
          coverPage.drawImage(dateImg, {
            x: date_x,
            y: date_y_bottom,
            width: 290.0,
            height: date_h,
          });
        }

        // C. Teacher Name (Line 5: បង្រៀនដោយ : <value>)
        if (plan.teacher) {
          const teacherImg = await makeTextImg(teacherFullName, '30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 900, 70);
          const teacher_y_top = plan.teacher_y0 || (isGrade8 ? 162.1 : 190.5);
          const teacher_h = 20.0;
          const teacher_y_bottom = pageH - teacher_y_top - teacher_h;
          const teacher_x = 238.0;"""

new_cover_coords = """        // A. Class Name
        if (plan.class_name) {
          const classImg = await makeTextImg(plan.class_name, 'bold 32px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 400, 70);
          const class_x = plan.class_x || (isGrade11 ? 210.0 : 238.0);
          const class_y_top = plan.class_y0 || (isGrade8 ? 78.1 : (isGrade11 ? 195.0 : 99.2));
          const class_h = 20.0;
          const class_y_bottom = pageH - class_y_top - class_h;

          // Whiteout only the value slot after the colon
          coverPage.drawRectangle({
            x: class_x,
            y: class_y_bottom,
            width: 240.0,
            height: class_h,
            color: PDFLib.rgb(1, 1, 1),
          });
          coverPage.drawImage(classImg, {
            x: class_x,
            y: class_y_bottom,
            width: 160.0,
            height: class_h,
          });
        }

        // B. Date
        if (plan.date_khmer) {
          const dateImg = await makeTextImg(plan.date_khmer, '30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 900, 70);
          const date_x = plan.date_x || (isGrade11 ? 210.0 : 238.0);
          const date_y_top = plan.box_y0 || (isGrade8 ? 141.1 : (isGrade11 ? 239.0 : 172.0));
          const date_h = 20.0;
          const date_y_bottom = pageH - date_y_top - date_h;

          // Whiteout old date dots after the colon
          coverPage.drawRectangle({
            x: date_x,
            y: date_y_bottom,
            width: 320.0,
            height: date_h,
            color: PDFLib.rgb(1, 1, 1),
          });
          coverPage.drawImage(dateImg, {
            x: date_x,
            y: date_y_bottom,
            width: 290.0,
            height: date_h,
          });
        }

        // C. Teacher Name
        if (plan.teacher) {
          const teacherImg = await makeTextImg(teacherFullName, '30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif', 900, 70);
          const teacher_x = plan.teacher_x || (isGrade11 ? 210.0 : 238.0);
          const teacher_y_top = plan.teacher_y0 || (isGrade8 ? 162.1 : (isGrade11 ? 217.0 : 190.5));
          const teacher_h = 20.0;
          const teacher_y_bottom = pageH - teacher_y_top - teacher_h;"""

content = content.replace(old_cover_coords, new_cover_coords)

# 7. Update gradesList and class buttons in render()
old_grades_list = """      const gradesList = [
        { id: 'ថ្នាក់ទី ៧', label: 'ថ្នាក់ទី ៧', count: 0, status: 'coming_soon' },
        { id: 'ថ្នាក់ទី ៨', label: 'ថ្នាក់ទី ៨', count: 72, status: 'active', icon: '⚡' },
        { id: 'ថ្នាក់ទី ៩', label: 'ថ្នាក់ទី ៩', count: 0, status: 'coming_soon' },
        { id: 'ថ្នាក់ទី ១០', label: 'ថ្នាក់ទី ១០', count: 0, status: 'coming_soon' },
        { id: 'ថ្នាក់ទី ១១', label: 'ថ្នាក់ទី ១១', count: 0, status: 'coming_soon' },
        { id: 'ថ្នាក់ទី ១២', label: 'ថ្នាក់ទី ១២', count: 37, status: 'active', icon: '⭐' }
      ];

      // Available classes and terminology based on grade
      const isGrade8 = currentGrade === 'ថ្នាក់ទី ៨';
      const unitLabel = isGrade8 ? 'មេរៀន' : 'ជំពូក';
      const defaultClasses = isGrade8
        ? ['8NGS_C1', '8NGS_C2', '8NGS_B']
        : ['១២A', '១២B', '១២C', '១២D'];"""

new_grades_list = """      const g8Count = this.plans.filter(p => p.grade === 'ថ្នាក់ទី ៨' || p.grade === 'ថ្នាក់ទី 8').length || 78;
      const g11Count = this.plans.filter(p => p.grade === 'ថ្នាក់ទី ១១' || p.grade === 'ថ្នាក់ទី 11').length || 10;
      const g12Count = this.plans.filter(p => p.grade === 'ថ្នាក់ទី ១២' || p.grade === 'ថ្នាក់ទី 12').length || 113;

      const gradesList = [
        { id: 'ថ្នាក់ទី ៧', label: 'ថ្នាក់ទី ៧', count: 0, status: 'coming_soon' },
        { id: 'ថ្នាក់ទី ៨', label: 'ថ្នាក់ទី ៨', count: g8Count, status: 'active', icon: '⚡' },
        { id: 'ថ្នាក់ទី ៩', label: 'ថ្នាក់ទី ៩', count: 0, status: 'coming_soon' },
        { id: 'ថ្នាក់ទី ១០', label: 'ថ្នាក់ទី ១០', count: 0, status: 'coming_soon' },
        { id: 'ថ្នាក់ទី ១១', label: 'ថ្នាក់ទី ១១', count: g11Count, status: 'active', icon: '⭐' },
        { id: 'ថ្នាក់ទី ១២', label: 'ថ្នាក់ទី ១២', count: g12Count, status: 'active', icon: '⭐' }
      ];

      // Available classes and terminology based on grade
      const isGrade8 = currentGrade === 'ថ្នាក់ទី ៨';
      const isGrade11 = currentGrade === 'ថ្នាក់ទី ១១';
      const isGrade12 = currentGrade === 'ថ្នាក់ទី ១២';
      const unitLabel = isGrade12 ? 'ជំពូក' : 'មេរៀន';
      const defaultClasses = isGrade8
        ? ['8NGS_C1', '8NGS_C2', '8NGS_B', '8NGS_B2']
        : (isGrade11 ? ['11NGS_P1', '11NGS_C2', '11NGS_P1 & 11NGS_C2', '១១A', '១១B'] : ['១២A', '១២B', '១២A & ១២B', '12NGS_1', '12NGS_2']);"""

content = content.replace(old_grades_list, new_grades_list)

# 8. Update class buttons in Batch Customizer HTML
old_class_buttons = """                  ${isGrade8 ? `
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                      8NGS_C1
                    </button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C2')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                      8NGS_C2
                    </button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_B')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                      8NGS_B
                    </button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_B2')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                      8NGS_B2
                    </button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1 & 8NGS_C2')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">
                      8NGS_C1 & 8NGS_C2 (២ ថ្នាក់)
                    </button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1, 8NGS_C2 & 8NGS_B')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">
                      8NGS_C1, 8NGS_C2 & 8NGS_B (៣ ថ្នាក់)
                    </button>
                  ` : `
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២A')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                      ១២A
                    </button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២B')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                      ១២B
                    </button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២A & ១២B')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">
                      ១២A & ១២B (២ ថ្នាក់)
                    </button>
                  `}"""

new_class_buttons = """                  ${isGrade8 ? `
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">8NGS_C1</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C2')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">8NGS_C2</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_B')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">8NGS_B</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_B2')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">8NGS_B2</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1 & 8NGS_C2')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">8NGS_C1 & 8NGS_C2 (២ ថ្នាក់)</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_C1, 8NGS_C2 & 8NGS_B')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">8NGS_C1, 8NGS_C2 & 8NGS_B (៣ ថ្នាក់)</button>
                  ` : (isGrade11 ? `
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('11NGS_P1')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">11NGS_P1</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('11NGS_C2')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">11NGS_C2</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('11NGS_P1 & 11NGS_C2')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">11NGS_P1 & 11NGS_C2 (២ ថ្នាក់)</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១១A')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">១១A</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១១B')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">១១B</button>
                  ` : `
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២A')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">១២A</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២B')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">១២B</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('១២A & ១២B')" class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 border border-purple-300 font-bold text-[11px] text-purple-800 dark:text-purple-300 transition">១២A & ១២B (២ ថ្នាក់)</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('12NGS_1')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">12NGS_1</button>
                    <button type="button" onclick="window.lessonPlansManager.setClassPreset('12NGS_2')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">12NGS_2</button>
                  `)}"""

content = content.replace(old_class_buttons, new_class_buttons)

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated js/lesson-plans.js successfully!")

