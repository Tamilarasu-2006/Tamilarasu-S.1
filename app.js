/**
 * SyncPulse — Standalone Team Availability Tracker Web Page
 * Pure Client-Side Storage & Dynamic Reactive UI
 */

const STORAGE_KEYS = {
  USERS: 'syncpulse_users_v2',
  ACTIVITY: 'syncpulse_activity_v2',
  THEME: 'syncpulse_theme',
  SOUND: 'syncpulse_sound',
  VIEW: 'syncpulse_view'
};

// Initial Seed Data for first run or reset
const INITIAL_USERS = [
  {
    id: 1,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@acme.corp',
    initials: 'AS',
    role: 'Principal Architect',
    department: 'Engineering',
    timezone: 'IST (UTC+5:30)',
    statusMessage: 'Reviewing PRs & System Design 🚀',
    statusEmoji: '🚀',
    avatarColor: '#6366f1',
    isAvailable: true,
    lastUpdated: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 2,
    name: 'Maya Patel',
    email: 'maya.patel@acme.corp',
    initials: 'MP',
    role: 'Lead UI/UX Designer',
    department: 'Design',
    timezone: 'IST (UTC+5:30)',
    statusMessage: 'Design sprint workshop until 4 PM 🎨',
    statusEmoji: '🎨',
    avatarColor: '#ec4899',
    isAvailable: false,
    lastUpdated: new Date(Date.now() - 45 * 60000).toISOString()
  },
  {
    id: 3,
    name: 'Rohan Gupta',
    email: 'rohan.gupta@acme.corp',
    initials: 'RG',
    role: 'Senior Full Stack Dev',
    department: 'Engineering',
    timezone: 'PST (UTC-8:00)',
    statusMessage: 'Pair programming on payment gateway 💻',
    statusEmoji: '💻',
    avatarColor: '#10b981',
    isAvailable: true,
    lastUpdated: new Date(Date.now() - 18 * 60000).toISOString()
  },
  {
    id: 4,
    name: 'Sara Khan',
    email: 'sara.khan@acme.corp',
    initials: 'SK',
    role: 'Senior Product Manager',
    department: 'Product',
    timezone: 'GMT (UTC+0:00)',
    statusMessage: 'Client roadmap sync 📞',
    statusEmoji: '📞',
    avatarColor: '#f59e0b',
    isAvailable: false,
    lastUpdated: new Date(Date.now() - 120 * 60000).toISOString()
  },
  {
    id: 5,
    name: 'Alex Chen',
    email: 'alex.chen@acme.corp',
    initials: 'AC',
    role: 'DevOps & Cloud Lead',
    department: 'Infrastructure',
    timezone: 'EST (UTC-5:00)',
    statusMessage: 'Kubernetes cluster maintenance ⚡',
    statusEmoji: '⚡',
    avatarColor: '#8b5cf6',
    isAvailable: true,
    lastUpdated: new Date(Date.now() - 60 * 60000).toISOString()
  },
  {
    id: 6,
    name: 'Elena Rostova',
    email: 'elena.rostova@acme.corp',
    initials: 'ER',
    role: 'Growth & Marketing Lead',
    department: 'Marketing',
    timezone: 'CET (UTC+1:00)',
    statusMessage: 'Campaign launch optimization 📈',
    statusEmoji: '📈',
    avatarColor: '#06b6d4',
    isAvailable: true,
    lastUpdated: new Date(Date.now() - 35 * 60000).toISOString()
  },
  {
    id: 7,
    name: 'David Kim',
    email: 'david.kim@acme.corp',
    initials: 'DK',
    role: 'QA Automation Engineer',
    department: 'Quality',
    timezone: 'KST (UTC+9:00)',
    statusMessage: 'Running regression test suites 🧪',
    statusEmoji: '🧪',
    avatarColor: '#14b8a6',
    isAvailable: false,
    lastUpdated: new Date(Date.now() - 90 * 60000).toISOString()
  },
  {
    id: 8,
    name: 'Priya Nair',
    email: 'priya.nair@acme.corp',
    initials: 'PN',
    role: 'AI/ML Research Scientist',
    department: 'AI & Data',
    timezone: 'IST (UTC+5:30)',
    statusMessage: 'Fine-tuning LLM agent models 🧠',
    statusEmoji: '🧠',
    avatarColor: '#f43f5e',
    isAvailable: true,
    lastUpdated: new Date(Date.now() - 15 * 60000).toISOString()
  }
];

