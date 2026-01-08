// ========================================
// MGS Arts Portal - Firebase Integrated App
// ========================================

import { AuthService, DatabaseService, EventTemplates } from './firebase.js';

class App {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentDate = new Date();
        this.data = {
            students: [],
            tutors: [],
            lessons: [],
            events: [],
            groups: [],
            instruments: [],
            instrumentHires: [],
            lessonRequests: [],
            settings: {}
        };
        this.isLoading = false;
        this.currentUser = null;
        
        this.init();
    }

    async init() {
        // Listen for auth state changes
        AuthService.onAuthStateChanged(async (user) => {
            if (user) {
                this.currentUser = user;
                await this.showApp();
            } else {
                this.currentUser = null;
                this.showLogin();
            }
        });

        this.bindEvents();
    }

    showLogin() {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('app-container').style.display = 'none';
    }

    async showApp() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        
        // Update user display
        this.updateUserDisplay();
        
        // Load data
        await this.loadAllData();
        
        // Render dashboard
        this.renderCurrentPage();
    }

    updateUserDisplay() {
        const user = this.currentUser;
        if (!user) return;
        
        // Extract name from email for display
        const email = user.email || '';
        const name = email.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
        const initials = name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
        
        document.getElementById('user-name').textContent = name;
        document.getElementById('user-avatar').textContent = initials;
        document.getElementById('welcome-name').textContent = name.split(' ')[0];
    }

    async loadAllData() {
        this.showLoading(true);
        
        try {
            const [students, tutors, lessons, events, groups, instruments, instrumentHires, lessonRequests, settings] = await Promise.all([
                DatabaseService.getStudents(),
                DatabaseService.getTutors(),
                DatabaseService.getLessons(),
                DatabaseService.getEvents(),
                DatabaseService.getGroups(),
                DatabaseService.getInstruments(),
                DatabaseService.getInstrumentHires(),
                DatabaseService.getLessonRequests(),
                DatabaseService.getSettings()
            ]);
            
            this.data = { students, tutors, lessons, events, groups, instruments, instrumentHires, lessonRequests, settings };
            
            // If no data, show welcome message
            if (students.length === 0 && tutors.length === 0) {
                this.showToast('Welcome! Load demo data from Settings to get started.', 'info');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.showToast('Error loading data. Please refresh.', 'error');
        }
        
        this.showLoading(false);
    }

    showLoading(show) {
        this.isLoading = show;
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    bindEvents() {
        // Login form
        document.getElementById('login-form')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('forgot-password')?.addEventListener('click', (e) => this.handleForgotPassword(e));
        
        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => this.handleLogout());
        
        // Navigation
        document.querySelectorAll('[data-page]').forEach(el => {
            el.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Nav group toggles
        document.querySelectorAll('.nav-group-toggle').forEach(btn => {
            btn.addEventListener('click', () => this.toggleNavGroup(btn));
        });
        
        // Mobile sidebar
        document.getElementById('hamburger-btn')?.addEventListener('click', () => this.toggleSidebar(true));
        document.getElementById('sidebar-close')?.addEventListener('click', () => this.toggleSidebar(false));
        document.getElementById('sidebar-overlay')?.addEventListener('click', () => this.toggleSidebar(false));
        
        // Theme toggle
        document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach(btn => {
            btn.addEventListener('click', () => this.toggleTheme());
        });
        
        // Quick actions and add buttons
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAction(e));
        });
        
        // Modal
        document.getElementById('modal-close')?.addEventListener('click', () => this.closeModal());
        document.getElementById('modal-cancel')?.addEventListener('click', () => this.closeModal());
        document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') this.closeModal();
        });
        
        // Settings actions
        document.getElementById('load-demo-data')?.addEventListener('click', () => this.loadDemoData());
        document.getElementById('export-all-data')?.addEventListener('click', () => this.exportData());
        document.getElementById('import-data-btn')?.addEventListener('click', () => document.getElementById('import-file').click());
        document.getElementById('import-file')?.addEventListener('change', (e) => this.importData(e));
        document.getElementById('save-school-settings')?.addEventListener('click', () => this.saveSchoolSettings());
        
        // Search inputs
        document.getElementById('lessons-search')?.addEventListener('input', (e) => this.handleSearch('lessons', e.target.value));
        document.getElementById('students-search')?.addEventListener('input', (e) => this.handleSearch('students', e.target.value));
        
        // Request tabs
        document.querySelectorAll('.page-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTabClick(e));
        });
        
        // Date navigator
        document.querySelector('[data-action="prev-day"]')?.addEventListener('click', () => this.changeDate(-1));
        document.querySelector('[data-action="next-day"]')?.addEventListener('click', () => this.changeDate(1));
        document.querySelector('[data-action="today"]')?.addEventListener('click', () => this.goToToday());
        
        // Initialize theme
        this.initTheme();
        
        // Update date display
        this.updateDateDisplay();
    }

    // ========================================
    // Authentication
    // ========================================

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('login-error');
        const btn = document.getElementById('login-btn');
        
        // Show loading
        btn.querySelector('.btn-text').style.display = 'none';
        btn.querySelector('.btn-loader').style.display = 'inline-flex';
        btn.disabled = true;
        errorEl.textContent = '';
        
        // Demo login bypass (for testing without Firebase auth setup)
        if (email === 'r.horn@middleton.school.nz' && password === 'demo123') {
            // Create a fake user for demo
            this.currentUser = { email: email, displayName: 'Rhian Horn' };
            await this.showApp();
            btn.querySelector('.btn-text').style.display = 'inline';
            btn.querySelector('.btn-loader').style.display = 'none';
            btn.disabled = false;
            return;
        }
        
        const result = await AuthService.signIn(email, password);
        
        btn.querySelector('.btn-text').style.display = 'inline';
        btn.querySelector('.btn-loader').style.display = 'none';
        btn.disabled = false;
        
        if (!result.success) {
            errorEl.textContent = result.error || 'Invalid email or password';
        }
    }

    handleForgotPassword(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        
        if (!email) {
            document.getElementById('login-error').textContent = 'Please enter your email first';
            return;
        }
        
        AuthService.resetPassword(email).then(result => {
            if (result.success) {
                this.showToast('Password reset email sent!', 'success');
            } else {
                document.getElementById('login-error').textContent = result.error;
            }
        });
    }

    async handleLogout() {
        await AuthService.signOut();
        this.showLogin();
    }

    // ========================================
    // Navigation
    // ========================================

    handleNavigation(e) {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        if (page) {
            this.navigateTo(page);
        }
    }

    navigateTo(page) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
        
        // Show page
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${page}`)?.classList.add('active');
        
        // Close mobile sidebar
        this.toggleSidebar(false);
        
        // Store current page
        this.currentPage = page;
        
        // Render page content
        this.renderCurrentPage();
    }

    renderCurrentPage() {
        switch (this.currentPage) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'lessons':
                this.renderLessons();
                break;
            case 'students':
                this.renderStudents();
                break;
            case 'tutors':
                this.renderTutors();
                break;
            case 'events':
                this.renderEvents();
                break;
            case 'requests':
                this.renderRequests();
                break;
            case 'groups':
                this.renderGroups();
                break;
            case 'instrument-list':
                this.renderInstruments();
                break;
            case 'hires':
                this.renderHires();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
    }

    toggleNavGroup(btn) {
        const group = btn.dataset.group;
        const items = document.querySelector(`.nav-group-items[data-group="${group}"]`);
        const isOpen = items.classList.contains('open');
        
        // Close all groups
        document.querySelectorAll('.nav-group-items').forEach(g => g.classList.remove('open'));
        document.querySelectorAll('.nav-group-toggle').forEach(b => b.classList.remove('open'));
        
        // Toggle this group
        if (!isOpen) {
            items.classList.add('open');
            btn.classList.add('open');
        }
    }

    toggleSidebar(open) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (open) {
            sidebar.classList.add('open');
            overlay.classList.add('visible');
        } else {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
        }
    }

    // ========================================
    // Dashboard Rendering
    // ========================================

    renderDashboard() {
        this.renderTodaysLessons();
        this.renderUpcomingEvents();
        this.renderRecentRequests();
        this.renderHiresSummary();
    }

    renderTodaysLessons() {
        const tbody = document.getElementById('todays-lessons-body');
        const badge = document.getElementById('total-lessons-badge');
        if (!tbody) return;
        
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = dayNames[this.currentDate.getDay()];
        
        const todaysLessons = this.data.lessons.filter(l => l.day === today).sort((a, b) => {
            return this.parseTime(a.time) - this.parseTime(b.time);
        });
        
        if (badge) {
            badge.textContent = `${todaysLessons.length} lessons`;
        }
        
        if (todaysLessons.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="no-data">No lessons scheduled for ${today}</td></tr>`;
            return;
        }
        
        tbody.innerHTML = todaysLessons.map(lesson => {
            const student = this.getStudentById(lesson.studentId) || { name: lesson.studentName || 'Unknown' };
            const tutor = this.getTutorById(lesson.tutorId) || { name: lesson.tutorName || 'Unknown', initials: 'UN', color: '#888' };
            
            return `
                <tr>
                    <td>${lesson.time}</td>
                    <td>
                        <div class="cell-student">
                            <div class="student-avatar music">${student.name.charAt(0)}</div>
                            <span class="student-name">${student.name}</span>
                        </div>
                    </td>
                    <td>${lesson.instrument}</td>
                    <td>
                        <div class="cell-tutor">
                            <div class="tutor-avatar" style="background: ${tutor.color}; color: white;">${tutor.initials}</div>
                            <span>${tutor.name}</span>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    parseTime(timeStr) {
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return 0;
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3].toUpperCase();
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    }

    renderUpcomingEvents() {
        const container = document.getElementById('events-list');
        if (!container) return;
        
        const events = this.data.events.slice(0, 4);
        
        if (events.length === 0) {
            container.innerHTML = '<p class="no-data">No upcoming events</p>';
            return;
        }
        
        container.innerHTML = events.map(event => `
            <div class="event-item">
                <div class="event-info">
                    <span class="event-name">${event.name}</span>
                    <span class="event-date">${this.formatDate(event.date)}</span>
                </div>
                <span class="discipline-tag discipline-music">${event.category || 'Event'}</span>
            </div>
        `).join('');
    }

    renderRecentRequests() {
        const container = document.getElementById('recent-requests');
        const awaitingEl = document.getElementById('requests-awaiting');
        const waitlistEl = document.getElementById('requests-waitlist');
        if (!container) return;
        
        const requests = this.data.lessonRequests;
        const awaiting = requests.filter(r => r.status === 'awaiting').length;
        const waitlist = requests.filter(r => r.status === 'waitlist').length;
        
        if (awaitingEl) awaitingEl.textContent = awaiting;
        if (waitlistEl) waitlistEl.textContent = waitlist;
        
        const recent = requests.slice(0, 3);
        
        if (recent.length === 0) {
            container.innerHTML = '<p class="no-data">No pending requests</p>';
            return;
        }
        
        container.innerHTML = recent.map(req => `
            <div class="request-item">
                <div class="request-info">
                    <span class="request-name">${req.studentName.split('(')[0].trim()}</span>
                    <span class="request-detail">Year ${req.year} • ${req.instrument}</span>
                </div>
                <span class="status-badge status-${req.status === 'awaiting' ? 'pending' : 'waiting'}">${req.status}</span>
            </div>
        `).join('');
    }

    renderHiresSummary() {
        const hires = this.data.instrumentHires;
        const active = hires.filter(h => h.status === 'active').length;
        const dueSoon = hires.filter(h => h.status === 'due-soon').length;
        const overdue = hires.filter(h => h.status === 'overdue').length;
        
        const activeEl = document.getElementById('hires-active');
        const dueSoonEl = document.getElementById('hires-due-soon');
        const overdueEl = document.getElementById('hires-overdue');
        
        if (activeEl) activeEl.textContent = active;
        if (dueSoonEl) dueSoonEl.textContent = dueSoon;
        if (overdueEl) overdueEl.textContent = overdue;
    }

    // ========================================
    // Lessons Rendering
    // ========================================

    renderLessons() {
        const tbody = document.getElementById('lessons-body');
        if (!tbody) return;
        
        if (this.data.lessons.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No lessons found. Add your first lesson!</td></tr>';
            return;
        }
        
        tbody.innerHTML = this.data.lessons.map(lesson => {
            const student = this.getStudentById(lesson.studentId) || { name: lesson.studentName || 'Unknown', class: '—' };
            const tutor = this.getTutorById(lesson.tutorId) || { name: lesson.tutorName || 'Unknown', initials: 'UN', color: '#888' };
            const dayTime = `${lesson.day} ${lesson.time}`;
            
            return `
                <tr data-id="${lesson.id}">
                    <td>
                        <div class="cell-student">
                            <div class="student-avatar music">${student.name.charAt(0)}</div>
                            <span class="student-name">${student.name}</span>
                        </div>
                    </td>
                    <td>${student.class}</td>
                    <td>${lesson.instrument}</td>
                    <td>${dayTime}</td>
                    <td>
                        <div class="cell-tutor">
                            <div class="tutor-avatar" style="background: ${tutor.color}; color: white;">${tutor.initials}</div>
                            <span>${tutor.name}</span>
                        </div>
                    </td>
                    <td><span class="status-badge status-${lesson.status === 'active' ? 'active' : 'waiting'}">${lesson.status}</span></td>
                    <td>
                        <div class="row-actions">
                            <button class="row-action-btn" title="Edit" data-action="edit-lesson" data-id="${lesson.id}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                            <button class="row-action-btn" title="Delete" data-action="delete-lesson" data-id="${lesson.id}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        // Bind edit/delete buttons
        this.bindRowActions('lesson');
    }

    // ========================================
    // Students Rendering
    // ========================================

    renderStudents() {
        const tbody = document.getElementById('students-body');
        if (!tbody) return;
        
        if (this.data.students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No students found. Add your first student!</td></tr>';
            return;
        }
        
        tbody.innerHTML = this.data.students.map(student => {
            const tutor = this.getTutorById(student.tutorId) || { name: 'Unassigned', initials: '—', color: '#888' };
            
            return `
                <tr data-id="${student.id}">
                    <td>
                        <div class="cell-student">
                            <div class="student-avatar music">${student.name.charAt(0)}</div>
                            <span class="student-name">${student.name}</span>
                        </div>
                    </td>
                    <td>${student.year}</td>
                    <td>${student.class}</td>
                    <td>${student.instruments?.join(', ') || '—'}</td>
                    <td>
                        <div class="cell-tutor">
                            <div class="tutor-avatar" style="background: ${tutor.color}; color: white;">${tutor.initials}</div>
                            <span>${tutor.name}</span>
                        </div>
                    </td>
                    <td><span class="status-badge status-${student.status === 'active' ? 'active' : student.status === 'waiting' ? 'waiting' : 'assigned'}">${student.status}</span></td>
                    <td>
                        <div class="row-actions">
                            <button class="row-action-btn" title="Edit" data-action="edit-student" data-id="${student.id}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        this.bindRowActions('student');
    }

    // ========================================
    // Tutors Rendering
    // ========================================

    renderTutors() {
        const container = document.getElementById('tutors-grid');
        if (!container) return;
        
        if (this.data.tutors.length === 0) {
            container.innerHTML = '<div class="no-data-card">No tutors found. Add your first tutor!</div>';
            return;
        }
        
        // Count students per tutor
        const studentCounts = {};
        this.data.students.forEach(s => {
            if (s.tutorId) {
                studentCounts[s.tutorId] = (studentCounts[s.tutorId] || 0) + 1;
            }
        });
        
        const lessonCounts = {};
        this.data.lessons.forEach(l => {
            if (l.tutorId) {
                lessonCounts[l.tutorId] = (lessonCounts[l.tutorId] || 0) + 1;
            }
        });
        
        container.innerHTML = this.data.tutors.map(tutor => `
            <div class="tutor-card" data-id="${tutor.id}">
                <div class="tutor-card-header">
                    <div class="tutor-avatar-large" style="background: ${tutor.color};">${tutor.initials}</div>
                    <div class="tutor-header-info">
                        <div class="tutor-name">${tutor.name}</div>
                        <div class="tutor-role">Itinerant Music Teacher</div>
                    </div>
                </div>
                <div class="tutor-disciplines">
                    ${(tutor.instruments || []).map(i => `<span class="discipline-tag discipline-music">${i}</span>`).join('')}
                </div>
                <div class="tutor-stats">
                    <div class="tutor-stat">
                        <div class="tutor-stat-value">${studentCounts[tutor.id] || tutor.studentCount || 0}</div>
                        <div class="tutor-stat-label">Students</div>
                    </div>
                    <div class="tutor-stat">
                        <div class="tutor-stat-value">${lessonCounts[tutor.id] || tutor.lessonsPerWeek || 0}</div>
                        <div class="tutor-stat-label">Lessons/Week</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ========================================
    // Events Rendering
    // ========================================

    renderEvents() {
        const tbody = document.getElementById('events-body');
        if (!tbody) return;
        
        const categoryColors = {
            'Music': 'music', 'Drama': 'drama', 'Dance': 'dance',
            'Pasifika': 'music', 'Kapa Haka': 'drama',
            'Performing Arts': 'dance', 'Production': 'drama'
        };
        
        if (this.data.events.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No events found. Create your first event!</td></tr>';
            return;
        }
        
        tbody.innerHTML = this.data.events.map(event => `
            <tr data-id="${event.id}">
                <td><strong>${event.name}</strong></td>
                <td>${event.description || '—'}</td>
                <td>${this.formatDate(event.date)}</td>
                <td>${event.term || '—'}</td>
                <td><span class="discipline-tag discipline-${categoryColors[event.category] || 'music'}">${event.category || 'Event'}</span></td>
                <td>
                    <div class="row-actions">
                        <button class="row-action-btn" title="View Tasks" data-action="view-event-tasks" data-id="${event.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 11l3 3L22 4"/>
                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                            </svg>
                        </button>
                        <button class="row-action-btn" title="Edit" data-action="edit-event" data-id="${event.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        this.bindRowActions('event');
    }

    // ========================================
    // Requests Rendering
    // ========================================

    renderRequests(filter = 'all') {
        const tbody = document.getElementById('requests-body');
        if (!tbody) return;
        
        let requests = this.data.lessonRequests;
        if (filter !== 'all') {
            requests = requests.filter(r => r.status === filter);
        }
        
        if (requests.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="no-data">No ${filter === 'all' ? '' : filter} requests</td></tr>`;
            return;
        }
        
        tbody.innerHTML = requests.map(req => `
            <tr data-id="${req.id}">
                <td><strong>${req.studentName}</strong></td>
                <td>${req.year}</td>
                <td>${req.instrument}</td>
                <td>${req.received || '—'}</td>
                <td>${req.form || '—'}</td>
                <td><span class="status-badge status-${req.status === 'awaiting' ? 'pending' : 'waiting'}">${req.status}</span></td>
                <td>
                    <div class="row-actions">
                        ${req.status === 'awaiting' ? `
                            <button class="row-action-btn success" title="Approve" data-action="approve-request" data-id="${req.id}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 6L9 17l-5-5"/>
                                </svg>
                            </button>
                            <button class="row-action-btn warning" title="Waitlist" data-action="waitlist-request" data-id="${req.id}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 6v6l4 2"/>
                                </svg>
                            </button>
                        ` : ''}
                        <button class="row-action-btn" title="Delete" data-action="delete-request" data-id="${req.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        this.bindRowActions('request');
    }

    // ========================================
    // Groups Rendering
    // ========================================

    renderGroups() {
        const container = document.getElementById('groups-grid');
        if (!container) return;
        
        const categoryColors = {
            'Music': 'music', 'Drama': 'drama', 'Dance': 'dance',
            'Pasifika': 'music', 'Kapa Haka': 'drama'
        };
        
        if (this.data.groups.length === 0) {
            container.innerHTML = '<div class="no-data-card">No groups found. Create your first group!</div>';
            return;
        }
        
        container.innerHTML = this.data.groups.map(group => `
            <div class="group-card" data-id="${group.id}">
                <div class="group-card-header">
                    <div class="group-name">${group.name}</div>
                    <div class="group-type">${group.type}</div>
                </div>
                <div class="group-card-body">
                    <div class="group-meta">
                        <div class="group-meta-item">
                            <span class="group-meta-value">${group.memberCount || 0}</span>
                            <span class="group-meta-label">Members</span>
                        </div>
                        <div class="group-meta-item">
                            <span class="group-meta-value discipline-tag discipline-${categoryColors[group.category] || 'music'}">${group.category}</span>
                        </div>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--color-text-muted);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; display: inline; vertical-align: middle; margin-right: 4px;">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                        </svg>
                        ${group.meetingTime || 'TBA'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ========================================
    // Instruments Rendering
    // ========================================

    renderInstruments() {
        const tbody = document.getElementById('instruments-body');
        if (!tbody) return;
        
        if (this.data.instruments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No instruments found. Add your first instrument!</td></tr>';
            return;
        }
        
        tbody.innerHTML = this.data.instruments.map(inst => `
            <tr data-id="${inst.id}">
                <td><strong>${inst.name}</strong></td>
                <td>${inst.type}</td>
                <td>${inst.size || '—'}</td>
                <td>${inst.condition || 'Good'}</td>
                <td><span class="status-badge status-${inst.status === 'Available' ? 'active' : 'assigned'}">${inst.status}</span></td>
                <td>
                    <div class="row-actions">
                        <button class="row-action-btn" title="Edit" data-action="edit-instrument" data-id="${inst.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        this.bindRowActions('instrument');
    }

    // ========================================
    // Hires Rendering
    // ========================================

    renderHires() {
        const tbody = document.getElementById('hires-body');
        if (!tbody) return;
        
        if (this.data.instrumentHires.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No active hires</td></tr>';
            return;
        }
        
        tbody.innerHTML = this.data.instrumentHires.map(hire => {
            const statusClass = hire.status === 'active' ? 'active' : hire.status === 'overdue' ? 'waiting' : 'assigned';
            
            return `
                <tr data-id="${hire.id}">
                    <td><strong>${hire.instrumentName || hire.instrument}</strong></td>
                    <td>${hire.studentName}</td>
                    <td>${this.formatDate(hire.hireDate)}</td>
                    <td>${this.formatDate(hire.expectedReturn)}</td>
                    <td>${hire.agreement ? '✓ Signed' : '✗ Pending'}</td>
                    <td><span class="status-badge status-${statusClass}">${hire.status}</span></td>
                    <td>
                        <div class="row-actions">
                            <button class="row-action-btn" title="Edit" data-action="edit-hire" data-id="${hire.id}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        this.bindRowActions('hire');
    }

    // ========================================
    // Settings Rendering
    // ========================================

    renderSettings() {
        // Render term dates
        const termContainer = document.getElementById('term-dates-list');
        if (termContainer && this.data.settings?.termDates) {
            const terms = this.data.settings.termDates;
            termContainer.innerHTML = Object.entries(terms).map(([term, dates]) => `
                <div class="term-date-item">
                    <span class="term-name">${term.replace('term', 'Term ')}</span>
                    <span class="term-range">${this.formatDate(dates.start)} — ${this.formatDate(dates.end)}</span>
                </div>
            `).join('');
        }
        
        // Fill school settings
        if (this.data.settings?.schoolName) {
            document.getElementById('setting-school-name').value = this.data.settings.schoolName;
        }
        if (this.data.settings?.academyName) {
            document.getElementById('setting-academy-name').value = this.data.settings.academyName;
        }
    }

    // ========================================
    // Actions & Modals
    // ========================================

    handleAction(e) {
        const action = e.currentTarget.dataset.action;
        const id = e.currentTarget.dataset.id;
        
        switch (action) {
            case 'add-lesson':
                this.showAddLessonModal();
                break;
            case 'add-student':
                this.showAddStudentModal();
                break;
            case 'add-event':
                this.showAddEventModal();
                break;
            case 'add-tutor':
                this.showAddTutorModal();
                break;
            case 'add-group':
                this.showAddGroupModal();
                break;
            case 'add-instrument':
                this.showAddInstrumentModal();
                break;
            case 'add-hire':
                this.showAddHireModal();
                break;
            case 'view-template':
                this.showTemplateModal(e.currentTarget.dataset.templateId);
                break;
            case 'import-data':
                document.getElementById('import-file').click();
                break;
            case 'export-data':
                this.exportData();
                break;
        }
    }

    bindRowActions(type) {
        document.querySelectorAll(`[data-action="edit-${type}"]`).forEach(btn => {
            btn.addEventListener('click', () => this.handleEdit(type, btn.dataset.id));
        });
        document.querySelectorAll(`[data-action="delete-${type}"]`).forEach(btn => {
            btn.addEventListener('click', () => this.handleDelete(type, btn.dataset.id));
        });
        
        // Request-specific actions
        if (type === 'request') {
            document.querySelectorAll('[data-action="approve-request"]').forEach(btn => {
                btn.addEventListener('click', () => this.handleApproveRequest(btn.dataset.id));
            });
            document.querySelectorAll('[data-action="waitlist-request"]').forEach(btn => {
                btn.addEventListener('click', () => this.handleWaitlistRequest(btn.dataset.id));
            });
        }
    }

    async handleEdit(type, id) {
        // For now, show a simple message - will implement full edit modals
        this.showToast(`Edit ${type} functionality coming soon`, 'info');
    }

    async handleDelete(type, id) {
        if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
        
        const collectionMap = {
            lesson: 'lessons',
            student: 'students',
            event: 'events',
            request: 'lessonRequests',
            instrument: 'instruments',
            hire: 'instrumentHires'
        };
        
        const result = await DatabaseService.delete(collectionMap[type], id);
        
        if (result.success) {
            this.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`, 'success');
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error deleting item', 'error');
        }
    }

    async handleApproveRequest(id) {
        const result = await DatabaseService.updateLessonRequest(id, { status: 'approved' });
        if (result.success) {
            this.showToast('Request approved!', 'success');
            await this.loadAllData();
            this.renderRequests();
            this.renderRecentRequests();
        }
    }

    async handleWaitlistRequest(id) {
        const result = await DatabaseService.updateLessonRequest(id, { status: 'waitlist' });
        if (result.success) {
            this.showToast('Request moved to waitlist', 'info');
            await this.loadAllData();
            this.renderRequests();
            this.renderRecentRequests();
        }
    }

    // ========================================
    // Modal Displays
    // ========================================

    showModal(title, content, onSave = null) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal-overlay').classList.add('visible');
        
        const saveBtn = document.getElementById('modal-save');
        if (onSave) {
            saveBtn.style.display = 'block';
            saveBtn.onclick = onSave;
        } else {
            saveBtn.style.display = 'none';
        }
    }

    closeModal() {
        document.getElementById('modal-overlay').classList.remove('visible');
    }

    showAddLessonModal() {
        const tutorOptions = this.data.tutors.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        const studentOptions = this.data.students.map(s => `<option value="${s.id}">${s.name} (${s.class})</option>`).join('');
        
        const content = `
            <form id="add-lesson-form" class="modal-form">
                <div class="form-group">
                    <label>Student</label>
                    <select name="studentId" required>
                        <option value="">Select student...</option>
                        ${studentOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Tutor</label>
                    <select name="tutorId" required>
                        <option value="">Select tutor...</option>
                        ${tutorOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Instrument</label>
                    <input type="text" name="instrument" placeholder="e.g., Guitar, Piano" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Day</label>
                        <select name="day" required>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Time</label>
                        <input type="text" name="time" placeholder="e.g., 9:00 AM" required>
                    </div>
                </div>
            </form>
        `;
        
        this.showModal('Add New Lesson', content, () => this.saveLesson());
    }

    async saveLesson() {
        const form = document.getElementById('add-lesson-form');
        const formData = new FormData(form);
        
        const lesson = {
            studentId: formData.get('studentId'),
            tutorId: formData.get('tutorId'),
            instrument: formData.get('instrument'),
            day: formData.get('day'),
            time: formData.get('time'),
            status: 'active'
        };
        
        const result = await DatabaseService.addLesson(lesson);
        
        if (result.success) {
            this.showToast('Lesson added successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error adding lesson', 'error');
        }
    }

    showAddStudentModal() {
        const tutorOptions = this.data.tutors.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        
        const content = `
            <form id="add-student-form" class="modal-form">
                <div class="form-group">
                    <label>Student Name</label>
                    <input type="text" name="name" placeholder="Full name" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Year</label>
                        <input type="number" name="year" min="1" max="13" required>
                    </div>
                    <div class="form-group">
                        <label>Class</label>
                        <input type="text" name="class" placeholder="e.g., 7WH" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Instrument(s)</label>
                    <input type="text" name="instruments" placeholder="e.g., Guitar, Piano">
                </div>
                <div class="form-group">
                    <label>Tutor</label>
                    <select name="tutorId">
                        <option value="">Select tutor (optional)...</option>
                        ${tutorOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Parent Email</label>
                    <input type="email" name="parentEmail" placeholder="parent@email.com">
                </div>
            </form>
        `;
        
        this.showModal('Add New Student', content, () => this.saveStudent());
    }

    async saveStudent() {
        const form = document.getElementById('add-student-form');
        const formData = new FormData(form);
        
        const student = {
            name: formData.get('name'),
            year: parseInt(formData.get('year')),
            class: formData.get('class'),
            instruments: formData.get('instruments').split(',').map(i => i.trim()).filter(i => i),
            tutorId: formData.get('tutorId') || null,
            parentEmail: formData.get('parentEmail'),
            status: formData.get('tutorId') ? 'assigned' : 'waiting'
        };
        
        const result = await DatabaseService.addStudent(student);
        
        if (result.success) {
            this.showToast('Student added successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error adding student', 'error');
        }
    }

    showAddEventModal() {
        const content = `
            <form id="add-event-form" class="modal-form">
                <div class="form-group">
                    <label>Event Name</label>
                    <input type="text" name="name" placeholder="e.g., Rock Night" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" placeholder="Event description..."></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label>Term</label>
                        <select name="term">
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                            <option value="Term 4">Term 4</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Category</label>
                        <select name="category">
                            <option value="Music">Music</option>
                            <option value="Drama">Drama</option>
                            <option value="Dance">Dance</option>
                            <option value="Kapa Haka">Kapa Haka</option>
                            <option value="Pasifika">Pasifika</option>
                            <option value="Performing Arts">Performing Arts</option>
                            <option value="Production">Production</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Template</label>
                        <select name="templateType">
                            <option value="school-during">School (During Hours)</option>
                            <option value="school-after">School (After Hours)</option>
                            <option value="offsite-during">Offsite (During Hours)</option>
                            <option value="offsite-after">Offsite (After Hours)</option>
                        </select>
                    </div>
                </div>
            </form>
        `;
        
        this.showModal('Create New Event', content, () => this.saveEvent());
    }

    async saveEvent() {
        const form = document.getElementById('add-event-form');
        const formData = new FormData(form);
        
        const event = {
            name: formData.get('name'),
            description: formData.get('description'),
            date: formData.get('date'),
            term: formData.get('term'),
            category: formData.get('category'),
            templateType: formData.get('templateType'),
            status: 'upcoming'
        };
        
        const result = await DatabaseService.addEvent(event);
        
        if (result.success) {
            this.showToast('Event created successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error creating event', 'error');
        }
    }

    showAddTutorModal() {
        const content = `
            <form id="add-tutor-form" class="modal-form">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" name="name" placeholder="Full name" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" placeholder="tutor@email.com" required>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" placeholder="021 123 4567">
                </div>
                <div class="form-group">
                    <label>Instruments (comma separated)</label>
                    <input type="text" name="instruments" placeholder="e.g., Guitar, Bass, Ukulele" required>
                </div>
            </form>
        `;
        
        this.showModal('Add New Tutor', content, () => this.saveTutor());
    }

    async saveTutor() {
        const form = document.getElementById('add-tutor-form');
        const formData = new FormData(form);
        
        const name = formData.get('name');
        const initials = name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
        const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#22c55e', '#3b82f6'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const tutor = {
            name: name,
            initials: initials,
            email: formData.get('email'),
            phone: formData.get('phone'),
            instruments: formData.get('instruments').split(',').map(i => i.trim()),
            color: color,
            active: true
        };
        
        const result = await DatabaseService.addTutor(tutor);
        
        if (result.success) {
            this.showToast('Tutor added successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error adding tutor', 'error');
        }
    }

    showAddGroupModal() {
        const content = `
            <form id="add-group-form" class="modal-form">
                <div class="form-group">
                    <label>Group Name</label>
                    <input type="text" name="name" placeholder="e.g., Jazz Band" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Type</label>
                        <select name="type">
                            <option value="Ensemble">Ensemble</option>
                            <option value="Choir">Choir</option>
                            <option value="Band">Band</option>
                            <option value="Club">Club</option>
                            <option value="Crew">Crew</option>
                            <option value="Group">Group</option>
                            <option value="Chamber">Chamber</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select name="category">
                            <option value="Music">Music</option>
                            <option value="Drama">Drama</option>
                            <option value="Dance">Dance</option>
                            <option value="Kapa Haka">Kapa Haka</option>
                            <option value="Pasifika">Pasifika</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Meeting Time</label>
                    <input type="text" name="meetingTime" placeholder="e.g., Wednesday 3:30 PM">
                </div>
                <div class="form-group">
                    <label>Group Leader</label>
                    <input type="text" name="leader" placeholder="Leader name">
                </div>
            </form>
        `;
        
        this.showModal('Create New Group', content, () => this.saveGroup());
    }

    async saveGroup() {
        const form = document.getElementById('add-group-form');
        const formData = new FormData(form);
        
        const group = {
            name: formData.get('name'),
            type: formData.get('type'),
            category: formData.get('category'),
            meetingTime: formData.get('meetingTime'),
            leader: formData.get('leader'),
            memberCount: 0
        };
        
        const result = await DatabaseService.addGroup(group);
        
        if (result.success) {
            this.showToast('Group created successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error creating group', 'error');
        }
    }

    showAddInstrumentModal() {
        const content = `
            <form id="add-instrument-form" class="modal-form">
                <div class="form-group">
                    <label>Instrument Name</label>
                    <input type="text" name="name" placeholder="e.g., Cello 1" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Type</label>
                        <input type="text" name="type" placeholder="e.g., Cello, Violin" required>
                    </div>
                    <div class="form-group">
                        <label>Size</label>
                        <input type="text" name="size" placeholder="e.g., 4/4, 3/4">
                    </div>
                </div>
                <div class="form-group">
                    <label>Condition</label>
                    <select name="condition">
                        <option value="Excellent">Excellent</option>
                        <option value="Good" selected>Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Serial Number</label>
                    <input type="text" name="serialNumber" placeholder="Optional">
                </div>
            </form>
        `;
        
        this.showModal('Add New Instrument', content, () => this.saveInstrument());
    }

    async saveInstrument() {
        const form = document.getElementById('add-instrument-form');
        const formData = new FormData(form);
        
        const instrument = {
            name: formData.get('name'),
            type: formData.get('type'),
            size: formData.get('size'),
            condition: formData.get('condition'),
            serialNumber: formData.get('serialNumber'),
            status: 'Available'
        };
        
        const result = await DatabaseService.addInstrument(instrument);
        
        if (result.success) {
            this.showToast('Instrument added successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error adding instrument', 'error');
        }
    }

    showAddHireModal() {
        const instrumentOptions = this.data.instruments
            .filter(i => i.status === 'Available')
            .map(i => `<option value="${i.id}">${i.name} (${i.type})</option>`).join('');
        
        const content = `
            <form id="add-hire-form" class="modal-form">
                <div class="form-group">
                    <label>Instrument</label>
                    <select name="instrumentId" required>
                        <option value="">Select instrument...</option>
                        ${instrumentOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Student Name</label>
                    <input type="text" name="studentName" placeholder="Full name" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Hire Date</label>
                        <input type="date" name="hireDate" required>
                    </div>
                    <div class="form-group">
                        <label>Expected Return</label>
                        <input type="date" name="expectedReturn" required>
                    </div>
                </div>
            </form>
        `;
        
        this.showModal('New Instrument Hire', content, () => this.saveHire());
    }

    async saveHire() {
        const form = document.getElementById('add-hire-form');
        const formData = new FormData(form);
        
        const instrumentId = formData.get('instrumentId');
        const instrument = this.data.instruments.find(i => i.id === instrumentId);
        
        const hire = {
            instrumentId: instrumentId,
            instrumentName: instrument?.name || 'Unknown',
            studentName: formData.get('studentName'),
            hireDate: formData.get('hireDate'),
            expectedReturn: formData.get('expectedReturn'),
            agreement: false,
            status: 'active'
        };
        
        const result = await DatabaseService.addInstrumentHire(hire);
        
        if (result.success) {
            // Update instrument status
            await DatabaseService.updateInstrument(instrumentId, { status: 'On Hire' });
            
            this.showToast('Hire recorded successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error recording hire', 'error');
        }
    }

    showTemplateModal(templateId) {
        const template = EventTemplates[templateId];
        if (!template) return;
        
        const content = `
            <div class="template-detail">
                <p class="template-detail-description">${template.description}</p>
                <div class="template-phases">
                    ${template.tasks.map(phase => `
                        <div class="template-phase">
                            <h4 class="phase-title">${phase.phase}</h4>
                            <ul class="phase-tasks">
                                ${phase.items.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.showModal(template.name, content);
    }

    // ========================================
    // Data Management
    // ========================================

    async loadDemoData() {
        if (!confirm('This will load demo data into your database. Continue?')) return;
        
        this.showLoading(true);
        
        try {
            // Use DummyData from dummyData.js
            const result = await DatabaseService.importAllData(DummyData);
            
            if (result.success) {
                this.showToast(`Demo data loaded! (${result.count} records)`, 'success');
                await this.loadAllData();
                this.renderCurrentPage();
            } else {
                this.showToast('Error loading demo data', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showToast('Error loading demo data', 'error');
        }
        
        this.showLoading(false);
    }

    async exportData() {
        this.showLoading(true);
        
        try {
            const data = await DatabaseService.exportAllData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mgs-arts-portal-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            this.showToast('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Error:', error);
            this.showToast('Error exporting data', 'error');
        }
        
        this.showLoading(false);
    }

    async importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!confirm('This will import data from the file. Continue?')) {
            e.target.value = '';
            return;
        }
        
        this.showLoading(true);
        
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            const result = await DatabaseService.importAllData(data);
            
            if (result.success) {
                this.showToast(`Data imported! (${result.count} records)`, 'success');
                await this.loadAllData();
                this.renderCurrentPage();
            } else {
                this.showToast('Error importing data', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showToast('Invalid file format', 'error');
        }
        
        e.target.value = '';
        this.showLoading(false);
    }

    async saveSchoolSettings() {
        const settings = {
            schoolName: document.getElementById('setting-school-name').value,
            academyName: document.getElementById('setting-academy-name').value
        };
        
        const result = await DatabaseService.updateSettings({ ...this.data.settings, ...settings });
        
        if (result.success) {
            this.showToast('Settings saved!', 'success');
            this.data.settings = { ...this.data.settings, ...settings };
        } else {
            this.showToast('Error saving settings', 'error');
        }
    }

    // ========================================
    // Utility Functions
    // ========================================

    getStudentById(id) {
        return this.data.students.find(s => s.id === id);
    }

    getTutorById(id) {
        return this.data.tutors.find(t => t.id === id);
    }

    formatDate(dateStr) {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        if (isNaN(date)) return dateStr;
        return date.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    handleSearch(type, query) {
        // Implement search filtering
        query = query.toLowerCase();
        
        if (type === 'lessons') {
            const tbody = document.getElementById('lessons-body');
            tbody.querySelectorAll('tr').forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        } else if (type === 'students') {
            const tbody = document.getElementById('students-body');
            tbody.querySelectorAll('tr').forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        }
    }

    handleTabClick(e) {
        const tab = e.target.dataset.tab;
        const tabContainer = e.target.closest('.page-tabs');
        
        tabContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Handle requests page tabs
        if (this.currentPage === 'requests') {
            this.renderRequests(tab);
        }
    }

    changeDate(days) {
        this.currentDate.setDate(this.currentDate.getDate() + days);
        this.updateDateDisplay();
        this.renderTodaysLessons();
    }

    goToToday() {
        this.currentDate = new Date();
        this.updateDateDisplay();
        this.renderTodaysLessons();
    }

    updateDateDisplay() {
        const dateEl = document.getElementById('current-date');
        if (dateEl) {
            dateEl.textContent = this.currentDate.toLocaleDateString('en-NZ', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        }
    }

    // ========================================
    // Theme
    // ========================================

    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
    }

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }

    // ========================================
    // Toast Notifications
    // ========================================

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
        
        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }
}

// Initialize app
const app = new App();
