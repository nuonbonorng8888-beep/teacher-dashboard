/**
 * Main Application Logic & View Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize State
  let currentTab = 'dashboard';
  let activeTaskCategory = 'ប្រជុំ';
  let weeklyChartInstance = null;
  let qualityChartInstance = null;

  // Cache DOM Elements
  const liveClockEl = document.getElementById('liveClock');
  const greetingEl = document.getElementById('greetingText');
  const userDisplayNameEl = document.getElementById('userDisplayName');
  const userRoleEl = document.getElementById('userRole');
  const userAvatarEl = document.getElementById('userAvatar');
  const schoolTitleEl = document.getElementById('schoolTitle');
  const academicYearEl = document.getElementById('academicYear');

  // Load and apply profile data
  function renderProfile() {
    const p = window.appStore.data.profile;
    if (p) {
      if (!p.schoolName || p.schoolName.includes('ស៊ីសុវត្ថិ') || p.schoolName.includes('បឹងត្របែក')) {
        p.schoolName = 'វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី';
        window.appStore.save();
      }
      if (!p.role || p.role === 'គ្រូបង្រៀន') {
        p.role = 'គ្រូបង្រៀនគណិតវិទ្យា · វិទ្យាល័យព្រះយុគន្ធរ NGS';
        window.appStore.save();
      }
    }
    if (userDisplayNameEl) userDisplayNameEl.textContent = p.name ? `លោកគ្រូ ${p.name.replace(/^លោកគ្រូ\s*/, '')}` : 'លោកគ្រូ នួន បូណង';
    if (userRoleEl) userRoleEl.textContent = p.role || 'គ្រូបង្រៀនគណិតវិទ្យា · វិទ្យាល័យព្រះយុគន្ធរ NGS';
    if (schoolTitleEl) schoolTitleEl.textContent = p.schoolName || 'វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី';
    if (academicYearEl) academicYearEl.textContent = `ឆ្នាំសិក្សា ${p.academicYear || '២០២៦-២០២៧'}`;
    
    const bannerName = document.getElementById('bannerTeacherName');
    if (bannerName) bannerName.textContent = p.username || 'Bonorng11';
    
    const bannerSubject = document.getElementById('bannerSubject');
    if (bannerSubject) bannerSubject.textContent = p.subject || 'គណិតវិទ្យា';

    const streakCount = document.getElementById('streakCount');
    if (streakCount) streakCount.textContent = p.streak || 0;

    const avatarUrl = p.avatar || 'teacher-profile.jpg';
    if (userAvatarEl) userAvatarEl.src = avatarUrl;
    const headerAvatarEl = document.getElementById('headerAvatar');
    if (headerAvatarEl) headerAvatarEl.src = avatarUrl;
    const bannerAvatarEl = document.getElementById('bannerAvatar');
    if (bannerAvatarEl) bannerAvatarEl.src = avatarUrl;
    const settingAvatarEl = document.getElementById('settingAvatarPreview');
    if (settingAvatarEl) settingAvatarEl.src = avatarUrl;
  }

  // Live Clock & Dynamic Greeting
  function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'ល្ងាច' : 'ព្រឹក';
    const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
    
    const khmerNumbers = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    const toKhmerNum = (numStr) => numStr.toString().split('').map(d => khmerNumbers[parseInt(d)] || d).join('');
    
    if (liveClockEl) {
      liveClockEl.textContent = `ម៉ោង ${toKhmerNum(displayHours)}:${toKhmerNum(minutes)} ${ampm}`;
    }

    if (greetingEl) {
      const username = window.appStore.data.profile.username || 'Bonorng11';
      if (hours < 12) {
        greetingEl.innerHTML = `Good Morning, ${username}! ☀️`;
      } else if (hours < 17) {
        greetingEl.innerHTML = `Good Afternoon, ${username}! 🌤️`;
      } else {
        greetingEl.innerHTML = `Good Evening, ${username}! 🕵️`;
      }
    }
  }

  setInterval(updateClock, 1000);
  updateClock();
  renderProfile();

  // Navigation Logic
  const navButtons = document.querySelectorAll('.nav-link');
  const tabContents = document.querySelectorAll('.tab-content');

  function switchTab(tabId) {
    currentTab = tabId;
    tabContents.forEach(tab => {
      if (tab.id === `tab-${tabId}`) {
        tab.classList.remove('hidden');
      } else {
        tab.classList.add('hidden');
      }
    });

    navButtons.forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('nav-active');
      } else {
        btn.classList.remove('nav-active');
      }
    });

    // Re-render tab specific content
    if (tabId === 'dashboard') {
      renderDashboardStats();
      renderTasksList();
      initCharts();
    } else if (tabId === 'grades') {
      renderGradesTable();
    } else if (tabId === 'attendance') {
      renderAttendanceTable();
    } else if (tabId === 'schedule') {
      renderScheduleTable();
    } else if (tabId === 'lessonplans') {
      renderLessonPlans();
    } else if (tabId === 'slides') {
      if (window.teachingSlidesManager) {
        window.teachingSlidesManager.render();
      }
    } else if (tabId === 'portfolio') {
      renderPortfolios();
    } else if (tabId === 'tools') {
      initFullTools();
    } else if (tabId === 'mathgames') {
      if (window.mathGames) {
        window.mathGames.showBlitzStart();
      }
    } else if (tabId === 'questionbank') {
      if (window.questionBank) {
        window.questionBank.init();
      }
    } else if (tabId === 'settings') {
      loadSettingsForm();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    });
  });

  // Category Chip Selection in Quick Task
  const taskChips = document.querySelectorAll('.task-chip');
  taskChips.forEach(chip => {
    chip.addEventListener('click', () => {
      taskChips.forEach(c => c.classList.remove('bg-purple-600', 'text-white'));
      chip.classList.add('bg-purple-600', 'text-white');
      activeTaskCategory = chip.dataset.category || 'ប្រជុំ';
    });
  });

  // Submit Quick Task
  const btnSubmitTask = document.getElementById('btnSubmitTask');
  const quickTaskInput = document.getElementById('quickTaskInput');
  if (btnSubmitTask && quickTaskInput) {
    btnSubmitTask.addEventListener('click', () => {
      const noteText = quickTaskInput.value.trim();
      const now = new Date();
      const newTask = {
        id: Date.now(),
        type: activeTaskCategory,
        note: noteText || `បានបំពេញកិច្ចការ៖ ${activeTaskCategory}`,
        date: now.toISOString().slice(0, 10),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        done: true
      };

      window.appStore.data.tasks.unshift(newTask);
      // Increment streak
      window.appStore.data.profile.streak = (window.appStore.data.profile.streak || 0) + 1;
      window.appStore.save();

      quickTaskInput.value = '';
      renderProfile();
      renderTasksList();
      renderDashboardStats();

      // Show toast
      showNotification('ជោគជ័យ', `បានកត់ត្រាកិច្ចការ «${activeTaskCategory}» រួចរាល់!`, 'success');
    });
  }

  // Render Tasks List on Dashboard
  function renderTasksList() {
    const listEl = document.getElementById('dashboardTasksList');
    if (!listEl) return;
    const tasks = window.appStore.data.tasks || [];
    if (tasks.length === 0) {
      listEl.innerHTML = `<p class="text-sm text-gray-500 py-2">មិនទាន់មានកត់ត្រាកិច្ចការនៅឡើយទេ</p>`;
      return;
    }

    listEl.innerHTML = tasks.slice(0, 5).map(t => `
      <div class="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-purple-200 transition">
        <div class="flex items-center gap-3">
          <span class="px-2.5 py-1 text-xs rounded-full font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
            ${t.type}
          </span>
          <span class="text-sm text-gray-800 dark:text-gray-200 font-medium">${t.note}</span>
        </div>
        <div class="text-xs text-gray-400 flex items-center gap-2">
          <span>${t.time}</span>
          <span class="text-green-500 font-bold">✓</span>
        </div>
      </div>
    `).join('');
  }

  // Render Dashboard Stat Counters
  function renderDashboardStats() {
    const d = window.appStore.data;
    const countObs = document.getElementById('countObservations');
    const countPlans = document.getElementById('countLessonPlans');
    const countStudents = document.getElementById('countTotalStudents');
    const countClasses = document.getElementById('countTotalClasses');

    if (countObs) countObs.textContent = d.observations ? d.observations.length : 0;
    if (countPlans) countPlans.textContent = (window.NGS_LESSON_PLANS_DATA ? window.NGS_LESSON_PLANS_DATA.length : (d.lessonPlans ? d.lessonPlans.length : 37));
    if (countStudents) countStudents.textContent = d.students ? d.students.length : 36;
    if (countClasses) {
      const uniqueClasses = new Set((d.schedule || []).map(s => s.class));
      countClasses.textContent = uniqueClasses.size || 3;
    }
  }

  // Charts Initialization (Listening Overview & Quality)
  function initCharts() {
    const weeklyCanvas = document.getElementById('weeklyChart');
    const qualityCanvas = document.getElementById('qualityChart');

    if (weeklyCanvas && typeof Chart !== 'undefined') {
      if (weeklyChartInstance) weeklyChartInstance.destroy();
      const wh = window.appStore.data.weeklyHours || { Mon: 5, Tue: 6, Wed: 5, Thu: 5.5, Fri: 5, Sat: 4, Sun: 0 };
      
      weeklyChartInstance = new Chart(weeklyCanvas, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'ម៉ោងបង្រៀន',
            data: [wh.Mon, wh.Tue, wh.Wed, wh.Thu, wh.Fri, wh.Sat, wh.Sun],
            backgroundColor: [
              '#8b5cf6', '#ec4899', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#94a3b8'
            ],
            borderRadius: 8,
            barThickness: 24
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 8,
              ticks: { stepSize: 2, callback: val => `${val}h` },
              grid: { color: 'rgba(200, 200, 200, 0.15)' }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    }

    if (qualityCanvas && typeof Chart !== 'undefined') {
      if (qualityChartInstance) qualityChartInstance.destroy();
      qualityChartInstance = new Chart(qualityCanvas, {
        type: 'doughnut',
        data: {
          labels: ['ល្អប្រសើរ', 'ល្អណាស់', 'ល្អ', 'ត្រូវការកែលម្អ'],
          datasets: [{
            data: [65, 25, 10, 0],
            backgroundColor: ['#8b5cf6', '#ec4899', '#eab308', '#22c55e'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  }

  // Notification Toast Helper
  function showNotification(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `p-4 mb-2 rounded-xl shadow-lg border text-sm flex items-start gap-3 transition-all duration-300 transform translate-y-2 bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-800`;
    
    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `
      <span class="text-xl">${icon}</span>
      <div class="flex-1">
        <h4 class="font-bold text-gray-900 dark:text-white">${title}</h4>
        <p class="text-gray-600 dark:text-gray-300 text-xs mt-0.5">${message}</p>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  window.showNotification = showNotification;

  /* ================== LUCKY WHEEL & NUMBER SPINNER MODAL ================== */
  const wheelModal = document.getElementById('wheelModal');
  const btnOpenWheel = document.getElementById('btnOpenWheel');
  const btnCloseWheel = document.getElementById('btnCloseWheel');
  const btnTriggerSpin = document.getElementById('btnTriggerSpin');
  const wheelWinnerBox = document.getElementById('wheelWinnerBox');
  const wheelWinnerText = document.getElementById('wheelWinnerText');
  const wheelWinnerNote = document.getElementById('wheelWinnerNote');
  const wheelHistoryContainer = document.getElementById('wheelHistoryContainer');
  const wheelHistoryList = document.getElementById('wheelHistoryList');
  const wheelRemainingBadge = document.getElementById('wheelRemainingBadge');
  const btnResetWheelPool = document.getElementById('btnResetWheelPool');
  const wheelEliminationMode = document.getElementById('wheelEliminationMode');

  // Tabs & Panels
  const wheelTabNumbers = document.getElementById('wheelTabNumbers');
  const wheelTabStudents = document.getElementById('wheelTabStudents');
  const wheelTabCustom = document.getElementById('wheelTabCustom');
  const wheelPanelNumbers = document.getElementById('wheelPanelNumbers');
  const wheelPanelStudents = document.getElementById('wheelPanelStudents');
  const wheelPanelCustom = document.getElementById('wheelPanelCustom');

  // Number Controls
  const wheelNumMin = document.getElementById('wheelNumMin');
  const wheelNumMax = document.getElementById('wheelNumMax');
  const wheelNumPrefix = document.getElementById('wheelNumPrefix');
  const btnApplyNumRange = document.getElementById('btnApplyNumRange');

  // Student Controls
  const wheelGradeSelect = document.getElementById('wheelGradeSelect');
  const wheelStudentCountBadge = document.getElementById('wheelStudentCountBadge');

  // Custom Controls
  const wheelCustomInput = document.getElementById('wheelCustomInput');
  const btnApplyCustomList = document.getElementById('btnApplyCustomList');

  let wheelMode = 'numbers'; // 'numbers' | 'students' | 'custom'
  let wheelItems = []; // current available pool
  let wheelOriginalPool = []; // full set for reset
  let wheelHistory = []; // array of picked items

  function getNumberList() {
    const minVal = parseInt(wheelNumMin?.value || '1', 10);
    const maxVal = parseInt(wheelNumMax?.value || '36', 10);
    const prefix = wheelNumPrefix?.value || 'num';
    const from = Math.min(minVal, maxVal);
    const to = Math.max(minVal, maxVal);
    const list = [];
    for (let i = from; i <= to; i++) {
      if (prefix === 'num') list.push(`លេខ ${i}`);
      else if (prefix === 'student') list.push(`សិស្សលេខ ${i}`);
      else if (prefix === 'group') list.push(`ក្រុមទី ${i}`);
      else list.push(String(i));
    }
    return list;
  }

  function getStudentList() {
    const grade = wheelGradeSelect?.value || 'all';
    const all = window.appStore?.data?.students || [];
    const cleanGrade = grade.replace(/^ថ្នាក់ទី\s*/, '').trim();
    const filtered = (grade === 'all') 
      ? all 
      : all.filter(s => (s.class === cleanGrade || s.class === grade || s.grade === grade || s.grade === `ថ្នាក់ទី ${cleanGrade}`));
    if (wheelStudentCountBadge) {
      wheelStudentCountBadge.textContent = `សិស្ស ${filtered.length} នាក់`;
    }
    return filtered.map(s => s.name);
  }

  function getCustomList() {
    const raw = wheelCustomInput?.value || '';
    return raw.split('\n').map(s => s.trim()).filter(s => s.length > 0);
  }

  function updateWheelRemaining() {
    if (wheelRemainingBadge) {
      wheelRemainingBadge.textContent = `នៅសល់៖ ${wheelItems.length} / ${wheelOriginalPool.length}`;
    }
  }

  function updateWheelHistoryUI() {
    if (!wheelHistoryContainer || !wheelHistoryList) return;
    if (wheelHistory.length === 0) {
      wheelHistoryContainer.classList.add('hidden');
      wheelHistoryList.innerHTML = '';
    } else {
      wheelHistoryContainer.classList.remove('hidden');
      wheelHistoryList.innerHTML = wheelHistory.map((item, idx) => `
        <span class="inline-block px-2 py-0.5 mr-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-[11px]">
          #${idx + 1}: ${item}
        </span>
      `).join('');
    }
  }

  function resetWheelPool(fullReset = true) {
    if (wheelMode === 'numbers') {
      wheelOriginalPool = getNumberList();
    } else if (wheelMode === 'students') {
      wheelOriginalPool = getStudentList();
    } else {
      wheelOriginalPool = getCustomList();
    }

    if (fullReset) {
      wheelItems = [...wheelOriginalPool];
      wheelHistory = [];
      updateWheelHistoryUI();
    }

    if (wheelWinnerBox) wheelWinnerBox.classList.add('hidden');
    updateWheelRemaining();
    window.classroomTools.drawWheel('wheelCanvas', wheelItems);
  }

  function setWheelMode(mode) {
    wheelMode = mode;

    // Update Tab Styles
    const tabs = [
      { id: 'numbers', btn: wheelTabNumbers, panel: wheelPanelNumbers },
      { id: 'students', btn: wheelTabStudents, panel: wheelPanelStudents },
      { id: 'custom', btn: wheelTabCustom, panel: wheelPanelCustom }
    ];

    tabs.forEach(t => {
      if (t.id === mode) {
        t.btn?.classList.add('bg-white', 'dark:bg-slate-800', 'text-purple-700', 'dark:text-purple-300', 'shadow-sm');
        t.btn?.classList.remove('text-slate-600', 'dark:text-slate-400');
        t.panel?.classList.remove('hidden');
      } else {
        t.btn?.classList.remove('bg-white', 'dark:bg-slate-800', 'text-purple-700', 'dark:text-purple-300', 'shadow-sm');
        t.btn?.classList.add('text-slate-600', 'dark:text-slate-400');
        t.panel?.classList.add('hidden');
      }
    });

    resetWheelPool(true);
  }

  function openWheelModal() {
    if (!wheelModal) return;
    wheelModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    // Default to numbers 1 to 36
    if (wheelItems.length === 0) {
      resetWheelPool(true);
    } else {
      window.classroomTools.drawWheel('wheelCanvas', wheelItems);
    }
    if (wheelWinnerBox) wheelWinnerBox.classList.add('hidden');
  }

  function closeWheelModal() {
    if (!wheelModal) return;
    wheelModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  // Attach Open / Close
  if (btnOpenWheel) btnOpenWheel.addEventListener('click', openWheelModal);
  if (btnCloseWheel) btnCloseWheel.addEventListener('click', closeWheelModal);

  // Mode Tabs
  if (wheelTabNumbers) wheelTabNumbers.addEventListener('click', () => setWheelMode('numbers'));
  if (wheelTabStudents) wheelTabStudents.addEventListener('click', () => setWheelMode('students'));
  if (wheelTabCustom) wheelTabCustom.addEventListener('click', () => setWheelMode('custom'));

  // Quick Preset Buttons (1-36, 1-40, 1-50, 1-99, 1-6)
  document.querySelectorAll('.wheel-preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const minVal = parseInt(btn.getAttribute('data-min') || '1', 10);
      const maxVal = parseInt(btn.getAttribute('data-max') || '36', 10);
      if (wheelNumMin) wheelNumMin.value = minVal;
      if (wheelNumMax) wheelNumMax.value = maxVal;

      // Highlight active preset button
      document.querySelectorAll('.wheel-preset-btn').forEach(b => {
        b.className = "wheel-preset-btn px-2.5 py-1 rounded-xl text-xs font-bold transition bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-50";
      });
      if (maxVal === 99) {
        btn.className = "wheel-preset-btn px-2.5 py-1 rounded-xl text-xs font-bold transition bg-amber-500 text-white shadow-sm";
      } else {
        btn.className = "wheel-preset-btn px-2.5 py-1 rounded-xl text-xs font-bold transition bg-purple-600 text-white shadow-sm";
      }

      resetWheelPool(true);
    });
  });

  // Apply range changes
  if (btnApplyNumRange) btnApplyNumRange.addEventListener('click', () => resetWheelPool(true));
  if (wheelNumPrefix) wheelNumPrefix.addEventListener('change', () => resetWheelPool(true));

  // Student Grade dropdown
  if (wheelGradeSelect) wheelGradeSelect.addEventListener('change', () => resetWheelPool(true));

  // Custom List load
  if (btnApplyCustomList) btnApplyCustomList.addEventListener('click', () => resetWheelPool(true));

  // Reset Pool button
  if (btnResetWheelPool) btnResetWheelPool.addEventListener('click', () => {
    resetWheelPool(true);
    if (typeof showToast === 'function') {
      showToast('បានកំណត់បញ្ជីឡើងវិញពេញលេញ!', 'success');
    }
  });

  // Trigger Spin
  if (btnTriggerSpin) {
    btnTriggerSpin.addEventListener('click', () => {
      if (wheelItems.length === 0) {
        window.showStandardDialog({
          title: 'បញ្ជីទទេ!',
          text: 'លេខ ឬឈ្មោះទាំងអស់ត្រូវបានហៅអស់ហើយ! សូមចុចប៊ូតុង Reset ដើម្បីបង្វិលឡើងវិញ។',
          icon: 'warning',
          confirmText: 'កំណត់ឡើងវិញ (Reset)',
          onConfirm: () => resetWheelPool(true)
        });
        return;
      }

      if (window.classroomTools.wheelSpinning) return;

      if (wheelWinnerBox) wheelWinnerBox.classList.add('hidden');
      btnTriggerSpin.disabled = true;
      btnTriggerSpin.classList.add('opacity-75', 'cursor-not-allowed');

      window.classroomTools.spinWheel('wheelCanvas', wheelItems, (winner, idx) => {
        btnTriggerSpin.disabled = false;
        btnTriggerSpin.classList.remove('opacity-75', 'cursor-not-allowed');

        if (wheelWinnerBox && wheelWinnerText) {
          wheelWinnerText.textContent = winner;
          if (wheelWinnerNote) {
            const isElim = wheelEliminationMode && wheelEliminationMode.checked;
            wheelWinnerNote.textContent = isElim ? `(បានដកចេញពីកងវិល មិនហៅជាន់ទៀតឡើយ)` : `(ស្ថិតក្នុងកងវិលនៅឡើយ)`;
          }
          wheelWinnerBox.classList.remove('hidden');
        }

        // Add to history
        wheelHistory.push(winner);
        updateWheelHistoryUI();

        // Check Elimination mode
        if (wheelEliminationMode && wheelEliminationMode.checked) {
          wheelItems.splice(idx, 1);
          updateWheelRemaining();
          // Redraw with remaining items after short delay
          setTimeout(() => {
            window.classroomTools.drawWheel('wheelCanvas', wheelItems);
          }, 1200);
        }
      });
    });
  }

  // Keyboard shortcut: Esc closes wheelModal, Space triggers spin
  window.addEventListener('keydown', (e) => {
    if (!wheelModal || wheelModal.classList.contains('hidden')) return;
    if (e.key === 'Escape') {
      closeWheelModal();
    } else if (e.key === ' ' && document.activeElement !== wheelCustomInput && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      btnTriggerSpin?.click();
    }
  });

  /* ================== CLASSROOM TIMER MODAL ================== */
  const timerModal = document.getElementById('timerModal');
  const btnOpenTimer = document.getElementById('btnOpenTimer');
  const btnCloseTimer = document.getElementById('btnCloseTimer');
  const timerDisplay = document.getElementById('timerDisplay');
  const btnTimerStart = document.getElementById('btnTimerStart');
  const btnTimerPause = document.getElementById('btnTimerPause');
  const btnTimerReset = document.getElementById('btnTimerReset');

  function openTimerModal() {
    if (!timerModal) return;
    timerModal.classList.remove('hidden');
  }

  if (btnOpenTimer) btnOpenTimer.addEventListener('click', openTimerModal);
  if (btnCloseTimer) btnCloseTimer.addEventListener('click', () => timerModal.classList.add('hidden'));

  if (btnTimerStart) {
    btnTimerStart.addEventListener('click', () => {
      window.classroomTools.startTimer(
        (formatted) => { if (timerDisplay) timerDisplay.textContent = formatted; },
        () => {
          showNotification('ដល់ម៉ោងហើយ!', 'ពេលវេលាដែលបានកំណត់ត្រូវបានបញ្ចប់!', 'success');
        }
      );
    });
  }

  if (btnTimerPause) {
    btnTimerPause.addEventListener('click', () => {
      window.classroomTools.pauseTimer();
    });
  }

  if (btnTimerReset) {
    btnTimerReset.addEventListener('click', () => {
      window.classroomTools.resetTimer(300, (formatted) => {
        if (timerDisplay) timerDisplay.textContent = formatted;
      });
    });
  }

  // Quick preset timer buttons (1m, 3m, 5m, 10m)
  document.querySelectorAll('.timer-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sec = parseInt(btn.dataset.seconds) || 300;
      window.classroomTools.resetTimer(sec, (formatted) => {
        if (timerDisplay) timerDisplay.textContent = formatted;
      });
    });
  });

  /* ================== GRADES MANAGEMENT VIEW ================== */
  let currentGradesFilterClass = 'all';
  function renderGradesTable(filterClass = currentGradesFilterClass) {
    currentGradesFilterClass = filterClass;
    const tableBody = document.getElementById('gradesTableBody');
    if (!tableBody) return;

    let allStudents = window.appStore.data.students || [];
    let studentsToRank = allStudents;
    if (filterClass !== 'all') {
      studentsToRank = allStudents.filter(s => s.class === filterClass);
    }

    const rankedStudents = window.gradeManager.getRankedStudents(studentsToRank);
    tableBody.innerHTML = rankedStudents.map((s, idx) => `
      <tr class="border-b border-gray-100 dark:border-slate-700 hover:bg-purple-50/50 dark:hover:bg-slate-800/50 transition">
        <td class="p-3 text-center font-bold text-gray-500">${idx + 1}</td>
        <td class="p-3 font-mono text-xs text-purple-600 dark:text-purple-400 font-semibold">${s.id}</td>
        <td class="p-3 font-medium text-gray-900 dark:text-white">${s.name}</td>
        <td class="p-3 text-center text-xs text-gray-500">${s.sex}</td>
        <td class="p-3 text-center font-medium">${s.class}</td>
        <td class="p-3 text-center"><input type="number" class="w-14 text-center border rounded py-1 px-1 text-sm bg-white dark:bg-slate-800 grade-input" data-id="${s.id}" data-field="q1" value="${s.q1}"></td>
        <td class="p-3 text-center"><input type="number" class="w-14 text-center border rounded py-1 px-1 text-sm bg-white dark:bg-slate-800 grade-input" data-id="${s.id}" data-field="q2" value="${s.q2}"></td>
        <td class="p-3 text-center"><input type="number" class="w-14 text-center border rounded py-1 px-1 text-sm bg-white dark:bg-slate-800 grade-input" data-id="${s.id}" data-field="midterm" value="${s.midterm}"></td>
        <td class="p-3 text-center"><input type="number" class="w-14 text-center border rounded py-1 px-1 text-sm bg-white dark:bg-slate-800 grade-input" data-id="${s.id}" data-field="final" value="${s.final}"></td>
        <td class="p-3 text-center font-bold text-purple-700 dark:text-purple-300">${s.score100}</td>
        <td class="p-3 text-center">
          <span class="px-2 py-0.5 rounded text-xs font-bold ${
            s.letterGrade === 'A' ? 'bg-green-100 text-green-700' :
            s.letterGrade === 'B' ? 'bg-blue-100 text-blue-700' :
            s.letterGrade === 'C' ? 'bg-yellow-100 text-yellow-700' :
            s.letterGrade === 'D' ? 'bg-orange-100 text-orange-700' :
            'bg-red-100 text-red-700'
          }">${s.letterGrade} (${s.khmerGrade})</span>
        </td>
        <td class="p-3 text-center font-extrabold text-gray-700 dark:text-gray-200">#${s.rank}</td>
        <td class="p-3 text-center">
          <button class="text-red-500 hover:text-red-700 btn-delete-student text-xs px-2 py-1 rounded hover:bg-red-50" data-id="${s.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');

    // Attach listeners for grades class filter buttons
    document.querySelectorAll('.grades-class-btn').forEach(btn => {
      btn.onclick = () => {
        const cls = btn.dataset.class;
        document.querySelectorAll('.grades-class-btn').forEach(b => {
          if (b.dataset.class === cls) {
            b.className = 'grades-class-btn px-3 py-1 rounded-xl font-bold transition bg-purple-600 text-white shadow-xs';
          } else {
            b.className = 'grades-class-btn px-2.5 py-1 rounded-xl font-bold transition bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-50';
          }
        });
        renderGradesTable(cls);
      };
    });

    // Attach listeners for live grade editing
    document.querySelectorAll('.grade-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        const field = e.target.dataset.field;
        const val = parseFloat(e.target.value) || 0;
        const student = window.appStore.data.students.find(s => s.id === id);
        if (student) {
          student[field] = val;
          window.appStore.save();
          renderGradesTable();
        }
      });
    });

    // Delete student button
    document.querySelectorAll('.btn-delete-student').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        window.showStandardDialog({
          title: 'បញ្ជាក់ការលុបសិស្ស',
          text: `តើលោកគ្រូពិតជាចង់លុបសិស្សអត្តលេខ ${id} នេះមែនទេ?`,
          icon: 'warning',
          showCancel: true,
          confirmText: 'លុបចេញ',
          cancelText: 'បោះបង់',
          onConfirm: () => {
            window.appStore.data.students = window.appStore.data.students.filter(s => s.id !== id);
            window.appStore.save();
            renderGradesTable();
            showNotification('លុបរួចរាល់', `បានលុបសិស្សអត្តលេខ ${id}`, 'info');
          }
        });
      });
    });
  }

  // Export CSV button
  const btnExportGradesCSV = document.getElementById('btnExportGradesCSV');
  if (btnExportGradesCSV) {
    btnExportGradesCSV.addEventListener('click', () => {
      const ranked = window.gradeManager.getRankedStudents();
      window.gradeManager.exportCSV(ranked);
    });
  }

  // Add new student button & modal
  const btnOpenAddStudent = document.getElementById('btnOpenAddStudent');
  const addStudentModal = document.getElementById('addStudentModal');
  const btnCloseAddStudent = document.getElementById('btnCloseAddStudent');
  const btnSaveStudent = document.getElementById('btnSaveStudent');

  if (btnOpenAddStudent && addStudentModal) {
    btnOpenAddStudent.addEventListener('click', () => addStudentModal.classList.remove('hidden'));
    btnCloseAddStudent.addEventListener('click', () => addStudentModal.classList.add('hidden'));
    
    btnSaveStudent.addEventListener('click', () => {
      const name = document.getElementById('newStudentName').value.trim();
      const sex = document.getElementById('newStudentSex').value;
      const sClass = document.getElementById('newStudentClass').value;
      if (!name) {
        window.showStandardDialog({
          title: 'ខ្វះទិន្នន័យ',
          text: 'សូមបញ្ចូលឈ្មោះសិស្ស!',
          icon: 'warning'
        });
        return;
      }
      const newId = `NGS-${(window.appStore.data.students.length + 1).toString().padStart(3, '0')}`;
      window.appStore.data.students.push({
        id: newId,
        name: name,
        sex: sex,
        class: sClass,
        q1: 15,
        q2: 15,
        midterm: 40,
        final: 42,
        note: 'ទើបបញ្ចូល'
      });
      window.appStore.save();
      addStudentModal.classList.add('hidden');
      renderGradesTable();
      showNotification('ជោគជ័យ', `បានបន្ថែមសិស្ស «${name}» ជោគជ័យ!`, 'success');
    });
  }

  /* ================== ATTENDANCE VIEW ================== */
  let currentAttendanceFilterClass = 'all';
  function renderAttendanceTable(filterClass = currentAttendanceFilterClass) {
    currentAttendanceFilterClass = filterClass;
    const container = document.getElementById('attendanceListContainer');
    if (!container) return;
    let all = window.appStore.data.students || [];
    let students = (filterClass === 'all') ? all : all.filter(s => s.class === filterClass);
    const today = new Date().toISOString().slice(0, 10);
    const dateAttendance = (window.appStore.data.attendance && window.appStore.data.attendance[today]) || {};

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        ${students.map((s, idx) => {
          const status = dateAttendance[s.id] || 'P'; // P = Present, A = Absent, L = Leave
          return `
            <div class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
              <div class="flex items-center gap-3">
                <span class="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center">${idx + 1}</span>
                <div>
                  <h4 class="font-bold text-sm text-gray-800 dark:text-white">${s.name}</h4>
                  <span class="text-xs text-gray-400 font-mono">${s.id} · ${s.sex}</span>
                </div>
              </div>
              <div class="flex gap-1">
                <button class="px-2.5 py-1 text-xs rounded-lg font-bold transition ${status === 'P' ? 'bg-green-600 text-white shadow' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'} btn-att" data-id="${s.id}" data-status="P">វត្តមាន</button>
                <button class="px-2.5 py-1 text-xs rounded-lg font-bold transition ${status === 'L' ? 'bg-amber-500 text-white shadow' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'} btn-att" data-id="${s.id}" data-status="L">ច្បាប់</button>
                <button class="px-2.5 py-1 text-xs rounded-lg font-bold transition ${status === 'A' ? 'bg-red-600 text-white shadow' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'} btn-att" data-id="${s.id}" data-status="A">អវត្ត</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Attach listeners for attendance class filter buttons
    document.querySelectorAll('.attendance-class-btn').forEach(btn => {
      btn.onclick = () => {
        const cls = btn.dataset.class;
        document.querySelectorAll('.attendance-class-btn').forEach(b => {
          if (b.dataset.class === cls) {
            b.className = 'attendance-class-btn px-3 py-1 rounded-xl font-bold transition bg-purple-600 text-white shadow-xs';
          } else {
            b.className = 'attendance-class-btn px-2.5 py-1 rounded-xl font-bold transition bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-50';
          }
        });
        renderAttendanceTable(cls);
      };
    });

    // Click handler for attendance buttons
    document.querySelectorAll('.btn-att').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const status = btn.dataset.status;
        if (!window.appStore.data.attendance) window.appStore.data.attendance = {};
        if (!window.appStore.data.attendance[today]) window.appStore.data.attendance[today] = {};
        window.appStore.data.attendance[today][id] = status;
        window.appStore.save();
        renderAttendanceTable();
      });
    });
  }

  // Mark all present button
  const btnMarkAllPresent = document.getElementById('btnMarkAllPresent');
  if (btnMarkAllPresent) {
    btnMarkAllPresent.addEventListener('click', () => {
      const today = new Date().toISOString().slice(0, 10);
      if (!window.appStore.data.attendance) window.appStore.data.attendance = {};
      window.appStore.data.attendance[today] = {};
      (window.appStore.data.students || []).forEach(s => {
        window.appStore.data.attendance[today][s.id] = 'P';
      });
      window.appStore.save();
      renderAttendanceTable();
      showNotification('ស្រង់វត្តមាន', 'បានកត់ត្រាវត្តមានសិស្សទាំងអស់រួចរាល់!', 'success');
    });
  }

  /* ================== SCHEDULE (TIMETABLE) VIEW ================== */
  function renderScheduleTable() {
    const listEl = document.getElementById('scheduleList');
    if (!listEl) return;
    const schedule = window.appStore.data.schedule || [];

    const days = ['ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
    listEl.innerHTML = days.map(day => {
      const items = schedule.filter(s => s.day === day);
      return `
        <div class="card-soft p-4 mb-4">
          <div class="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-slate-700">
            <h3 class="font-bold text-base text-purple-700 dark:text-purple-400 flex items-center gap-2">
              <i class="fa-regular fa-calendar-check"></i> ថ្ងៃ${day}
            </h3>
            <span class="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full font-medium">
              ${items.length} ម៉ោងបង្រៀន
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            ${items.length === 0 ? `<p class="text-xs text-gray-400 col-span-3 py-2">គ្មានម៉ោងបង្រៀន</p>` : items.map(it => `
              <div class="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700">
                <span class="text-xs text-purple-600 dark:text-purple-400 font-semibold">${it.period}</span>
                <h4 class="font-bold text-gray-800 dark:text-white mt-1">${it.subject} - <span class="text-purple-600">${it.class}</span></h4>
                <p class="text-xs text-gray-500 mt-1 flex items-center gap-1"><i class="fa-solid fa-location-dot text-gray-400"></i> ${it.room}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  /* ================== LESSON PLANS VIEW ================== */
  function renderLessonPlans() {
    if (window.lessonPlansManager) {
      window.lessonPlansManager.render();
      return;
    }
    const listEl = document.getElementById('lessonPlansList');
    if (!listEl) return;
    const plans = window.appStore.data.lessonPlans || [];

    listEl.innerHTML = plans.map(p => `
      <div class="card-soft p-5 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xl shrink-0">
            <i class="fa-solid fa-book-open"></i>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-xs font-bold ${p.status === 'បានផ្ទៀងផ្ទាត់' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}">${p.status}</span>
              <span class="text-xs text-gray-400 font-mono">${p.week} · ${p.date}</span>
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white text-base">${p.title}</h3>
            <p class="text-xs text-gray-500 mt-1">${p.grade} · មុខវិជ្ជា៖ ${p.subject} · ស្តង់ដារ ៥ ជំហាន NGS (ពិន្ទុ៖ <strong class="text-purple-600">${p.score}/50</strong>)</p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <a href="${p.driveLink}" target="_blank" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 transition shadow">
            <i class="fa-solid fa-cloud-arrow-down"></i> បើកឯកសារ Drive
          </a>
        </div>
      </div>
    `).join('');
  }

  // Add Lesson Plan Modal & Button
  const btnOpenAddPlan = document.getElementById('btnOpenAddPlan');
  const addPlanModal = document.getElementById('addPlanModal');
  const btnCloseAddPlan = document.getElementById('btnCloseAddPlan');
  const btnSavePlan = document.getElementById('btnSavePlan');

  if (btnOpenAddPlan && addPlanModal) {
    btnOpenAddPlan.addEventListener('click', () => addPlanModal.classList.remove('hidden'));
    btnCloseAddPlan.addEventListener('click', () => addPlanModal.classList.add('hidden'));

    btnSavePlan.addEventListener('click', () => {
      const title = document.getElementById('newPlanTitle').value.trim();
      const grade = document.getElementById('newPlanGrade').value;
      const week = document.getElementById('newPlanWeek').value.trim();
      const drive = document.getElementById('newPlanDrive').value.trim();

      if (!title) {
        window.showStandardDialog({
          title: 'ខ្វះទិន្នន័យ',
          text: 'សូមបញ្ចូលចំណងជើងកិច្ចតែងការ!',
          icon: 'warning'
        });
        return;
      }

      window.appStore.data.lessonPlans.unshift({
        id: Date.now(),
        title,
        grade,
        subject: window.appStore.data.profile.subject || 'គណិតវិទ្យា',
        week: week || 'សប្ដាហ៍ថ្មី',
        date: new Date().toISOString().slice(0, 10),
        status: 'រង់ចាំការពិនិត្យ',
        stepsCount: 5,
        score: 0,
        driveLink: drive || 'https://drive.google.com/'
      });

      window.appStore.save();
      addPlanModal.classList.add('hidden');
      renderLessonPlans();
      showNotification('ជោគជ័យ', 'បានដាក់កិច្ចតែងការបង្រៀនថ្មីជោគជ័យ!', 'success');
    });
  }

  /* ================== PORTFOLIO & ACHIEVEMENTS ================== */
  function renderPortfolios() {
    const listEl = document.getElementById('portfolioList');
    if (!listEl) return;
    const items = window.appStore.data.portfolios || [];

    listEl.innerHTML = items.map(it => `
      <div class="card-soft p-5 mb-4">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3 mb-2">
            <span class="px-2.5 py-1 text-xs rounded-full font-bold bg-amber-100 text-amber-800">
              <i class="fa-solid fa-award"></i> ${it.category}
            </span>
            <span class="text-xs text-gray-400 font-mono">${it.year}</span>
          </div>
        </div>
        <h3 class="font-bold text-gray-900 dark:text-white text-base">${it.title}</h3>
        <p class="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">${it.description}</p>
      </div>
    `).join('');
  }

  /* ================== SETTINGS & PROFILE VIEW ================== */
  function loadSettingsForm() {
    const p = window.appStore.data.profile;
    document.getElementById('settingTeacherName').value = p.name || '';
    document.getElementById('settingUsername').value = p.username || '';
    document.getElementById('settingRole').value = p.role || '';
    document.getElementById('settingSubject').value = p.subject || '';
    document.getElementById('settingSchool').value = p.schoolName || '';
    document.getElementById('settingYear').value = p.academicYear || '';
    const settingAvatarEl = document.getElementById('settingAvatarPreview');
    if (settingAvatarEl) settingAvatarEl.src = p.avatar || 'teacher-profile.jpg';
  }

  // Upload/Change Avatar from Settings
  const settingAvatarInput = document.getElementById('settingAvatarInput');
  if (settingAvatarInput) {
    settingAvatarInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const p = window.appStore.data.profile;
          p.avatar = event.target.result;
          window.appStore.save();
          renderProfile();
          showNotification('បានផ្លាស់ប្ដូររូបថត', 'រូបថតប្រវត្តិរូបត្រូវបានផ្លាស់ប្ដូរដោយជោគជ័យ!', 'success');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const btnSaveSettings = document.getElementById('btnSaveSettings');
  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', () => {
      const p = window.appStore.data.profile;
      p.name = document.getElementById('settingTeacherName').value.trim();
      p.username = document.getElementById('settingUsername').value.trim();
      p.role = document.getElementById('settingRole').value.trim();
      p.subject = document.getElementById('settingSubject').value.trim();
      p.schoolName = document.getElementById('settingSchool').value.trim();
      p.academicYear = document.getElementById('settingYear').value.trim();

      window.appStore.save();
      renderProfile();
      showNotification('រក្សាទុកជោគជ័យ', 'ព័ត៌មានប្រវត្តិរូប និងការកំណត់ត្រូវបានផ្លាស់ប្ដូរ!', 'success');
    });
  }

  // Backup JSON Download
  const btnBackupJSON = document.getElementById('btnBackupJSON');
  if (btnBackupJSON) {
    btnBackupJSON.addEventListener('click', () => {
      window.appStore.exportJSON();
      showNotification('Backup', 'បានទាញយកឯកសារបម្រុងទុកទិន្នន័យ (JSON) រួចរាល់!', 'success');
    });
  }

  // Restore JSON Upload
  const fileRestoreJSON = document.getElementById('fileRestoreJSON');
  if (fileRestoreJSON) {
    fileRestoreJSON.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const success = window.appStore.importJSON(event.target.result);
        if (success) {
          renderProfile();
          renderDashboardStats();
          renderTasksList();
          showNotification('ស្ដារទិន្នន័យជោគជ័យ', 'ទិន្នន័យទាំងអស់ត្រូវបាននាំចូលរួចរាល់!', 'success');
        } else {
          window.showStandardDialog({
            title: 'ឯកសារមិនត្រឹមត្រូវ',
            text: 'ឯកសារ JSON មិនត្រឹមត្រូវ សូមព្យាយាមម្ដងទៀត!',
            icon: 'error'
          });
        }
      };
      reader.readAsText(file);
    });
  }

  // Theme Toggle
  const btnToggleTheme = document.getElementById('btnToggleTheme');
  if (btnToggleTheme) {
    btnToggleTheme.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('BONORNG_THEME', isDark ? 'dark' : 'light');
    });
  }

  // Load saved theme
  if (localStorage.getItem('BONORNG_THEME') === 'dark') {
    document.documentElement.classList.add('dark');
  }

  // Print button
  const btnPrintReport = document.getElementById('btnPrintReport');
  if (btnPrintReport) {
    btnPrintReport.addEventListener('click', () => {
      window.print();
    });
  }

  // Quick Action Buttons on Welcome Banner
  const btnBannerAddPlan = document.getElementById('btnBannerAddPlan');
  if (btnBannerAddPlan) {
    btnBannerAddPlan.addEventListener('click', () => {
      switchTab('lessonplans');
      if (addPlanModal) addPlanModal.classList.remove('hidden');
    });
  }

  const btnBannerPortfolio = document.getElementById('btnBannerPortfolio');
  if (btnBannerPortfolio) {
    btnBannerPortfolio.addEventListener('click', () => {
      switchTab('portfolio');
    });
  }

  // Initial tab render
  switchTab('dashboard');
});