const INITIAL_ACTIVITY = [
  { id: 1, userName: 'Aarav Sharma', action: 'switched status to Available', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 2, userName: 'Rohan Gupta', action: 'switched status to Available', timestamp: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: 3, userName: 'Elena Rostova', action: 'set status to "Campaign launch optimization 📈"', timestamp: new Date(Date.now() - 35 * 60000).toISOString() },
  { id: 4, userName: 'Maya Patel', action: 'set status to "Design sprint workshop until 4 PM 🎨"', timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 5, userName: 'Alex Chen', action: 'switched status to Available', timestamp: new Date(Date.now() - 60 * 60000).toISOString() },
];

// Local Storage Manager
const Storage = {
  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!data) {
        Storage.setUsers(INITIAL_USERS);
        return INITIAL_USERS;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_USERS;
    }
  },

  setUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getActivity() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      if (!data) {
        Storage.setActivity(INITIAL_ACTIVITY);
        return INITIAL_ACTIVITY;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_ACTIVITY;
    }
  },

  setActivity(activity) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activity.slice(0, 30)));
  },

  logActivity(userName, action) {
    const activity = Storage.getActivity();
    const newLog = {
      id: Date.now(),
      userName,
      action,
      timestamp: new Date().toISOString()
    };
    activity.unshift(newLog);
    Storage.setActivity(activity);
  }
};

// Application State
const state = {
  users: Storage.getUsers(),
  filterStatus: 'all', // 'all' | 'available' | 'away'
  filterDepartment: 'all',
  searchQuery: '',
  viewMode: localStorage.getItem(STORAGE_KEYS.VIEW) || 'grid',
  theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'dark',
  soundEnabled: localStorage.getItem(STORAGE_KEYS.SOUND) !== 'false',
  selectedColor: '#6366f1',
};

// DOM Selectors
const DOM = {
  // Stat elements
  statAvailable: document.querySelector('#stat-available'),
  statAway: document.querySelector('#stat-away'),
  statTotal: document.querySelector('#stat-total'),
  statRate: document.querySelector('#stat-rate'),
  statDeptCount: document.querySelector('#stat-dept-count'),
  statProgressAvailable: document.querySelector('#stat-progress-available'),

  // Filter & Search
  searchInput: document.querySelector('#search-input'),
  clearSearchBtn: document.querySelector('#clear-search'),
  statusTabs: document.querySelectorAll('.tab-btn'),
  countAll: document.querySelector('#count-all'),
  countAvailable: document.querySelector('#count-available'),
  countAway: document.querySelector('#count-away'),
  deptFilter: document.querySelector('#department-filter'),
  filterStatusBar: document.querySelector('#filter-status-bar'),
  filterSummaryText: document.querySelector('#filter-summary-text'),
  btnClearAllFilters: document.querySelector('#btn-clear-all-filters'),

  // Container
  usersContainer: document.querySelector('#users-container'),
  emptyState: document.querySelector('#empty-state'),
  btnEmptyReset: document.querySelector('#btn-empty-reset'),

  // Top Nav & Controls
  liveTime: document.querySelector('#live-time'),
  liveTimezone: document.querySelector('#live-timezone'),
  btnThemeToggle: document.querySelector('#btn-theme-toggle'),
  themeIcon: document.querySelector('#theme-icon'),
  btnSoundToggle: document.querySelector('#btn-sound-toggle'),
  soundIcon: document.querySelector('#sound-icon'),
  btnAddMember: document.querySelector('#btn-add-member'),
  btnViewGrid: document.querySelector('#btn-view-grid'),
  btnViewList: document.querySelector('#btn-view-list'),
  btnBulkMenu: document.querySelector('#btn-bulk-menu'),
  bulkDropdown: document.querySelector('#bulk-dropdown'),
  btnAllAvailable: document.querySelector('#btn-all-available'),
  btnAllAway: document.querySelector('#btn-all-away'),
  btnExportCsv: document.querySelector('#btn-export-csv'),
  btnExportJson: document.querySelector('#btn-export-json'),
  btnResetDemo: document.querySelector('#btn-reset-demo'),

  // Add / Edit Member Modal
  memberModal: document.querySelector('#member-modal'),
  modalTitle: document.querySelector('#modal-title'),
  memberForm: document.querySelector('#member-form'),
  memberId: document.querySelector('#member-id'),
  inputName: document.querySelector('#input-name'),
  inputEmail: document.querySelector('#input-email'),
  inputRole: document.querySelector('#input-role'),
  inputDepartment: document.querySelector('#input-department'),
  inputTimezone: document.querySelector('#input-timezone'),
  inputStatusMsg: document.querySelector('#input-status-msg'),
  inputIsAvailable: document.querySelector('#input-is-available'),
  modalAvatarPreview: document.querySelector('#modal-avatar-preview'),
  modalAvatarInitials: document.querySelector('#modal-avatar-initials'),
  colorSwatches: document.querySelectorAll('.color-swatch'),
  btnCloseModal: document.querySelector('#btn-close-modal'),
  btnCancelModal: document.querySelector('#btn-cancel-modal'),
  btnSaveText: document.querySelector('#btn-save-text'),

  // Quick Status Modal
  statusModal: document.querySelector('#status-modal'),
  statusModalSubtitle: document.querySelector('#status-modal-subtitle'),
  statusForm: document.querySelector('#status-form'),
  statusUserId: document.querySelector('#status-user-id'),
  inputCustomStatus: document.querySelector('#input-custom-status'),
  btnCloseStatusModal: document.querySelector('#btn-close-status-modal'),
  btnClearStatus: document.querySelector('#btn-clear-status'),
  presetChips: document.querySelectorAll('.chip-btn'),

  // Activity Drawer
  btnActivityLog: document.querySelector('#btn-activity-log'),
  activityDrawer: document.querySelector('#activity-drawer'),
  btnCloseDrawer: document.querySelector('#btn-close-drawer'),
  activityList: document.querySelector('#activity-list'),
  activityBadge: document.querySelector('#activity-badge'),

  // Toasts
  toastContainer: document.querySelector('#toast-container'),
};

