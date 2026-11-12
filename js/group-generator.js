/**
 * Spin Wheel Group Generator (កង់បង្វិលបែងចែកក្រុមសិស្ស)
 * Interactive Classroom Tool with Special Needs / Visual Impairment Placement & Random Distribution
 * Specially Crafted for Teacher Nuon Bonorng (Bonorng11) - NGS Preah Yukunthor High School
 */

class GroupGeneratorEngine {
  constructor() {
    this.students = []; // { id, name, sex, isSpecial: boolean, isAnchor: boolean, class: string, totalScore: number, note: string }
    this.numGroups = 4;
    this.specialNeedsGroup = 1; // 1-based index (default Group 1: front row)
    this.groupSpecialTogether = true;
    this.distributeAnchors = true; // disperse top / anchor students across different groups
    this.namingStyle = 'numbers'; // 'numbers' | 'letters' | 'creative' | 'colors'
    this.groups = []; // { id, name, theme, members: [], leader: null, isSpecialGroup: boolean, hasAnchor: boolean }
    
    // Canvas & Animation State
    this.canvasId = 'groupSpinCanvas';
    this.isSpinning = false;
    this.currentRotation = 0;
    this.audioCtx = null;
    
    // One-by-one spin queue
    this.oneByOneQueue = [];
    this.currentStudentIdx = 0;
    this.oneByOneActive = false;
    
    // Current class filter
    this.selectedClass = '11A';
  }

