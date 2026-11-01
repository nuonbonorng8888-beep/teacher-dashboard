/**
 * NGS Interactive Math Games Engine (សាលារៀនជំនាន់ថ្មី - វិទ្យាល័យព្រះយុគន្ធរ)
 * Standardized Educational Math Games with Full Curriculum Integration (5,470 Questions)
 * Filterable by Grade (7, 8, 9, 10, 11, 12) and Lesson / Topic
 * Specially Crafted for Teacher Nuon Bonorng (Bonorng11)
 */

class MathGamesEngine {
  constructor() {
    this.audioCtx = null;
    this.selectedGrade = 'all';
    this.selectedLesson = 'all';

    // Blitz State
    this.blitzDuration = 15;
    this.blitzScore = 0;
    this.blitzStreak = 0;
    this.blitzTimer = null;
    this.blitzTimeLeft = 15;
    this.blitzPaused = false;
    this.currentBlitzQ = null;

    // Formula Match State
    this.matchPairsCount = 6;
    this.matchDuration = 0; // 0 = free
    this.matchTimer = null;
    this.matchTimeLeft = 0;
    this.matchMoves = 0;
    this.matchMatchedCount = 0;
    this.matchPlayersCount = 1; // 1, 2, or 4 players
    this.matchActivePlayer = 0;
    this.matchPlayerScores = [0, 0, 0, 0];
    this.praiseTimer = null;
    this.matchPlayerConfigs = [
      { name: 'អ្នកលេង ១', color: 'blue', bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-400', ring: 'ring-blue-500', text: 'text-blue-700 dark:text-blue-300', icon: '🔵' },
      { name: 'អ្នកលេង ២', color: 'rose', bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-400', ring: 'ring-rose-500', text: 'text-rose-700 dark:text-rose-300', icon: '🔴' },
      { name: 'អ្នកលេង ៣', color: 'emerald', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-400', ring: 'ring-emerald-500', text: 'text-emerald-700 dark:text-emerald-300', icon: '🟢' },
      { name: 'អ្នកលេង ៤', color: 'amber', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-400', ring: 'ring-amber-500', text: 'text-amber-700 dark:text-amber-300', icon: '🟡' }
    ];

    // Team Battle State
    this.battleTargetScore = 50;
    this.battleTurnDuration = 30; // 0 = free
    this.battleTimer = null;
    this.battleTimeLeft = 30;
    this.teamAScore = 0;
    this.teamBScore = 0;
    this.activeTeam = 'A';
    this.currentBattleQ = null;

    // Millionaire State
    this.millionaireLevel = 1;
    this.millionaireDuration = 0; // 0 = free
    this.millionaireTimer = null;
    this.millionaireTimeLeft = 0;
    this.currentMillionaireQ = null;
    this.lifeline5050Used = false;
    this.lifelineStudentUsed = false;
    this.lifelineHintUsed = false;

    // Space Defender State
    this.defenderDuration = 30;
    this.defenderCustomLives = 3;
    this.defenderScore = 0;
    this.defenderLives = 3;
    this.defenderTimer = null;
    this.defenderTimeRemainingMs = 30000;
    this.defenderPaused = false;
    this.currentDefenderQ = null;

    // Comprehensive Grade & Topic-Specific Formula Packs (100% Unique Left & Right, Strictly MoEYS Curriculum)
    this.formulaPacks = {
      // ================== GRADE 7 FORMULA PACKS ==================
      // Lesson 1: ចំនួនគត់ (Integers - properties, order of operations, powers)
      g7_integers: [
        { id: 'g7_int_1', left: "a + b", right: "b + a\\text{ (លក្ខណៈត្រឡប់)}" },
        { id: 'g7_int_2', left: "(a + b) + c", right: "a + (b + c)\\text{ (លក្ខណៈផ្តុំ)}" },
        { id: 'g7_int_3', left: "a \\cdot b", right: "b \\cdot a\\text{ (លក្ខណៈត្រឡប់)}" },
        { id: 'g7_int_4', left: "(a \\cdot b) \\cdot c", right: "a \\cdot (b \\cdot c)\\text{ (លក្ខណៈផ្តុំ)}" },
        { id: 'g7_int_5', left: "a(b + c)", right: "ab + ac\\text{ (លក្ខណៈបំបែក)}" },
        { id: 'g7_int_6', left: "a(b - c)", right: "ab - ac\\text{ (លក្ខណៈបំបែក)}" },
        { id: 'g7_int_7', left: "a + 0", right: "a\\text{ (ធាតុណឺតផលបូក)}" },
        { id: 'g7_int_8', left: "a \\cdot 1", right: "a\\text{ (ធាតុណឺតផលគុណ)}" },
        { id: 'g7_int_9', left: "a \\cdot 0", right: "0\\text{ (ប្រមាណវិធីលើសូន្យ)}" },
        { id: 'g7_int_10', left: "a^2", right: "a \\times a\\text{ (ការេនៃចំនួនគត់)}" },
        { id: 'g7_int_11', left: "a^3", right: "a \\times a \\times a\\text{ (គូបនៃចំនួនគត់)}" },
        { id: 'g7_int_12', left: "2^3", right: "8" },
        { id: 'g7_int_13', left: "3^2", right: "9" },
        { id: 'g7_int_14', left: "4^2", right: "16" },
        { id: 'g7_int_15', left: "5^2", right: "25" },
        { id: 'g7_int_16', left: "15 + 25 \\times 2", right: "65" },
        { id: 'g7_int_17', left: "2^3 + 3^2", right: "17" },
        { id: 'g7_int_18', left: "|{-5}|", right: "5\\text{ (តម្លៃដាច់ខាត)}" },
        { id: 'g7_int_19', left: "24 - 4 \\times 5 + 6", right: "10" },
        { id: 'g7_int_20', left: "10^2", right: "100" }
      ],

      // Lesson 2: តួចែកនិងពហុគុណ (Factors and Multiples, GCD/LCM)
      g7_factors_multiples: [
        { id: 'g7_fm_1', left: "\\text{PGCD}(12, 18)", right: "6" },
        { id: 'g7_fm_2', left: "\\text{PPCM}(4, 6)", right: "12" },
        { id: 'g7_fm_3', left: "\\text{PGCD}(8, 12)", right: "4" },
        { id: 'g7_fm_4', left: "\\text{PPCM}(3, 5)", right: "15" },
        { id: 'g7_fm_5', left: "\\text{ចំនួនបឋមតូចជាងគេ}", right: "2" },
        { id: 'g7_fm_6', left: "\\text{ចំនួនគត់សេសបឋមដំបូង}", right: "3" },
        { id: 'g7_fm_7', left: "12\\text{ (កត្តាបឋម)}", right: "2^2 \\times 3" },
        { id: 'g7_fm_8', left: "18\\text{ (កត្តាបឋម)}", right: "2 \\times 3^2" },
        { id: 'g7_fm_9', left: "20\\text{ (កត្តាបឋម)}", right: "2^2 \\times 5" },
        { id: 'g7_fm_10', left: "24\\text{ (កត្តាបឋម)}", right: "2^3 \\times 3" },
        { id: 'g7_fm_11', left: "a \\times b", right: "\\text{PGCD}(a,b) \\times \\text{PPCM}(a,b)" },
        { id: 'g7_fm_12', left: "\\text{តួចែកនៃ } 6", right: "\\{1, 2, 3, 6\\}" },
        { id: 'g7_fm_13', left: "\\text{តួចែកនៃ } 8", right: "\\{1, 2, 4, 8\\}" },
        { id: 'g7_fm_14', left: "\\text{PGCD}(15, 20)", right: "5" },
        { id: 'g7_fm_15', left: "\\text{PPCM}(6, 8)", right: "24" },
        { id: 'g7_fm_16', left: "30\\text{ (កត្តាបឋម)}", right: "2 \\times 3 \\times 5" },
        { id: 'g7_fm_17', left: "\\text{PGCD}(14, 21)", right: "7" },
        { id: 'g7_fm_18', left: "\\text{PPCM}(10, 15)", right: "30" }
      ],

      // Lesson 3: ចំនួនគត់រ៉ឺឡាទីប (Relative Integers)
      g7_relative_integers: [
        { id: 'g7_ri_1', left: "(-a) + (-b)", right: "-(a + b)" },
        { id: 'g7_ri_2', left: "(+a) \\times (+b)", right: "+ab" },
        { id: 'g7_ri_3', left: "(-a) \\times (-b)", right: "+ab\\text{ (ដកគុណដក)}" },
        { id: 'g7_ri_4', left: "(+a) \\times (-b)", right: "-ab" },
        { id: 'g7_ri_5', left: "(-3) + (-5)", right: "-8" },
        { id: 'g7_ri_6', left: "(-4) \\times (-3)", right: "+12" },
        { id: 'g7_ri_7', left: "(-10) \\div 2", right: "-5" },
        { id: 'g7_ri_8', left: "(-2)^3", right: "-8\\text{ (ស្វ័យគុណសេស)}" },
        { id: 'g7_ri_9', left: "(-3)^2", right: "+9\\text{ (ស្វ័យគុណគូ)}" },
        { id: 'g7_ri_10', left: "5 - (-3)", right: "8" },
        { id: 'g7_ri_11', left: "(-7) + 10", right: "+3" },
        { id: 'g7_ri_12', left: "(-6) \\times 4", right: "-24" },
        { id: 'g7_ri_13', left: "(-15) \\div (-3)", right: "+5" },
        { id: 'g7_ri_14', left: "0 - 7", right: "-7" },
        { id: 'g7_ri_15', left: "(-1)^5", right: "-1" },
        { id: 'g7_ri_16', left: "(-1)^6", right: "1" }
      ],

      // Lesson 4: ប្រភាគ (Fractions)
      g7_fractions: [
        { id: 'g7_fr_1', left: "\\frac{a}{m} + \\frac{b}{m}", right: "\\frac{a + b}{m}" },
        { id: 'g7_fr_2', left: "\\frac{a}{m} - \\frac{b}{m}", right: "\\frac{a - b}{m}" },
        { id: 'g7_fr_3', left: "\\frac{a}{b} \\times \\frac{c}{d}", right: "\\frac{ac}{bd}" },
        { id: 'g7_fr_4', left: "\\frac{a}{b} \\div \\frac{c}{d}", right: "\\frac{a}{b} \\times \\frac{d}{c}" },
        { id: 'g7_fr_5', left: "\\frac{1}{2} + \\frac{1}{4}", right: "\\frac{3}{4}" },
        { id: 'g7_fr_6', left: "\\frac{2}{3} \\times \\frac{3}{4}", right: "\\frac{1}{2}" },
        { id: 'g7_fr_7', left: "\\frac{3}{5} \\div \\frac{2}{5}", right: "\\frac{3}{2}" },
        { id: 'g7_fr_8', left: "1 - \\frac{1}{3}", right: "\\frac{2}{3}" },
        { id: 'g7_fr_9', left: "\\frac{1}{3} + \\frac{1}{6}", right: "\\frac{1}{2}\\text{ (សម្រួលរួច)}" },
        { id: 'g7_fr_10', left: "\\frac{4}{8}", right: "\\frac{1}{2}\\text{ (ប្រភាគងាយ)}" },
        { id: 'g7_fr_11', left: "\\frac{6}{9}", right: "\\frac{2}{3}\\text{ (ប្រភាគងាយ)}" },
        { id: 'g7_fr_12', left: "\\frac{10}{15}", right: "\\frac{2}{3}\\text{ (ចែកនឹង ៥)}" },
        { id: 'g7_fr_13', left: "\\frac{1}{4} + \\frac{1}{2}", right: "\\frac{3}{4}\\text{ (ភាគបែង ៤)}" },
        { id: 'g7_fr_14', left: "\\frac{5}{6} - \\frac{1}{6}", right: "\\frac{2}{3}\\text{ (សម្រួល ៤/៦)}" },
        { id: 'g7_fr_15', left: "\\frac{3}{4} \\times 4", right: "3" },
        { id: 'g7_fr_16', left: "\\frac{1}{5} \\times 10", right: "2" }
      ],

      // Lesson 6: ភាគរយ (Percentages)
      g7_percentages: [
        { id: 'g7_pc_1', left: "50\\%", right: "\\frac{1}{2}" },
        { id: 'g7_pc_2', left: "25\\%", right: "\\frac{1}{4}" },
        { id: 'g7_pc_3', left: "75\\%", right: "\\frac{3}{4}" },
        { id: 'g7_pc_4', left: "20\\%", right: "\\frac{1}{5}" },
        { id: 'g7_pc_5', left: "10\\%", right: "\\frac{1}{10}" },
        { id: 'g7_pc_6', left: "100\\%", right: "1" },
        { id: 'g7_pc_7', left: "50\\%\\text{ នៃ } 200", right: "100" },
        { id: 'g7_pc_8', left: "20\\%\\text{ នៃ } 50", right: "10" },
        { id: 'g7_pc_9', left: "10\\%\\text{ នៃ } 350", right: "35" },
        { id: 'g7_pc_10', left: "25\\%\\text{ នៃ } 80", right: "20" },
        { id: 'g7_pc_11', left: "\\frac{1}{5}\\text{ ជាភាគរយ}", right: "20\\%" },
        { id: 'g7_pc_12', left: "\\frac{2}{5}\\text{ ជាភាគរយ}", right: "40\\%" },
        { id: 'g7_pc_13', left: "5\\%\\text{ នៃ } 100", right: "5" },
        { id: 'g7_pc_14', left: "30\\%\\text{ នៃ } 200", right: "60" },
        { id: 'g7_pc_15', left: "0.5\\text{ ជាភាគរយ}", right: "50\\%" },
        { id: 'g7_pc_16', left: "0.25\\text{ ជាភាគរយ}", right: "25\\%" }
      ],

      // Geometry Grade 7
      g7_geometry: [
        { id: 'g7_geo_1', left: "\\text{ផលបូកមុំក្នុងត្រីកោណ}", right: "180^\\circ" },
        { id: 'g7_geo_2', left: "\\text{ផលបូកមុំក្នុងចតុកោណ}", right: "360^\\circ" },
        { id: 'g7_geo_3', left: "\\text{មុំកែង}", right: "90^\\circ" },
        { id: 'g7_geo_4', left: "\\text{មុំរាប}", right: "180^\\circ\\text{ (មុំកន្លះរង្វង់)}" },
        { id: 'g7_geo_5', left: "S_\\triangle", right: "\\frac{1}{2} b h" },
        { id: 'g7_geo_6', left: "P_{\\text{ការេ}}", right: "4a" },
        { id: 'g7_geo_7', left: "S_{\\text{ការេ}}", right: "a^2" },
        { id: 'g7_geo_8', left: "P_{\\text{ចតុកោណកែង}}", right: "2(a + b)" },
        { id: 'g7_geo_9', left: "S_{\\text{ចតុកោណកែង}}", right: "a \\times b" },
        { id: 'g7_geo_10', left: "P_\\circ", right: "2\\pi R" },
        { id: 'g7_geo_11', left: "S_\\circ", right: "\\pi R^2" },
        { id: 'g7_geo_12', left: "V_{\\text{គូប}}", right: "a^3" },
        { id: 'g7_geo_13', left: "V_{\\text{ប្រលេឡូពីប៉ែត}}", right: "a \\times b \\times c" },
        { id: 'g7_geo_14', left: "S_{\\text{ចតុកោណព្នាយ}}", right: "\\frac{(a+b)h}{2}" },
        { id: 'g7_geo_15', left: "S_{\\text{ប្រលេឡូក្រាម}}", right: "b \\times h" },
        { id: 'g7_geo_16', left: "d_{\\text{រង្វង់}}", right: "2R" }
      ],

      // Grade 7 Comprehensive Fallback
      grade7_all: [
        { id: 'g7_all_1', left: "a + b", right: "b + a" },
        { id: 'g7_all_2', left: "a(b + c)", right: "ab + ac" },
        { id: 'g7_all_3', left: "2^3", right: "8" },
        { id: 'g7_all_4', left: "3^2", right: "9" },
        { id: 'g7_all_5', left: "4^2", right: "16" },
        { id: 'g7_all_6', left: "\\text{PGCD}(12, 18)", right: "6" },
        { id: 'g7_all_7', left: "\\text{PPCM}(4, 6)", right: "12" },
        { id: 'g7_all_8', left: "(-3) \\times (-4)", right: "+12" },
        { id: 'g7_all_9', left: "(-2)^3", right: "-8" },
        { id: 'g7_all_10', left: "\\frac{1}{2} + \\frac{1}{4}", right: "\\frac{3}{4}" },
        { id: 'g7_all_11', left: "\\frac{2}{3} \\times \\frac{3}{4}", right: "\\frac{1}{2}" },
        { id: 'g7_all_12', left: "50\\%", right: "\\frac{1}{2}\\text{ (ពាក់កណ្តាល)}" },
        { id: 'g7_all_13', left: "25\\%", right: "\\frac{1}{4}\\text{ (មួយភាគបួន)}" },
        { id: 'g7_all_14', left: "S_{\\text{ការេ}}", right: "a^2" },
        { id: 'g7_all_15', left: "P_{\\text{ការេ}}", right: "4a" },
        { id: 'g7_all_16', left: "S_\\triangle", right: "\\frac{1}{2} b h" },
        { id: 'g7_all_17', left: "P_\\circ", right: "2\\pi R" },
        { id: 'g7_all_18', left: "S_\\circ", right: "\\pi R^2" }
      ],

      // ================== GRADE 8 FORMULA PACKS ==================
      // Powers (ស្វ័យគុណ)
      g8_powers: [
        { id: 'g8_p_1', left: "a^m \\cdot a^n", right: "a^{m+n}" },
        { id: 'g8_p_2', left: "\\frac{a^m}{a^n}", right: "a^{m-n}" },
        { id: 'g8_p_3', left: "(a^m)^n", right: "a^{mn}" },
        { id: 'g8_p_4', left: "(ab)^n", right: "a^n b^n" },
        { id: 'g8_p_5', left: "(\\frac{a}{b})^n", right: "\\frac{a^n}{b^n}" },
        { id: 'g8_p_6', left: "a^0\\text{ (}a \\neq 0)", right: "1" },
        { id: 'g8_p_7', left: "a^{-n}", right: "\\frac{1}{a^n}" },
        { id: 'g8_p_8', left: "2^4", right: "16" },
        { id: 'g8_p_9', left: "3^3", right: "27" },
        { id: 'g8_p_10', left: "5^3", right: "125" },
        { id: 'g8_p_11', left: "10^3", right: "1000" },
        { id: 'g8_p_12', left: "10^{-2}", right: "0.01" },
        { id: 'g8_p_13', left: "2^{-1}", right: "\\frac{1}{2}" },
        { id: 'g8_p_14', left: "2^5", right: "32" },
        { id: 'g8_p_15', left: "4^3", right: "64" },
        { id: 'g8_p_16', left: "10^{-3}", right: "0.001" }
      ],

      // Pythagoras (ពីតាក័រ)
      g8_pythagoras: [
        { id: 'g8_py_1', left: "c^2\\text{ (ពីតាក័រ)}", right: "a^2 + b^2" },
        { id: 'g8_py_2', left: "a^2 + b^2 = c^2 \\iff", right: "\\triangle\\text{ កែងត្រង់ }C" },
        { id: 'g8_py_3', left: "3^2 + 4^2", right: "5^2" },
        { id: 'g8_py_4', left: "6^2 + 8^2", right: "10^2" },
        { id: 'g8_py_5', left: "5^2 + 12^2", right: "13^2" },
        { id: 'g8_py_6', left: "c", right: "\\sqrt{a^2 + b^2}\\text{ (អ៊ីប៉ូតេនុស)}" },
        { id: 'g8_py_7', left: "a^2", right: "c^2 - b^2" },
        { id: 'g8_py_8', left: "b^2", right: "c^2 - a^2" },
        { id: 'g8_py_9', left: "\\sqrt{3^2 + 4^2}", right: "5" },
        { id: 'g8_py_10', left: "\\sqrt{6^2 + 8^2}", right: "10" },
        { id: 'g8_py_11', left: "\\sqrt{5^2 + 12^2}", right: "13" },
        { id: 'g8_py_12', left: "9^2 + 12^2", right: "15^2" },
        { id: 'g8_py_13', left: "7^2 + 24^2", right: "25^2" },
        { id: 'g8_py_14', left: "8^2 + 15^2", right: "17^2" },
        { id: 'g8_py_15', left: "\\text{អ៊ីប៉ូតេនុស}", right: "\\text{ជ្រុងឈមនឹងមុំកែង}" },
        { id: 'g8_py_16', left: "c^2 = a^2 + b^2", right: "\\text{ទ្រឹស្តីបទពីតាក័រ}" }
      ],

      // Grade 8 Fallback
      grade8_all: [
        { id: 'g8_all_1', left: "a^m \\cdot a^n", right: "a^{m+n}" },
        { id: 'g8_all_2', left: "\\frac{a^m}{a^n}", right: "a^{m-n}" },
        { id: 'g8_all_3', left: "(a^m)^n", right: "a^{mn}" },
        { id: 'g8_all_4', left: "a^0\\text{ (}a \\neq 0)", right: "1" },
        { id: 'g8_all_5', left: "a^{-n}", right: "\\frac{1}{a^n}" },
        { id: 'g8_all_6', left: "c^2\\text{ (ពីតាក័រ)}", right: "a^2 + b^2" },
        { id: 'g8_all_7', left: "3^2 + 4^2", right: "5^2" },
        { id: 'g8_all_8', left: "6^2 + 8^2", right: "10^2" },
        { id: 'g8_all_9', left: "2^4", right: "16" },
        { id: 'g8_all_10', left: "3^3", right: "27" },
        { id: 'g8_all_11', left: "5^3", right: "125" },
        { id: 'g8_all_12', left: "S_\\triangle", right: "\\frac{1}{2} b h" },
        { id: 'g8_all_13', left: "S_{\\text{ការេ}}", right: "a^2" },
        { id: 'g8_all_14', left: "P_{\\text{ការេ}}", right: "4a" },
        { id: 'g8_all_15', left: "P_\\circ", right: "2\\pi R" },
        { id: 'g8_all_16', left: "S_\\circ", right: "\\pi R^2" }
      ],

      // ================== GRADE 9 FORMULA PACKS ==================
      // Radicals (ឫសការេ និងរ៉ាឌីកាល់)
      g9_radicals: [
        { id: 'g9_rad_1', left: "\\sqrt{a \\cdot b}", right: "\\sqrt{a}\\sqrt{b}" },
        { id: 'g9_rad_2', left: "\\sqrt{\\frac{a}{b}}", right: "\\frac{\\sqrt{a}}{\\sqrt{b}}" },
        { id: 'g9_rad_3', left: "(\\sqrt{a})^2", right: "a\\text{ (}a \\ge 0)" },
        { id: 'g9_rad_4', left: "\\sqrt{a^2}", right: "|a|" },
        { id: 'g9_rad_5', left: "\\sqrt{16}", right: "4" },
        { id: 'g9_rad_6', left: "\\sqrt{25}", right: "5" },
        { id: 'g9_rad_7', left: "\\sqrt{36}", right: "6" },
        { id: 'g9_rad_8', left: "\\sqrt{49}", right: "7" },
        { id: 'g9_rad_9', left: "\\sqrt{64}", right: "8" },
        { id: 'g9_rad_10', left: "\\sqrt{81}", right: "9" },
        { id: 'g9_rad_11', left: "\\sqrt{100}", right: "10" },
        { id: 'g9_rad_12', left: "\\sqrt{144}", right: "12" },
        { id: 'g9_rad_13', left: "\\sqrt{169}", right: "13" },
        { id: 'g9_rad_14', left: "\\sqrt{196}", right: "14" },
        { id: 'g9_rad_15', left: "\\sqrt{50}", right: "5\\sqrt{2}" },
        { id: 'g9_rad_16', left: "\\sqrt{18}", right: "3\\sqrt{2}" }
      ],

      // Quadratic Equations (សមីការដឺក្រេទីពីរ)
      g9_quadratics: [
        { id: 'g9_q_1', left: "\\Delta", right: "b^2 - 4ac" },
        { id: 'g9_q_2', left: "\\Delta > 0 \\implies", right: "\\text{មានឬសពីរផ្សេងគ្នា}" },
        { id: 'g9_q_3', left: "\\Delta = 0 \\implies", right: "\\text{មានឬសឌុប}" },
        { id: 'g9_q_4', left: "\\Delta < 0 \\implies", right: "\\text{គ្មានឬសក្នុង }\\mathbb{R}" },
        { id: 'g9_q_5', left: "x_{1,2}", right: "\\frac{-b \\pm \\sqrt{\\Delta}}{2a}" },
        { id: 'g9_q_6', left: "x_0\\text{ (ឬសឌុប)}", right: "-\\frac{b}{2a}" },
        { id: 'g9_q_7', left: "S = x_1 + x_2", right: "-\\frac{b}{a}" },
        { id: 'g9_q_8', left: "P = x_1 \\cdot x_2", right: "\\frac{c}{a}" },
        { id: 'g9_q_9', left: "(a+b)^2", right: "a^2 + 2ab + b^2" },
        { id: 'g9_q_10', left: "(a-b)^2", right: "a^2 - 2ab + b^2" },
        { id: 'g9_q_11', left: "a^2 - b^2", right: "(a-b)(a+b)" },
        { id: 'g9_q_12', left: "x^2 - 4 = 0", right: "x = \\pm 2" },
        { id: 'g9_q_13', left: "x^2 - 9 = 0", right: "x = \\pm 3" },
        { id: 'g9_q_14', left: "x^2 - 16 = 0", right: "x = \\pm 4" },
        { id: 'g9_q_15', left: "(x - 1)(x - 2) = 0", right: "x = 1,\\, x = 2" },
        { id: 'g9_q_16', left: "x^2 - 25 = 0", right: "x = \\pm 5" }
      ],

      // Solids (សូលីត)
      g9_solids: [
        { id: 'g9_s_1', left: "V_{\\text{ស៊ីឡាំង}}", right: "\\pi R^2 h" },
        { id: 'g9_s_2', left: "S_{L\\text{ (ស៊ីឡាំង)}}", right: "2\\pi R h" },
        { id: 'g9_s_3', left: "V_{\\text{កោន}}", right: "\\frac{1}{3}\\pi R^2 h" },
        { id: 'g9_s_4', left: "S_{L\\text{ (កោន)}}", right: "\\pi R l" },
        { id: 'g9_s_5', left: "V_{\\text{ស្វ៊ែរ}}", right: "\\frac{4}{3}\\pi R^3" },
        { id: 'g9_s_6', left: "S_{\\text{ស្វ៊ែរ}}", right: "4\\pi R^2" },
        { id: 'g9_s_7', left: "V_{\\text{គូប}}", right: "a^3" },
        { id: 'g9_s_8', left: "S_{T\\text{ (គូប)}}", right: "6a^2" },
        { id: 'g9_s_9', left: "V_{\\text{ប្រលេឡូពីប៉ែត}}", right: "l \\times w \\times h" },
        { id: 'g9_s_10', left: "\\frac{S_1}{S_2}\\text{ (ដូចគ្នា)}", right: "k^2" },
        { id: 'g9_s_11', left: "\\frac{V_1}{V_2}\\text{ (ដូចគ្នា)}", right: "k^3" },
        { id: 'g9_s_12', left: "l^2\\text{ (កោន)}", right: "R^2 + h^2" },
        { id: 'g9_s_13', left: "S_T\\text{ (ស៊ីឡាំង)}", right: "2\\pi R(R + h)" },
        { id: 'g9_s_14', left: "S_T\\text{ (កោន)}", right: "\\pi R(R + l)" },
        { id: 'g9_s_15', left: "V_{\\text{ព្រីស}}", right: "B \\times h" },
        { id: 'g9_s_16', left: "V_{\\text{ពីរ៉ាមីត}}", right: "\\frac{1}{3} B \\times h" }
      ],

      // Grade 9 Fallback
      grade9_all: [
        { id: 'g9_all_1', left: "\\sqrt{a \\cdot b}", right: "\\sqrt{a}\\sqrt{b}" },
        { id: 'g9_all_2', left: "\\Delta", right: "b^2 - 4ac" },
        { id: 'g9_all_3', left: "x_{1,2}", right: "\\frac{-b \\pm \\sqrt{\\Delta}}{2a}" },
        { id: 'g9_all_4', left: "(a+b)^2", right: "a^2 + 2ab + b^2" },
        { id: 'g9_all_5', left: "(a-b)^2", right: "a^2 - 2ab + b^2" },
        { id: 'g9_all_6', left: "a^2 - b^2", right: "(a-b)(a+b)" },
        { id: 'g9_all_7', left: "V_{\\text{ស៊ីឡាំង}}", right: "\\pi R^2 h" },
        { id: 'g9_all_8', left: "V_{\\text{កោន}}", right: "\\frac{1}{3}\\pi R^2 h" },
        { id: 'g9_all_9', left: "V_{\\text{ស្វ៊ែរ}}", right: "\\frac{4}{3}\\pi R^3" },
        { id: 'g9_all_10', left: "\\sqrt{16}", right: "4" },
        { id: 'g9_all_11', left: "\\sqrt{25}", right: "5" },
        { id: 'g9_all_12', left: "\\sqrt{36}", right: "6" },
        { id: 'g9_all_13', left: "\\sqrt{49}", right: "7" },
        { id: 'g9_all_14', left: "\\sqrt{64}", right: "8" },
        { id: 'g9_all_15', left: "S = x_1 + x_2", right: "-\\frac{b}{a}" },
        { id: 'g9_all_16', left: "P = x_1 \\cdot x_2", right: "\\frac{c}{a}" }
      ],

      // ================== GRADE 11 FORMULA PACKS ==================
      // Lesson 1: ស្វ៊ីតចំនួនពិត (Real Sequences ONLY - strictly no arithmetic, no geometric)
      sequences_real: [
        { id: 'sr_1', left: "u_{n+1} - u_n > 0", right: "\\text{ស្វ៊ីតកើនដាច់ខាត}" },
        { id: 'sr_2', left: "u_{n+1} - u_n < 0", right: "\\text{ស្វ៊ីតចុះដាច់ខាត}" },
        { id: 'sr_3', left: "u_{n+1} = u_n", right: "\\text{ស្វ៊ីតថេរ}" },
        { id: 'sr_4', left: "u_n \\le M", right: "\\text{ស្វ៊ីតទល់លើ}" },
        { id: 'sr_5', left: "u_n \\ge m", right: "\\text{ស្វ៊ីតទល់ក្រោម}" },
        { id: 'sr_6', left: "m \\le u_n \\le M", right: "\\text{ស្វ៊ីតទល់}" },
        { id: 'sr_7', left: "u_n = 2n + 1 \\implies u_1", right: "3" },
        { id: 'sr_8', left: "u_n = 2n + 1 \\implies u_2", right: "5" },
        { id: 'sr_9', left: "u_n = n^2 - 1 \\implies u_3", right: "8" },
        { id: 'sr_10', left: "u_n = \\frac{1}{n} \\implies u_4", right: "\\frac{1}{4}" },
        { id: 'sr_11', left: "u_n = 3n - 1 \\implies u_1", right: "2" },
        { id: 'sr_12', left: "u_n = 5 - 2n \\implies u_2", right: "1" },
        { id: 'sr_13', left: "u_n = 2^n \\implies u_4", right: "16" },
        { id: 'sr_14', left: "u_{n+1} = u_n + 3,\\, u_1 = 1 \\implies u_2", right: "4" },
        { id: 'sr_15', left: "u_{n+1} = 2u_n,\\, u_1 = 3 \\implies u_2", right: "6" },
        { id: 'sr_16', left: "u_n = \\frac{n}{n+1} \\implies u_1", right: "\\frac{1}{2}" },
        { id: 'sr_17', left: "u_n = \\frac{n}{n+1} \\implies u_2", right: "\\frac{2}{3}" },
        { id: 'sr_18', left: "u_n = n^2 + 1 \\implies u_3", right: "10" }
      ],

      // Lesson 2: ស្វ៊ីតនព្វន្ត (Arithmetic Sequences ONLY - strictly no geometric)
      sequences_arithmetic: [
        { id: 'sa_1', left: "d\\text{ (ផលសងរួម)}", right: "u_n - u_{n-1}" },
        { id: 'sa_2', left: "u_n\\text{ (តួទី }n\\text{ នព្វន្ត)}", right: "u_1 + (n-1)d" },
        { id: 'sa_3', left: "S_n\\text{ (ផលបូក }n\\text{ តួនព្វន្ត)}", right: "\\frac{n(u_1 + u_n)}{2}" },
        { id: 'sa_4', left: "S_n\\text{ (រូបមន្តទី ២)}", right: "\\frac{n[2u_1 + (n-1)d]}{2}" },
        { id: 'sa_5', left: "b\\text{ (មធ្យមនព្វន្តនៃ }a, c)", right: "\\frac{a + c}{2}" },
        { id: 'sa_6', left: "2b\\text{ (លក្ខខណ្ឌ ៣ តួតគ្នានព្វន្ត)}", right: "a + c" },
        { id: 'sa_7', left: "1 + 2 + 3 + \\dots + n", right: "\\frac{n(n+1)}{2}" },
        { id: 'sa_8', left: "1 + 2 + 3 + \\dots + 10", right: "55" },
        { id: 'sa_9', left: "2 + 4 + 6 + \\dots + 2n", right: "n(n+1)" },
        { id: 'sa_10', left: "1 + 3 + 5 + \\dots + (2n-1)", right: "n^2" },
        { id: 'sa_11', left: "u_n - u_p", right: "(n-p)d" },
        { id: 'sa_12', left: "u_5 - u_1", right: "4d" },
        { id: 'sa_13', left: "u_1 = 2,\\, d = 3 \\implies u_3", right: "8" },
        { id: 'sa_14', left: "u_1 = 5,\\, d = 2 \\implies u_2", right: "7" },
        { id: 'sa_15', left: "u_1 = 1,\\, u_2 = 4 \\implies d", right: "3" },
        { id: 'sa_16', left: "u_1 = 3,\\, u_3 = 7 \\implies d", right: "2" }
      ],

      // Lesson 3: ស្វ៊ីតធរណីមាត្រ (Geometric Sequences ONLY - strictly no arithmetic)
      sequences_geometric: [
        { id: 'sg_1', left: "q\\text{ (ផលធៀបរួម)}", right: "\\frac{u_n}{u_{n-1}}" },
        { id: 'sg_2', left: "u_n\\text{ (តួទី }n\\text{ ធរណីមាត្រ)}", right: "u_1 \\cdot q^{n-1}" },
        { id: 'sg_3', left: "S_n\\text{ (ផលបូក }n\\text{ តួធរណីមាត្រ)}", right: "\\frac{u_1(1 - q^n)}{1 - q}" },
        { id: 'sg_4', left: "b^2\\text{ (លក្ខខណ្ឌ ៣ តួតគ្នាធរណីមាត្រ)}", right: "ac" },
        { id: 'sg_5', left: "b\\text{ (មធ្យមធរណីមាត្រនៃ }a, c)", right: "\\sqrt{ac}" },
        { id: 'sg_6', left: "S_\\infty\\text{ (ផលបូកអនន្ត, }|q|<1)", right: "\\frac{u_1}{1 - q}" },
        { id: 'sg_7', left: "\\frac{u_n}{u_p}", right: "q^{n-p}" },
        { id: 'sg_8', left: "u_1 = 2,\\, q = 3 \\implies u_2", right: "6" },
        { id: 'sg_9', left: "u_1 = 1,\\, q = 2 \\implies u_3", right: "4" },
        { id: 'sg_10', left: "u_1 = 3,\\, q = 3 \\implies u_2", right: "9" },
        { id: 'sg_11', left: "1 + q + q^2 + \\dots + q^{n-1}", right: "\\frac{1 - q^n}{1 - q}" },
        { id: 'sg_12', left: "1 + \\frac{1}{2} + \\frac{1}{4} + \\dots", right: "2" },
        { id: 'sg_13', left: "u_1 = 4,\\, q = \\frac{1}{2} \\implies S_\\infty", right: "8" },
        { id: 'sg_14', left: "u_1 = 1,\\, q = 3 \\implies u_4", right: "27" },
        { id: 'sg_15', left: "u_1 = 5,\\, q = 10 \\implies u_2", right: "50" },
        { id: 'sg_16', left: "u_2 = 6,\\, u_1 = 2 \\implies q", right: "3" }
      ],

      // Sequences Chapter Fallback
      sequences: [
        { id: 'seq_1', left: "u_n\\text{ (នព្វន្ត)}", right: "u_1 + (n-1)d" },
        { id: 'seq_2', left: "S_n\\text{ (នព្វន្ត)}", right: "\\frac{n(u_1 + u_n)}{2}" },
        { id: 'seq_3', left: "u_n\\text{ (ធរណីមាត្រ)}", right: "u_1 \\cdot q^{n-1}" },
        { id: 'seq_4', left: "S_n\\text{ (ធរណីមាត្រ)}", right: "\\frac{u_1(1 - q^n)}{1 - q}" },
        { id: 'seq_5', left: "\\sum_{k=1}^n k", right: "\\frac{n(n+1)}{2}" },
        { id: 'seq_6', left: "S_\\infty\\text{ (|q|<1)}", right: "\\frac{u_1}{1 - q}" },
        { id: 'seq_7', left: "d\\text{ (ផលសងរួម)}", right: "u_{n} - u_{n-1}" },
        { id: 'seq_8', left: "q\\text{ (ផលធៀបរួម)}", right: "\\frac{u_n}{u_{n-1}}" },
        { id: 'seq_9', left: "b\\text{ (មធ្យមនព្វន្តនៃ }a, c)", right: "\\frac{a + c}{2}" },
        { id: 'seq_10', left: "b\\text{ (មធ្យមធរណីមាត្រនៃ }a, c)", right: "\\sqrt{ac}" },
        { id: 'seq_11', left: "\\sum_{k=1}^n 1", right: "n" },
        { id: 'seq_12', left: "1 + 2 + 3 + \\dots + 10", right: "55" },
        { id: 'seq_13', left: "2 + 4 + 6 + \\dots + 2n", right: "n(n+1)" },
        { id: 'seq_14', left: "1 + 3 + 5 + \\dots + (2n-1)", right: "n^2" },
        { id: 'seq_15', left: "1 + \\frac{1}{2} + \\frac{1}{4} + \\dots", right: "2" }
      ],

      // Grade 11 Fallback
      // Grade 10 Fallback
      grade10_all: [
        { id: 'g10_all_1', left: "\\sin^2(x) + \\cos^2(x)", right: "1" },
        { id: 'g10_all_2', left: "\\tan(x)", right: "\\frac{\\sin(x)}{\\cos(x)}" },
        { id: 'g10_all_3', left: "1 + \\tan^2(x)", right: "\\frac{1}{\\cos^2(x)}" },
        { id: 'g10_all_4', left: "\\sin(2x)", right: "2\\sin(x)\\cos(x)" },
        { id: 'g10_all_5', left: "\\cos(2x)", right: "\\cos^2(x) - \\sin^2(x)" },
        { id: 'g10_all_6', left: "\\vec{u} \\cdot \\vec{v}", right: "xx' + yy'" },
        { id: 'g10_all_7', left: "|\\vec{u}|", right: "\\sqrt{x^2 + y^2}" },
        { id: 'g10_all_8', left: "A \\cap B", right: "\\{x \\mid x \\in A \\text{ និង } x \\in B\\}" },
        { id: 'g10_all_9', left: "A \\cup B", right: "\\{x \\mid x \\in A \\text{ ឬ } x \\in B\\}" },
        { id: 'g10_all_10', left: "\\Delta", right: "b^2 - 4ac" },
        { id: 'g10_all_11', left: "\\sin(\\frac{\\pi}{6})", right: "\\frac{1}{2}" },
        { id: 'g10_all_12', left: "\\cos(\\frac{\\pi}{6})", right: "\\frac{\\sqrt{3}}{2}" },
        { id: 'g10_all_13', left: "\\sin(\\frac{\\pi}{4})", right: "\\frac{\\sqrt{2}}{2}" },
        { id: 'g10_all_14', left: "\\tan(\\frac{\\pi}{3})", right: "\\sqrt{3}" }
      ],

      grade11_all: [
        { id: 'g11_all_1', left: "u_n\\text{ (នព្វន្ត)}", right: "u_1 + (n-1)d" },
        { id: 'g11_all_2', left: "S_n\\text{ (នព្វន្ត)}", right: "\\frac{n(u_1 + u_n)}{2}" },
        { id: 'g11_all_3', left: "u_n\\text{ (ធរណីមាត្រ)}", right: "u_1 \\cdot q^{n-1}" },
        { id: 'g11_all_4', left: "S_n\\text{ (ធរណីមាត្រ)}", right: "\\frac{u_1(1 - q^n)}{1 - q}" },
        { id: 'g11_all_5', left: "\\det\\begin{pmatrix}a & b \\\\ c & d\\end{pmatrix}", right: "ad - bc" },
        { id: 'g11_all_6', left: "A \\cdot I", right: "A" },
        { id: 'g11_all_7', left: "\\vec{u} \\cdot \\vec{v}", right: "xx' + yy' + zz'" },
        { id: 'g11_all_8', left: "|\\vec{u}|", right: "\\sqrt{x^2 + y^2 + z^2}" },
        { id: 'g11_all_9', left: "\\vec{u} \\perp \\vec{v} \\iff", right: "\\vec{u} \\cdot \\vec{v} = 0" },
        { id: 'g11_all_10', left: "P(A \\cup B)", right: "P(A) + P(B) - P(A \\cap B)" },
        { id: 'g11_all_11', left: "P(\\bar{A})", right: "1 - P(A)" },
        { id: 'g11_all_12', left: "b\\text{ (មធ្យមនព្វន្តនៃ }a, c)", right: "\\frac{a + c}{2}" },
        { id: 'g11_all_13', left: "b\\text{ (មធ្យមធរណីមាត្រនៃ }a, c)", right: "\\sqrt{ac}" },
        { id: 'g11_all_14', left: "S_\\infty\\text{ (|q|<1)}", right: "\\frac{u_1}{1 - q}" }
      ],

      // ================== GRADE 12 FORMULA PACKS ==================
      // Lesson 1: ចំនួនកុំផ្លិចទម្រង់ពីជគណិត (Algebraic Form - Strictly MoEYS Authentic)
      complex_algebraic: [
        { id: 'ca_1', left: "i^2", right: "-1" },
        { id: 'ca_2', left: "i^3", right: "-i" },
        { id: 'ca_3', left: "i^4", right: "1" },
        { id: 'ca_4', left: "|a + bi|", right: "\\sqrt{a^2 + b^2}" },
        { id: 'ca_5', left: "\\overline{a + bi}", right: "a - bi" },
        { id: 'ca_6', left: "z \\cdot \\bar{z}", right: "|z|^2" },
        { id: 'ca_7', left: "|3 - 4i|", right: "5" },
        { id: 'ca_8', left: "|1 + i|", right: "\\sqrt{2}" },
        { id: 'ca_9', left: "(2+i)(3-2i)", right: "8 - i" },
        { id: 'ca_10', left: "\\sqrt{-4}", right: "2i" },
        { id: 'ca_11', left: "\\sqrt{-9}", right: "3i" },
        { id: 'ca_12', left: "\\sqrt{-16}", right: "4i" },
        { id: 'ca_13', left: "|z \\cdot z'|", right: "|z| \\cdot |z'|" },
        { id: 'ca_14', left: "\\overline{z + z'}", right: "\\bar{z} + \\bar{z}'" },
        { id: 'ca_15', left: "\\frac{1}{i^3}", right: "i" },
        { id: 'ca_16', left: "(1+2i)^2", right: "-3 + 4i" },
        { id: 'ca_17', left: "(1-i)^2", right: "-2i" },
        { id: 'ca_18', left: "\\overline{z \\cdot z'}", right: "\\bar{z} \\cdot \\bar{z}'" }
      ],

      // Lesson 2: ចំនួនកុំផ្លិចទម្រង់ត្រីកោណមាត្រ (Trigonometric Form - Strictly MoEYS Curriculum)
      complex_trigonometric: [
        { id: 'ct_1', left: "z\\text{ (ទម្រង់ត្រីកោណមាត្រ)}", right: "r(\\cos\\theta + i\\sin\\theta)" },
        { id: 'ct_2', left: "r\\text{ (ម៉ូឌុលនៃ }z)", right: "\\sqrt{a^2 + b^2}" },
        { id: 'ct_3', left: "\\cos\\theta", right: "\\frac{a}{r}" },
        { id: 'ct_4', left: "\\sin\\theta", right: "\\frac{b}{r}" },
        { id: 'ct_5', left: "(\\cos\\theta + i\\sin\\theta)^n", right: "\\cos(n\\theta) + i\\sin(n\\theta)" },
        { id: 'ct_6', left: "[r(\\cos\\theta + i\\sin\\theta)]^n", right: "r^n[\\cos(n\\theta) + i\\sin(n\\theta)]" },
        { id: 'ct_7', left: "z \\cdot z'", right: "rr'[\\cos(\\theta+\\theta') + i\\sin(\\theta+\\theta')]" },
        { id: 'ct_8', left: "\\frac{z}{z'}", right: "\\frac{r}{r'}[\\cos(\\theta-\\theta') + i\\sin(\\theta-\\theta')]" },
        { id: 'ct_9', left: "\\arg(z \\cdot z')", right: "\\arg(z) + \\arg(z')" },
        { id: 'ct_10', left: "\\arg(\\frac{z}{z'})", right: "\\arg(z) - \\arg(z')" },
        { id: 'ct_11', left: "\\arg(z^n)", right: "n\\arg(z)" },
        { id: 'ct_12', left: "1+i\\text{ (ត្រីកោណមាត្រ)}", right: "\\sqrt{2}(\\cos\\frac{\\pi}{4} + i\\sin\\frac{\\pi}{4})" },
        { id: 'ct_13', left: "i\\text{ (ត្រីកោណមាត្រ)}", right: "\\cos\\frac{\\pi}{2} + i\\sin\\frac{\\pi}{2}" },
        { id: 'ct_14', left: "-1\\text{ (ត្រីកោណមាត្រ)}", right: "\\cos\\pi + i\\sin\\pi" },
        { id: 'ct_15', left: "1-i\\text{ (ត្រីកោណមាត្រ)}", right: "\\sqrt{2}[\\cos(-\\frac{\\pi}{4}) + i\\sin(-\\frac{\\pi}{4})]" },
        { id: 'ct_16', left: "\\arg(\\bar{z})", right: "-\\arg(z)" }
      ],

      // Complex Numbers Chapter Fallback
      complex_numbers: [
        { id: 'c_1', left: "i^2", right: "-1" },
        { id: 'c_2', left: "i^3", right: "-i" },
        { id: 'c_3', left: "i^4", right: "1" },
        { id: 'c_4', left: "|a + bi|", right: "\\sqrt{a^2 + b^2}" },
        { id: 'c_5', left: "\\overline{a + bi}", right: "a - bi" },
        { id: 'c_6', left: "z \\cdot \\bar{z}", right: "|z|^2" },
        { id: 'c_7', left: "|3 - 4i|", right: "5" },
        { id: 'c_8', left: "(\\cos\\theta + i\\sin\\theta)^n", right: "\\cos(n\\theta) + i\\sin(n\\theta)" },
        { id: 'c_9', left: "(2+i)(3-2i)", right: "8 - i" },
        { id: 'c_10', left: "\\sqrt{-4}", right: "2i" },
        { id: 'c_11', left: "|z \\cdot z'|", right: "|z| \\cdot |z'|" },
        { id: 'c_12', left: "\\overline{z + z'}", right: "\\bar{z} + \\bar{z}'" },
        { id: 'c_13', left: "\\frac{1}{i^3}", right: "i" },
        { id: 'c_14', left: "\\sqrt{-9}", right: "3i" },
        { id: 'c_15', left: "(1-i)^2", right: "-2i" },
        { id: 'c_16', left: "\\arg(z \\cdot z')", right: "\\arg(z) + \\arg(z')" }
      ],

      // Limits (លីមីត)
      limits: [
        { id: 'lim_1', left: "\\lim_{x \\to 0} \\frac{\\sin x}{x}", right: "1" },
        { id: 'lim_2', left: "\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2}", right: "\\frac{1}{2}" },
        { id: 'lim_3', left: "\\lim_{x \\to 0} \\frac{e^{2x} - 1}{x}", right: "2" },
        { id: 'lim_4', left: "\\lim_{x \\to 0} \\frac{\\ln(1+3x)}{x}", right: "3" },
        { id: 'lim_5', left: "\\lim_{x \\to 0} \\frac{\\tan(4x)}{x}", right: "4" },
        { id: 'lim_6', left: "\\lim_{x \\to 0} \\frac{\\sin(5x)}{x}", right: "5" },
        { id: 'lim_7', left: "\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}", right: "6" },
        { id: 'lim_8', left: "\\lim_{x \\to +\\infty} (1 + \\frac{1}{x})^x", right: "e" },
        { id: 'lim_9', left: "\\lim_{x \\to +\\infty} \\frac{1}{x}", right: "0" },
        { id: 'lim_10', left: "\\lim_{x \\to 0^+} \\frac{1}{x}", right: "+\\infty" },
        { id: 'lim_11', left: "\\lim_{x \\to 0^-} \\frac{1}{x}", right: "-\\infty" },
        { id: 'lim_12', left: "\\lim_{x \\to 2} \\frac{x^3 - 8}{x - 2}", right: "12" },
        { id: 'lim_13', left: "\\lim_{x \\to 2} (3x + 1)", right: "7" },
        { id: 'lim_14', left: "\\lim_{x \\to 64} \\sqrt{x}", right: "8" }
      ],

      // Derivatives (ដេរីវេ)
      derivatives: [
        { id: 'der_1', left: "(x^n)'", right: "n x^{n-1}" },
        { id: 'der_2', left: "(\\ln x)'", right: "\\frac{1}{x}" },
        { id: 'der_3', left: "(e^x)'", right: "e^x" },
        { id: 'der_4', left: "(\\sin x)'", right: "\\cos x" },
        { id: 'der_5', left: "(\\cos x)'", right: "-\\sin x" },
        { id: 'der_6', left: "(\\tan x)'", right: "\\frac{1}{\\cos^2 x}" },
        { id: 'der_7', left: "(u \\cdot v)'", right: "u'v + uv'" },
        { id: 'der_8', left: "(\\frac{u}{v})'", right: "\\frac{u'v - uv'}{v^2}" },
        { id: 'der_9', left: "(\\sqrt{x})'", right: "\\frac{1}{2\\sqrt{x}}" },
        { id: 'der_10', left: "(a^x)'", right: "a^x \\ln a" },
        { id: 'der_11', left: "(\\cot x)'", right: "-\\frac{1}{\\sin^2 x}" },
        { id: 'der_12', left: "(e^{kx})'", right: "k e^{kx}" },
        { id: 'der_13', left: "(x^3)'", right: "3x^2" },
        { id: 'der_14', left: "(x^4)'", right: "4x^3" },
        { id: 'der_15', left: "(\\frac{1}{x})'", right: "-\\frac{1}{x^2}" }
      ],

      // Integrals (អាំងតេក្រាល)
      integrals: [
        { id: 'int_1', left: "\\int x^n\\,dx", right: "\\frac{x^{n+1}}{n+1} + C" },
        { id: 'int_2', left: "\\int \\frac{1}{x}\\,dx", right: "\\ln|x| + C" },
        { id: 'int_3', left: "\\int e^x\\,dx", right: "e^x + C" },
        { id: 'int_4', left: "\\int \\cos x\\,dx", right: "\\sin x + C" },
        { id: 'int_5', left: "\\int \\sin x\\,dx", right: "-\\cos x + C" },
        { id: 'int_6', left: "\\int \\frac{1}{\\cos^2 x}\\,dx", right: "\\tan x + C" },
        { id: 'int_7', left: "\\int 2x\\,dx", right: "x^2 + C" },
        { id: 'int_8', left: "\\int 3x^2\\,dx", right: "x^3 + C" },
        { id: 'int_9', left: "\\int u' v\\,dx", right: "uv - \\int u v'\\,dx" },
        { id: 'int_10', left: "\\int e^{2x}\\,dx", right: "\\frac{1}{2}e^{2x} + C" },
        { id: 'int_11', left: "\\int \\frac{1}{\\sqrt{x}}\\,dx", right: "2\\sqrt{x} + C" },
        { id: 'int_12', left: "\\int 0\\,dx", right: "C" },
        { id: 'int_13', left: "\\int 1\\,dx", right: "x + C" },
        { id: 'int_14', left: "\\int \\frac{u'}{u}\\,dx", right: "\\ln|u| + C" }
      ],

      // Matrices (ម៉ាទ្រីស)
      matrices: [
        { id: 'mat_1', left: "\\det\\begin{pmatrix}a & b \\\\ c & d\\end{pmatrix}", right: "ad - bc" },
        { id: 'mat_2', left: "A \\cdot I", right: "A" },
        { id: 'mat_3', left: "A - A", right: "0" },
        { id: 'mat_4', left: "(kA)^T", right: "k A^T" },
        { id: 'mat_5', left: "(AB)^T", right: "B^T A^T" },
        { id: 'mat_6', left: "\\det(AB)", right: "\\det(A) \\cdot \\det(B)" },
        { id: 'mat_7', left: "A \\cdot A^{-1}", right: "I" },
        { id: 'mat_8', left: "\\det(A^{-1})", right: "\\frac{1}{\\det(A)}" },
        { id: 'mat_9', left: "\\det(kA)", right: "k^n \\det(A)" },
        { id: 'mat_10', left: "A(B+C)", right: "AB + AC" },
        { id: 'mat_11', left: "\\det(I_n)", right: "1" },
        { id: 'mat_12', left: "(A+B)^T", right: "A^T + B^T" },
        { id: 'mat_13', left: "\\det(A^T)", right: "\\det(A)" },
        { id: 'mat_14', left: "(A^T)^{-1}", right: "(A^{-1})^T" }
      ],

      // Vectors (វ៉ិចទ័រ)
      vectors: [
        { id: 'vec_1', left: "\\vec{u} \\cdot \\vec{v}", right: "xx' + yy' + zz'" },
        { id: 'vec_2', left: "|\\vec{u}|", right: "\\sqrt{x^2 + y^2 + z^2}" },
        { id: 'vec_3', left: "\\cos(\\vec{u}, \\vec{v})", right: "\\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{u}| \\cdot |\\vec{v}|}" },
        { id: 'vec_4', left: "\\vec{u} \\perp \\vec{v} \\iff", right: "\\vec{u} \\cdot \\vec{v} = 0" },
        { id: 'vec_5', left: "\\vec{u} \\parallel \\vec{v} \\iff", right: "\\vec{u} \\times \\vec{v} = \\vec{0}" },
        { id: 'vec_6', left: "\\vec{u} \\cdot \\vec{u}", right: "|\\vec{u}|^2" },
        { id: 'vec_7', left: "|\\vec{u} \\times \\vec{v}|", right: "|\\vec{u}||\\vec{v}|\\sin\\theta" },
        { id: 'vec_8', left: "\\vec{v} \\times \\vec{u}", right: "-\\vec{u} \\times \\vec{v}" },
        { id: 'vec_9', left: "S_\\triangle\\text{ (វ៉ិចទ័រ)}", right: "\\frac{1}{2}|\\vec{AB} \\times \\vec{AC}|" },
        { id: 'vec_10', left: "V\\text{ (ប្រលេឡូពីប៉ែត)}", right: "|(\\vec{u} \\times \\vec{v}) \\cdot \\vec{w}|" },
        { id: 'vec_11', left: "\\vec{AB}", right: "(x_B-x_A,\\, y_B-y_A,\\, z_B-z_A)" },
        { id: 'vec_12', left: "\\vec{u} \\cdot \\vec{0}", right: "0" }
      ],

      // Conics (កោនិក)
      conics: [
        { id: 'con_1', left: "y^2 = 4px\\text{ (ប៉ារ៉ាបូល)}", right: "F(p, 0)" },
        { id: 'con_2', left: "x^2 = 4py\\text{ (ប៉ារ៉ាបូល)}", right: "F(0, p)" },
        { id: 'con_3', left: "D\\text{ (បន្ទាត់ប្រាប់ទិស }y^2=4px)", right: "x = -p" },
        { id: 'con_4', left: "D'\\text{ (បន្ទាត់ប្រាប់ទិស }x^2=4py)", right: "y = -p" },
        { id: 'con_5', left: "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1", right: "c^2 = a^2 - b^2" },
        { id: 'con_6', left: "e\\text{ (អេឡិចត្រីស៊ីតេអេលីប)}", right: "\\frac{c}{a} < 1" },
        { id: 'con_7', left: "\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1", right: "c^2 = a^2 + b^2" },
        { id: 'con_8', left: "y = \\pm \\frac{b}{a}x", right: "\\text{អាស៊ីមតូតអ៊ីពែបូល}" },
        { id: 'con_9', left: "e\\text{ (អ៊ីពែបូល)}", right: "\\frac{c}{a} > 1" },
        { id: 'con_10', left: "e\\text{ (ប៉ារ៉ាបូល)}", right: "1" },
        { id: 'con_11', left: "(x-h)^2 + (y-k)^2", right: "R^2" },
        { id: 'con_12', left: "\\text{ប្រវែងអ័ក្សធំអេលីប}", right: "2a" },
        { id: 'con_13', left: "\\text{ប្រវែងអ័ក្សតូចអេលីប}", right: "2b" },
        { id: 'con_14', left: "\\text{ប្រវែងចម្ងាយប្រសព្វកំបោល}", right: "2c" }
      ],

      // Probability (ប្រូបាប)
      probability: [
        { id: 'pr_1', left: "P(A \\cup B)", right: "P(A) + P(B) - P(A \\cap B)" },
        { id: 'pr_2', left: "P(\\bar{A})", right: "1 - P(A)" },
        { id: 'pr_3', left: "P(A \\mid B)", right: "\\frac{P(A \\cap B)}{P(B)}" },
        { id: 'pr_4', left: "P(A \\cap B)\\text{ (ឯករាជ្យ)}", right: "P(A) \\cdot P(B)" },
        { id: 'pr_5', left: "C(n, k)", right: "\\frac{n!}{k!(n-k)!}" },
        { id: 'pr_6', left: "P(n, k)", right: "\\frac{n!}{(n-k)!}" },
        { id: 'pr_7', left: "n!", right: "n(n-1)\\cdots 1" },
        { id: 'pr_8', left: "0!", right: "1" },
        { id: 'pr_9', left: "C(n, 2)", right: "\\frac{n(n-1)}{2}" },
        { id: 'pr_10', left: "C(n, 1)", right: "n" },
        { id: 'pr_11', left: "P(\\emptyset)", right: "0" },
        { id: 'pr_12', left: "E(X)\\text{ (គណិតសង្ឃឹម)}", right: "\\sum x_i P(X = x_i)" },
        { id: 'pr_13', left: "P(B_k \\mid A)\\text{ (បាយែស)}", right: "\\frac{P(B_k)P(A|B_k)}{\\sum P(B_i)P(A|B_i)}" },
        { id: 'pr_14', left: "E(X)\\text{ (ទ្វេធា }B(n,p))", right: "np" }
      ],

      // Statistics (ស្ថិតិ)
      statistics: [
        { id: 'st_1', left: "\\bar{x}\\text{ (មធ្យមនព្វន្ត)}", right: "\\frac{\\sum f_i x_i}{N}" },
        { id: 'st_2', left: "M_o", right: "\\text{តម្លៃដែលមានប្រេកង់ច្រើនបំផុត}" },
        { id: 'st_3', left: "V(X)\\text{ (វ៉ារ្យង់)}", right: "\\frac{\\sum f_i (x_i - \\bar{x})^2}{N}" },
        { id: 'st_4', left: "\\sigma\\text{ (គម្លាតស្តង់ដារ)}", right: "\\sqrt{V(X)}" },
        { id: 'st_5', left: "\\text{Cov}(X, Y)", right: "\\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{N}" },
        { id: 'st_6', left: "r\\text{ (មេគុណតម្រែតម្រង់)}", right: "\\frac{\\text{Cov}(X, Y)}{\\sigma_X \\cdot \\sigma_Y}" },
        { id: 'st_7', left: "y = ax + b\\text{ (បន្ទាត់តម្រែតម្រង់)}", right: "a = \\frac{\\text{Cov}(X,Y)}{\\sigma_X^2}" },
        { id: 'st_8', left: "b\\text{ (ចំណុចកាត់អ័ក្ស)}", right: "\\bar{y} - a\\bar{x}" },
        { id: 'st_9', left: "M_e", right: "\\text{មេដ្យាន (ពាក់កណ្តាលទិន្នន័យ)}" },
        { id: 'st_10', left: "Q_1", right: "\\text{ចតុតភាគទី ១ (២៥%)}" },
        { id: 'st_11', left: "Q_3", right: "\\text{ចតុតភាគទី ៣ (៧៥%)}" },
        { id: 'st_12', left: "IQR", right: "Q_3 - Q_1" }
      ],

      // Trigonometry (ត្រីកោណមាត្រ)
      trigonometry: [
        { id: 'tr_1', left: "\\sin^2(x) + \\cos^2(x)", right: "1" },
        { id: 'tr_2', left: "\\tan(x)", right: "\\frac{\\sin(x)}{\\cos(x)}" },
        { id: 'tr_3', left: "1 + \\tan^2(x)", right: "\\frac{1}{\\cos^2(x)}" },
        { id: 'tr_4', left: "\\sin(2x)", right: "2\\sin(x)\\cos(x)" },
        { id: 'tr_5', left: "\\cos(2x)", right: "\\cos^2(x) - \\sin^2(x)" },
        { id: 'tr_6', left: "\\cos(2x)\\text{ (ស៊ីនុស)}", right: "1 - 2\\sin^2(x)" },
        { id: 'tr_7', left: "\\cos(2x)\\text{ (កូស៊ីនុស)}", right: "2\\cos^2(x) - 1" },
        { id: 'tr_8', left: "\\tan(2x)", right: "\\frac{2\\tan(x)}{1 - \\tan^2(x)}" },
        { id: 'tr_9', left: "\\sin(a+b)", right: "\\sin a\\cos b + \\cos a\\sin b" },
        { id: 'tr_10', left: "\\cos(a+b)", right: "\\cos a\\cos b - \\sin a\\sin b" },
        { id: 'tr_11', left: "\\sin(a-b)", right: "\\sin a\\cos b - \\cos a\\sin b" },
        { id: 'tr_12', left: "\\cos(a-b)", right: "\\cos a\\cos b + \\sin a\\sin b" },
        { id: 'tr_13', left: "\\sin(\\frac{\\pi}{6})", right: "\\frac{1}{2}" },
        { id: 'tr_14', left: "\\cos(\\frac{\\pi}{4})", right: "\\frac{\\sqrt{2}}{2}" },
        { id: 'tr_15', left: "\\sin(\\frac{\\pi}{3})", right: "\\frac{\\sqrt{3}}{2}" },
        { id: 'tr_16', left: "\\tan(0)", right: "0" }
      ],

      // Grade 12 Fallback
      grade12_all: [
        { id: 'g12_all_1', left: "i^2", right: "-1" },
        { id: 'g12_all_2', left: "|a + bi|", right: "\\sqrt{a^2 + b^2}" },
        { id: 'g12_all_3', left: "z \\cdot \\bar{z}", right: "|z|^2" },
        { id: 'g12_all_4', left: "(x^n)'", right: "n x^{n-1}" },
        { id: 'g12_all_5', left: "(\\ln x)'", right: "\\frac{1}{x}" },
        { id: 'g12_all_6', left: "(e^x)'", right: "e^x" },
        { id: 'g12_all_7', left: "\\int x^n\\,dx", right: "\\frac{x^{n+1}}{n+1} + C" },
        { id: 'g12_all_8', left: "\\int e^x\\,dx", right: "e^x + C" },
        { id: 'g12_all_9', left: "\\lim_{x \\to 0} \\frac{\\sin x}{x}", right: "1" },
        { id: 'g12_all_10', left: "\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2}", right: "\\frac{1}{2}" },
        { id: 'g12_all_11', left: "y^2 = 4px", right: "F(p, 0)" },
        { id: 'g12_all_12', left: "P(A \\cup B)", right: "P(A) + P(B) - P(A \\cap B)" },
        { id: 'g12_all_13', left: "(\\cos\\theta + i\\sin\\theta)^n", right: "\\cos(n\\theta) + i\\sin(n\\theta)" },
        { id: 'g12_all_14', left: "\\int 2x\\,dx", right: "x^2 + C" }
      ]
    };

    // Fallback starter questions
    this.fallbackQuestions = [
      {
        g: "ថ្នាក់ទី ១០",
        l: "ត្រីកោណមាត្រ",
        p: "រូបមន្តគ្រឹះ",
        q: "តម្លៃនៃកន្សោមត្រីកោណមាត្រ $ \\sin^2(\\theta) + \\cos^2(\\theta) $ ស្មើនឹង៖",
        o: ["$ 0 $", "$ 1 $", "$ 2 $", "$ -1 $"],
        a: 1,
        e: "រូបមន្តគ្រឹះត្រីកោណមាត្រ $\\sin^2(\\theta) + \\cos^2(\\theta) = 1$ ចំពោះគ្រប់មុំ $\\theta$ ។"
      },
      {
        g: "ថ្នាក់ទី ១០",
        l: "ពិជគណិត",
        p: "សមីការដឺក្រេទី២",
        q: "ដោះស្រាយសមីការដឺក្រេទីពីរ $ x^2 - 9 = 0 $ គេបាន $ x $ ស្មើនឹង៖",
        o: ["$ x = 3 $", "$ x = -3 $", "$ x = \\pm 3 $", "$ x = 9 $"],
        a: 2,
        e: "$x^2 = 9 \\iff x = \\pm \\sqrt{9} = \\pm 3$"
      },
      {
        g: "ថ្នាក់ទី ១១",
        l: "លីមីត",
        p: "លីមីតត្រីកោណមាត្រ",
        q: "គណនាលីមីត $ \\lim_{x \\to 0} \\frac{\\sin(x)}{x} $ ស្មើនឹង៖",
        o: ["$ 0 $", "$ 1 $", "$ +\\infty $", "មិនកំណត់"],
        a: 1,
        e: "តាមទ្រឹស្តីបទលីមីតត្រីកោណមាត្រគ្រឹះ $\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$ ។"
      },
      {
        g: "ថ្នាក់ទី ១២",
        l: "ដេរីវេ",
        p: "ដេរីវេនៃអនុគមន៍ស្វ័យគុណ",
        q: "គណនាដេរីវេនៃអនុគមន៍ $ f(x) = x^3 $ គេបាន $ f'(x) $ ស្មើនឹង៖",
        o: ["$ 3x $", "$ 3x^2 $", "$ x^2 $", "$ 3x^3 $"],
        a: 1,
        e: "រូបមន្តដេរីវេ $(x^n)' = n x^{n-1} \\implies (x^3)' = 3x^2$ ។"
      },
      {
        g: "ថ្នាក់ទី ១២",
        l: "អាំងតេក្រាល",
        p: "អាំងតេក្រាលមិនកំណត់",
        q: "គណនាអាំងតេក្រាលមិនកំណត់ $ \\int 2x\\,dx $ ស្មើនឹង៖",
        o: ["$ x^2 + C $", "$ 2x^2 + C $", "$ x + C $", "$ 2 + C $"],
        a: 0,
        e: "$\\int 2x\\,dx = 2 \\cdot \\frac{x^2}{2} + C = x^2 + C$"
      }
    ];
  }

  /* ================== QUESTIONS FILTER CONTROLLER ================== */
  getFilteredQuestions() {
    if (!window.MATH_DATABASE || !window.MATH_DATABASE.questions || window.MATH_DATABASE.questions.length === 0) {
      return this.fallbackQuestions;
    }
    let list = window.MATH_DATABASE.questions;
    if (this.selectedGrade && this.selectedGrade !== 'all') {
      list = list.filter(q => q.g === this.selectedGrade || (q.gradeLabel && q.gradeLabel.includes(this.selectedGrade)));
    }
    if (this.selectedLesson && this.selectedLesson !== 'all') {
      if (this.selectedLesson.startsWith('chapter:')) {
        const chId = this.selectedLesson.replace('chapter:', '');
        list = list.filter(q => q.chId === chId || q.ch === chId);
      } else {
        list = list.filter(q => q.lesId === this.selectedLesson || q.l === this.selectedLesson);
      }
    }
    return list.length > 0 ? list : this.fallbackQuestions;
  }

  getLessonDisplayName(lesVal) {
    if (!lesVal || lesVal === 'all') return 'គ្រប់ជំពូក និងមេរៀនទាំងអស់';
    if (lesVal.startsWith('chapter:')) {
      const chId = lesVal.replace('chapter:', '');
      if (window.MATH_DATABASE && window.MATH_DATABASE.courses) {
        for (const c of window.MATH_DATABASE.courses) {
          for (const ch of c.chapters) {
            if (ch.id === chId) return `ជំពូកទាំងមូល ៖ ${ch.title}`;
          }
        }
      }
      return lesVal;
    }
    if (window.MATH_DATABASE && window.MATH_DATABASE.courses) {
      for (const c of window.MATH_DATABASE.courses) {
        for (const ch of c.chapters) {
          for (const les of ch.lessons) {
            if (les.id === lesVal || les.title === lesVal) {
              return `[${ch.title}] ➔ ${les.title}`;
            }
          }
        }
      }
    }
    return lesVal;
  }

  onFilterChanged() {
    this.updateActiveTopicLabels();
    this.updateQuestionCountBadge();

    // 1. If currently in Formula Match
    if (this.activeMode === 'match') {
      const gameView = document.getElementById('matchGameView');
      if (gameView && !gameView.classList.contains('hidden')) {
        this.startMatchGame();
      }
    }

    // 2. If currently in Planet Defender
    if (this.activeMode === 'defender') {
      const gameView = document.getElementById('defenderGameView');
      if (gameView && !gameView.classList.contains('hidden')) {
        this.nextDefenderWave();
      }
    }

    // 3. If currently in Speed Blitz
    if (this.activeMode === 'blitz') {
      const gameView = document.getElementById('blitzGameView');
      if (gameView && !gameView.classList.contains('hidden')) {
        this.nextBlitzQuestion();
      }
    }

    // 4. If currently in Math Battle
    if (this.activeMode === 'battle') {
      const gameView = document.getElementById('battleGameView');
      if (gameView && !gameView.classList.contains('hidden')) {
        this.nextBattleQuestion();
      }
    }

    // 5. If currently in Millionaire
    if (this.activeMode === 'millionaire') {
      const gameView = document.getElementById('millionaireGameView');
      if (gameView && !gameView.classList.contains('hidden')) {
        this.loadMillionaireQuestion();
      }
    }
  }

  updateLessonDropdown() {
    const lessonSelect = document.getElementById('filterGameLesson');
    if (!lessonSelect) return;

    if (!window.MATH_DATABASE || !window.MATH_DATABASE.chaptersByGrade) {
      lessonSelect.innerHTML = `<option value="all">📚 គ្រប់ជំពូក និងមេរៀនទាំងអស់</option>`;
      return;
    }

    let optionsHtml = `<option value="all">📚 គ្រប់ជំពូក និងមេរៀនទាំងអស់</option>`;

    if (this.selectedGrade === 'all') {
      Object.entries(window.MATH_DATABASE.chaptersByGrade).forEach(([gradeName, chapters]) => {
        chapters.forEach(ch => {
          const streamBadge = ch.stream ? ` (${ch.stream})` : '';
          optionsHtml += `<optgroup label="${gradeName} ➔ ${ch.title}${streamBadge}">`;
          optionsHtml += `<option value="chapter:${ch.id}">📖 ជំពូកទាំងមូល ៖ ${ch.title}</option>`;
          ch.lessons.forEach(les => {
            const countText = les.questionCount ? ` (${les.questionCount} សំណួរ)` : '';
            optionsHtml += `<option value="${les.id}">[${ch.title}] ➔ ${les.title}${countText}</option>`;
          });
          optionsHtml += `</optgroup>`;
        });
      });
    } else {
      const chapters = window.MATH_DATABASE.chaptersByGrade[this.selectedGrade] || [];
      chapters.forEach(ch => {
        const streamBadge = ch.stream ? ` (${ch.stream})` : '';
        optionsHtml += `<optgroup label="${ch.title}${streamBadge}">`;
        optionsHtml += `<option value="chapter:${ch.id}">📖 ជំពូកទាំងមូល ៖ ${ch.title}</option>`;
        ch.lessons.forEach(les => {
          const countText = les.questionCount ? ` (${les.questionCount} សំណួរ)` : '';
          optionsHtml += `<option value="${les.id}">[${ch.title}] ➔ ${les.title}${countText}</option>`;
        });
        optionsHtml += `</optgroup>`;
      });
    }

    lessonSelect.innerHTML = optionsHtml;
    this.selectedLesson = 'all';
    this.updateQuestionCountBadge();
    this.updateActiveTopicLabels();
  }

  updateActiveTopicLabels() {
    const gText = this.selectedGrade === 'all' ? 'គ្រប់កម្រិតថ្នាក់ (៧ ដល់ ១២)' : this.selectedGrade;
    const lText = this.getLessonDisplayName(this.selectedLesson);

    const lbl = document.getElementById('defenderActiveTopicLabel');
    if (lbl) {
      lbl.textContent = `${gText} • ${lText}`;
    }
    const sub = document.getElementById('defenderGameLessonSub');
    if (sub) {
      sub.textContent = `${gText} • ${lText}`;
    }
    const matchBadge = document.getElementById('matchGradeBadge');
    if (matchBadge) {
      matchBadge.textContent = `${this.selectedGrade === 'all' ? 'គ្រប់ថ្នាក់' : this.selectedGrade} • ${lText}`;
    }
  }

  updateQuestionCountBadge() {
    const badge = document.getElementById('filterQuestionCountBadge');
    if (badge) {
      const questions = this.getFilteredQuestions();
      badge.textContent = `🎯 មាន ${questions.length} សំណួរ`;
    }
  }

  /* ================== LATEX & AUDIO HELPERS ================== */
  /* ================== LATEX & AUDIO HELPERS ================== */
  cleanLatexFormula(formula) {
    if (!formula) return '';
    let f = formula.replace(/^\$+|\$+$/g, '').trim();

    // 1. Repair unescaped control characters from JS literals
    f = f.replace(/\x08ar/g, '\\bar');
    f = f.replace(/\x08egin/g, '\\begin');
    f = f.replace(/[\t\x09]ext/g, '\\text');
    f = f.replace(/[\t\x09]heta/g, '\\theta');
    f = f.replace(/[\t\x09]imes/g, '\\times');
    f = f.replace(/[\t\x09]an/g, '\\tan');
    f = f.replace(/[\t\x09]o([\s\$]|$)/g, '\\to$1');
    f = f.replace(/[\t\x09]riangle/g, '\\triangle');
    f = f.replace(/\x0crac/g, '\\frac');
    f = f.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // 2. Eliminate stray control codes and fix malformed text macros
    f = f.replace(/\\t\\text/g, '\\text');
    f = f.replace(/\\t(?=ext)/g, '\\');
    f = f.replace(/\\text\s*\(([^)]+)\)/g, '\\text{($1)}');
    f = f.replace(/(^|[^\\])ext\{/g, '$1\\text{');
    f = f.replace(/(^|[^\\])ext\(/g, '$1\\text{(');
    f = f.replace(/\\t(?![a-zA-Z])/g, ' ');

    // 3. Repair missing backslashes on standard LaTeX math macros
    const macros = [
      'dots', 'cdots', 'text', 'begin', 'end', 'pmatrix', 'cdot', 'sqrt', 'overline',
      'theta', 'cos', 'sin', 'tan', 'cot', 'lim', 'frac', 'dfrac', 'int',
      'sum', 'infty', 'vec', 'times', 'pm', 'Delta', 'det', 'arg', 'pi'
    ];
    macros.forEach(m => {
      const reg = new RegExp('(^|[^\\\\a-zA-Z])' + m + '(?![a-zA-Z])', 'g');
      f = f.replace(reg, '$1\\' + m);
    });

    f = f.replace(/(^|[^\\])\bbar([\{a-zA-Z])/g, '$1\\bar$2');

    // 4. Strictly convert any stray Euler expressions into standard MoEYS trigonometric form
    f = f.replace(/r\s*e\^\{i\s*\\?theta\}/g, 'r(\\cos\\theta + i\\sin\\theta)');
    f = f.replace(/e\^\{i\s*\\?theta\}/g, '\\cos\\theta + i\\sin\\theta');
    f = f.replace(/r\s*e\^\{iheta\}/g, 'r(\\cos\\theta + i\\sin\\theta)');
    f = f.replace(/e\^\{iheta\}/g, '\\cos\\theta + i\\sin\\theta');

    return f;
  }

  formatMath(text) {
    if (!text) return '';
    if (typeof katex === 'undefined') return text;

    // Render explicit $...$
    if (text.includes('$')) {
      return text.replace(/\$([^\$]+)\$/g, (match, formula) => {
        try {
          const clean = this.cleanLatexFormula(formula);
          return katex.renderToString(clean, { throwOnError: false, displayMode: false });
        } catch (e) {
          return formula;
        }
      });
    }

    // Auto-detect math formulas or LaTeX commands without $
    const hasMathMacro = /\\(frac|lim|sqrt|sin|cos|tan|log|ln|int|pm|times|div|le|ge|neq|alpha|beta|theta|pi|infty|vec|sum|to|bar|cdot|overline|Delta)/.test(text);
    if (hasMathMacro || /^[0-9a-zA-Z\s\+\-\*\/\^\(\)\=\,\.\_\<\>\|\\]+$/.test(text)) {
      try {
        const clean = this.cleanLatexFormula(text);
        return katex.renderToString(clean, { throwOnError: false, displayMode: false });
      } catch (e) {}
    }

    return text;
  }

  renderLatex(formula, displayMode = false) {
    if (!formula) return '';
    let trimmed = formula.trim();

    // 1. Pure Khmer text without LaTeX math symbols
    if (/^[\u1780-\u17FF\s0-9\(\)\,\.\+\-\=\:\/\%\–\—\?]+$/.test(trimmed) && !/[\\\$_\^\{\}]/.test(trimmed)) {
      return `<span class="khmer-card-text font-battambang font-bold text-sm md:text-base leading-snug">${trimmed}</span>`;
    }

    // 2. If formula contains \text{Khmer label}
    const textLabelMatch = trimmed.match(/^(.*?)\\text\{([^\}]+)\}(.*?)$/);
    if (textLabelMatch) {
      const mathPrefix = (textLabelMatch[1] || '').trim();
      const khmerLabel = (textLabelMatch[2] || '').trim();
      const mathSuffix = (textLabelMatch[3] || '').trim();
      const mathCombined = (mathPrefix + ' ' + mathSuffix).trim();

      let renderedMath = '';
      if (mathCombined && typeof katex !== 'undefined') {
        try {
          const clean = this.cleanLatexFormula(mathCombined);
          renderedMath = katex.renderToString(clean, { throwOnError: false, displayMode: false });
        } catch (e) {
          renderedMath = mathCombined;
        }
      }

      if (renderedMath && khmerLabel) {
        return `<div class="flex flex-col items-center justify-center gap-1 leading-snug">
                  <span class="text-base md:text-lg font-bold">${renderedMath}</span>
                  <span class="text-[11px] md:text-xs text-purple-700 dark:text-purple-300 font-battambang font-medium">${khmerLabel}</span>
                </div>`;
      } else if (khmerLabel) {
        return `<span class="khmer-card-text font-battambang font-bold text-sm md:text-base">${khmerLabel}</span>`;
      }
    }

    // 3. Render pure LaTeX math with KaTeX
    if (typeof katex === 'undefined') return formula;
    const cleanFormula = this.cleanLatexFormula(formula);
    try {
      return katex.renderToString(cleanFormula, { throwOnError: false, displayMode: displayMode });
    } catch (e) {
      return cleanFormula;
    }
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15) {
    try {
      this.initAudio();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }

  playCorrectSound() {
    this.playTone(523.25, 'triangle', 0.1);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.15), 100);
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25), 200);
  }

  playWrongSound() {
    this.playTone(220, 'sawtooth', 0.2);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.3), 150);
  }