// ==========================================================================
// Web Audio Synthesizer (Micro-interactions)
// ==========================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playToggle(isOnline) {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      const now = this.ctx.currentTime;
      if (isOnline) {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      } else {
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.12);
      }

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  playPop() {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }
}

const soundFX = new SoundFX();

// ==========================================================================
// Toast System
// ==========================================================================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? 'ph-fill ph-check-circle' : 'ph-fill ph-warning-circle';
  toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==========================================================================
// Timezone & Live Clock
// ==========================================================================
function updateLiveClock() {
  const now = new Date();
  DOM.liveTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  try {
    const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    DOM.liveTimezone.textContent = tzName.split('/')[1] || tzName;
  } catch (e) {
    DOM.liveTimezone.textContent = 'Local';
  }
}
setInterval(updateLiveClock, 1000);
updateLiveClock();

// ==========================================================================
// Theme Management
// ==========================================================================
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  DOM.themeIcon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
}

function toggleTheme() {
  soundFX.playPop();
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

// ==========================================================================
// Sound Toggle
// ==========================================================================
function updateSoundIcon() {
  DOM.soundIcon.className = state.soundEnabled ? 'ph ph-speaker-high' : 'ph ph-speaker-slash';
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  localStorage.setItem(STORAGE_KEYS.SOUND, state.soundEnabled);
  updateSoundIcon();
  if (state.soundEnabled) soundFX.playPop();
  showToast(state.soundEnabled ? 'Sound feedback enabled' : 'Sound feedback muted');
}

// ==========================================================================
// Filter & Search Logic
// ==========================================================================
function getFilteredUsers() {
  let result = [...state.users];

  // 1. Status Tab Filter
  if (state.filterStatus === 'available') {
    result = result.filter(u => u.isAvailable);
  } else if (state.filterStatus === 'away') {
    result = result.filter(u => !u.isAvailable);
  }

  // 2. Department Filter
  if (state.filterDepartment !== 'all') {
    result = result.filter(u => u.department && u.department.toLowerCase() === state.filterDepartment.toLowerCase());
  }

  // 3. Search Query
  if (state.searchQuery.trim() !== '') {
    const q = state.searchQuery.toLowerCase().trim();
    result = result.filter(u =>
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q)) ||
      (u.statusMessage && u.statusMessage.toLowerCase().includes(q)) ||
      (u.department && u.department.toLowerCase().includes(q))
    );
  }

  // Sort available first, then alphabetical by name
  return result.sort((a, b) => {
    if (a.isAvailable === b.isAvailable) {
      return a.name.localeCompare(b.name);
    }
    return a.isAvailable ? -1 : 1;
  });
}