  /* ================== AUDIO SYNTHESIZER ================== */
  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  beep(freq = 600, duration = 0.05, type = 'sine') {
    try {
      this.initAudio();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }

  playVictoryFanfare() {
    try {
      this.initAudio();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => this.beep(freq, 0.25, 'triangle'), idx * 110);
      });
    } catch (e) {}
  }

  playSpecialPlacementSound() {
    try {
      this.initAudio();
      // Celestial chime for special placement
      [659.25, 880.00, 1046.50].forEach((freq, idx) => {
        setTimeout(() => this.beep(freq, 0.2, 'sine'), idx * 90);
      });
    } catch (e) {}
  }

  /* ================== STUDENT SOURCE & ROSTER ================== */
  loadClassStudents(className = '11A') {
    this.selectedClass = className;
    let list = [];

    // 1. Try to read from dashboard database
    if (window.DATA && window.DATA.students && Array.isArray(window.DATA.students)) {
      const filtered = window.DATA.students.filter(s => s.class === className);
      if (filtered.length > 0) {
        list = filtered.map((s, idx) => {
          const totalScore = (s.q1 || 0) + (s.q2 || 0) + (s.midterm || 0) + (s.final || 0);
          return {
            id: s.id || `st_${idx + 1}`,
            name: s.name,
            sex: s.sex || 'ប្រុស',
            class: className,
            isSpecial: false,
            isAnchor: false,
            totalScore: totalScore,
            note: s.note || ''
          };
        });
      }
    }

    // 2. Realistic authentic fallback if not in DATA
    if (list.length === 0) {
      const defaultNames = [
        { name: 'សុខ សុភា', sex: 'ប្រុស' }, { name: 'ចាន់ ធីតា', sex: 'ស្រី' },
        { name: 'កែវ វិចិត្រ', sex: 'ប្រុស' }, { name: 'លី ម៉េងហួរ', sex: 'ប្រុស' },
        { name: 'ហេង រតនា', sex: 'ប្រុស' }, { name: 'ជា ស្រីពៅ', sex: 'ស្រី' },
        { name: 'ឌុច វឌ្ឍនា', sex: 'ប្រុស' }, { name: 'អ៊ុំ សុវណ្ណារី', sex: 'ស្រី' },
        { name: 'វ៉ាន់ ពិទូ', sex: 'ប្រុស' }, { name: 'ណុប កល្យាណ', sex: 'ស្រី' },
        { name: 'ស៊ឹម បុប្ផា', sex: 'ស្រី' }, { name: 'ម៉ៅ គីមសាន', sex: 'ប្រុស' },
        { name: 'ព្រំ សុវណ្ណ', sex: 'ប្រុស' }, { name: 'ប៉ែន ស្រីម៉ៅ', sex: 'ស្រី' },
        { name: 'ទូច សម្បត្តិ', sex: 'ប្រុស' }, { name: 'អេង ម៉ារីណា', sex: 'ស្រី' },
        { name: 'ឈុំ មុនីរ័ត្ន', sex: 'ប្រុស' }, { name: 'ជៀម សុជាតា', sex: 'ស្រី' },
        { name: 'ខៀវ ដារ៉ូ', sex: 'ប្រុស' }, { name: 'ឡុង ពិសិដ្ឋ', sex: 'ប្រុស' },
        { name: 'សេង ស្រីនិច', sex: 'ស្រី' }, { name: 'គង់ វីរៈ', sex: 'ប្រុស' },
        { name: 'នួន វិសាល', sex: 'ប្រុស' }, { name: 'ស៊ូ រ៉ានី', sex: 'ស្រី' }
      ];
      list = defaultNames.map((item, idx) => ({
        id: `st_${className}_${idx + 1}`,
        name: item.name,
        sex: item.sex,
        class: className,
        isSpecial: (idx === 0 || idx === 1), // pre-mark 2 students as demo special needs (front row)
        isAnchor: false,
        totalScore: 70 + (idx % 25),
        note: (idx === 3 || idx === 4 || idx === 8 || idx === 12) ? 'ឆ្នើម' : ''
      }));
    }

    this.students = list;
    this.autoSelectAnchors(false); // auto-select top students initially
    this.renderStudentChips();
    this.updateStatsBadge();
    this.drawWheel();
  }

  loadCustomStudents(namesText) {
    if (!namesText || !namesText.trim()) return;
    const lines = namesText.split(/[\n,;]+/).map(s => s.trim()).filter(s => s.length > 0);
    
    // Preserve existing flags if names match
    const existingSpecial = new Set(this.students.filter(s => s.isSpecial).map(s => s.name));
    const existingAnchor = new Set(this.students.filter(s => s.isAnchor).map(s => s.name));

    this.students = lines.map((name, idx) => ({
      id: `custom_${idx + 1}`,
      name: name,
      sex: 'ទូទៅ',
      class: 'ផ្ទាល់ខ្លួន',
      isSpecial: existingSpecial.has(name),
      isAnchor: existingAnchor.has(name),
      totalScore: 75,
      note: ''
    }));

    if (this.students.filter(s => s.isAnchor).length === 0) {
      this.autoSelectAnchors(false);
    }
    this.renderStudentChips();
    this.updateStatsBadge();
    this.drawWheel();
  }

  toggleSpecialNeeds(studentId) {
    const st = this.students.find(s => s.id === studentId);
    if (st) {
      st.isSpecial = !st.isSpecial;
      this.beep(st.isSpecial ? 880 : 440, 0.08, 'triangle');
      this.renderStudentChips();
      this.updateStatsBadge();
    }
  }

  toggleAnchor(studentId) {
    const st = this.students.find(s => s.id === studentId);
    if (st) {
      st.isAnchor = !st.isAnchor;
      this.beep(st.isAnchor ? 784 : 392, 0.08, 'sine');
      this.renderStudentChips();
      this.updateStatsBadge();
    }
  }

  autoSelectAnchors(showNotification = true) {
    if (!this.students || this.students.length === 0) return;
    const targetCount = this.numGroups; // 1 top student per group
    // Sort descending by score, honor note, or name
    const sorted = [...this.students].sort((a, b) => {
      const scoreA = (a.note === 'ឆ្នើម' ? 100 : 0) + (a.totalScore || 0);
      const scoreB = (b.note === 'ឆ្នើម' ? 100 : 0) + (b.totalScore || 0);
      return scoreB - scoreA;
    });

    const topIds = new Set(sorted.slice(0, targetCount).map(s => s.id));
    this.students.forEach(s => {
      s.isAnchor = topIds.has(s.id);
    });

    this.renderStudentChips();
    this.updateStatsBadge();
    if (showNotification && typeof window.showToast === 'function') {
      window.showToast(`✨ បានជ្រើសរើសសិស្សពូកែ ${this.toKhmerNum(targetCount)} នាក់ ជាសិស្សបង្គោល!`, 'success');
    }
  }

  clearAnchors() {
    this.students.forEach(s => { s.isAnchor = false; });
    this.renderStudentChips();
    this.updateStatsBadge();
    if (typeof window.showToast === 'function') {
      window.showToast('បានកំណត់សិស្សបង្គោលឡើងវិញ!', 'info');
    }
  }

  /* ================== GROUP THEMES & STYLES ================== */
  getGroupTheme(index) {
    const themes = [
      { name: 'មាស (Gold)', bg: 'from-amber-500 to-yellow-600', border: 'border-amber-400', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200', icon: '🌟', hex: '#F59E0B' },
      { name: 'ខៀវ (Blue)', bg: 'from-blue-500 to-indigo-600', border: 'border-blue-400', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200', icon: '🚀', hex: '#3B82F6' },
      { name: 'បៃតង (Green)', bg: 'from-emerald-500 to-teal-600', border: 'border-emerald-400', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200', icon: '🍀', hex: '#10B981' },
      { name: 'ស្វាយ (Purple)', bg: 'from-purple-500 to-pink-600', border: 'border-purple-400', badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200', icon: '⚡', hex: '#8B5CF6' },
      { name: 'ក្រហម (Red)', bg: 'from-rose-500 to-red-600', border: 'border-rose-400', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200', icon: '🔥', hex: '#EF4444' },
      { name: 'ទឹកប៊ិច (Cyan)', bg: 'from-cyan-500 to-sky-600', border: 'border-cyan-400', badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200', icon: '💎', hex: '#06B6D4' },
      { name: 'ព្រះអាទិត្យ (Orange)', bg: 'from-orange-500 to-amber-600', border: 'border-orange-400', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200', icon: '☀️', hex: '#F97316' },
      { name: 'រាជិនី (Violet)', bg: 'from-violet-500 to-fuchsia-600', border: 'border-violet-400', badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200', icon: '👑', hex: '#7C3AED' },
      { name: 'ធម្មជាតិ (Lime)', bg: 'from-lime-500 to-green-600', border: 'border-lime-400', badge: 'bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-200', icon: '🌿', hex: '#84CC16' },
      { name: 'ផ្កាយភ្លឺ (Pink)', bg: 'from-pink-500 to-rose-600', border: 'border-pink-400', badge: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200', icon: '✨', hex: '#EC4899' }
    ];
    return themes[index % themes.length];
  }

  getGroupBaseName(index) {
    if (this.namingStyle === 'letters') {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      return `ក្រុម ${letters[index] || (index + 1)}`;
    }
    if (this.namingStyle === 'creative') {
      const creative = [
        'ទេវតាមាស', 'ឥន្ទ្រីក្រហម', 'តោមាស', 'នាគខៀវ', 
        'កុលាបពេជ្រ', 'រាជសីហ៍', 'អធិរាជផ្គរ', 'រស្មីរន្ទះ', 'ឥន្ទ្រីយ៍ដែក', 'មេឃាខៀវ'
      ];
      return `ក្រុម ${creative[index] || (index + 1)}`;
    }
    if (this.namingStyle === 'colors') {
      const colors = ['មាស', 'ខៀវ', 'បៃតង', 'ស្វាយ', 'ក្រហម', 'ផ្ទៃមេឃ', 'ទឹកក្រូច', 'ស៊ីជម្ពូ', 'ត្រួយចេក', 'ប្រាក់'];
      return `ក្រុមពណ៌ ${colors[index] || (index + 1)}`;
    }
    return `ក្រុមទី ${this.toKhmerNum(index + 1)}`;
  }

  toKhmerNum(num) {
    const kDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    return String(num).split('').map(d => kDigits[parseInt(d, 10)] || d).join('');
  }

  /* ================== CORE GROUPING ALGORITHM ================== */
  computeGroups() {
    if (this.students.length === 0) return [];

    const total = this.students.length;
    const baseSize = Math.floor(total / this.numGroups);
    const rem = total % this.numGroups;
    const targetSizes = Array.from({ length: this.numGroups }, (_, i) => baseSize + (i < rem ? 1 : 0));

    // Initialize groups
    const groups = [];
    const targetSpecialIdx = Math.max(0, Math.min(this.numGroups - 1, this.specialNeedsGroup - 1));

    for (let i = 0; i < this.numGroups; i++) {
      const theme = this.getGroupTheme(i);
      const isTargetSpecialGroup = this.groupSpecialTogether && (i === targetSpecialIdx);
      const baseName = this.getGroupBaseName(i);
      // Neutral, dignified group title without public labeling
      const displayName = baseName;

      groups.push({
        id: i + 1,
        index: i,
        name: displayName,
        baseName: baseName,
        isSpecialGroup: isTargetSpecialGroup,
        hasAnchor: false,
        theme: theme,
        members: [],
        leader: null
      });
    }

    // Partition students into categories
    const both = [];
    const onlySpecial = [];
    const onlyAnchor = [];
    const regular = [];

    this.students.forEach(st => {
      const isSpec = !!st.isSpecial;
      const isAnc = !!st.isAnchor;
      if (isSpec && isAnc) {
        both.push({ ...st });
      } else if (isSpec) {
        onlySpecial.push({ ...st });
      } else if (isAnc) {
        onlyAnchor.push({ ...st });
      } else {
        regular.push({ ...st });
      }
    });

    // 1. Assign students who have BOTH Special Needs & Anchor (Front row + anchor)
    if (this.groupSpecialTogether && both.length > 0) {
      both.forEach(st => {
        let currentIdx = targetSpecialIdx;
        if (groups[currentIdx].members.length >= targetSizes[currentIdx] && currentIdx + 1 < this.numGroups) {
          currentIdx++;
        }
        groups[currentIdx].members.push(st);
        groups[currentIdx].hasAnchor = true;
      });
    } else {
      both.forEach(st => onlyAnchor.push(st));
    }

    // 2. Assign ONLY SPECIAL needs students (Eyesight / Front row)
    if (this.groupSpecialTogether && onlySpecial.length > 0) {
      let currentIdx = targetSpecialIdx;
      onlySpecial.forEach(st => {
        if (groups[currentIdx].members.length >= targetSizes[currentIdx] && currentIdx + 1 < this.numGroups) {
          currentIdx++;
        }
        groups[currentIdx].members.push(st);
      });
    } else {
      onlySpecial.forEach(st => regular.push(st));
    }

    // 3. Assign ONLY ANCHOR students (Top students dispersed across distinct groups)
    if (this.distributeAnchors && onlyAnchor.length > 0) {
      // Shuffle anchor students so assignment to groups is randomized
      const shuffledAnchors = [...onlyAnchor];
      for (let i = shuffledAnchors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledAnchors[i], shuffledAnchors[j]] = [shuffledAnchors[j], shuffledAnchors[i]];
      }

      shuffledAnchors.forEach(st => {
        // Find groups that DO NOT yet have an anchor and have room
        const candidates = groups.filter(g => !g.hasAnchor && g.members.length < targetSizes[g.index]);
        if (candidates.length > 0) {
          // Pick randomly among candidate groups
          const picked = candidates[Math.floor(Math.random() * candidates.length)];
          picked.members.push(st);
          picked.hasAnchor = true;
        } else {
          // If all available groups already have an anchor (i.e. anchors > numGroups)
          // Find group with remaining capacity and fewest members
          const available = groups.filter(g => g.members.length < targetSizes[g.index]);
          if (available.length > 0) {
            available.sort((a, b) => a.members.length - b.members.length);
            available[0].members.push(st);
          } else {
            // Overflow fallback
            groups[groups.length - 1].members.push(st);
          }
        }
      });
    } else {
      onlyAnchor.forEach(st => regular.push(st));
    }

    // 4. Assign REGULAR students (Fisher-Yates shuffle + balanced distribution)
    const shuffledRegular = [...regular];
    for (let i = shuffledRegular.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledRegular[i], shuffledRegular[j]] = [shuffledRegular[j], shuffledRegular[i]];
    }

    shuffledRegular.forEach(st => {
      // Find group with the most room remaining: (targetSizes[i] - members.length)
      let bestGroup = null;
      let maxRemaining = -Infinity;
      for (let i = 0; i < groups.length; i++) {
        const remaining = targetSizes[i] - groups[i].members.length;
        if (remaining > maxRemaining) {
          maxRemaining = remaining;
          bestGroup = groups[i];
        }
      }
      if (bestGroup) {
        bestGroup.members.push(st);
      }
    });

    // 5. INTERNAL SHUFFLE (Confidentiality & Equality Shield)
    // Randomize member display order inside each group so top/special students are not always at index 0
    groups.forEach(g => {
      for (let i = g.members.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [g.members[i], g.members[j]] = [g.members[j], g.members[i]];
      }
    });

    this.groups = groups;
    return groups;
  }

  /* ================== CANVAS WHEEL DRAWING ================== */
  drawWheel() {
    const canvas = document.getElementById(this.canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = centerX - 12;

    ctx.clearRect(0, 0, width, height);

    const count = this.numGroups;
    if (count === 0) return;

    const sliceAngle = (2 * Math.PI) / count;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.currentRotation);

    for (let i = 0; i < count; i++) {
      const angle = i * sliceAngle;
      const theme = this.getGroupTheme(i);
      const isTargetSpecial = this.groupSpecialTogether && (i === (this.specialNeedsGroup - 1));

      // Slice sector
      ctx.beginPath();
      ctx.fillStyle = theme.hex;
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      // Border between slices
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Text and Icon along slice
      ctx.save();
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px "Kantumruy Pro", "Battambang", sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 3;

      const groupLabel = `${theme.icon} ${this.getGroupBaseName(i)}${isTargetSpecial ? ' 👓' : ''}`;
      ctx.fillText(groupLabel, radius - 16, 5);
      ctx.restore();
    }

    // Outer wheel border ring
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Center hub
    const hubR = 30;
    ctx.beginPath();
    ctx.arc(0, 0, hubR, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#10B981';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, hubR - 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#10B981';
    ctx.fill();

    // Center text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', 0, 0);

    ctx.restore();
  }

  /* ================== SPIN ACTION: QUICK SPIN ALL ================== */
  quickSpinAll() {
    if (this.isSpinning || this.students.length === 0) return;
    this.isSpinning = true;
    this.oneByOneActive = false;

    const count = this.numGroups;
    const sliceAngle = (2 * Math.PI) / count;
    
    // Pick random target landing
    const winningIndex = Math.floor(Math.random() * count);
    const fullRotations = (5 + Math.floor(Math.random() * 4)) * 2 * Math.PI;
    const targetSliceAngle = winningIndex * sliceAngle + sliceAngle / 2;
    const targetRotation = fullRotations + (1.5 * Math.PI - targetSliceAngle);

    const startRotation = this.currentRotation % (2 * Math.PI);
    const totalRotation = targetRotation + (2 * Math.PI - (startRotation % (2 * Math.PI)));
    const duration = 3800; // ms
    const startTime = performance.now();

    let lastTickAngle = 0;

    const banner = document.getElementById('groupSpinStatusBanner');
    if (banner) {
      banner.className = 'p-3 rounded-2xl bg-emerald-500 text-white font-bold text-center text-sm shadow animate-pulse';
      banner.innerHTML = `🎡 កំពុងបង្វិលកង់បែងចែកក្រុមសិស្ស... សូមរង់ចាំ!`;
    }

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      this.currentRotation = startRotation + totalRotation * ease;
      this.drawWheel();

      // Tick sound
      if (Math.abs(this.currentRotation - lastTickAngle) > sliceAngle) {
        this.beep(850, 0.03, 'sine');
        lastTickAngle = this.currentRotation;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        // Compute the final groups
        this.computeGroups();
        this.renderGroupResults();
        this.playVictoryFanfare();

        if (typeof confetti === 'function') {
          confetti({ particleCount: 130, spread: 85, origin: { y: 0.55 } });
        }

        if (banner) {
          banner.className = 'p-3 rounded-2xl bg-emerald-600 text-white font-bold text-center text-sm shadow';
          banner.innerHTML = `🎉 បែងចែកក្រុមបានជោគជ័យ ១០០%! មាន ${this.toKhmerNum(this.numGroups)} ក្រុម (បែងចែកដោយសមធម៌ និងតម្លាភាព)`;
        }
      }
    };

    requestAnimationFrame(animate);
  }

  /* ================== SPIN ACTION: ONE BY ONE ================== */
  startOneByOneSpin() {
    if (this.isSpinning || this.students.length === 0) return;
    
    // Prepare pre-computed groups structure
    this.computeGroups();
    
    // Create assignment sequence: list of { student, targetGroup }
    const assignments = [];
    this.groups.forEach(g => {
      g.members.forEach(m => {
        assignments.push({ student: m, group: g });
      });
    });

    // Shuffle sequence so students are called in exciting order
    this.oneByOneQueue = assignments.sort(() => Math.random() - 0.5);
    this.currentStudentIdx = 0;
    this.oneByOneActive = true;

    // Reset visible group cards to empty initially
    this.groups.forEach(g => { g.displayedMembers = []; });
    this.renderGroupResults(true);

    this.spinNextStudent();
  }

  spinNextStudent() {
    if (!this.oneByOneActive || this.currentStudentIdx >= this.oneByOneQueue.length) {
      this.finishOneByOne();
      return;
    }

    const item = this.oneByOneQueue[this.currentStudentIdx];
    const student = item.student;
    const targetGroup = item.group;

    const banner = document.getElementById('groupSpinStatusBanner');
    if (banner) {
      banner.className = 'p-3 rounded-2xl bg-indigo-600 text-white font-bold text-center text-sm shadow';
      banner.innerHTML = `👤 វេនសិស្ស ៖ <span class="text-amber-300 font-extrabold text-base">${student.name}</span> (នៅសល់ ${this.toKhmerNum(this.oneByOneQueue.length - this.currentStudentIdx)} នាក់)`;
    }

    // All students spin through the wheel uniformly without bias
    this.isSpinning = true;
    const count = this.numGroups;
    const sliceAngle = (2 * Math.PI) / count;
    const winningIndex = targetGroup.index;
    
    const fullRotations = (3 + Math.floor(Math.random() * 2)) * 2 * Math.PI;
    const targetSliceAngle = winningIndex * sliceAngle + sliceAngle / 2;
    const targetRotation = fullRotations + (1.5 * Math.PI - targetSliceAngle);

    const startRotation = this.currentRotation % (2 * Math.PI);
    const totalRotation = targetRotation + (2 * Math.PI - (startRotation % (2 * Math.PI)));
    const duration = 2200; // faster duration for one-by-one
    const startTime = performance.now();
    let lastTickAngle = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      this.currentRotation = startRotation + totalRotation * ease;
      this.drawWheel();

      if (Math.abs(this.currentRotation - lastTickAngle) > sliceAngle) {
        this.beep(800, 0.03, 'sine');
        lastTickAngle = this.currentRotation;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        this.beep(1046.50, 0.2, 'triangle'); // Bell ring

        // Place student in group
        targetGroup.displayedMembers = targetGroup.displayedMembers || [];
        targetGroup.displayedMembers.push(student);
        this.currentStudentIdx++;
        this.renderGroupResults(true);

        // Next student
        if (this.currentStudentIdx < this.oneByOneQueue.length) {
          setTimeout(() => {
            if (this.oneByOneActive) this.spinNextStudent();
          }, 800);
        } else {
          this.finishOneByOne();
        }
      }
    };

    requestAnimationFrame(animate);
  }

  finishOneByOne() {
    this.oneByOneActive = false;
    this.isSpinning = false;
    this.playVictoryFanfare();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 } });
    }
    const banner = document.getElementById('groupSpinStatusBanner');
    if (banner) {
      banner.className = 'p-3 rounded-2xl bg-emerald-600 text-white font-bold text-center text-sm shadow';
      banner.innerHTML = `🎉 បានបែងចែកសិស្សទាំងអស់ចូលក្រុមរួចរាល់ជាស្ថាពរ!`;
    }
    this.renderGroupResults(false);
  }

  skipOneByOne() {
    this.oneByOneActive = false;
    this.isSpinning = false;
    this.computeGroups();
    this.renderGroupResults(false);
    this.playVictoryFanfare();
    const banner = document.getElementById('groupSpinStatusBanner');
    if (banner) {
      banner.className = 'p-3 rounded-2xl bg-emerald-600 text-white font-bold text-center text-sm shadow';
      banner.innerHTML = `⚡ បានបែងចែកសិស្សដែលនៅសល់ទាំងអស់ចូលក្រុមភ្លាមៗ!`;
    }
  }

  /* ================== LEADER SELECTION ================== */
  pickLeader(groupId) {
    const group = this.groups.find(g => g.id === groupId);
    if (!group || !group.members || group.members.length === 0) return;
    const randomMember = group.members[Math.floor(Math.random() * group.members.length)];
    group.leader = randomMember.id;
    this.playVictoryFanfare();
    this.renderGroupResults();
    window.showToast(`👑 ${randomMember.name} ត្រូវបានជ្រើសរើសជាប្រធាន ${group.name}!`, 'success');
  }

  /* ================== UI RENDERING ================== */
  renderStudentChips() {
    const container = document.getElementById('groupStudentChipsList');
    if (!container) return;

    if (this.students.length === 0) {
      container.innerHTML = `<p class="text-xs text-slate-400 p-4 text-center">មិនទាន់មានឈ្មោះសិស្សនៅឡើយទេ</p>`;
      return;
    }

    container.innerHTML = this.students.map(st => {
      let borderClass = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300';
      if (st.isSpecial && st.isAnchor) {
        borderClass = 'border-purple-400 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 ring-2 ring-purple-300';
      } else if (st.isSpecial) {
        borderClass = 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-1 ring-amber-400';
      } else if (st.isAnchor) {
        borderClass = 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-400';
      }

      return `
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs ${borderClass}">
          <span class="truncate max-w-[120px]">${st.name}</span>
          <div class="inline-flex items-center gap-1 shrink-0">
            <!-- Eyesight / Front Row Toggle -->
            <button type="button" onclick="window.groupGen.toggleSpecialNeeds('${st.id}')" class="px-1.5 py-0.5 rounded-md text-[10px] transition ${
              st.isSpecial
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-amber-600 hover:bg-amber-50'
            }" title="ចុចដើម្បីកំណត់សិស្សភ្នែកពិបាកមើល (ឱ្យនៅក្រុមជួរមុខ)">
              👓 ជួរមុខ
            </button>
            <!-- Top / Anchor Student Toggle -->
            <button type="button" onclick="window.groupGen.toggleAnchor('${st.id}')" class="px-1.5 py-0.5 rounded-md text-[10px] transition ${
              st.isAnchor
                ? 'bg-indigo-600 text-white font-black shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
            }" title="ចុចដើម្បីកំណត់សិស្សពូកែ/បង្គោល (ឱ្យនៅបែកក្រុមគ្នា ដើម្បីជួយគ្រប់គ្រងក្រុម)">
              ⭐ បង្គោល
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderGroupResults(useDisplayed = false) {
    const container = document.getElementById('groupResultsGrid');
    if (!container) return;

    if (!this.groups || this.groups.length === 0) {
      container.innerHTML = `<div class="col-span-full p-8 text-center text-slate-400 text-xs font-bold">ចុចប៊ូតុង «បង្វិលចែកក្រុម» ដើម្បីបង្កើតក្រុមសិស្ស</div>`;
      return;
    }

    container.innerHTML = this.groups.map(g => {
      const members = useDisplayed ? (g.displayedMembers || []) : g.members;
      const theme = g.theme;
      return `
        <div class="card-soft p-4 border-2 ${theme.border} bg-white dark:bg-slate-800 shadow-md flex flex-col justify-between space-y-3 transition transform hover:-translate-y-1">
          <!-- Card Header (Neutral, dignified, no public stigma/labeling) -->
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2.5">
            <div class="flex items-center gap-2 truncate">
              <span class="text-xl">${theme.icon}</span>
              <div>
                <h4 class="font-extrabold text-sm text-slate-900 dark:text-white truncate">${g.name}</h4>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-lg text-xs font-black ${theme.badge} shrink-0">
              ${this.toKhmerNum(members.length)} នាក់
            </span>
          </div>

          <!-- Members List: 100% UNIFORM, ZERO STIGMATIZING/DIVISIVE TAGS OR BADGES -->
          <div class="space-y-1.5 min-h-[140px] max-h-[220px] overflow-y-auto pr-1">
            ${members.length === 0 ? `<p class="text-xs text-slate-400 italic text-center py-6">កំពុងរង់ចាំសិស្ស...</p>` : ''}
            ${members.map((m, idx) => {
              const isLeader = g.leader === m.id;
              return `
                <div class="flex items-center justify-between p-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800/80">
                  <div class="flex items-center gap-2 truncate">
                    <span class="text-slate-400 font-mono text-[10px] w-4 shrink-0">${idx + 1}.</span>
                    <span class="truncate">${m.name}</span>
                  </div>
                  ${isLeader ? `<span class="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black shrink-0">👑 ប្រធាន</span>` : ''}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Card Footer Actions -->
          <div class="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
            <button type="button" onclick="window.groupGen.pickLeader(${g.id})" class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition flex items-center gap-1">
              <span>👑</span> <span>ចាប់ប្រធានក្រុម</span>
            </button>
            <span class="text-[10px] text-slate-400 font-medium">${theme.name}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  updateStatsBadge() {
    const totalEl = document.getElementById('groupTotalStudentsBadge');
    const specialEl = document.getElementById('groupSpecialCountBadge');
    const anchorEl = document.getElementById('groupAnchorCountBadge');
    const sizeEl = document.getElementById('groupTargetSizeBadge');

    const total = this.students.length;
    const specialCount = this.students.filter(s => s.isSpecial).length;
    const anchorCount = this.students.filter(s => s.isAnchor).length;
    const perGroup = total > 0 ? Math.ceil(total / this.numGroups) : 0;

    if (totalEl) totalEl.textContent = this.toKhmerNum(total);
    if (specialEl) specialEl.textContent = this.toKhmerNum(specialCount);
    if (anchorEl) anchorEl.textContent = this.toKhmerNum(anchorCount);
    if (sizeEl) sizeEl.textContent = this.toKhmerNum(perGroup);
  }

  /* ================== EXPORT & PRINT ================== */
  copyGroupsToClipboard() {
    if (!this.groups || this.groups.length === 0) {
      if (typeof window.showToast === 'function') window.showToast('សូមបែងចែកក្រុមជាមុនសិន!', 'warning');
      return;
    }

    let text = `📋 លទ្ធផលបែងចែកក្រុមសិស្ស · ថ្នាក់ ${this.selectedClass}\n`;
    text += `វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី (NGS)\n`;
    text += `==========================================\n\n`;

    this.groups.forEach(g => {
      text += `🌟 ${g.name} (ចំនួន ${this.toKhmerNum(g.members.length)} នាក់) ៖\n`;
      g.members.forEach((m, idx) => {
        const leaderMark = g.leader === m.id ? ' [👑 ប្រធានក្រុម]' : '';
        text += `  ${idx + 1}. ${m.name}${leaderMark}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      if (typeof window.showToast === 'function') window.showToast('📋 បានចម្លងបញ្ជីក្រុមទាំងអស់រួចរាល់!', 'success');
    }).catch(() => {
      if (typeof window.showToast === 'function') window.showToast('មិនអាចចម្លងបានទេ សូមចម្លងដោយដៃ', 'error');
    });
  }

  printGroups() {
    if (!this.groups || this.groups.length === 0) {
      if (typeof window.showToast === 'function') window.showToast('សូមបែងចែកក្រុមជាមុនសិន!', 'warning');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let html = `
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="utf-8">
        <title>បញ្ជីក្រុមសិស្ស - ថ្នាក់ ${this.selectedClass}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Kantumruy Pro', sans-serif; padding: 24px; color: #1e293b; }
          .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #10b981; padding-bottom: 12px; }
          .header h2 { margin: 0 0 4px 0; font-size: 18px; color: #047857; }
          .header h3 { margin: 0 0 4px 0; font-size: 15px; color: #334155; }
          .header p { margin: 0; font-size: 11px; color: #64748b; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .card { border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px; page-break-inside: avoid; }
          .card-title { font-weight: bold; font-size: 14px; color: #047857; margin-bottom: 8px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px; display: flex; justify-content: space-between; }
          .member-row { font-size: 13px; padding: 4px 0; display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; }
          .leader-tag { font-size: 11px; background: #fef3c7; color: #92400e; padding: 1px 6px; border-radius: 4px; font-weight: bold; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>វិទ្យាល័យព្រះយុគន្ធរ · សាលារៀនជំនាន់ថ្មី (NGS)</h2>
          <h3>តារាងបែងចែកក្រុមសិស្ស · ថ្នាក់ ${this.selectedClass}</h3>
          <p>សរុប ${this.toKhmerNum(this.numGroups)} ក្រុម • កាលបរិច្ឆេទ ៖ ${new Date().toLocaleDateString('km-KH')}</p>
        </div>
        <div class="grid">
    `;

    this.groups.forEach(g => {
      html += `
        <div class="card">
          <div class="card-title">
            <span>${g.name}</span>
            <span style="font-size: 11px; color: #64748b;">${this.toKhmerNum(g.members.length)} នាក់</span>
          </div>
          <div>
      `;
      g.members.forEach((m, idx) => {
        const isLeader = g.leader === m.id;
        html += `
          <div class="member-row">
            <span>${idx + 1}. ${m.name}</span>
            ${isLeader ? '<span class="leader-tag">👑 ប្រធានក្រុម</span>' : ''}
          </div>
        `;
      });
      html += `</div></div>`;
    });

    html += `
        </div>
        <script>window.onload = () => { window.print(); };</script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  }

  /* ================== EVENT LISTENERS & INITIALIZATION ================== */
  init() {
    // 1. Initial Load
    this.loadClassStudents('11A');

    // 2. Class Select dropdown
    const classSelect = document.getElementById('groupClassSelect');
    if (classSelect) {
      classSelect.addEventListener('change', (e) => {
        this.loadClassStudents(e.target.value);
      });
    }

    // 3. Custom names apply button
    const btnApplyCustom = document.getElementById('btnGroupApplyCustom');
    const customTextarea = document.getElementById('groupCustomTextarea');
    if (btnApplyCustom && customTextarea) {
      btnApplyCustom.addEventListener('click', () => {
        this.loadCustomStudents(customTextarea.value);
      });
    }

    // 4. Number of Groups Presets
    document.querySelectorAll('.group-count-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.group-count-btn').forEach(b => {
          b.classList.remove('bg-emerald-600', 'border-emerald-500', 'text-white');
          b.classList.add('bg-white', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.remove('bg-white', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        btn.classList.add('bg-emerald-600', 'border-emerald-500', 'text-white');

        this.numGroups = parseInt(btn.dataset.count, 10);
        this.updateSpecialGroupDropdown();
        this.updateStatsBadge();
        this.drawWheel();
      });
    });

    // 5. Special Needs Toggle & Group Select
    const specialToggle = document.getElementById('groupSpecialTogetherToggle');
    if (specialToggle) {
      specialToggle.addEventListener('change', (e) => {
        this.groupSpecialTogether = e.target.checked;
        this.drawWheel();
      });
    }

    const specialGroupSelect = document.getElementById('groupSpecialGroupSelect');
    if (specialGroupSelect) {
      specialGroupSelect.addEventListener('change', (e) => {
        this.specialNeedsGroup = parseInt(e.target.value, 10);
        this.drawWheel();
      });
    }

    // 5b. Anchor / Top Students Disperse Toggle & Buttons
    const anchorToggle = document.getElementById('groupDistributeAnchorsToggle');
    if (anchorToggle) {
      anchorToggle.addEventListener('change', (e) => {
        this.distributeAnchors = e.target.checked;
      });
    }

    const btnAutoAnchors = document.getElementById('btnGroupAutoSelectAnchors');
    if (btnAutoAnchors) {
      btnAutoAnchors.addEventListener('click', () => {
        this.autoSelectAnchors(true);
      });
    }

    const btnClearAnchors = document.getElementById('btnGroupClearAnchors');
    if (btnClearAnchors) {
      btnClearAnchors.addEventListener('click', () => {
        this.clearAnchors();
      });
    }

    // 6. Naming Style
    const styleSelect = document.getElementById('groupNamingStyleSelect');
    if (styleSelect) {
      styleSelect.addEventListener('change', (e) => {
        this.namingStyle = e.target.value;
        this.drawWheel();
      });
    }

    // 7. Spin Buttons
    const btnQuickSpin = document.getElementById('btnGroupQuickSpin');
    if (btnQuickSpin) btnQuickSpin.addEventListener('click', () => this.quickSpinAll());

    const btnOneByOne = document.getElementById('btnGroupOneByOne');
    if (btnOneByOne) btnOneByOne.addEventListener('click', () => this.startOneByOneSpin());

    const btnSkipOne = document.getElementById('btnGroupSkipOne');
    if (btnSkipOne) btnSkipOne.addEventListener('click', () => this.skipOneByOne());

    // 8. Export & Print Buttons
    const btnCopy = document.getElementById('btnGroupCopyList');
    if (btnCopy) btnCopy.addEventListener('click', () => this.copyGroupsToClipboard());

    const btnPrint = document.getElementById('btnGroupPrint');
    if (btnPrint) btnPrint.addEventListener('click', () => this.printGroups());

    // 9. Modal Open / Close Triggers
    const modal = document.getElementById('groupGenModal');
    const openBtn = document.getElementById('btnOpenGroupModal');
    const closeBtn = document.getElementById('btnCloseGroupModal');

    const openModal = () => {
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        this.drawWheel();
      }
    };

    const closeModal = () => {
      if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Also support ESC key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    this.updateSpecialGroupDropdown();
  }

  updateSpecialGroupDropdown() {
    const select = document.getElementById('groupSpecialGroupSelect');
    if (!select) return;
    let opts = '';
    for (let i = 1; i <= this.numGroups; i++) {
      const isSelected = i === this.specialNeedsGroup ? 'selected' : '';
      const frontNote = (i === 1) ? ' (ជួរមុខក្បែរក្ដារខៀន)' : '';
      opts += `<option value="${i}" ${isSelected}>ក្រុមទី ${this.toKhmerNum(i)}${frontNote}</option>`;
    }
    select.innerHTML = opts;
  }
}

// Global instance
window.groupGen = new GroupGeneratorEngine();

// Auto initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.groupGen.init();
});