  playVictoryFanfare() {
    const melody = [523, 659, 784, 1046, 784, 1046];
    melody.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.2), idx * 120);
    });
    if (typeof confetti === 'function') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    }
  }

  /* ================== NAVIGATION & GAME SWITCHER ================== */
  switchGameMode(mode) {
    this.clearAllTimers();

    document.querySelectorAll('.game-mode-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.game-tab-btn').forEach(btn => {
      btn.classList.remove('bg-purple-600', 'text-white', 'shadow');
      btn.classList.add('text-slate-700', 'dark:text-slate-300');
    });

    const activeBtn = document.getElementById(`tabBtn-${mode}`);
    if (activeBtn) {
      activeBtn.classList.add('bg-purple-600', 'text-white', 'shadow');
      activeBtn.classList.remove('text-slate-700', 'dark:text-slate-300');
    }

    const panel = document.getElementById(`panel-${mode}`);
    if (panel) panel.classList.remove('hidden');

    // Standard behavior: show Start screen for selected game
    if (mode === 'blitz') this.showBlitzStart();
    else if (mode === 'match') this.showMatchStart();
    else if (mode === 'battle') this.showBattleStart();
    else if (mode === 'millionaire') this.showMillionaireStart();
    else if (mode === 'defender') this.showDefenderStart();
  }

  clearAllTimers() {
    clearInterval(this.blitzTimer);
    clearInterval(this.matchTimer);
    clearInterval(this.battleTimer);
    clearInterval(this.millionaireTimer);
    clearInterval(this.defenderTimer);
  }

  /* ================== GAME 1: MATH SPEED BLITZ ================== */
  showBlitzStart() {
    clearInterval(this.blitzTimer);
    this.blitzPaused = false;
    const startView = document.getElementById('blitzStartView');
    const gameView = document.getElementById('blitzGameView');
    if (startView) startView.classList.remove('hidden');
    if (gameView) gameView.classList.add('hidden');
  }

  initBlitzControls() {
    document.querySelectorAll('.blitz-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.blitz-time-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'border-purple-500', 'text-white', 'active-blitz-time-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        btn.classList.add('bg-purple-600', 'border-purple-500', 'text-white', 'active-blitz-time-btn');

        const sec = parseInt(btn.dataset.seconds, 10);
        this.blitzDuration = sec;
        const input = document.getElementById('blitzCustomTimeInput');
        if (input) input.value = sec;
        const badge = document.getElementById('blitzSelectedTimeBadge');
        if (badge) badge.textContent = sec >= 60 ? `${sec / 60} នាទី (${sec} វិនាទី)` : `${sec} វិនាទី`;
      });
    });

    const input = document.getElementById('blitzCustomTimeInput');
    if (input) {
      input.addEventListener('input', (e) => {
        let sec = parseInt(e.target.value, 10);
        if (isNaN(sec) || sec < 5) sec = 5;
        if (sec > 300) sec = 300;
        this.blitzDuration = sec;

        document.querySelectorAll('.blitz-time-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'border-purple-500', 'text-white', 'active-blitz-time-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });

        const badge = document.getElementById('blitzSelectedTimeBadge');
        if (badge) badge.textContent = sec >= 60 ? `${Math.floor(sec/60)} នាទី ${sec%60 > 0 ? (sec%60)+' វិ.' : ''}` : `${sec} វិនាទី`;
      });
    }
  }

  toggleBlitzPause() {
    this.blitzPaused = !this.blitzPaused;
    const btn = document.getElementById('btnPauseBlitz');
    if (this.blitzPaused) {
      if (btn) btn.innerHTML = `<i class="fa-solid fa-play"></i> <span>បន្ត</span>`;
    } else {
      if (btn) btn.innerHTML = `<i class="fa-solid fa-pause"></i> <span>ផ្អាក</span>`;
    }
  }

  startBlitzGame() {
    const input = document.getElementById('blitzCustomTimeInput');
    if (input && input.value) {
      const parsed = parseInt(input.value, 10);
      if (!isNaN(parsed) && parsed >= 5) this.blitzDuration = parsed;
    }
    const startView = document.getElementById('blitzStartView');
    const gameView = document.getElementById('blitzGameView');
    if (startView) startView.classList.add('hidden');
    if (gameView) gameView.classList.remove('hidden');

    this.blitzScore = 0;
    this.blitzStreak = 0;
    this.blitzPaused = false;
    this.updateBlitzUI();
    this.nextBlitzQuestion();
  }

  nextBlitzQuestion() {
    clearInterval(this.blitzTimer);
    this.blitzTimeLeft = this.blitzDuration;
    this.blitzPaused = false;
    const pauseBtn = document.getElementById('btnPauseBlitz');
    if (pauseBtn) pauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i> <span>ផ្អាក</span>`;

    const feedbackBox = document.getElementById('blitzFeedbackBox');
    if (feedbackBox) feedbackBox.classList.add('hidden');

    const pool = this.getFilteredQuestions();
    const randomIndex = Math.floor(Math.random() * pool.length);
    this.currentBlitzQ = pool[randomIndex];

    const questionEl = document.getElementById('blitzQuestionText');
    const topicEl = document.getElementById('blitzTopic');
    const gradeEl = document.getElementById('blitzGrade');
    const optionsContainer = document.getElementById('blitzOptionsContainer');
    const timerBar = document.getElementById('blitzTimerBar');
    const timeDisplay = document.getElementById('blitzTimerText');

    if (questionEl) questionEl.innerHTML = this.formatMath(this.currentBlitzQ.q);
    if (topicEl) topicEl.textContent = (this.currentBlitzQ.ch ? this.currentBlitzQ.ch + ' ➔ ' : '') + this.currentBlitzQ.l;
    if (gradeEl) gradeEl.textContent = this.currentBlitzQ.g;
    if (timeDisplay) timeDisplay.textContent = `${this.blitzTimeLeft}s`;
    if (timerBar) {
      timerBar.style.width = '100%';
      timerBar.className = 'h-full bg-purple-600 rounded-full transition-all duration-1000';
    }

    if (optionsContainer) {
      optionsContainer.innerHTML = this.currentBlitzQ.o.map((opt, idx) => `
        <button class="blitz-opt-btn w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-700 font-bold text-base md:text-xl text-slate-800 dark:text-white transition transform active:scale-95 shadow-sm text-center flex items-center justify-center gap-3" data-idx="${idx}">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-extrabold shrink-0">${String.fromCharCode(65 + idx)}</span>
          <span class="katex-content flex-1 text-center">${this.formatMath(opt)}</span>
        </button>
      `).join('');

      document.querySelectorAll('.blitz-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.idx, 10);
          this.handleBlitzAnswer(selected, btn);
        });
      });
    }

    this.blitzTimer = setInterval(() => {
      if (this.blitzPaused) return;

      this.blitzTimeLeft--;
      if (timeDisplay) timeDisplay.textContent = `${this.blitzTimeLeft}s`;
      if (timerBar) {
        const pct = (this.blitzTimeLeft / this.blitzDuration) * 100;
        timerBar.style.width = `${Math.max(0, pct)}%`;
        timerBar.className = pct < 30 ? "h-full bg-red-500 rounded-full transition-all duration-1000" : "h-full bg-purple-600 rounded-full transition-all duration-1000";
      }

      if (this.blitzTimeLeft <= 0) {
        clearInterval(this.blitzTimer);
        this.playWrongSound();
        this.blitzStreak = 0;
        this.updateBlitzUI();
        this.showBlitzFeedback(false, `អស់ពេលហើយ! ចម្លើយត្រឹមត្រូវគឺ៖ ${this.formatMath(this.currentBlitzQ.o[this.currentBlitzQ.a])}`);
      }
    }, 1000);
  }

  handleBlitzAnswer(selectedIdx, clickedBtn) {
    clearInterval(this.blitzTimer);
    const isCorrect = selectedIdx === this.currentBlitzQ.a;
    document.querySelectorAll('.blitz-opt-btn').forEach(btn => btn.disabled = true);

    if (isCorrect) {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-green-100', 'border-green-500', 'text-green-800');
      this.playCorrectSound();
      this.blitzScore += 10 + (this.blitzStreak * 2);
      this.blitzStreak++;
      if (this.blitzStreak >= 3 && typeof confetti === 'function') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
      this.updateBlitzUI();
      setTimeout(() => this.nextBlitzQuestion(), 1000);
    } else {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
      this.playWrongSound();
      this.blitzStreak = 0;
      this.updateBlitzUI();
      this.showBlitzFeedback(false, `មិនត្រឹមត្រូវទេ! ចម្លើយត្រឹមត្រូវគឺ៖ ${this.formatMath(this.currentBlitzQ.o[this.currentBlitzQ.a])}`);
    }
  }

  showBlitzFeedback(correct, msg) {
    const feedbackBox = document.getElementById('blitzFeedbackBox');
    if (!feedbackBox) return;
    feedbackBox.innerHTML = `
      <div class="p-5 rounded-2xl ${correct ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 border-2 border-red-200 dark:border-red-800'} border text-center font-bold text-sm shadow-sm">
        ${correct ? `
          <div class="w-16 h-16 mx-auto mb-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-4xl shadow-sm animate-bounce">
            🥳
          </div>
          <p class="text-xs text-emerald-600 dark:text-emerald-300 mb-1 font-bold">អស្ចារ្យណាស់! ឆ្លើយត្រឹមត្រូវ!</p>
        ` : `
          <div class="w-16 h-16 mx-auto mb-2 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center text-4xl shadow-sm animate-bounce">
            😭
          </div>
          <p class="text-xs text-red-600 dark:text-red-400 mb-1 font-bold">អូយ! ពិបាកចិត្តណាស់... ឆ្លើយខុសហើយ!</p>
        `}
        <div class="mt-2 text-slate-800 dark:text-slate-200">${msg}</div>
        <button id="btnBlitzNext" class="mt-3 block mx-auto px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition">
          សំណួរបន្ទាប់ ➔
        </button>
      </div>
    `;
    feedbackBox.classList.remove('hidden');
    document.getElementById('btnBlitzNext').addEventListener('click', () => {
      feedbackBox.classList.add('hidden');
      this.nextBlitzQuestion();
    });
  }

  updateBlitzUI() {
    const scoreEl = document.getElementById('blitzScoreText');
    const streakEl = document.getElementById('blitzStreakText');
    if (scoreEl) scoreEl.textContent = this.blitzScore;
    if (streakEl) streakEl.textContent = this.blitzStreak;
  }

  /* ================== GAME 2: FORMULA MEMORY MATCH ================== */
  showMatchStart() {
    clearInterval(this.matchTimer);
    const startView = document.getElementById('matchStartView');
    const gameView = document.getElementById('matchGameView');
    if (startView) startView.classList.remove('hidden');
    if (gameView) gameView.classList.add('hidden');
  }

  initMatchControls() {
    // Grid Size Preset buttons
    document.querySelectorAll('.match-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.match-size-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'border-purple-500', 'text-white', 'active-match-size-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        btn.classList.add('bg-purple-600', 'border-purple-500', 'text-white', 'active-match-size-btn');

        this.matchPairsCount = parseInt(btn.dataset.pairs, 10);
      });
    });

    // Timer challenge buttons
    document.querySelectorAll('.match-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.match-time-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'border-purple-500', 'text-white', 'active-match-time-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        btn.classList.add('bg-purple-600', 'border-purple-500', 'text-white', 'active-match-time-btn');

        this.matchDuration = parseInt(btn.dataset.time, 10);
      });
    });

    // Players count preset buttons (១នាក់, ២នាក់, ឬ ៤នាក់)
    document.querySelectorAll('.match-player-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.match-player-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'border-purple-500', 'text-white', 'active-match-player-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        btn.classList.add('bg-purple-600', 'border-purple-500', 'text-white', 'active-match-player-btn');

        this.matchPlayersCount = parseInt(btn.dataset.players, 10);
        const badge = document.getElementById('matchPlayersBadge');
        if (badge) {
          badge.textContent = this.matchPlayersCount === 1 ? '👤 ម្នាក់ឯង (Solo)' :
                              this.matchPlayersCount === 2 ? '⚔️ ២ នាក់ (1 vs 1)' : '🏆 ៤ នាក់ (4 Players)';
        }
      });
    });
  }

  getFormulaPackForCurrentGrade() {
    const les = this.selectedLesson || '';
    const grade = this.selectedGrade || 'all';

    // 1. Exact Lesson Matching (Strict Pedagogical Sequencing)
    if (les && les !== 'all') {
      const lesName = this.getLessonDisplayName(les);

      // Grade 7 Lessons:
      if (les === 'les-g7-01' || (lesName.includes('ចំនួនគត់') && !lesName.includes('រ៉ឺឡាទីប'))) {
        return [...this.formulaPacks.g7_integers];
      }
      if (les === 'les-g7-02' || lesName.includes('តួចែក') || lesName.includes('ពហុគុណ') || lesName.includes('PGCD')) {
        return [...this.formulaPacks.g7_factors_multiples];
      }
      if (les === 'les-g7-03' || lesName.includes('រ៉ឺឡាទីប')) {
        return [...this.formulaPacks.g7_relative_integers];
      }
      if (les === 'les-g7-04' || lesName.includes('ប្រភាគ')) {
        return [...this.formulaPacks.g7_fractions];
      }
      if (les === 'les-g7-06' || lesName.includes('ភាគរយ')) {
        return [...this.formulaPacks.g7_percentages];
      }
      if (lesName.includes('មុំ') || lesName.includes('បន្ទាត់') || lesName.includes('បរិមាត្រ') || lesName.includes('រង្វង់') || lesName.includes('ផ្ទៃក្រឡា')) {
        return [...this.formulaPacks.g7_geometry];
      }

      // Grade 8 Lessons:
      if (lesName.includes('ស្វ័យគុណ')) {
        return [...this.formulaPacks.g8_powers];
      }
      if (lesName.includes('ពីតាក័រ')) {
        return [...this.formulaPacks.g8_pythagoras];
      }

      // Grade 9 Lessons:
      if (lesName.includes('ឫស') || lesName.includes('រ៉ាឌីកាល់')) {
        return [...this.formulaPacks.g9_radicals];
      }
      if (lesName.includes('សមីការដឺក្រេទីពីរ')) {
        return [...this.formulaPacks.g9_quadratics];
      }
      if (lesName.includes('សូលីត')) {
        return [...this.formulaPacks.g9_solids];
      }

      // Grade 11 Lessons (Strict Sequence Order):
      // Lesson 1: ស្វ៊ីតចំនួនពិត (Real Sequences ONLY - strictly no arithmetic, no geometric)
      if (les === 'les-g11b-1-1' || (lesName.includes('ស្វ៊ីត') && (lesName.includes('ពិត') || lesName.includes('មេរៀនទី ១')))) {
        return [...this.formulaPacks.sequences_real];
      }
      // Lesson 2: ស្វ៊ីតនព្វន្ត (Arithmetic Sequences ONLY - strictly no geometric)
      if (les === 'les-g11b-1-2' || (lesName.includes('ស្វ៊ីត') && lesName.includes('នព្វន្ត'))) {
        return [...this.formulaPacks.sequences_arithmetic];
      }
      // Lesson 3: ស្វ៊ីតធរណីមាត្រ (Geometric Sequences ONLY)
      if (les === 'les-g11b-1-3' || (lesName.includes('ស្វ៊ីត') && lesName.includes('ធរណីមាត្រ'))) {
        return [...this.formulaPacks.sequences_geometric];
      }

      // Grade 12 Lessons:
      // Lesson 1: ចំនួនកុំផ្លិចទម្រង់ពីជគណិត (Algebraic Form ONLY - strictly algebraic MoEYS curriculum)
      if (les === 'les-g12a-1-1' || (lesName.includes('កុំផ្លិច') && lesName.includes('ពីជគណិត'))) {
        return [...this.formulaPacks.complex_algebraic];
      }
      // Lesson 2: ចំនួនកុំផ្លិចទម្រង់ត្រីកោណមាត្រ (Trigonometric Form ONLY - strictly MoEYS curriculum)
      if (les === 'les-g12a-1-2' || (lesName.includes('កុំផ្លិច') && lesName.includes('ត្រីកោណមាត្រ'))) {
        return [...this.formulaPacks.complex_trigonometric];
      }

      // Calculus Lessons
      if (lesName.includes('លីមីត')) {
        return [...this.formulaPacks.limits];
      }
      if (lesName.includes('ដេរីវេ')) {
        return [...this.formulaPacks.derivatives];
      }
      if (lesName.includes('អាំងតេក្រាល') || lesName.includes('ព្រីមីទីវ')) {
        return [...this.formulaPacks.integrals];
      }
      if (lesName.includes('វ៉ិចទ័រ')) {
        return [...this.formulaPacks.vectors];
      }
      if (lesName.includes('កោនិក') || lesName.includes('ប៉ារ៉ាបូល') || lesName.includes('អេលីប') || lesName.includes('អ៊ីពែបូល')) {
        return [...this.formulaPacks.conics];
      }
      if (lesName.includes('ម៉ាទ្រីស') || lesName.includes('ដេទែរមីណង់')) {
        return [...this.formulaPacks.matrices];
      }
      if (lesName.includes('ប្រូបាប') || lesName.includes('បន្សំ') || lesName.includes('ចម្រាស') || lesName.includes('បាយែស')) {
        return [...this.formulaPacks.probability];
      }
      if (lesName.includes('ស្ថិតិ')) {
        return [...this.formulaPacks.statistics];
      }
      if (lesName.includes('ត្រីកោណមាត្រ')) {
        return [...this.formulaPacks.trigonometry];
      }

      // Dynamic extraction strictly from this exact lesson's questions
      const filteredQ = this.getFilteredQuestions();
      if (filteredQ && filteredQ.length >= 6) {
        const dynPairs = [];
        const usedL = new Set();
        const usedR = new Set();
        for (const q of filteredQ) {
          let left = (q.q || '').replace(/^(គណនា|រក|ដោះស្រាយសមីការ|សម្រួល|ពង្រាយកន្សោម|តម្លៃនៃ|តាមនិយមន័យនៃ|បំប្លែង)\s*/g, '')
                                .replace(/(\s*ស្មើនឹង៖?|\s*គឺ\s*៖?|\s*៖?)$/g, '').trim();
          const right = (q.o && q.o[q.a]) ? q.o[q.a].trim() : '';
          // Strictly exclude any Euler formula references
          if (left.includes('e^{i') || right.includes('e^{i') || left.includes('Euler') || right.includes('Euler') || left.includes('អយល័រ')) continue;
          if (left && right && left.length <= 45 && right.length <= 35 && left !== right && !usedL.has(left) && !usedR.has(right)) {
            dynPairs.push({ id: `dyn_${dynPairs.length + 1}`, left, right });
            usedL.add(left);
            usedR.add(right);
            if (dynPairs.length >= 16) break;
          }
        }
        if (dynPairs.length >= 6) {
          return dynPairs;
        }
      }
    }

    // 2. Identify Topic by selected Chapter when chapter: is selected
    let topicText = '';
    if (les && les.startsWith('chapter:')) {
      topicText = this.getLessonDisplayName(les);
    }

    if (topicText.includes('កុំផ្លិច')) {
      return [...this.formulaPacks.complex_numbers];
    } else if (topicText.includes('លីមីត')) {
      return [...this.formulaPacks.limits];
    } else if (topicText.includes('ដេរីវេ')) {
      return [...this.formulaPacks.derivatives];
    } else if (topicText.includes('អាំងតេក្រាល') || topicText.includes('ព្រីមីទីវ')) {
      return [...this.formulaPacks.integrals];
    } else if (topicText.includes('វ៉ិចទ័រ')) {
      return [...this.formulaPacks.vectors];
    } else if (topicText.includes('កោនិក')) {
      return [...this.formulaPacks.conics];
    } else if (topicText.includes('ស្វ៊ីត')) {
      return [...this.formulaPacks.sequences];
    } else if (topicText.includes('ម៉ាទ្រីស')) {
      return [...this.formulaPacks.matrices];
    } else if (topicText.includes('ប្រូបាប')) {
      return [...this.formulaPacks.probability];
    } else if (topicText.includes('ស្ថិតិ')) {
      return [...this.formulaPacks.statistics];
    } else if (topicText.includes('ត្រីកោណមាត្រ')) {
      return [...this.formulaPacks.trigonometry];
    }

    // 3. Fallback STRICTLY matching selected Grade (NEVER cross-grade)
    if (grade === 'ថ្នាក់ទី ៧') {
      return [...this.formulaPacks.grade7_all];
    } else if (grade === 'ថ្នាក់ទី ៨') {
      return [...this.formulaPacks.grade8_all];
    } else if (grade === 'ថ្នាក់ទី ៩') {
      return [...this.formulaPacks.grade9_all];
    } else if (grade === 'ថ្នាក់ទី ១០') {
      return [...this.formulaPacks.grade10_all];
    } else if (grade === 'ថ្នាក់ទី ១១') {
      return [...this.formulaPacks.grade11_all];
    } else if (grade === 'ថ្នាក់ទី ១២') {
      return [...this.formulaPacks.grade12_all];
    }

    return [...this.formulaPacks.grade7_all];
  }

  showMatchPraise(customMsg = null) {
    const praiseMessages = [
      { text: "អស្ចារ្យណាស់! រកឃើញគូត្រឹមត្រូវឥតខ្ចោះ!", icon: "🌟" },
      { text: "ពូកែណាស់! ចងចាំរូបមន្តបានល្អឥតខ្ចោះ!", icon: "🎉" },
      { text: "ឆ្លាតវៃមែនទែន! +១ គូ!", icon: "💡" },
      { text: "ត្រឹមត្រូវឥតខ្ចោះ! ល្បឿនលឿនអស្ចារ្យ!", icon: "🎯" },
      { text: "សិស្សឆ្នើម! ចងចាំរូបមន្តបានយ៉ាងស្ទាត់!", icon: "🏆" },
      { text: "ពូកែណាស់! បន្តរក្សាភាពឈ្នះនេះទៀត!", icon: "👏" },
      { text: "អបអរសាទរ! គូត្រូវគ្មានទាស់!", icon: "⚡" },
      { text: "ពិតជាអស្ចារ្យ! កំពូលអ្នកចងចាំរូបមន្ត!", icon: "🔥" }
    ];

    const pick = praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
    const banner = document.getElementById('matchPraiseBanner');
    const textEl = document.getElementById('matchPraiseText');
    const iconEl = document.getElementById('matchPraiseIcon');

    if (!banner || !textEl || !iconEl) return;

    if (customMsg) {
      textEl.textContent = customMsg;
      iconEl.textContent = "🌟";
    } else {
      textEl.textContent = pick.text;
      iconEl.textContent = pick.icon;
    }

    // Trigger animation
    banner.classList.add('show-praise');
    banner.classList.remove('opacity-0', 'scale-50');

    if (typeof confetti === 'function') {
      confetti({ particleCount: 35, spread: 65, origin: { y: 0.28 } });
    }

    clearTimeout(this.praiseTimer);
    this.praiseTimer = setTimeout(() => {
      banner.classList.remove('show-praise');
      banner.classList.add('opacity-0', 'scale-50');
    }, 1350);
  }

  updateMatchMultiplayerUI() {
    const multiPanel = document.getElementById('matchMultiplayerPanel');
    const playersGrid = document.getElementById('matchPlayersGrid');
    const turnText = document.getElementById('matchCurrentTurnText');

    if (!multiPanel) return;

    if (this.matchPlayersCount <= 1) {
      multiPanel.classList.add('hidden');
      return;
    }

    multiPanel.classList.remove('hidden');

    const activeCfg = this.matchPlayerConfigs[this.matchActivePlayer];
    if (turnText) {
      turnText.innerHTML = `វេនរបស់អ្នកលេង៖ <span class="${activeCfg.text} font-black text-sm md:text-base">${activeCfg.icon} ${activeCfg.name}</span> <span class="text-xs text-slate-500 font-normal">(សូមជ្រើសកាត ២ សន្លឹក)</span>`;
    }

    if (playersGrid) {
      playersGrid.innerHTML = Array.from({ length: this.matchPlayersCount }).map((_, idx) => {
        const cfg = this.matchPlayerConfigs[idx];
        const isActive = idx === this.matchActivePlayer;
        const score = this.matchPlayerScores[idx] || 0;
        return `
          <div class="p-3 rounded-2xl border-2 transition-all duration-200 ${cfg.bg} ${isActive ? `${cfg.border} ring-4 ${cfg.ring} scale-105 shadow-md` : 'border-slate-200 dark:border-slate-700 opacity-70'}">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold ${cfg.text}">${cfg.icon} ${cfg.name}</span>
              ${isActive ? '<span class="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-black animate-pulse">កំពុងលេង</span>' : ''}
            </div>
            <div class="flex items-baseline justify-between">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">ផ្គូផ្គងបាន៖</span>
              <span class="text-lg md:text-xl font-black ${cfg.text}">${score} <span class="text-[11px] font-normal">គូ</span></span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  startMatchGame() {
    const startView = document.getElementById('matchStartView');
    const gameView = document.getElementById('matchGameView');
    if (startView) startView.classList.add('hidden');
    if (gameView) gameView.classList.remove('hidden');

    this.matchMoves = 0;
    this.matchMatchedCount = 0;
    this.matchActivePlayer = 0;
    this.matchPlayerScores = [0, 0, 0, 0];
    this.updateMatchStatsUI();
    this.initFormulaMatch();

    // Handle timer
    clearInterval(this.matchTimer);
    const timerContainer = document.getElementById('matchTimerContainer');
    const timerText = document.getElementById('matchTimerText');

    if (this.matchDuration > 0) {
      if (timerContainer) timerContainer.classList.remove('hidden');
      this.matchTimeLeft = this.matchDuration;
      if (timerText) timerText.textContent = `${this.matchTimeLeft}s`;

      this.matchTimer = setInterval(() => {
        this.matchTimeLeft--;
        if (timerText) timerText.textContent = `${this.matchTimeLeft}s`;

        if (this.matchTimeLeft <= 0) {
          clearInterval(this.matchTimer);
          this.playWrongSound();
          window.showStandardDialog({
            title: '😭 អូយ! អស់ពេលហើយ... ពិបាកចិត្តណាស់!',
            html: `
              <div class="py-2 text-center">
                <div class="w-20 h-20 mx-auto mb-3 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center text-5xl animate-bounce">
                  😭
                </div>
                <p class="text-xs text-slate-500 mb-2">ពេលវេលាកំណត់បានបញ្ចប់ហើយ!</p>
                <div class="text-sm font-bold text-slate-700 dark:text-slate-200">
                  ផ្គូផ្គងបាន៖ <strong class="text-purple-600">${this.matchMatchedCount}</strong> នៃ <strong>${this.matchPairsCount}</strong> គូ
                </div>
              </div>
            `,
            icon: 'error',
            confirmText: '🔄 សាកល្បងម្ដងទៀត',
            onConfirm: () => this.startMatchGame()
          });
        }
      }, 1000);
    } else {
      if (timerContainer) timerContainer.classList.add('hidden');
    }
  }

  updateMatchStatsUI() {
    const movesEl = document.getElementById('matchMovesText');
    const pairsEl = document.getElementById('matchPairsText');
    const badgeEl = document.getElementById('matchGradeBadge');

    if (movesEl) movesEl.textContent = this.matchMoves;
    if (pairsEl) pairsEl.textContent = `${this.matchMatchedCount}/${this.matchPairsCount}`;
    if (badgeEl) {
      badgeEl.textContent = this.selectedGrade === 'all' ? 'គ្រប់កម្រិតថ្នាក់' : this.selectedGrade;
    }
    this.updateMatchMultiplayerUI();
  }

  initFormulaMatch() {
    const container = document.getElementById('formulaMatchGrid');
    if (!container) return;

    const targetPairs = this.matchPairsCount || 8;
    const pack = this.getFormulaPackForCurrentGrade();
    pack.sort(() => Math.random() - 0.5);

    // Pick pairs ensuring 100% unique left and right values
    const selected = [];
    const usedLefts = new Set();
    const usedRights = new Set();

    for (const p of pack) {
      if (!usedLefts.has(p.left) && !usedRights.has(p.right)) {
        selected.push(p);
        usedLefts.add(p.left);
        usedRights.add(p.right);
        if (selected.length === targetPairs) break;
      }
    }

    // Strict Pedagogical Rule: Never cross-contaminate lessons or grades!
    // If pack has fewer pairs than targetPairs, clamp matchPairsCount strictly to available pairs
    this.matchPairsCount = selected.length;
    this.updateMatchStatsUI();

    let cards = [];
    selected.forEach(p => {
      cards.push({ id: p.id, latex: p.left, type: 'left', target: p.right });
      cards.push({ id: p.id, latex: p.right, type: 'right', target: p.left });
    });

    cards.sort(() => Math.random() - 0.5);

    container.innerHTML = cards.map((c, idx) => {
      const renderedLatex = this.renderLatex(c.latex, true);
      return `
        <div class="match-card group relative h-32 cursor-pointer rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-200 select-none overflow-hidden" 
             data-id="${c.id}" 
             data-type="${c.type}"
             data-val="${encodeURIComponent(c.latex)}" 
             data-target="${encodeURIComponent(c.target)}"
             data-idx="${idx}">
          <div class="card-front absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex flex-col items-center justify-center text-white transition-all">
            <span class="text-3xl font-extrabold filter drop-shadow">❓</span>
            <span class="text-[11px] font-bold text-purple-200 mt-1 uppercase tracking-wider font-battambang">រូបមន្ត</span>
          </div>
          <div class="card-back absolute inset-0 hidden bg-white dark:bg-slate-800 flex items-center justify-center p-3 text-center text-purple-950 dark:text-purple-100 font-extrabold text-base md:text-lg">
            <div class="latex-wrapper transform scale-110">${renderedLatex}</div>
          </div>
        </div>
      `;
    }).join('');

    let firstCard = null;
    let lockBoard = false;

    document.querySelectorAll('.match-card').forEach(card => {
      card.addEventListener('click', () => {
        if (lockBoard || card === firstCard || card.classList.contains('matched')) return;

        const front = card.querySelector('.card-front');
        const back = card.querySelector('.card-back');
        front.classList.add('hidden');
        back.classList.remove('hidden');
        card.classList.add('ring-4', 'ring-purple-400');
        this.playTone(440, 'sine', 0.08);

        if (!firstCard) {
          firstCard = card;
        } else {
          lockBoard = true;
          this.matchMoves++;
          this.updateMatchStatsUI();

          const isMatch = (firstCard.dataset.id === card.dataset.id) || 
                          (firstCard.dataset.target && firstCard.dataset.target === card.dataset.val) ||
                          (card.dataset.target && card.dataset.target === firstCard.dataset.val);

          if (isMatch) {
            this.playCorrectSound();
            [firstCard, card].forEach(c => {
              c.classList.remove('ring-4', 'ring-purple-400', 'border-purple-200', 'dark:border-purple-800');
              c.classList.add('matched', 'border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/60');
              c.querySelector('.card-back').classList.add('bg-emerald-50', 'dark:bg-emerald-950/60', 'text-emerald-800', 'dark:text-emerald-200');
            });

            firstCard = null;
            lockBoard = false;
            this.matchMatchedCount++;

            // Handle points and praise
            if (this.matchPlayersCount > 1) {
              this.matchPlayerScores[this.matchActivePlayer]++;
              const cfg = this.matchPlayerConfigs[this.matchActivePlayer];
              this.showMatchPraise(`🎉 ${cfg.name} រកឃើញគូត្រូវ! (+១ គូ) បានលេងបន្ត!`);
            } else {
              this.showMatchPraise();
            }

            this.updateMatchStatsUI();

            if (this.matchMatchedCount === this.matchPairsCount) {
              clearInterval(this.matchTimer);
              this.playVictoryFanfare();
              setTimeout(() => {
                if (this.matchPlayersCount > 1) {
                  // Multiplayer Podium & Winner celebration
                  let maxScore = -1;
                  let winners = [];
                  for (let i = 0; i < this.matchPlayersCount; i++) {
                    const score = this.matchPlayerScores[i] || 0;
                    if (score > maxScore) {
                      maxScore = score;
                      winners = [i];
                    } else if (score === maxScore) {
                      winners.push(i);
                    }
                  }

                  let resultTitle = '';
                  let winnerDesc = '';
                  if (winners.length === 1) {
                    const wCfg = this.matchPlayerConfigs[winners[0]];
                    resultTitle = `🏆 អបអរសាទរ! ${wCfg.name} ជាអ្នកឈ្នះ!`;
                    winnerDesc = `<p class="text-base font-black ${wCfg.text}">${wCfg.icon} ${wCfg.name} ឈ្នះដាច់គេ ដោយរកបាន ${maxScore} គូ!</p>`;
                  } else {
                    const wNames = winners.map(w => this.matchPlayerConfigs[w].name).join(' និង ');
                    resultTitle = `🤝 លទ្ធផលស្មើគ្នា! (${maxScore} គូស្មើគ្នា)`;
                    winnerDesc = `<p class="text-sm font-bold text-purple-600">ពូកែដូចគ្នា! ${wNames} រកបាន ${maxScore} គូស្មើគ្នា!</p>`;
                  }

                  const rankingHtml = Array.from({ length: this.matchPlayersCount }).map((_, idx) => {
                    const cfg = this.matchPlayerConfigs[idx];
                    const sc = this.matchPlayerScores[idx] || 0;
                    const isWin = winners.includes(idx);
                    return `
                      <div class="flex items-center justify-between p-2.5 rounded-xl ${isWin ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300' : 'bg-slate-50 dark:bg-slate-700/50'} text-xs font-bold">
                        <span class="flex items-center gap-2 ${cfg.text}">
                          <span>${isWin ? '🥇' : '🎖️'}</span>
                          <span>${cfg.name}</span>
                        </span>
                        <span class="font-black text-sm ${cfg.text}">${sc} គូ</span>
                      </div>
                    `;
                  }).join('');

                  window.showStandardDialog({
                    title: resultTitle,
                    html: `
                      <div class="py-2 text-center space-y-3">
                        <div class="text-5xl animate-bounce">🏆</div>
                        ${winnerDesc}
                        <div class="space-y-1.5 text-left max-w-xs mx-auto">
                          ${rankingHtml}
                        </div>
                        <p class="text-xs text-slate-500">ការប្រកួតពង្រឹងការចងចាំរូបមន្តគណិតវិទ្យា NGS យ៉ាងស្វិតស្វាញ ✨</p>
                      </div>
                    `,
                    icon: 'success',
                    confirmText: '🔄 ប្រកួតវគ្គថ្មី',
                    onConfirm: () => this.startMatchGame()
                  });
                } else {
                  // Solo Winner Dialog
                  window.showStandardDialog({
                    title: '🎉 អបអរសាទរ! ផ្គូផ្គងបានជោគជ័យ!',
                    html: `
                      <div class="py-2 text-center">
                        <div class="text-5xl mb-2">⭐⭐⭐</div>
                        <p class="text-sm font-bold text-emerald-700 dark:text-emerald-400">សិស្សានុសិស្សបានផ្គូផ្គងរូបមន្តគណិតវិទ្យាបានត្រឹមត្រូវទាំងអស់!</p>
                        <div class="my-3 p-3 rounded-2xl bg-purple-50 dark:bg-slate-700 text-xs text-purple-900 dark:text-purple-200 font-bold">
                          <div>ចំនួនបើកសរុប៖ <strong>${this.matchMoves}</strong> ដង</div>
                          ${this.matchDuration > 0 ? `<div>ពេលនៅសល់៖ <strong>${this.matchTimeLeft} វិ.</strong></div>` : ''}
                        </div>
                        <p class="text-xs text-slate-500">ស្ទាត់ជំនាញ និងយល់ដឹងច្បាស់លាស់ពីរូបមន្តគណិតវិទ្យា NGS ✨</p>
                      </div>
                    `,
                    icon: 'success',
                    confirmText: '🔄 លេងវគ្គថ្មី',
                    onConfirm: () => this.startMatchGame()
                  });
                }
              }, 400);
            }
          } else {
            // Mismatch: Cards shake/glow red, then turn passes to NEXT player if multiplayer!
            this.playWrongSound();
            [firstCard, card].forEach(c => c.classList.add('ring-4', 'ring-red-400'));
            setTimeout(() => {
              [firstCard, card].forEach(c => {
                c.classList.remove('ring-4', 'ring-red-400', 'ring-purple-400');
                c.querySelector('.card-front').classList.remove('hidden');
                c.querySelector('.card-back').classList.add('hidden');
              });
              firstCard = null;
              lockBoard = false;

              // Turn passes to next player if multiplayer
              if (this.matchPlayersCount > 1) {
                this.matchActivePlayer = (this.matchActivePlayer + 1) % this.matchPlayersCount;
                this.updateMatchStatsUI();
              }
            }, 900);
          }
        }
      });
    });
  }

  /* ================== GAME 3: TEAM BATTLE (RED VS BLUE) ================== */
  showBattleStart() {
    clearInterval(this.battleTimer);
    const startView = document.getElementById('battleStartView');
    const gameView = document.getElementById('battleGameView');
    if (startView) startView.classList.remove('hidden');
    if (gameView) gameView.classList.add('hidden');
  }

  initBattleControls() {
    // Target score presets
    document.querySelectorAll('.battle-target-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.battle-target-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'border-purple-500', 'text-white', 'active-battle-target-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        btn.classList.add('bg-purple-600', 'border-purple-500', 'text-white', 'active-battle-target-btn');

        this.battleTargetScore = parseInt(btn.dataset.target, 10);
      });
    });

    // Time per turn presets
    document.querySelectorAll('.battle-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.battle-time-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'border-purple-500', 'text-white', 'active-battle-time-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        btn.classList.add('bg-purple-600', 'border-purple-500', 'text-white', 'active-battle-time-btn');

        this.battleTurnDuration = parseInt(btn.dataset.seconds, 10);
      });
    });
  }

  startBattleGame() {
    const startView = document.getElementById('battleStartView');
    const gameView = document.getElementById('battleGameView');
    if (startView) startView.classList.add('hidden');
    if (gameView) gameView.classList.remove('hidden');

    this.teamAScore = 0;
    this.teamBScore = 0;
    this.activeTeam = 'A';

    const targetEl = document.getElementById('battleTargetDisplay');
    if (targetEl) targetEl.textContent = `${this.battleTargetScore} ពិន្ទុ`;

    this.updateBattleUI();
    this.nextBattleQuestion();
  }

  updateBattleUI() {
    const aScore = document.getElementById('battleScoreTeamA');
    const bScore = document.getElementById('battleScoreTeamB');
    const turnEl = document.getElementById('battleActiveTurn');
    const boxA = document.getElementById('battleTeamABox');
    const boxB = document.getElementById('battleTeamBBox');

    if (aScore) aScore.textContent = this.teamAScore;
    if (bScore) bScore.textContent = this.teamBScore;

    if (turnEl) {
      turnEl.innerHTML = this.activeTeam === 'A' ? 
        `<span class="px-4 py-1.5 rounded-full bg-red-100 text-red-700 font-bold text-xs shadow-sm ring-2 ring-red-400 animate-pulse">វេនក្រុមទី ១ (ក្រុមក្រហម) 🔴</span>` :
        `<span class="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs shadow-sm ring-2 ring-blue-400 animate-pulse">វេនក្រុមទី ២ (ក្រុមខៀវ) 🔵</span>`;
    }

    if (boxA && boxB) {
      if (this.activeTeam === 'A') {
        boxA.classList.add('ring-4', 'ring-red-400', 'scale-105');
        boxB.classList.remove('ring-4', 'ring-blue-400', 'scale-105');
      } else {
        boxB.classList.add('ring-4', 'ring-blue-400', 'scale-105');
        boxA.classList.remove('ring-4', 'ring-red-400', 'scale-105');
      }
    }
  }

  nextBattleQuestion() {
    clearInterval(this.battleTimer);
    const pool = this.getFilteredQuestions();
    const randomIndex = Math.floor(Math.random() * pool.length);
    const q = pool[randomIndex];
    this.currentBattleQ = q;

    const qEl = document.getElementById('battleQuestionText');
    const optContainer = document.getElementById('battleOptionsContainer');

    if (qEl) {
      const infoEl = document.getElementById('battleQuestionInfo');
      if (infoEl) infoEl.textContent = `${q.g} • ${q.ch ? q.ch + ' ➔ ' : ''}${q.l}`;
      qEl.innerHTML = this.formatMath(q.q);
    }

    // Setup turn timer
    const timerWrapper = document.getElementById('battleTimerWrapper');
    const timerText = document.getElementById('battleTimerText');
    const timerBar = document.getElementById('battleTimerBar');

    if (this.battleTurnDuration > 0) {
      if (timerWrapper) timerWrapper.classList.remove('hidden');
      this.battleTimeLeft = this.battleTurnDuration;
      if (timerText) timerText.textContent = `${this.battleTimeLeft}s`;
      if (timerBar) {
        timerBar.style.width = '100%';
        timerBar.className = this.activeTeam === 'A' ? 'h-full bg-red-500 rounded-full transition-all duration-1000' : 'h-full bg-blue-500 rounded-full transition-all duration-1000';
      }

      this.battleTimer = setInterval(() => {
        this.battleTimeLeft--;
        if (timerText) timerText.textContent = `${this.battleTimeLeft}s`;
        if (timerBar) {
          const pct = (this.battleTimeLeft / this.battleTurnDuration) * 100;
          timerBar.style.width = `${Math.max(0, pct)}%`;
        }

        if (this.battleTimeLeft <= 0) {
          clearInterval(this.battleTimer);
          this.handleBattleTimeout();
        }
      }, 1000);
    } else {
      if (timerWrapper) timerWrapper.classList.add('hidden');
    }

    if (optContainer) {
      optContainer.innerHTML = q.o.map((opt, idx) => `
        <button class="battle-opt-btn w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 font-bold text-base md:text-xl text-slate-800 dark:text-white transition shadow-sm text-center flex items-center justify-center gap-3" data-idx="${idx}">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-extrabold shrink-0">${String.fromCharCode(65 + idx)}</span>
          <span class="flex-1 text-center">${this.formatMath(opt)}</span>
        </button>
      `).join('');

      document.querySelectorAll('.battle-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.idx, 10);
          this.handleBattleAnswer(selected, btn);
        });
      });
    }
  }

  handleBattleAnswer(selectedIdx, clickedBtn) {
    clearInterval(this.battleTimer);
    document.querySelectorAll('.battle-opt-btn').forEach(btn => btn.disabled = true);

    const isCorrect = selectedIdx === this.currentBattleQ.a;
    const currentTeamName = this.activeTeam === 'A' ? 'ក្រុមទី ១ (ក្រុមក្រហម 🔴)' : 'ក្រុមទី ២ (ក្រុមខៀវ 🔵)';
    const nextTeamName = this.activeTeam === 'A' ? 'ក្រុមទី ២ (ក្រុមខៀវ 🔵)' : 'ក្រុមទី ១ (ក្រុមក្រហម 🔴)';

    if (isCorrect) {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-800');
      this.playCorrectSound();

      if (this.activeTeam === 'A') this.teamAScore += 10;
      else this.teamBScore += 10;

      if (typeof confetti === 'function') confetti({ particleCount: 70, spread: 80 });
      this.updateBattleUI();

      // Check for winning score
      const currentScore = this.activeTeam === 'A' ? this.teamAScore : this.teamBScore;
      if (currentScore >= this.battleTargetScore) {
        this.playVictoryFanfare();
        setTimeout(() => {
          window.showStandardDialog({
            title: '🏆 អបអរសាទរជើងឯក!',
            html: `
              <div class="py-2 text-center">
                <div class="text-6xl mb-2 animate-bounce">🏆</div>
                <h3 class="text-lg font-black ${this.activeTeam === 'A' ? 'text-red-600' : 'text-blue-600'} mb-2">
                  ${currentTeamName} បានទទួលជ័យជម្នះ!
                </h3>
                <p class="text-xs text-slate-500 mb-3">បានសម្រេចពិន្ទុគោលដៅ ${this.battleTargetScore} ពិន្ទុមុនគេ!</p>
                <div class="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-700 text-xs font-bold">
                  <div>ក្រុមក្រហម៖ <strong class="text-red-600 text-sm">${this.teamAScore}</strong> ពិន្ទុ</div>
                  <div>ក្រុមខៀវ៖ <strong class="text-blue-600 text-sm">${this.teamBScore}</strong> ពិន្ទុ</div>
                </div>
              </div>
            `,
            icon: 'success',
            confirmText: '🔄 ប្រកួតឡើងវិញ',
            onConfirm: () => this.startBattleGame()
          });
        }, 500);
        return;
      }

      this.activeTeam = this.activeTeam === 'A' ? 'B' : 'A';
      this.updateBattleUI();
      setTimeout(() => this.nextBattleQuestion(), 1100);
    } else {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
      this.playWrongSound();

      // Highlight correct option
      document.querySelectorAll('.battle-opt-btn').forEach(b => {
        if (parseInt(b.dataset.idx, 10) === this.currentBattleQ.a) {
          b.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-800');
        }
      });

      const correctText = this.formatMath(this.currentBattleQ.o[this.currentBattleQ.a]);
      const expText = this.currentBattleQ.e ? this.formatMath(this.currentBattleQ.e) : '';

      setTimeout(() => {
        window.showStandardDialog({
          title: '😭 អូយ! ឆ្លើយខុសហើយ... ពិបាកចិត្តណាស់!',
          html: `
            <div class="py-2 text-center">
              <div class="w-20 h-20 mx-auto mb-2 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center text-5xl animate-bounce">
                😭
              </div>
              <h4 class="text-sm font-bold text-red-600 mb-1">${currentTeamName} ឆ្លើយមិនត្រឹមត្រូវទេ!</h4>
              <div class="p-3 my-2 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-left">
                <div>✅ ចម្លើយត្រឹមត្រូវគឺ៖ <strong class="text-emerald-600 text-sm">${correctText}</strong></div>
                ${expText ? `<div class="mt-1.5 pt-1.5 border-t border-red-200/60 text-slate-600 dark:text-slate-300 text-[11px]">${expText}</div>` : ''}
              </div>
              <p class="text-xs text-purple-600 font-bold mt-2">វេនបន្ទាប់៖ ${nextTeamName}</p>
            </div>
          `,
          icon: 'error',
          confirmText: '👉 បន្តទៅវេនបន្ទាប់',
          onConfirm: () => {
            this.activeTeam = this.activeTeam === 'A' ? 'B' : 'A';
            this.updateBattleUI();
            this.nextBattleQuestion();
          }
        });
      }, 500);
    }
  }

  handleBattleTimeout() {
    this.playWrongSound();
    const currentTeamName = this.activeTeam === 'A' ? 'ក្រុមទី ១ (ក្រុមក្រហម 🔴)' : 'ក្រុមទី ២ (ក្រុមខៀវ 🔵)';
    const nextTeamName = this.activeTeam === 'A' ? 'ក្រុមទី ២ (ក្រុមខៀវ 🔵)' : 'ក្រុមទី ១ (ក្រុមក្រហម 🔴)';
    const correctText = this.formatMath(this.currentBattleQ.o[this.currentBattleQ.a]);

    window.showStandardDialog({
      title: '😭 អូយ! អស់ពេលហើយ... ពិបាកចិត្តណាស់!',
      html: `
        <div class="py-2 text-center">
          <div class="w-20 h-20 mx-auto mb-2 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center text-5xl animate-bounce">
            😭
          </div>
          <h4 class="text-sm font-bold text-red-600 mb-1">${currentTeamName} បានអស់ពេលហើយ!</h4>
          <p class="text-xs text-slate-500 mb-2">ចម្លើយត្រឹមត្រូវគឺ៖ <strong class="text-emerald-600">${correctText}</strong></p>
          <p class="text-xs text-purple-600 font-bold">វេនបន្ទាប់៖ ${nextTeamName}</p>
        </div>
      `,
      icon: 'error',
      confirmText: '👉 ផ្ទេរវេនទៅក្រុមបន្ទាប់',
      onConfirm: () => {
        this.activeTeam = this.activeTeam === 'A' ? 'B' : 'A';
        this.updateBattleUI();
        this.nextBattleQuestion();
      }
    });
  }

  /* ================== GAME 4: MATH MILLIONAIRE (សេដ្ឋីគណិតវិទ្យា) ================== */
  showMillionaireStart() {
    clearInterval(this.millionaireTimer);
    const startView = document.getElementById('millionaireStartView');
    const gameView = document.getElementById('millionaireGameView');
    if (startView) startView.classList.remove('hidden');
    if (gameView) gameView.classList.add('hidden');
  }

  initMillionaireControls() {
    document.querySelectorAll('.millionaire-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.millionaire-time-btn').forEach(b => {
          b.classList.remove('bg-amber-500', 'border-amber-400', 'text-slate-950', 'active-millionaire-time-btn');
          b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        btn.classList.add('bg-amber-500', 'border-amber-400', 'text-slate-950', 'active-millionaire-time-btn');

        this.millionaireDuration = parseInt(btn.dataset.seconds, 10);
      });
    });
  }

  startMillionaireGame() {
    const startView = document.getElementById('millionaireStartView');
    const gameView = document.getElementById('millionaireGameView');
    if (startView) startView.classList.add('hidden');
    if (gameView) gameView.classList.remove('hidden');

    this.millionaireLevel = 1;
    this.lifeline5050Used = false;
    this.lifelineStudentUsed = false;
    this.lifelineHintUsed = false;
    this.renderMillionaireLadder();
    this.resetMillionaireLifelines();
    this.nextMillionaireQuestion();
  }

  renderMillionaireLadder() {
    const ladderContainer = document.getElementById('millionaireLadder');
    if (!ladderContainer) return;

    const levels = [
      { lvl: 10, pts: "១០ ពិន្ទុ (ជើងឯក 🏆)" },
      { lvl: 9, pts: "៩ ពិន្ទុ" },
      { lvl: 8, pts: "៨ ពិន្ទុ" },
      { lvl: 7, pts: "៧ ពិន្ទុ" },
      { lvl: 6, pts: "៦ ពិន្ទុ" },
      { lvl: 5, pts: "៥ ពិន្ទុ (សុវត្ថិភាព 🛡️)" },
      { lvl: 4, pts: "៤ ពិន្ទុ" },
      { lvl: 3, pts: "៣ ពិន្ទុ" },
      { lvl: 2, pts: "២ ពិន្ទុ" },
      { lvl: 1, pts: "១ ពិន្ទុ" }
    ];

    ladderContainer.innerHTML = levels.map(item => `
      <div id="millionaire-step-${item.lvl}" class="p-2 rounded-xl text-xs font-bold flex items-center justify-between border transition ${
        this.millionaireLevel === item.lvl ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-md scale-105' :
        this.millionaireLevel > item.lvl ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300' :
        'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
      }">
        <span>កម្រិត ${item.lvl}</span>
        <span>${item.pts}</span>
      </div>
    `).join('');
  }

  resetMillionaireLifelines() {
    const btn5050 = document.getElementById('btnLife5050');
    const btnStudent = document.getElementById('btnLifeStudent');
    const btnHint = document.getElementById('btnLifeHint');

    if (btn5050) { btn5050.disabled = false; btn5050.classList.remove('opacity-40', 'line-through'); }
    if (btnStudent) { btnStudent.disabled = false; btnStudent.classList.remove('opacity-40', 'line-through'); }
    if (btnHint) { btnHint.disabled = false; btnHint.classList.remove('opacity-40', 'line-through'); }
  }

  nextMillionaireQuestion() {
    const pool = this.getFilteredQuestions();
    const randomIndex = Math.floor(Math.random() * pool.length);
    this.currentMillionaireQ = pool[randomIndex];

    this.renderMillionaireLadder();

    const qEl = document.getElementById('millionaireQuestionText');
    const optContainer = document.getElementById('millionaireOptionsContainer');
    const lvlText = document.getElementById('millionaireCurrentLvlText');

    if (lvlText) lvlText.textContent = `សំណួរទី ${this.millionaireLevel} (ប្រជែងយក ${this.millionaireLevel} ពិន្ទុ)`;
    if (qEl) {
      const infoEl = document.getElementById('millionaireQuestionInfo');
      if (infoEl) infoEl.textContent = `${this.currentMillionaireQ.g} • ${this.currentMillionaireQ.ch ? this.currentMillionaireQ.ch + ' ➔ ' : ''}${this.currentMillionaireQ.l}`;
      qEl.innerHTML = this.formatMath(this.currentMillionaireQ.q);
    }

    if (optContainer) {
      optContainer.innerHTML = this.currentMillionaireQ.o.map((opt, idx) => `
        <button class="millionaire-opt-btn w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 font-bold text-base md:text-xl text-slate-800 dark:text-white transition shadow-sm text-center flex items-center justify-center gap-3" data-idx="${idx}">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-sm font-extrabold shrink-0">${String.fromCharCode(65 + idx)}</span>
          <span class="katex-content flex-1 text-center">${this.formatMath(opt)}</span>
        </button>
      `).join('');

      document.querySelectorAll('.millionaire-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.idx, 10);
          this.handleMillionaireAnswer(selected, btn);
        });
      });
    }
  }

  handleMillionaireAnswer(selectedIdx, clickedBtn) {
    document.querySelectorAll('.millionaire-opt-btn').forEach(btn => btn.disabled = true);
    const isCorrect = selectedIdx === this.currentMillionaireQ.a;

    if (isCorrect) {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-800');
      this.playCorrectSound();

      if (this.millionaireLevel === 10) {
        this.playVictoryFanfare();
        setTimeout(() => {
          window.showStandardDialog({
            title: '🏆 អស្ចារ្យណាស់!',
            html: `
              <div class="py-2 text-center">
                <div class="text-6xl mb-2 animate-bounce">🥇</div>
                <p class="text-base font-extrabold text-amber-600 dark:text-amber-400">អ្នកបានឆ្លើយត្រូវគ្រប់ ១០ សំណួរ!</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">ក្លាយជាជើងឯកគណិតវិទ្យា NGS ថ្នាក់ជាតិ 🥇</p>
              </div>
            `,
            icon: 'success',
            confirmText: '🎉 អស្ចារ្យ! លេងម្ដងទៀត',
            onConfirm: () => this.startMillionaireGame()
          });
        }, 500);
      } else {
        this.millionaireLevel++;
        setTimeout(() => this.nextMillionaireQuestion(), 1100);
      }
    } else {
      clickedBtn.classList.remove('bg-white', 'border-slate-200');
      clickedBtn.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
      this.playWrongSound();
      const finalPts = this.millionaireLevel >= 5 ? 5 : 0;
      setTimeout(() => {
        window.showStandardDialog({
          title: '😭 អូយ! ពិបាកចិត្តណាស់... ឆ្លើយខុសហើយ!',
          html: `
            <div class="py-2 text-center">
              <div class="w-24 h-24 mx-auto mb-3 bg-red-50 dark:bg-red-950/50 rounded-full border-2 border-red-200 dark:border-red-800 flex items-center justify-center shadow-inner relative animate-bounce">
                <span class="text-6xl">😭</span>
                <span class="absolute -bottom-1 -right-1 text-2xl">💔</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-2">កុំទាន់អស់សង្ឃឹម សាកល្បងម្ដងទៀតណា៎!</p>
              <div class="p-3.5 my-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 text-left">
                <span class="font-bold">ចម្លើយត្រឹមត្រូវគឺ៖</span> ${this.formatMath(this.currentMillionaireQ.o[this.currentMillionaireQ.a])}
              </div>
              <div class="text-center font-bold text-sm text-slate-700 dark:text-slate-200 mt-2">
                ពិន្ទុដែលទទួលបាន៖ <span class="text-purple-600 font-extrabold text-xl">${finalPts}</span> ពិន្ទុ ${finalPts === 5 ? '(កម្រិតសុវត្ថិភាព 🛡️)' : ''}
              </div>
            </div>
          `,
          icon: 'error',
          confirmText: '🔄 សាកល្បងម្ដងទៀត',
          onConfirm: () => this.startMillionaireGame()
        });
      }, 700);
    }
  }

  walkAwayMillionaire() {
    const currentPts = this.millionaireLevel - 1;
    window.showStandardDialog({
      title: '🚪 ឈប់លេង និងយកពិន្ទុបច្ចុប្បន្ន?',
      html: `
        <div class="py-2 text-center">
          <p class="text-xs text-slate-500 mb-2">លោកគ្រូ/សិស្សានុសិស្សជ្រើសរើសរក្សាទុកពិន្ទុបច្ចុប្បន្ន៖</p>
          <div class="text-2xl font-black text-amber-500 my-2">${currentPts} ពិន្ទុ</div>
          <p class="text-[11px] text-slate-400">ពិន្ទុនេះនឹងត្រូវបានកត់ត្រាទុកយ៉ាងមានសុវត្ថិភាព!</p>
        </div>
      `,
      icon: 'question',
      showCancel: true,
      cancelText: 'បន្តប្រជែងទៀត',
      confirmText: 'យកពិន្ទុ និងបញ្ចប់',
      onConfirm: () => {
        window.showToast(`✅ បានបញ្ចប់ការប្រកួតជាមួយ ${currentPts} ពិន្ទុ!`);
        this.showMillionaireStart();
      }
    });
  }

  useLifeline5050() {
    if (this.lifeline5050Used || !this.currentMillionaireQ) return;
    this.lifeline5050Used = true;
    const btn = document.getElementById('btnLife5050');
    if (btn) { btn.disabled = true; btn.classList.add('opacity-40', 'line-through'); }

    const correctIdx = this.currentMillionaireQ.a;
    const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIdx);
    wrongIndices.sort(() => Math.random() - 0.5);
    const toRemove = wrongIndices.slice(0, 2);

    document.querySelectorAll('.millionaire-opt-btn').forEach(b => {
      const idx = parseInt(b.dataset.idx, 10);
      if (toRemove.includes(idx)) {
        b.style.visibility = 'hidden';
      }
    });
    this.playTone(350, 'sine', 0.1);
  }

  useLifelineStudent() {
    if (this.lifelineStudentUsed) return;
    this.lifelineStudentUsed = true;
    const btn = document.getElementById('btnLifeStudent');
    if (btn) { btn.disabled = true; btn.classList.add('opacity-40', 'line-through'); }

    const students = (window.appStore && window.appStore.data && window.appStore.data.students) || [];
    const studentName = students.length > 0 ? students[Math.floor(Math.random() * students.length)].name : 'មិត្តរួមថ្នាក់';

    this.playTone(600, 'triangle', 0.2);
    window.showStandardDialog({
      title: '👥 ជំនួយពីមិត្តរួមថ្នាក់',
      html: `
        <div class="py-3 text-center">
          <p class="text-xs text-slate-500 mb-2 font-medium">សិស្សដែលត្រូវបានជ្រើសរើសឱ្យជួយឆ្លើយគឺ៖</p>
          <div class="inline-block px-5 py-2.5 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 font-extrabold text-xl shadow-sm">
            👨‍🎓 ${studentName}
          </div>
        </div>
      `,
      icon: 'info',
      confirmText: 'យល់ព្រម'
    });
  }

  useLifelineHint() {
    if (this.lifelineHintUsed || !this.currentMillionaireQ) return;
    this.lifelineHintUsed = true;
    const btn = document.getElementById('btnLifeHint');
    if (btn) { btn.disabled = true; btn.classList.add('opacity-40', 'line-through'); }

    const exp = this.currentMillionaireQ.e || "សូមពិនិត្យមើលរូបមន្តគន្លឹះនៃមេរៀននេះ!";
    this.playTone(550, 'sine', 0.15);
    window.showStandardDialog({
      title: '💡 គន្លឹះដោះស្រាយ & រូបមន្ត',
      html: `
        <div class="py-2 text-left">
          <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            ${this.formatMath(exp)}
          </div>
        </div>
      `,
      icon: 'info',
      confirmText: 'យល់ព្រម'
    });
  }

  /* ================== GAME 5: SPACE MATH DEFENDER (បាញ់កម្ទេចអាចម៍ផ្កាយ) ================== */
  showDefenderStart() {
    clearInterval(this.defenderTimer);
    this.defenderPaused = false;
    const startView = document.getElementById('defenderStartView');
    const gameView = document.getElementById('defenderGameView');
    if (startView) startView.classList.remove('hidden');
    if (gameView) gameView.classList.add('hidden');
    this.updateActiveTopicLabels();
  }

  initDefenderControls() {
    // Time preset buttons
    document.querySelectorAll('.defender-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.defender-time-btn').forEach(b => {
          b.classList.remove('bg-amber-500', 'border-amber-400', 'text-slate-950', 'active-defender-time-btn');
          b.classList.add('bg-indigo-900/60', 'border-indigo-700', 'text-indigo-200');
        });
        btn.classList.remove('bg-indigo-900/60', 'border-indigo-700', 'text-indigo-200');
        btn.classList.add('bg-amber-500', 'border-amber-400', 'text-slate-950', 'active-defender-time-btn');

        const sec = parseInt(btn.dataset.seconds, 10);
        this.defenderDuration = sec;
        const input = document.getElementById('defenderCustomTimeInput');
        if (input) input.value = sec;
        const badge = document.getElementById('defenderSelectedTimeBadge');
        if (badge) {
          if (sec >= 60) {
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            badge.textContent = `${m} នាទី ${s > 0 ? s + ' វិនាទី' : ''}`;
          } else {
            badge.textContent = `${sec} វិនាទី`;
          }
        }
      });
    });

    // Custom time input
    const input = document.getElementById('defenderCustomTimeInput');
    if (input) {
      input.addEventListener('input', (e) => {
        let sec = parseInt(e.target.value, 10);
        if (isNaN(sec) || sec < 5) sec = 5;
        if (sec > 600) sec = 600;
        this.defenderDuration = sec;

        document.querySelectorAll('.defender-time-btn').forEach(b => {
          b.classList.remove('bg-amber-500', 'border-amber-400', 'text-slate-950', 'active-defender-time-btn');
          b.classList.add('bg-indigo-900/60', 'border-indigo-700', 'text-indigo-200');
        });

        const badge = document.getElementById('defenderSelectedTimeBadge');
        if (badge) {
          if (sec >= 60) {
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            badge.textContent = `${m} នាទី ${s > 0 ? s + ' វិនាទី' : ''}`;
          } else {
            badge.textContent = `${sec} វិនាទី`;
          }
        }
      });
    }

    // Lives buttons
    document.querySelectorAll('.defender-lives-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.defender-lives-btn').forEach(b => {
          b.classList.remove('bg-red-600', 'border-red-400', 'text-white', 'active-defender-lives-btn');
          b.classList.add('bg-indigo-900/60', 'border-indigo-700', 'text-indigo-200');
        });
        btn.classList.remove('bg-indigo-900/60', 'border-indigo-700', 'text-indigo-200');
        btn.classList.add('bg-red-600', 'border-red-400', 'text-white', 'active-defender-lives-btn');

        this.defenderCustomLives = parseInt(btn.dataset.lives, 10);
      });
    });

    this.updateActiveTopicLabels();
  }



  toggleDefenderPause() {
    this.defenderPaused = !this.defenderPaused;
    const overlay = document.getElementById('defenderPauseOverlay');
    const btn = document.getElementById('btnPauseDefender');

    if (this.defenderPaused) {
      if (overlay) overlay.classList.remove('hidden');
      if (btn) btn.innerHTML = `<i class="fa-solid fa-play"></i> <span>បន្ត</span>`;
    } else {
      if (overlay) overlay.classList.add('hidden');
      if (btn) btn.innerHTML = `<i class="fa-solid fa-pause"></i> <span>ផ្អាក</span>`;
    }
  }

  startDefenderGame() {
    const input = document.getElementById('defenderCustomTimeInput');
    if (input && input.value) {
      const parsed = parseInt(input.value, 10);
      if (!isNaN(parsed) && parsed >= 5) this.defenderDuration = parsed;
    }

    const startView = document.getElementById('defenderStartView');
    const gameView = document.getElementById('defenderGameView');
    if (startView) startView.classList.add('hidden');
    if (gameView) gameView.classList.remove('hidden');

    this.defenderScore = 0;
    this.defenderLives = this.defenderCustomLives;
    this.defenderPaused = false;
    const overlay = document.getElementById('defenderPauseOverlay');
    if (overlay) overlay.classList.add('hidden');
    const pauseBtn = document.getElementById('btnPauseDefender');
    if (pauseBtn) pauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i> <span>ផ្អាក</span>`;

    const sub = document.getElementById('defenderGameLessonSub');
    if (sub) {
      const gText = this.selectedGrade === 'all' ? 'គ្រប់ថ្នាក់' : this.selectedGrade;
      const lText = this.selectedLesson === 'all' ? 'គ្រប់មេរៀន' : this.selectedLesson;
      sub.textContent = `${gText} • ${lText}`;
    }

    this.updateDefenderUI();
    this.nextDefenderWave();
  }

  updateDefenderUI() {
    const scoreEl = document.getElementById('defenderScoreText');
    const livesEl = document.getElementById('defenderLivesText');
    if (scoreEl) scoreEl.textContent = this.defenderScore;
    if (livesEl) {
      if (this.defenderLives >= 900) {
        livesEl.textContent = '🛡️ សេរី';
      } else {
        livesEl.textContent = '❤️'.repeat(Math.max(0, this.defenderLives));
      }
    }
  }

  updateDefenderTimerDisplay() {
    const totalMs = this.defenderDuration * 1000;
    const remainMs = Math.max(0, this.defenderTimeRemainingMs);
    const secRemain = Math.ceil(remainMs / 1000);

    const timeTextEl = document.getElementById('defenderTimeLeftText');
    if (timeTextEl) {
      if (secRemain >= 60) {
        const m = Math.floor(secRemain / 60);
        const s = secRemain % 60;
        timeTextEl.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
      } else {
        timeTextEl.textContent = `${secRemain}s`;
      }

      if (secRemain <= 5) {
        timeTextEl.className = "font-mono text-xl font-black text-red-400 animate-pulse";
      } else if (secRemain <= 10) {
        timeTextEl.className = "font-mono text-xl font-black text-amber-400";
      } else {
        timeTextEl.className = "font-mono text-xl font-black text-emerald-400";
      }
    }

    const timerBar = document.getElementById('defenderTimerProgress');
    if (timerBar) {
      const pct = (remainMs / totalMs) * 100;
      timerBar.style.width = `${pct}%`;
      if (pct < 20) {
        timerBar.className = "h-full bg-red-500 rounded-full transition-all duration-100";
      } else if (pct < 50) {
        timerBar.className = "h-full bg-amber-400 rounded-full transition-all duration-100";
      } else {
        timerBar.className = "h-full bg-emerald-400 rounded-full transition-all duration-100";
      }
    }
  }

  nextDefenderWave() {
    clearInterval(this.defenderTimer);
    this.defenderPaused = false;
    const overlay = document.getElementById('defenderPauseOverlay');
    if (overlay) overlay.classList.add('hidden');
    const pauseBtn = document.getElementById('btnPauseDefender');
    if (pauseBtn) pauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i> <span>ផ្អាក</span>`;

    const pool = this.getFilteredQuestions();
    this.currentDefenderQ = pool[Math.floor(Math.random() * pool.length)];

    const meteorEl = document.getElementById('defenderMeteor');
    const qTextEl = document.getElementById('defenderQuestionContent');
    const optionsGrid = document.getElementById('defenderOptionsGrid');

    if (qTextEl) {
      const metaHtml = `<div class="text-[11px] font-bold text-amber-200 mb-1 opacity-90">${this.currentDefenderQ.ch ? this.currentDefenderQ.ch + ' ➔ ' : ''}${this.currentDefenderQ.l}</div>`;
      qTextEl.innerHTML = metaHtml + this.formatMath(this.currentDefenderQ.q);
    }

    this.defenderTimeRemainingMs = this.defenderDuration * 1000;
    if (meteorEl) {
      meteorEl.style.top = '8%';
      meteorEl.classList.remove('opacity-0', 'scale-0');
    }

    this.updateDefenderTimerDisplay();

    if (optionsGrid) {
      optionsGrid.innerHTML = this.currentDefenderQ.o.map((opt, idx) => `
        <button class="defender-opt-btn p-4 rounded-2xl bg-indigo-900/80 hover:bg-purple-600 border-2 border-indigo-500 text-white font-bold text-base md:text-xl transition shadow-lg flex items-center justify-center gap-2 transform active:scale-95" data-idx="${idx}">
          <span class="w-8 h-8 rounded-xl bg-purple-500/50 text-white font-extrabold flex items-center justify-center text-sm shrink-0">${String.fromCharCode(65 + idx)}</span>
          <span class="flex-1 text-center">${this.formatMath(opt)}</span>
        </button>
      `).join('');

      document.querySelectorAll('.defender-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.idx, 10);
          this.handleDefenderShot(selected);
        });
      });
    }

    this.runDefenderTimer();
  }

  runDefenderTimer() {
    clearInterval(this.defenderTimer);
    const totalMs = this.defenderDuration * 1000;
    const meteorEl = document.getElementById('defenderMeteor');

    this.defenderTimer = setInterval(() => {
      if (this.defenderPaused) return;

      this.defenderTimeRemainingMs -= 100;
      if (this.defenderTimeRemainingMs < 0) this.defenderTimeRemainingMs = 0;

      const elapsedRatio = 1 - (this.defenderTimeRemainingMs / totalMs);
      if (meteorEl) {
        meteorEl.style.top = `${8 + (elapsedRatio * 68)}%`;
      }

      this.updateDefenderTimerDisplay();

      if (this.defenderTimeRemainingMs <= 0) {
        clearInterval(this.defenderTimer);
        this.handleDefenderTimeout();
      }
    }, 100);
  }

  handleDefenderTimeout() {
    this.playWrongSound();
    if (this.defenderLives < 900) {
      this.defenderLives--;
    }
    this.updateDefenderUI();

    const isGameOver = this.defenderLives <= 0;
    const correctText = this.currentDefenderQ ? this.formatMath(this.currentDefenderQ.o[this.currentDefenderQ.a]) : '';
    const expText = this.currentDefenderQ && this.currentDefenderQ.e ? this.formatMath(this.currentDefenderQ.e) : '';

    window.showStandardDialog({
      title: isGameOver ? '💥 ហ្គេមចប់ហើយ! ពិបាកចិត្តណាស់...' : '😭 អូយ! អស់ពេលហើយ... ពិបាកចិត្តណាស់!',
      html: `
        <div class="py-2 text-center">
          <div class="w-24 h-24 mx-auto mb-3 bg-red-50 dark:bg-red-950/50 rounded-full border-2 border-red-300 dark:border-red-800 flex items-center justify-center shadow-inner relative animate-bounce">
            <span class="text-6xl">😭</span>
            <span class="absolute -bottom-1 -right-1 text-2xl">💔</span>
          </div>
          <h4 class="text-base font-extrabold text-red-600 dark:text-red-400 mb-1">
            ${isGameOver ? 'អាចម៍ផ្កាយបានធ្លាក់មកដល់ដី! ខែលការពារអស់ហើយ!' : 'អាចម៍ផ្កាយធ្លាក់ដល់ដី! បាត់បង់ ១ ជីវិត'}
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
            ${isGameOver ? 'កុំទាន់អស់សង្ឃឹម សាកល្បងម្ដងទៀតណា៎!' : (this.defenderLives >= 900 ? 'របៀបហ្វឹកហាត់សេរី' : `នៅសល់ខែលការពារ៖ ${'❤️'.repeat(Math.max(0, this.defenderLives))}`)}
          </p>

          <div class="p-3.5 my-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200 text-left">
            <div class="font-bold mb-1">✅ ចម្លើយត្រឹមត្រូវគឺ៖ <span class="text-sm font-extrabold text-emerald-600">${correctText}</span></div>
            ${expText ? `<div class="mt-1.5 pt-1.5 border-t border-red-200/60 dark:border-red-800/60 text-[11px] text-slate-600 dark:text-slate-300">${expText}</div>` : ''}
          </div>

          <div class="text-center font-bold text-sm text-slate-700 dark:text-slate-200">
            ${isGameOver ? `ពិន្ទុសរុប៖ <span class="text-amber-500 font-black text-xl">${this.defenderScore}</span> ពិន្ទុ` : `ពិន្ទុបច្ចុប្បន្ន៖ <span class="text-purple-600 font-black">${this.defenderScore}</span>`}
          </div>
        </div>
      `,
      icon: 'error',
      confirmText: isGameOver ? '🔄 ចាប់ផ្ដើមលេងម្ដងទៀត' : '👉 បន្តសំណួរបន្ទាប់',
      onConfirm: () => {
        if (isGameOver) {
          this.startDefenderGame();
        } else {
          this.nextDefenderWave();
        }
      }
    });
  }

  handleDefenderShot(selectedIdx) {
    clearInterval(this.defenderTimer);
    const isCorrect = selectedIdx === this.currentDefenderQ.a;

    if (isCorrect) {
      this.playTone(880, 'square', 0.1);
      setTimeout(() => this.playTone(1200, 'square', 0.2), 80);
      this.defenderScore += 15;
      this.updateDefenderUI();

      const meteorEl = document.getElementById('defenderMeteor');
      if (meteorEl) {
        meteorEl.classList.add('scale-0', 'opacity-0');
      }

      if (typeof confetti === 'function') {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.4 } });
      }

      setTimeout(() => this.nextDefenderWave(), 800);
    } else {
      this.playWrongSound();
      if (this.defenderLives < 900) {
        this.defenderLives--;
      }
      this.updateDefenderUI();

      const isGameOver = this.defenderLives <= 0;
      const correctText = this.currentDefenderQ ? this.formatMath(this.currentDefenderQ.o[this.currentDefenderQ.a]) : '';
      const expText = this.currentDefenderQ && this.currentDefenderQ.e ? this.formatMath(this.currentDefenderQ.e) : '';

      window.showStandardDialog({
        title: isGameOver ? '💥 ហ្គេមចប់ហើយ! ពិបាកចិត្តណាស់...' : '😭 អូយ! ឆ្លើយខុសហើយ... ពិបាកចិត្តណាស់!',
        html: `
          <div class="py-2 text-center">
            <div class="w-24 h-24 mx-auto mb-3 bg-red-50 dark:bg-red-950/50 rounded-full border-2 border-red-300 dark:border-red-800 flex items-center justify-center shadow-inner relative animate-bounce">
              <span class="text-6xl">😭</span>
              <span class="absolute -bottom-1 -right-1 text-2xl">💔</span>
            </div>
            
            <h4 class="text-base font-extrabold text-red-600 dark:text-red-400 mb-1">
              ${isGameOver ? 'បាញ់ខុស! ខែលការពារត្រូវបានកម្ទេចអស់ហើយ!' : 'ឆ្លើយខុសហើយ! បាត់បង់ ១ ជីវិត'}
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
              ${isGameOver ? 'កុំទាន់អស់សង្ឃឹម សាកល្បងម្ដងទៀតណា៎!' : (this.defenderLives >= 900 ? 'របៀបហ្វឹកហាត់សេរី' : `នៅសល់ខែលការពារ៖ ${'❤️'.repeat(Math.max(0, this.defenderLives))}`)}
            </p>

            <div class="p-3.5 my-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200 text-left">
              <div class="font-bold mb-1">✅ ចម្លើយត្រឹមត្រូវគឺ៖ <span class="text-sm font-extrabold text-emerald-600">${correctText}</span></div>
              ${expText ? `<div class="mt-1.5 pt-1.5 border-t border-red-200/60 dark:border-red-800/60 text-[11px] text-slate-600 dark:text-slate-300">${expText}</div>` : ''}
            </div>

            <div class="text-center font-bold text-sm text-slate-700 dark:text-slate-200">
              ${isGameOver ? `ពិន្ទុសរុប៖ <span class="text-amber-500 font-black text-xl">${this.defenderScore}</span> ពិន្ទុ` : `ពិន្ទុបច្ចុប្បន្ន៖ <span class="text-purple-600 font-black">${this.defenderScore}</span>`}
            </div>
          </div>
        `,
        icon: 'error',
        confirmText: isGameOver ? '🔄 ចាប់ផ្ដើមលេងម្ដងទៀត' : '👉 បន្តសំណួរបន្ទាប់',
        onConfirm: () => {
          if (isGameOver) {
            this.startDefenderGame();
          } else {
            this.nextDefenderWave();
          }
        }
      });
    }
  }
}

window.mathGames = new MathGamesEngine();

// Auto-initialize filters and game controls when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const gradeSelect = document.getElementById('filterGameGrade');
  const lessonSelect = document.getElementById('filterGameLesson');

  if (gradeSelect) {
    gradeSelect.addEventListener('change', (e) => {
      window.mathGames.selectedGrade = e.target.value;
      window.mathGames.updateLessonDropdown();
      window.mathGames.updateQuestionCountBadge();
      window.mathGames.onFilterChanged();
    });
  }

  if (lessonSelect) {
    lessonSelect.addEventListener('change', (e) => {
      window.mathGames.selectedLesson = e.target.value;
      window.mathGames.updateQuestionCountBadge();
      window.mathGames.updateActiveTopicLabels();
      window.mathGames.onFilterChanged();
    });
  }

  // Initialize interactive game controls for all 5 modes
  window.mathGames.initBlitzControls();
  window.mathGames.initMatchControls();
  window.mathGames.initBattleControls();
  window.mathGames.initMillionaireControls();
  window.mathGames.initDefenderControls();

  // Populate initial dropdowns
  window.mathGames.updateLessonDropdown();
  window.mathGames.updateQuestionCountBadge();
});