// ==========================================================================
// Stats & Counts Computation
// ==========================================================================
function updateStats() {
  const total = state.users.length;
  const available = state.users.filter(u => u.isAvailable).length;
  const away = total - available;
  const rate = total > 0 ? Math.round((available / total) * 100) : 0;

  const departments = new Set(state.users.map(u => u.department).filter(Boolean)).size;

  DOM.statAvailable.textContent = available;
  DOM.statAway.textContent = away;
  DOM.statTotal.textContent = total;
  DOM.statRate.textContent = `${rate}% Active`;
  DOM.statDeptCount.textContent = `${departments} Departments`;
  DOM.statProgressAvailable.style.width = `${rate}%`;

  DOM.countAll.textContent = total;
  DOM.countAvailable.textContent = available;
  DOM.countAway.textContent = away;

  // Update Filter Active Bar
  const isFiltered = state.filterStatus !== 'all' || state.filterDepartment !== 'all' || state.searchQuery !== '';
  if (isFiltered) {
    DOM.filterStatusBar.style.display = 'flex';
    let filterDetails = [];
    if (state.filterStatus !== 'all') filterDetails.push(`Status: ${state.filterStatus.toUpperCase()}`);
    if (state.filterDepartment !== 'all') filterDetails.push(`Department: ${state.filterDepartment}`);
    if (state.searchQuery) filterDetails.push(`Search: "${state.searchQuery}"`);
    DOM.filterSummaryText.textContent = `Showing filtered members (${filterDetails.join(' • ')})`;
  } else {
    DOM.filterStatusBar.style.display = 'none';
  }
}

// ==========================================================================
// Rendering
// ==========================================================================
function render() {
  updateStats();
  const filteredUsers = getFilteredUsers();

  if (filteredUsers.length === 0) {
    DOM.usersContainer.innerHTML = '';
    DOM.emptyState.style.display = 'flex';
    return;
  }

  DOM.emptyState.style.display = 'none';
  DOM.usersContainer.className = `users-grid ${state.viewMode === 'list' ? 'list-view' : ''}`;

  DOM.usersContainer.innerHTML = filteredUsers.map((user) => {
    const isOnline = Boolean(user.isAvailable);
    const statusText = isOnline ? 'Available' : 'Away';
    const statusMsg = user.statusMessage || 'Click to set status...';
    const hasStatus = Boolean(user.statusMessage);

    return `
      <article class="user-card ${isOnline ? 'is-available' : ''}" data-id="${user.id}">
        <div class="user-card-top">
          <div class="user-profile-group">
            <div class="avatar-wrapper">
              <div class="avatar" style="background: ${user.avatarColor || '#6366f1'};">
                ${user.initials || 'TM'}
              </div>
              <span class="avatar-beacon ${isOnline ? 'online' : ''}"></span>
            </div>
            <div class="user-details">
              <h3 class="user-name">${user.name}</h3>
              <span class="user-role-title">${user.role || 'Team Member'}</span>
              <a href="mailto:${user.email}" class="user-email-link" title="Send email to ${user.email}">
                <i class="ph ph-envelope-simple"></i>
                <span>${user.email}</span>
              </a>
            </div>
          </div>

          <div class="card-action-group">
            <span class="status-pill ${isOnline ? 'online' : ''}">
              <span class="indicator-dot"></span>
              <span>${statusText}</span>
            </span>

            <label class="switch" aria-label="Toggle availability for ${user.name}">
              <input 
                type="checkbox" 
                data-user-id="${user.id}" 
                ${isOnline ? 'checked' : ''} 
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="status-bubble" data-open-status="${user.id}" title="Click to update status message">
          <div class="status-bubble-text ${hasStatus ? '' : 'status-bubble-empty'}">
            <span>${user.statusEmoji || (isOnline ? '🟢' : '⚪')}</span>
            <span>${statusMsg}</span>
          </div>
          <i class="ph ph-pencil-simple-line status-edit-icon"></i>
        </div>

        <div class="user-card-footer">
          <div class="tags-group">
            <span class="dept-pill">${user.department || 'Engineering'}</span>
            <span class="tz-pill" title="Timezone">${user.timezone || 'Local'}</span>
          </div>

          <div class="member-more-actions">
            <button class="action-icon-btn btn-edit-user" data-edit-id="${user.id}" title="Edit profile">
              <i class="ph ph-gear-six"></i>
            </button>
            <button class="action-icon-btn delete btn-delete-user" data-delete-id="${user.id}" title="Remove member">
              <i class="ph ph-trash"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ==========================================================================
// Availability & Status Handlers (Pure Client-Side)
// ==========================================================================
function updateAvailability(id, isAvailable) {
  const userIndex = state.users.findIndex(u => u.id === id);
  if (userIndex === -1) return;

  state.users[userIndex].isAvailable = isAvailable;
  state.users[userIndex].lastUpdated = new Date().toISOString();
  Storage.setUsers(state.users);
  Storage.logActivity(state.users[userIndex].name, isAvailable ? 'switched status to Available' : 'switched status to Away');

  soundFX.playToggle(isAvailable);
  render();
  showToast(`${state.users[userIndex].name} is now ${isAvailable ? 'Available' : 'Away'}`);
}

function updateStatusMessage(id, statusMessage, statusEmoji) {
  const userIndex = state.users.findIndex(u => u.id === id);
  if (userIndex === -1) return;

  state.users[userIndex].statusMessage = statusMessage;
  state.users[userIndex].statusEmoji = statusEmoji;
  state.users[userIndex].lastUpdated = new Date().toISOString();
  Storage.setUsers(state.users);

  if (statusMessage) {
    Storage.logActivity(state.users[userIndex].name, `set status to "${statusMessage}"`);
  }

  render();
  closeStatusModal();
  showToast('Status message updated');
}

function saveMember(formData) {
  const isEditing = Boolean(formData.id);

  // Derive initials
  const nameParts = (formData.name || '').trim().split(/\s+/);
  const initials = nameParts.length > 1
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : (formData.name || 'TM').substring(0, 2).toUpperCase();

  if (isEditing) {
    const idx = state.users.findIndex(u => u.id === formData.id);
    if (idx !== -1) {
      state.users[idx] = {
        ...state.users[idx],
        name: formData.name,
        email: formData.email,
        initials,
        role: formData.role || 'Team Member',
        department: formData.department || 'Engineering',
        timezone: formData.timezone || 'IST (UTC+5:30)',
        statusMessage: formData.statusMessage || state.users[idx].statusMessage,
        avatarColor: formData.avatarColor || state.users[idx].avatarColor,
        isAvailable: formData.isAvailable,
        lastUpdated: new Date().toISOString()
      };
      Storage.setUsers(state.users);
      Storage.logActivity(formData.name, 'profile updated');
      showToast(`Updated ${formData.name}`);
    }
  } else {
    // Check duplicate email
    const exists = state.users.some(u => u.email.toLowerCase() === formData.email.toLowerCase());
    if (exists) {
      showToast('A team member with this email already exists', 'error');
      return;
    }

    const newId = Date.now();
    const newUser = {
      id: newId,
      name: formData.name,
      email: formData.email,
      initials,
      role: formData.role || 'Team Member',
      department: formData.department || 'Engineering',
      timezone: formData.timezone || 'IST (UTC+5:30)',
      statusMessage: formData.statusMessage || '',
      statusEmoji: formData.statusEmoji || '',
      avatarColor: formData.avatarColor || '#6366f1',
      isAvailable: formData.isAvailable,
      lastUpdated: new Date().toISOString()
    };
    state.users.unshift(newUser);
    Storage.setUsers(state.users);
    Storage.logActivity(formData.name, 'joined the team tracker');
    showToast(`Added ${formData.name} to the team`);
  }

  closeMemberModal();
  render();
}

function deleteMember(id) {
  const user = state.users.find(u => u.id === id);
  if (!user) return;

  if (!confirm(`Are you sure you want to remove ${user.name} from the tracker?`)) {
    return;
  }

  state.users = state.users.filter(u => u.id !== id);
  Storage.setUsers(state.users);
  Storage.logActivity(user.name, 'was removed from team tracker');
  showToast(`Removed ${user.name}`);
  render();
}

function bulkUpdateAvailability(isAvailable) {
  state.users = state.users.map(u => ({
    ...u,
    isAvailable,
    lastUpdated: new Date().toISOString()
  }));
  Storage.setUsers(state.users);
  Storage.logActivity('System Admin', isAvailable ? 'marked entire team as Available' : 'marked entire team as Away');
  DOM.bulkDropdown.classList.remove('show');
  soundFX.playToggle(isAvailable);
  render();
  showToast(`Marked entire team as ${isAvailable ? 'Available' : 'Away'}`);
}

function resetDemoData() {
  if (!confirm('Reset all team members to default sample data?')) return;
  state.users = [...INITIAL_USERS];
  Storage.setUsers(INITIAL_USERS);
  Storage.setActivity(INITIAL_ACTIVITY);
  DOM.bulkDropdown.classList.remove('show');
  render();
  showToast('Default sample data reset successfully');
}

function loadActivityFeed() {
  const logs = Storage.getActivity();
  if (!logs || logs.length === 0) {
    DOM.activityList.innerHTML = '<p class="status-bubble-empty">No activity recorded yet.</p>';
    return;
  }

  DOM.activityList.innerHTML = logs.map(item => `
    <div class="activity-item">
      <span class="activity-dot"></span>
      <div class="activity-content">
        <p class="activity-text"><strong>${item.userName}</strong> ${item.action}</p>
        <span class="activity-time">${formatTimeAgo(item.timestamp)}</span>
      </div>
    </div>
  `).join('');
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return 'just now';
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date() - date) / 1000);
  if (isNaN(seconds) || seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ==========================================================================
// Export CSV / JSON
// ==========================================================================
function exportCSV() {
  DOM.bulkDropdown.classList.remove('show');
  const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Timezone', 'Status', 'Custom Status'];
  const rows = state.users.map(u => [
    u.id,
    `"${(u.name || '').replace(/"/g, '""')}"`,
    `"${u.email || ''}"`,
    `"${(u.role || '').replace(/"/g, '""')}"`,
    `"${u.department || ''}"`,
    `"${u.timezone || ''}"`,
    u.isAvailable ? 'Available' : 'Away',
    `"${(u.statusMessage || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `team-availability-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Exported team CSV report');
}

function exportJSON() {
  DOM.bulkDropdown.classList.remove('show');
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.users, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `team-availability-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Exported team JSON snapshot');
}

// ==========================================================================
// Modal Controllers
// ==========================================================================
function openAddMemberModal() {
  DOM.modalTitle.textContent = 'Add Team Member';
  DOM.btnSaveText.textContent = 'Add Member';
  DOM.memberForm.reset();
  DOM.memberId.value = '';
  state.selectedColor = '#6366f1';
  updateColorSwatches();
  updateAvatarPreview('TM');
  DOM.memberModal.classList.add('show');
  DOM.memberModal.setAttribute('aria-hidden', 'false');
  DOM.inputName.focus();
}

function openEditMemberModal(id) {
  const user = state.users.find(u => u.id === id);
  if (!user) return;

  DOM.modalTitle.textContent = 'Edit Member Profile';
  DOM.btnSaveText.textContent = 'Save Changes';
  DOM.memberId.value = user.id;
  DOM.inputName.value = user.name || '';
  DOM.inputEmail.value = user.email || '';
  DOM.inputRole.value = user.role || '';
  DOM.inputDepartment.value = user.department || 'Engineering';
  DOM.inputTimezone.value = user.timezone || 'IST (UTC+5:30)';
  DOM.inputStatusMsg.value = user.statusMessage || '';
  DOM.inputIsAvailable.checked = Boolean(user.isAvailable);
  
  state.selectedColor = user.avatarColor || '#6366f1';
  updateColorSwatches();
  updateAvatarPreview(user.initials);

  DOM.memberModal.classList.add('show');
  DOM.memberModal.setAttribute('aria-hidden', 'false');
}

function closeMemberModal() {
  DOM.memberModal.classList.remove('show');
  DOM.memberModal.setAttribute('aria-hidden', 'true');
}

function openStatusModal(id) {
  const user = state.users.find(u => u.id === id);
  if (!user) return;

  DOM.statusUserId.value = user.id;
  DOM.statusModalSubtitle.textContent = `Update status note for ${user.name}`;
  DOM.inputCustomStatus.value = user.statusMessage || '';
  DOM.statusModal.classList.add('show');
  DOM.statusModal.setAttribute('aria-hidden', 'false');
  DOM.inputCustomStatus.focus();
}

function closeStatusModal() {
  DOM.statusModal.classList.remove('show');
  DOM.statusModal.setAttribute('aria-hidden', 'true');
}

function updateColorSwatches() {
  DOM.colorSwatches.forEach(swatch => {
    swatch.classList.toggle('active', swatch.dataset.color === state.selectedColor);
  });
  DOM.modalAvatarPreview.style.background = state.selectedColor;
}

function updateAvatarPreview(initials) {
  DOM.modalAvatarInitials.textContent = initials || 'TM';
}

// ==========================================================================
// Event Listeners
// ==========================================================================
function initEvents() {
  // Theme & Sound
  DOM.btnThemeToggle.addEventListener('click', toggleTheme);
  DOM.btnSoundToggle.addEventListener('click', toggleSound);

  // Search input & Hotkey '/'
  DOM.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    DOM.clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
    render();
  });

  DOM.clearSearchBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    state.searchQuery = '';
    DOM.clearSearchBtn.style.display = 'none';
    render();
    DOM.searchInput.focus();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== DOM.searchInput && !document.querySelector('.modal-overlay.show')) {
      e.preventDefault();
      DOM.searchInput.focus();
    }
    if (e.key === 'Escape') {
      closeMemberModal();
      closeStatusModal();
      DOM.activityDrawer.classList.remove('show');
      DOM.bulkDropdown.classList.remove('show');
    }
  });

  // Status Tab buttons
  DOM.statusTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.statusTabs.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      state.filterStatus = btn.dataset.filterStatus;
      soundFX.playPop();
      render();
    });
  });

  // Department filter dropdown
  DOM.deptFilter.addEventListener('change', (e) => {
    state.filterDepartment = e.target.value;
    render();
  });

  // Clear filters buttons
  function resetAllFilters() {
    state.filterStatus = 'all';
    state.filterDepartment = 'all';
    state.searchQuery = '';
    DOM.searchInput.value = '';
    DOM.clearSearchBtn.style.display = 'none';
    DOM.deptFilter.value = 'all';
    DOM.statusTabs.forEach(b => {
      b.classList.toggle('active', b.dataset.filterStatus === 'all');
      b.setAttribute('aria-selected', b.dataset.filterStatus === 'all');
    });
    render();
  }

  DOM.btnClearAllFilters.addEventListener('click', resetAllFilters);
  DOM.btnEmptyReset.addEventListener('click', resetAllFilters);

  // View mode toggle
  DOM.btnViewGrid.addEventListener('click', () => {
    state.viewMode = 'grid';
    localStorage.setItem(STORAGE_KEYS.VIEW, 'grid');
    DOM.btnViewGrid.classList.add('active');
    DOM.btnViewList.classList.remove('active');
    render();
  });

  DOM.btnViewList.addEventListener('click', () => {
    state.viewMode = 'list';
    localStorage.setItem(STORAGE_KEYS.VIEW, 'list');
    DOM.btnViewList.classList.add('active');
    DOM.btnViewGrid.classList.remove('active');
    render();
  });

  // Bulk dropdown menu toggle
  DOM.btnBulkMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    DOM.bulkDropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    DOM.bulkDropdown.classList.remove('show');
  });

  DOM.btnAllAvailable.addEventListener('click', () => bulkUpdateAvailability(true));
  DOM.btnAllAway.addEventListener('click', () => bulkUpdateAvailability(false));
  DOM.btnExportCsv.addEventListener('click', exportCSV);
  DOM.btnExportJson.addEventListener('click', exportJSON);
  DOM.btnResetDemo.addEventListener('click', resetDemoData);

  // Add Member Button & Modal
  DOM.btnAddMember.addEventListener('click', openAddMemberModal);
  DOM.btnCloseModal.addEventListener('click', closeMemberModal);
  DOM.btnCancelModal.addEventListener('click', closeMemberModal);

  // Color Swatches
  DOM.colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      state.selectedColor = swatch.dataset.color;
      updateColorSwatches();
    });
  });

  // Live avatar initials typing preview
  DOM.inputName.addEventListener('input', (e) => {
    const parts = e.target.value.trim().split(/\s+/);
    const initials = parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (parts[0] ? parts[0].substring(0, 2).toUpperCase() : 'TM');
    updateAvatarPreview(initials);
  });

  // Member form submit
  DOM.memberForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = DOM.memberId.value ? Number(DOM.memberId.value) : null;
    const name = DOM.inputName.value.trim();
    const email = DOM.inputEmail.value.trim();
    const role = DOM.inputRole.value.trim();
    const department = DOM.inputDepartment.value;
    const timezone = DOM.inputTimezone.value;
    const statusMessage = DOM.inputStatusMsg.value.trim();
    const isAvailable = DOM.inputIsAvailable.checked;

    saveMember({
      id,
      name,
      email,
      role,
      department,
      timezone,
      statusMessage,
      avatarColor: state.selectedColor,
      isAvailable
    });
  });

  // Status Note Modal
  DOM.btnCloseStatusModal.addEventListener('click', closeStatusModal);
  DOM.presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      DOM.inputCustomStatus.value = chip.dataset.preset;
    });
  });

  DOM.statusForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = Number(DOM.statusUserId.value);
    const text = DOM.inputCustomStatus.value.trim();
    // Detect emoji if start of preset
    const emojiMatch = text.match(/^(\p{Extended_Pictographic})/u);
    const emoji = emojiMatch ? emojiMatch[1] : '';
    updateStatusMessage(id, text, emoji);
  });

  DOM.btnClearStatus.addEventListener('click', () => {
    const id = Number(DOM.statusUserId.value);
    updateStatusMessage(id, '', '');
  });

  // Activity Feed Drawer
  DOM.btnActivityLog.addEventListener('click', () => {
    DOM.activityDrawer.classList.add('show');
    DOM.activityDrawer.setAttribute('aria-hidden', 'false');
    loadActivityFeed();
  });

  DOM.btnCloseDrawer.addEventListener('click', () => {
    DOM.activityDrawer.classList.remove('show');
    DOM.activityDrawer.setAttribute('aria-hidden', 'true');
  });

  DOM.activityDrawer.addEventListener('click', (e) => {
    if (e.target === DOM.activityDrawer) {
      DOM.activityDrawer.classList.remove('show');
    }
  });

  // Grid / List Event Delegation (Toggles, Edit, Delete, Status Click)
  DOM.usersContainer.addEventListener('click', (e) => {
    const target = e.target;

    // Open Status modal on bubble click
    const statusBubble = target.closest('[data-open-status]');
    if (statusBubble) {
      const id = Number(statusBubble.dataset.openStatus);
      openStatusModal(id);
      return;
    }

    // Edit button click
    const editBtn = target.closest('.btn-edit-user');
    if (editBtn) {
      const id = Number(editBtn.dataset.editId);
      openEditMemberModal(id);
      return;
    }

    // Delete button click
    const deleteBtn = target.closest('.btn-delete-user');
    if (deleteBtn) {
      const id = Number(deleteBtn.dataset.deleteId);
      deleteMember(id);
      return;
    }
  });

  DOM.usersContainer.addEventListener('change', (e) => {
    if (e.target.matches('input[type="checkbox"][data-user-id]')) {
      const id = Number(e.target.dataset.userId);
      updateAvailability(id, e.target.checked);
    }
  });
}

// ==========================================================================
// Initialization
// ==========================================================================
function init() {
  applyTheme(state.theme);
  updateSoundIcon();
  if (state.viewMode === 'list') {
    DOM.btnViewList.classList.add('active');
    DOM.btnViewGrid.classList.remove('active');
  }
  initEvents();
  render();
}

// Launch immediately
init();
