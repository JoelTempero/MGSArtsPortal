// ========================================
// MGS Arts Portal - Firebase Integrated App
// ========================================

import { AuthService, DatabaseService, EventTemplates, auth } from './firebase.js';
import { EmailService } from './emailService.js';
import { DummyData } from './dummyData.js';

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
        this.isDemoMode = false;

        // Sorting state for tables
        this.sortState = {
            lessons: { column: null, direction: 'asc' },
            students: { column: null, direction: 'asc' },
            events: { column: null, direction: 'asc' },
            instruments: { column: null, direction: 'asc' },
            hires: { column: null, direction: 'asc' }
        };

        // Filter state for tables
        this.filterState = {
            lessons: {},
            students: {},
            events: {},
            instruments: {},
            hires: {}
        };

        // Tab state for pages with tabs
        this.lessonsTab = 'all';
        this.fundedLessonsTab = 'requests';

        this.init();
    }

    async init() {
        // Check domain authorization for Firebase Auth
        this.checkDomainAuthorization();

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

    checkDomainAuthorization() {
        const currentDomain = window.location.hostname;
        const authorizedDomains = [
            'localhost',
            '127.0.0.1',
            'mgs-performing-arts.firebaseapp.com',
            'mgs-performing-arts.web.app'
        ];
        if (!authorizedDomains.includes(currentDomain) && !currentDomain.endsWith('.firebaseapp.com')) {
            console.warn(
                `Domain "${currentDomain}" may not be authorized for Firebase Auth. ` +
                `Add it to Firebase Console → Authentication → Settings → Authorized domains.`
            );
            this.unauthorizedDomain = currentDomain;
        }
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

        // Initialize Joel counter
        this.initJoelCounter();

        // Render dashboard
        this.renderCurrentPage();
    }

    updateUserDisplay() {
        const user = this.currentUser;
        if (!user) return;
        
        // Extract name from displayName or email for display
        const email = user.email || '';
        let name = user.displayName || email.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');

        // If name is just initials like "R", try to get a better display name
        const firstName = name.split(' ')[0];
        const displayFirstName = firstName.length > 2 ? firstName : name;

        const initials = name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);

        document.getElementById('user-name').textContent = name;
        document.getElementById('user-avatar').textContent = initials;
        document.getElementById('welcome-name').textContent = displayFirstName;
    }

    initJoelCounter() {
        const JOEL_COUNTER_KEY = 'joelCounterData';
        const countEl = document.getElementById('joel-day-count');
        const resetBtn = document.getElementById('reset-joel-counter');

        if (!countEl || !resetBtn) return;

        // Get stored data or initialize
        const getCounterData = () => {
            const stored = localStorage.getItem(JOEL_COUNTER_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
            return { startDate: new Date().toISOString().split('T')[0], count: 0 };
        };

        const saveCounterData = (data) => {
            localStorage.setItem(JOEL_COUNTER_KEY, JSON.stringify(data));
        };

        const updateDisplay = () => {
            const data = getCounterData();
            const startDate = new Date(data.startDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);

            // Calculate days since start date
            const diffTime = today - startDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            countEl.textContent = Math.max(0, diffDays);
        };

        // Initial display update
        updateDisplay();

        // Reset button handler
        resetBtn.addEventListener('click', () => {
            saveCounterData({ startDate: new Date().toISOString().split('T')[0], count: 0 });
            updateDisplay();
            this.showToast('Joel counter reset!', 'success');
        });
    }

    async loadAllData() {
        this.showLoading(true);

        // Demo mode: load from local DummyData instead of Firestore
        if (this.isDemoMode) {
            this.loadDemoDataLocally();
            this.showLoading(false);
            return;
        }

        // Verify real Firebase auth before querying Firestore
        if (!auth.currentUser) {
            console.error('No Firebase auth session. Firestore queries will fail.');
            const domainMsg = this.unauthorizedDomain
                ? ` The domain "${this.unauthorizedDomain}" needs to be added to Firebase Console → Authentication → Settings → Authorized domains.`
                : '';
            this.showToast('Authentication error — not signed in to Firebase.' + domainMsg, 'error');
            this.showLoading(false);
            return;
        }

        try {
            const [students, tutors, lessons, events, groups, instruments, instrumentHires, lessonRequests, settings, forms, users, templates, activities] = await Promise.all([
                DatabaseService.getStudents(),
                DatabaseService.getTutors(),
                DatabaseService.getLessons(),
                DatabaseService.getEvents(),
                DatabaseService.getGroups(),
                DatabaseService.getInstruments(),
                DatabaseService.getInstrumentHires(),
                DatabaseService.getLessonRequests(),
                DatabaseService.getSettings(),
                DatabaseService.getForms(),
                DatabaseService.getUsers(),
                DatabaseService.getTemplates(),
                DatabaseService.getRecentActivities(30)
            ]);

            this.data = { students, tutors, lessons, events, groups, instruments, instrumentHires, lessonRequests, settings, forms, users, templates, activities };

            // Update activity notification badge
            this.updateActivityBadge();

            // If no data, show welcome message
            if (students.length === 0 && tutors.length === 0) {
                this.showToast('Welcome! Load demo data from Settings to get started.', 'info');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            if (error.code === 'permission-denied') {
                const domainMsg = this.unauthorizedDomain
                    ? ` Try adding "${this.unauthorizedDomain}" to Firebase Console → Authentication → Settings → Authorized domains.`
                    : '';
                this.showToast('Permission denied — your account may not have access.' + domainMsg, 'error');
            } else {
                this.showToast('Error loading data. Please refresh.', 'error');
            }
        }

        this.showLoading(false);
    }

    loadDemoDataLocally() {
        const addIds = (arr) => arr.map((item, i) => ({ id: `demo-${i}`, ...item }));
        this.data = {
            students: addIds(DummyData.students || []),
            tutors: addIds(DummyData.tutors || []),
            lessons: addIds(DummyData.lessons || []),
            events: addIds(DummyData.events || []),
            groups: addIds(DummyData.groups || []),
            instruments: addIds(DummyData.instruments || []),
            instrumentHires: addIds(DummyData.instrumentHires || []),
            lessonRequests: addIds(DummyData.lessonRequests || []),
            settings: DummyData.settings || {},
            forms: [],
            users: [{ id: 'demo-admin', name: 'Rhian Horn', email: 'r.horn@middleton.school.nz', role: 'admin', active: true }],
            templates: [],
            activities: []
        };
        this.updateActivityBadge();
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

        // Mobile bottom navigation
        document.querySelectorAll('.mobile-bottom-nav .bottom-nav-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                this.navigateTo(page);
                this.updateBottomNavActive(page);
            });
        });
        document.getElementById('mobile-hamburger')?.addEventListener('click', () => this.toggleSidebar(true));

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
        document.getElementById('wipe-all-data')?.addEventListener('click', () => this.showWipeDataModal());
        document.getElementById('save-school-settings')?.addEventListener('click', () => this.saveSchoolSettings());
        document.getElementById('add-category-btn')?.addEventListener('click', () => this.addCategory());

        // CSV Import - use modal-based flow which has full type support
        document.getElementById('csv-import-btn')?.addEventListener('click', () => this.showCSVImportModal());

        // Search inputs
        document.getElementById('lessons-search')?.addEventListener('input', (e) => this.handleSearch('lessons', e.target.value));
        document.getElementById('students-search')?.addEventListener('input', (e) => this.handleSearch('students', e.target.value));
        document.getElementById('events-search')?.addEventListener('input', (e) => this.handleSearch('events', e.target.value));
        document.getElementById('tutors-search')?.addEventListener('input', (e) => this.handleSearch('tutors', e.target.value));
        document.getElementById('groups-search')?.addEventListener('input', (e) => this.handleSearch('groups', e.target.value));
        document.getElementById('instruments-search')?.addEventListener('input', (e) => this.handleSearch('instruments', e.target.value));
        document.getElementById('hires-search')?.addEventListener('input', (e) => this.handleSearch('hires', e.target.value));
        
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
        // Uses local DummyData instead of Firestore to avoid permission-denied errors
        if (email === 'r.horn@middleton.school.nz' && password === 'demo123') {
            this.currentUser = { email: email, displayName: 'Rhian Horn' };
            this.isDemoMode = true;
            await this.showApp();
            this.showToast('Demo mode — using sample data (read-only). Changes will not be saved.', 'info');
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
            let msg = result.error || 'Invalid email or password';
            if (this.unauthorizedDomain && (msg.includes('network') || msg.includes('internal'))) {
                msg += ` (Domain "${this.unauthorizedDomain}" may need to be authorized in Firebase Console.)`;
            }
            errorEl.textContent = msg;
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
        this.isDemoMode = false;
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

        // Update mobile bottom nav
        this.updateBottomNavActive(page);

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
            case 'recent-activity':
                this.renderRecentActivityPage();
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
            case 'funded-lessons':
                this.renderFundedLessons();
                break;
            case 'groups':
                this.renderGroups();
                break;
            case 'instrument-list':
                this.renderInstruments();
                break;
            case 'hires':
                this.renderHires(this.currentHiresFilter || 'active');
                break;
            case 'forms':
                this.renderForms();
                break;
            case 'templates':
                this.renderTemplates();
                break;
            case 'settings':
                this.renderSettings();
                break;
            case 'event-details':
                this.renderEventDetails();
                break;
        }
    }

    toggleNavGroup(btn) {
        const group = btn.dataset.group;
        const items = document.querySelector(`.nav-group-items[data-group="${group}"]`);
        const isOpen = items.classList.contains('expanded');
        
        // Close all groups
        document.querySelectorAll('.nav-group-items').forEach(g => g.classList.remove('expanded'));
        document.querySelectorAll('.nav-group-toggle').forEach(b => b.classList.remove('expanded'));
        
        // Toggle this group
        if (!isOpen) {
            items.classList.add('expanded');
            btn.classList.add('expanded');
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

    updateBottomNavActive(page) {
        // Update mobile bottom nav active state
        document.querySelectorAll('.mobile-bottom-nav .bottom-nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === page) {
                btn.classList.add('active');
            }
        });
    }

    // ========================================
    // Dashboard Rendering
    // ========================================

    renderDashboard() {
        this.renderOverdueEventTasks();
        this.renderUpcomingEvents();
        this.renderRecentRequests();
        this.renderOverdueHires();
        this.renderTodaysLessons();
    }

    renderRecentActivityPage() {
        this.renderRecentActivity();
        // Mark activities as viewed when Recent Activity page is visible
        this.markActivitiesViewed();
    }

    renderOverdueEventTasks() {
        const container = document.getElementById('overdue-tasks-list');
        const badge = document.getElementById('overdue-tasks-badge');
        if (!container) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Collect all overdue tasks from all events
        const overdueTasks = [];
        this.data.events.forEach(event => {
            const eventDate = new Date(event.date);

            // Get template tasks and calculate due dates
            const templateTasks = this.getEventTemplateTasks(event.template || event.templateType);
            const savedTasks = event.tasks || [];

            templateTasks.forEach(templateTask => {
                // Find if this task has been saved/completed
                const savedTask = savedTasks.find(t => t.name === templateTask.name);
                if (savedTask?.completed) return;

                // Calculate due date based on daysBefore
                const dueDate = new Date(eventDate);
                dueDate.setDate(dueDate.getDate() - templateTask.daysBefore);

                if (dueDate < today && eventDate >= today) {
                    overdueTasks.push({
                        eventId: event.id,
                        eventName: event.name,
                        taskName: templateTask.name,
                        dueDate: dueDate,
                        phase: templateTask.phase
                    });
                }
            });

            // Also check custom tasks stored in event.tasks
            savedTasks.filter(t => t.isCustom && !t.completed).forEach(task => {
                const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                if (dueDate && dueDate < today && eventDate >= today) {
                    overdueTasks.push({
                        eventId: event.id,
                        eventName: event.name,
                        taskName: task.name,
                        dueDate: dueDate,
                        phase: task.phase || 'Custom'
                    });
                }
            });
        });

        // Sort by due date (oldest first)
        overdueTasks.sort((a, b) => a.dueDate - b.dueDate);

        if (badge) {
            badge.textContent = `${overdueTasks.length} overdue`;
            badge.classList.toggle('has-items', overdueTasks.length > 0);
        }

        if (overdueTasks.length === 0) {
            container.innerHTML = '<p class="no-data success-text">No overdue tasks!</p>';
            return;
        }

        container.innerHTML = overdueTasks.slice(0, 5).map(task => {
            const daysOverdue = Math.floor((today - task.dueDate) / (1000 * 60 * 60 * 24));
            return `
                <div class="overdue-task-item" onclick="app.showEventDetailsPage('${task.eventId}')">
                    <div class="overdue-task-info">
                        <span class="overdue-task-name">${typeof task.taskName === 'string' ? task.taskName : task.taskName.name || 'Task'}</span>
                        <span class="overdue-task-event">${task.eventName}</span>
                    </div>
                    <span class="overdue-badge">${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue</span>
                </div>
            `;
        }).join('');
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
                <tr class="clickable" onclick="app.showEditLessonModal('${lesson.id}')">
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

    renderRecentActivity() {
        const container = document.getElementById('recent-activity-list');
        if (!container) return;

        let activities = this.data.activities || [];

        // Apply filters
        const userFilter = document.getElementById('activity-filter-user')?.value;
        const typeFilter = document.getElementById('activity-filter-type')?.value;
        const dateFilter = document.getElementById('activity-filter-date')?.value;

        if (userFilter) {
            activities = activities.filter(a => a.actor === userFilter);
        }
        if (typeFilter) {
            activities = activities.filter(a => a.type === typeFilter);
        }
        if (dateFilter) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

            activities = activities.filter(a => {
                const activityDate = new Date(a.createdAt);
                if (dateFilter === 'today') return activityDate >= today;
                if (dateFilter === 'week') return activityDate >= weekAgo;
                if (dateFilter === 'month') return activityDate >= monthAgo;
                return true;
            });
        }

        // Populate user filter dropdown with unique actors
        const userSelect = document.getElementById('activity-filter-user');
        if (userSelect && userSelect.options.length <= 1) {
            const allActivities = this.data.activities || [];
            const uniqueActors = [...new Set(allActivities.map(a => a.actor).filter(a => a))];
            uniqueActors.forEach(actor => {
                const option = document.createElement('option');
                option.value = actor;
                option.textContent = actor;
                userSelect.appendChild(option);
            });
        }

        if (activities.length === 0) {
            container.innerHTML = '<div class="no-activity">No recent activity matching filters</div>';
            return;
        }

        // Show all activities (no limit) for full page view
        container.innerHTML = activities.map(activity => {
            const icon = this.getActivityIcon(activity.type);
            const timeAgo = this.formatTimeAgo(activity.createdAt);

            return `
                <div class="activity-item">
                    <div class="activity-icon ${activity.type}">
                        ${icon}
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.message}</div>
                        <div class="activity-meta">
                            <span class="activity-time">${timeAgo}</span>
                            ${activity.actor ? `<span>by ${activity.actor}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    filterActivity() {
        this.renderRecentActivity();
    }

    clearActivityFilters() {
        const userSelect = document.getElementById('activity-filter-user');
        const typeSelect = document.getElementById('activity-filter-type');
        const dateSelect = document.getElementById('activity-filter-date');
        if (userSelect) userSelect.value = '';
        if (typeSelect) typeSelect.value = '';
        if (dateSelect) dateSelect.value = '';
        this.renderRecentActivity();
    }

    getActivityIcon(type) {
        const icons = {
            lesson: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
            event: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
            task: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
            student: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
            staff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
            group: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
            email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>'
        };
        return icons[type] || icons.task;
    }

    formatTimeAgo(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
    }

    // Log an activity to the database
    async logActivity(type, message, details = {}) {
        try {
            await DatabaseService.logActivity({
                type,
                message,
                details,
                actor: this.currentUser?.displayName || this.currentUser?.email || 'System'
            });
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    }

    // Update the activity notification badge
    updateActivityBadge() {
        const badge = document.getElementById('activity-badge');
        if (!badge) return;

        const activities = this.data.activities || [];
        if (activities.length === 0) {
            badge.style.display = 'none';
            return;
        }

        // Get last viewed timestamp from localStorage
        const lastViewed = localStorage.getItem('mgs_last_activity_view');
        const lastViewedDate = lastViewed ? new Date(lastViewed) : new Date(0);

        // Count activities newer than last viewed
        const newCount = activities.filter(a => {
            const activityDate = new Date(a.createdAt);
            return activityDate > lastViewedDate;
        }).length;

        if (newCount > 0 && this.currentPage !== 'dashboard') {
            badge.textContent = newCount > 99 ? '99+' : newCount;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }

    // Mark activities as viewed (called when viewing Dashboard)
    markActivitiesViewed() {
        localStorage.setItem('mgs_last_activity_view', new Date().toISOString());
        const badge = document.getElementById('activity-badge');
        if (badge) badge.style.display = 'none';
    }

    renderUpcomingEvents() {
        const container = document.getElementById('events-list');
        if (!container) return;

        // Sort events by date and take first 4
        const sortedEvents = [...this.data.events].sort((a, b) => new Date(a.date) - new Date(b.date));
        const events = sortedEvents.filter(e => new Date(e.date) >= new Date()).slice(0, 4);

        if (events.length === 0) {
            container.innerHTML = '<p class="no-data">No upcoming events</p>';
            return;
        }

        container.innerHTML = events.map(event => {
            const categoryClass = (event.category || 'other').toLowerCase().replace(/\s+/g, '-');
            return `
                <div class="event-item clickable" onclick="app.showEventDetailsPage('${event.id}')">
                    <div class="event-info">
                        <span class="event-name">${event.name}</span>
                        <span class="event-date">${this.formatDate(event.date)}</span>
                    </div>
                    <span class="category-badge ${categoryClass}">${event.category || 'Event'}</span>
                </div>
            `;
        }).join('');
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
            <div class="request-item clickable" onclick="app.${req.status === 'awaiting' ? `showApproveRequestModal('${req.id}')` : `navigateTo('requests')`}">
                <div class="request-info">
                    <span class="request-name">${req.studentName.split('(')[0].trim()}</span>
                    <span class="request-detail">Year ${req.year} • ${req.instrument}</span>
                </div>
                <span class="status-badge status-${req.status === 'awaiting' ? 'pending' : 'waiting'}">${req.status}</span>
            </div>
        `).join('');
    }

    renderOverdueHires() {
        const hires = this.data.instrumentHires;
        const activeHires = hires.filter(h => h.status === 'active');
        const dueSoonHires = hires.filter(h => h.status === 'due-soon');
        const overdueHires = hires.filter(h => h.status === 'overdue');

        const activeEl = document.getElementById('hires-active');
        const dueSoonEl = document.getElementById('hires-due-soon');
        const overdueEl = document.getElementById('hires-overdue');

        if (activeEl) activeEl.textContent = activeHires.length;
        if (dueSoonEl) dueSoonEl.textContent = dueSoonHires.length;
        if (overdueEl) overdueEl.textContent = overdueHires.length;

        // Render overdue hires list
        const container = document.getElementById('overdue-hires-list');
        if (!container) return;

        const combinedOverdue = [...overdueHires, ...dueSoonHires];
        if (combinedOverdue.length === 0) {
            container.innerHTML = '<p class="no-data success-text">No overdue agreements!</p>';
            return;
        }

        container.innerHTML = combinedOverdue.slice(0, 4).map(hire => {
            const instrument = this.data.instruments.find(i => i.id === hire.instrumentId);
            const student = this.data.students.find(s => s.id === hire.studentId);
            const isOverdue = hire.status === 'overdue';
            // Get instrument name from lookup, or from hire record, or fallback
            const instrumentName = instrument?.name || hire.instrumentName || hire.instrument || 'Unknown Instrument';
            return `
                <div class="overdue-hire-item clickable ${isOverdue ? 'is-overdue' : 'is-due-soon'}" onclick="app.showEditHireModal('${hire.id}')">
                    <div class="overdue-hire-info">
                        <span class="overdue-hire-instrument">${instrumentName}</span>
                        <span class="overdue-hire-student">${student?.name || hire.studentName || 'Unknown'}</span>
                    </div>
                    <span class="hire-status-badge ${hire.status}">${isOverdue ? 'Overdue' : 'Due Soon'}</span>
                </div>
            `;
        }).join('');
    }

    // ========================================
    // Lessons Rendering
    // ========================================

    renderLessons() {
        const table = document.getElementById('lessons-table');
        const tbody = document.getElementById('lessons-body');
        if (!tbody) return;

        // Update sortable headers
        const thead = table?.querySelector('thead tr');
        if (thead) {
            thead.innerHTML = `
                <th class="sortable" onclick="app.sortData('lessons', 'studentName')">Student ${this.getSortIcon('lessons', 'studentName')}</th>
                <th class="sortable" onclick="app.sortData('lessons', 'class')">Class ${this.getSortIcon('lessons', 'class')}</th>
                <th class="sortable" onclick="app.sortData('lessons', 'instrument')">Instrument ${this.getSortIcon('lessons', 'instrument')}</th>
                <th class="sortable" onclick="app.sortData('lessons', 'dayTime')">Day & Time ${this.getSortIcon('lessons', 'dayTime')}</th>
                <th class="sortable" onclick="app.sortData('lessons', 'tutorName')">Tutor ${this.getSortIcon('lessons', 'tutorName')}</th>
                <th class="sortable" onclick="app.sortData('lessons', 'status')">Status ${this.getSortIcon('lessons', 'status')}</th>
                <th class="sortable" onclick="app.sortData('lessons', 'acknowledged')">Confirmed ${this.getSortIcon('lessons', 'acknowledged')}</th>
                <th class="sortable" onclick="app.sortData('lessons', 'funded')">Funded ${this.getSortIcon('lessons', 'funded')}</th>
                <th class="sortable" onclick="app.sortData('lessons', 'finished')">Finished ${this.getSortIcon('lessons', 'finished')}</th>
                <th class="th-actions"></th>
            `;
        }

        if (this.data.lessons.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="no-data">No lessons found. Add your first lesson!</td></tr>';
            return;
        }

        // Apply tab filtering first
        let lessons = [...this.data.lessons];
        const activeTab = this.lessonsTab || 'all';

        switch (activeTab) {
            case 'funded':
                lessons = lessons.filter(l => l.funded === true);
                break;
            case 'active':
                lessons = lessons.filter(l => l.status === 'active');
                break;
            case 'paused':
                lessons = lessons.filter(l => l.status === 'paused' || l.status === 'cancelled');
                break;
            // 'all' shows everything
        }

        // Apply column filtering and sorting
        lessons = this.getFilteredData('lessons', lessons);
        lessons = this.getSortedData('lessons', lessons);

        tbody.innerHTML = lessons.map(lesson => {
            const student = this.getStudentById(lesson.studentId) || { name: lesson.studentName || 'Unknown', class: '—' };
            const tutor = this.getTutorById(lesson.tutorId) || { name: lesson.tutorName || 'Unknown', initials: 'UN', color: '#888' };
            const dayTime = `${lesson.day} ${lesson.time}`;
            const fundedBadge = lesson.funded
                ? '<span class="status-badge status-funded">Funded</span>'
                : '<span class="text-muted">—</span>';

            // Acknowledgment status badge
            let acknowledgedBadge;
            if (lesson.acknowledged) {
                if (lesson.acknowledgmentStatus === 'accepted') {
                    acknowledgedBadge = '<span class="status-badge status-active" title="Tutor confirmed">Accepted</span>';
                } else if (lesson.acknowledgmentStatus === 'waitlist') {
                    acknowledgedBadge = '<span class="status-badge status-waiting" title="Added to waitlist">Waitlist</span>';
                } else {
                    acknowledgedBadge = '<span class="status-badge status-assigned" title="Tutor responded">Responded</span>';
                }
            } else {
                acknowledgedBadge = '<span class="status-badge status-pending" title="Awaiting tutor confirmation">Pending</span>';
            }

            // Finished status badge
            const finishedBadge = lesson.finished
                ? `<span class="status-badge status-inactive" title="Ended ${lesson.finishedAt ? this.formatDate(lesson.finishedAt) : ''}">Finished</span>`
                : '<span class="text-muted">—</span>';

            return `
                <tr data-id="${lesson.id}" ${lesson.finished ? 'class="row-finished"' : ''}>
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
                    <td>${acknowledgedBadge}</td>
                    <td>${fundedBadge}</td>
                    <td>${finishedBadge}</td>
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
        const table = document.getElementById('students-table');
        const tbody = document.getElementById('students-body');
        if (!tbody) return;

        // Update sortable headers
        const thead = table?.querySelector('thead tr');
        if (thead) {
            thead.innerHTML = `
                <th class="sortable" onclick="app.sortData('students', 'name')">Student ${this.getSortIcon('students', 'name')}</th>
                <th class="sortable" onclick="app.sortData('students', 'year')">Year ${this.getSortIcon('students', 'year')}</th>
                <th class="sortable" onclick="app.sortData('students', 'class')">Class ${this.getSortIcon('students', 'class')}</th>
                <th>Instruments</th>
                <th class="sortable" onclick="app.sortData('students', 'tutorName')">Tutor ${this.getSortIcon('students', 'tutorName')}</th>
                <th class="sortable" onclick="app.sortData('students', 'status')">Status ${this.getSortIcon('students', 'status')}</th>
                <th class="th-actions"></th>
            `;
        }

        if (this.data.students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No students found. Add your first student!</td></tr>';
            return;
        }

        // Apply filtering and sorting
        let students = this.getFilteredData('students', this.data.students);
        students = this.getSortedData('students', students);

        tbody.innerHTML = students.map(student => {
            // Derive tutor from student's active lessons (lessons assigned to this student)
            const studentLessons = this.data.lessons.filter(l =>
                l.studentId === student.id ||
                l.studentName?.toLowerCase() === student.name?.toLowerCase()
            );
            const activeLessons = studentLessons.filter(l => l.status === 'active');

            let tutor = { name: 'Unassigned', initials: '—', color: '#888' };
            if (activeLessons.length > 0) {
                // Get the tutor from the first active lesson
                const lesson = activeLessons[0];
                tutor = this.getTutorById(lesson.tutorId) || this.data.tutors.find(t => t.name === lesson.tutorName) || tutor;
            } else if (student.tutorId) {
                // Fallback to student.tutorId if no lessons found
                tutor = this.getTutorById(student.tutorId) || tutor;
            }

            // Also include parent info from form submissions if available
            const parentInfo = student.parentName || student.parentEmail || student.parentPhone;

            return `
                <tr data-id="${student.id}">
                    <td>
                        <div class="cell-student">
                            <div class="student-avatar music">${student.name.charAt(0)}</div>
                            <span class="student-name">${student.name}</span>
                        </div>
                    </td>
                    <td>${student.year || '—'}</td>
                    <td>${student.class || '—'}</td>
                    <td>${student.instruments?.join(', ') || '—'}</td>
                    <td>
                        <div class="cell-tutor">
                            <div class="tutor-avatar" style="background: ${tutor.color || '#888'}; color: white;">${tutor.initials || this.getInitials(tutor.name)}</div>
                            <span>${tutor.name}${activeLessons.length > 1 ? ` (+${activeLessons.length - 1})` : ''}</span>
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
            container.innerHTML = '<div class="no-data-card">No staff found. Add your first staff member!</div>';
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
        
        container.innerHTML = this.data.tutors.map(tutor => {
            // Handle both old groupId and new groupIds format
            const tutorGroupIds = tutor.groupIds || (tutor.groupId ? [tutor.groupId] : []);
            const groups = tutorGroupIds.map(gid => this.data.groups.find(g => g.id === gid)).filter(g => g);
            
            // Determine role label based on what they have
            const hasInstruments = tutor.instruments && tutor.instruments.length > 0;
            const hasGroups = groups.length > 0;
            let roleLabel = 'Staff Member';
            if (hasInstruments && hasGroups) roleLabel = 'Tutor & Group Leader';
            else if (hasInstruments) roleLabel = 'Itinerant Music Teacher';
            else if (hasGroups) roleLabel = 'Group Leader';
            
            return `
                <div class="tutor-card" data-id="${tutor.id}">
                    <div class="tutor-card-header">
                        <div class="tutor-avatar-large" style="background: ${tutor.color};">${tutor.initials}</div>
                        <div class="tutor-header-info">
                            <div class="tutor-name">${tutor.name}</div>
                            <div class="tutor-role">${roleLabel}</div>
                        </div>
                    </div>
                    <div class="tutor-disciplines">
                        ${(tutor.instruments || []).map(i => `<span class="discipline-tag discipline-music">${i}</span>`).join('')}
                        ${groups.map(g => `<span class="discipline-tag discipline-drama">${g.name}</span>`).join('')}
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
                    <div class="tutor-card-actions">
                        <button class="btn btn-outline btn-sm" data-action="edit-tutor" data-id="${tutor.id}">Edit</button>
                        ${tutor.email ? `<button class="btn btn-outline btn-sm" data-action="send-portal-link" data-id="${tutor.id}" title="Send portal access link">Portal Link</button>` : ''}
                        <button class="btn btn-outline btn-sm" data-action="delete-tutor" data-id="${tutor.id}">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Bind edit/delete buttons
        this.bindRowActions('tutor');
    }

    // ========================================
    // Events Rendering
    // ========================================

    renderEvents() {
        const table = document.getElementById('events-table');
        const tbody = document.getElementById('events-body');
        if (!tbody) return;

        // Update sortable headers
        const thead = table?.querySelector('thead tr');
        if (thead) {
            thead.innerHTML = `
                <th class="sortable" onclick="app.sortData('events', 'name')">Event ${this.getSortIcon('events', 'name')}</th>
                <th class="sortable" onclick="app.sortData('events', 'date')">Date ${this.getSortIcon('events', 'date')}</th>
                <th class="sortable" onclick="app.sortData('events', 'location')">Location ${this.getSortIcon('events', 'location')}</th>
                <th class="sortable" onclick="app.sortData('events', 'term')">Term ${this.getSortIcon('events', 'term')}</th>
                <th>Groups</th>
                <th>Progress</th>
                <th class="sortable" onclick="app.sortData('events', 'category')">Category ${this.getSortIcon('events', 'category')}</th>
                <th class="sortable" onclick="app.sortData('events', 'template')">Type ${this.getSortIcon('events', 'template')}</th>
                <th class="th-actions"></th>
            `;
        }

        const categoryColors = {
            'Music': 'music', 'Drama': 'drama', 'Dance': 'dance',
            'Pasifika': 'music', 'Kapa Haka': 'drama',
            'Performing Arts': 'dance', 'Production': 'drama'
        };

        const templateLabels = {
            'school-during': 'School (During)',
            'school-after': 'School (After)',
            'offsite-during': 'Offsite (During)',
            'offsite-after': 'Offsite (After)'
        };

        if (this.data.events.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="no-data">No events found. Create your first event!</td></tr>';
            return;
        }

        // Apply filtering and sorting
        let events = this.getFilteredData('events', this.data.events);
        events = this.getSortedData('events', events);

        tbody.innerHTML = events.map(event => {
            const templateLabel = templateLabels[event.template] || event.template || '—';

            // Calculate task progress from template tasks
            const templateTasks = this.getEventTemplateTasks(event.template || event.templateType);
            const savedTasks = event.tasks || [];
            const totalTasks = templateTasks.length;
            const completedTasks = savedTasks.filter(t => t.completed).length;
            const eventDate = new Date(event.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Calculate overdue tasks based on template due dates
            let overdueTasks = 0;
            templateTasks.forEach(task => {
                const savedTask = savedTasks.find(t => t.name === task.name);
                if (!savedTask?.completed) {
                    const dueDate = new Date(eventDate);
                    dueDate.setDate(dueDate.getDate() - task.daysBefore);
                    if (dueDate < today) {
                        overdueTasks++;
                    }
                }
            });

            const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            const progressClass = overdueTasks > 0 ? 'has-overdue' : (progressPercent === 100 ? 'complete' : '');

            const taskProgressDisplay = totalTasks > 0 ? `
                <div class="event-progress-indicator ${progressClass}">
                    <div class="progress-bar-mini">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <span class="progress-text">${progressPercent}%</span>
                    ${overdueTasks > 0 ? `
                        <span class="overdue-badge" title="${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            ${overdueTasks}
                        </span>
                    ` : ''}
                </div>
            ` : '<span class="text-muted">No tasks</span>';

            // Get group names
            const eventGroups = (event.groupIds || [])
                .map(gid => this.data.groups.find(g => g.id === gid))
                .filter(g => g)
                .map(g => g.name);
            const groupsDisplay = eventGroups.length > 0
                ? eventGroups.map(name => `<span class="mini-tag">${name}</span>`).join('')
                : '<span class="text-muted">—</span>';

            return `
                <tr data-id="${event.id}">
                    <td><strong>${event.name}</strong></td>
                    <td>${this.formatDate(event.date)}${event.time ? ' · ' + event.time : ''}</td>
                    <td>${event.location || '—'}</td>
                    <td>${event.term || '—'}</td>
                    <td><div class="mini-tags">${groupsDisplay}</div></td>
                    <td>${taskProgressDisplay}</td>
                    <td><span class="discipline-tag discipline-${categoryColors[event.category] || 'music'}">${event.category || 'Event'}</span></td>
                    <td><span class="text-muted">${templateLabel}</span></td>
                    <td>
                        <div class="row-actions">
                            <button class="row-action-btn primary" title="View Tasks" data-action="view-event-details" data-id="${event.id}">
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
                            <button class="row-action-btn" title="Delete" data-action="delete-event" data-id="${event.id}">
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
            requests = requests.filter(r => r.status === filter || (filter === 'pending' && r.status === 'awaiting'));
        }

        if (requests.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="no-data">No ${filter === 'all' ? '' : filter} requests</td></tr>`;
            return;
        }

        tbody.innerHTML = requests.map(req => {
            const statusClass = req.status === 'awaiting' || req.status === 'pending' ? 'pending' : req.status;
            return `
            <tr data-id="${req.id}">
                <td><strong>${req.studentName}</strong></td>
                <td>${req.year || req.yearLevel || '—'}</td>
                <td>${req.instrument}</td>
                <td>${req.received ? this.formatDate(req.received) : (req.submittedAt ? this.formatDate(req.submittedAt) : '—')}</td>
                <td>${req.source || req.form || '—'}</td>
                <td><span class="status-badge status-${statusClass}">${req.status}</span></td>
                <td>
                    <div class="row-actions">
                        <button class="row-action-btn info" title="View Details" data-action="view-request" data-id="${req.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                        ${req.status === 'awaiting' || req.status === 'pending' || req.status === 'waitlist' ? `
                            <button class="row-action-btn success" title="Approve" data-action="approve-request" data-id="${req.id}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 6L9 17l-5-5"/>
                                </svg>
                            </button>
                        ` : ''}
                        ${req.status === 'awaiting' || req.status === 'pending' ? `
                            <button class="row-action-btn warning" title="Waitlist" data-action="waitlist-request" data-id="${req.id}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 6v6l4 2"/>
                                </svg>
                            </button>
                        ` : ''}
                        <button class="row-action-btn" title="Edit" data-action="edit-request" data-id="${req.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="row-action-btn" title="Delete" data-action="delete-request" data-id="${req.id}">
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

        this.bindRowActions('request');
    }

    // ========================================
    // Funded Lessons Rendering
    // ========================================

    renderFundedLessons() {
        const statsContainer = document.getElementById('funded-stats-cards');
        const tbody = document.getElementById('funded-lessons-body');
        if (!tbody) return;

        const currentTab = this.fundedLessonsTab || 'requests';

        // Calculate stats
        const fundedLessons = this.data.lessons.filter(l => l.funded);
        const fundedRequests = this.data.lessonRequests.filter(r => r.fundedRequested);
        const confirmedFunded = fundedLessons.filter(l => l.status === 'active');
        const movedToPrivate = this.data.lessons.filter(l => l.fundedConverted);

        // Calculate tutor slots
        const tutorSlots = this.data.tutors
            .filter(t => t.fundedSlots && t.fundedSlots > 0)
            .map(t => {
                const usedSlots = fundedLessons.filter(l => l.tutorId === t.id && l.status === 'active').length;
                return {
                    name: t.name,
                    total: t.fundedSlots,
                    used: usedSlots,
                    remaining: t.fundedSlots - usedSlots
                };
            });

        const totalSlots = tutorSlots.reduce((sum, t) => sum + t.total, 0);
        const usedSlots = tutorSlots.reduce((sum, t) => sum + t.used, 0);
        const remainingSlots = totalSlots - usedSlots;

        // Render stats cards
        if (statsContainer) {
            // Build tutor slots breakdown
            const tutorSlotsHtml = tutorSlots.length > 0 ? `
                <div class="tutor-slots-breakdown" style="margin-top: var(--spacing-sm); font-size: 0.75rem; color: var(--color-text-secondary);">
                    ${tutorSlots.map(t => `<span style="white-space: nowrap;">${t.name.split(' ')[0]}: ${t.remaining}/${t.total}</span>`).join(' | ')}
                </div>
            ` : '';

            statsContainer.innerHTML = `
                <div class="funded-stat-card">
                    <div class="stat-value">${fundedRequests.filter(r => r.status !== 'approved').length}</div>
                    <div class="stat-label">Pending Requests</div>
                    <div class="stat-sublabel">Awaiting decision</div>
                </div>
                <div class="funded-stat-card success">
                    <div class="stat-value">${confirmedFunded.length}</div>
                    <div class="stat-label">Confirmed Funded</div>
                    <div class="stat-sublabel">Active funded lessons</div>
                </div>
                <div class="funded-stat-card ${remainingSlots < 5 ? 'warning' : ''}">
                    <div class="stat-value">${remainingSlots}/${totalSlots}</div>
                    <div class="stat-label">Slots Remaining</div>
                    <div class="stat-sublabel">${tutorSlots.length} tutors with funded slots</div>
                    ${tutorSlotsHtml}
                </div>
                <div class="funded-stat-card">
                    <div class="stat-value">${movedToPrivate.length}</div>
                    <div class="stat-label">Moved to Private</div>
                    <div class="stat-sublabel">Converted from funded</div>
                </div>
            `;
        }

        // Get data based on current tab
        let data = [];
        switch (currentTab) {
            case 'requests':
                data = fundedRequests.map(r => ({
                    id: r.id,
                    type: 'request',
                    studentName: r.studentName,
                    year: r.year,
                    instrument: r.instrument,
                    tutorId: r.tutorId,
                    status: r.status
                }));
                break;
            case 'confirmed':
                data = confirmedFunded.map(l => {
                    const student = this.getStudentById(l.studentId);
                    return {
                        id: l.id,
                        type: 'lesson',
                        studentName: student?.name || l.studentName || 'Unknown',
                        year: student?.year || '',
                        instrument: l.instrument,
                        tutorId: l.tutorId,
                        status: 'funded'
                    };
                });
                break;
            case 'converted':
                data = movedToPrivate.map(l => {
                    const student = this.getStudentById(l.studentId);
                    return {
                        id: l.id,
                        type: 'lesson',
                        studentName: student?.name || l.studentName || 'Unknown',
                        year: student?.year || '',
                        instrument: l.instrument,
                        tutorId: l.tutorId,
                        status: 'private'
                    };
                });
                break;
        }

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="no-data">No ${currentTab} found</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(item => {
            const tutor = this.getTutorById(item.tutorId);
            const statusBadge = item.status === 'funded'
                ? '<span class="status-badge status-active">Funded</span>'
                : item.status === 'private'
                ? '<span class="status-badge status-assigned">Private</span>'
                : `<span class="status-badge status-${item.status === 'awaiting' ? 'pending' : 'waiting'}">${item.status}</span>`;

            return `
                <tr data-id="${item.id}">
                    <td><strong>${item.studentName}</strong></td>
                    <td>${item.year || '—'}</td>
                    <td>${item.instrument || '—'}</td>
                    <td>${tutor ? `
                        <div class="cell-tutor">
                            <div class="tutor-avatar" style="background: ${tutor.color || '#8b5cf6'}; color: white;">${tutor.initials}</div>
                            <span>${tutor.name}</span>
                        </div>
                    ` : '—'}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="row-actions">
                            ${currentTab === 'requests' ? `
                                <button class="btn btn-sm btn-outline" onclick="app.confirmFundedLesson('${item.id}')" title="Confirm as Funded">
                                    Confirm Funded
                                </button>
                                <button class="btn btn-sm btn-outline" onclick="app.convertToPrivate('${item.id}')" title="Move to Private">
                                    Move to Private
                                </button>
                            ` : currentTab === 'confirmed' ? `
                                <button class="btn btn-sm btn-outline" onclick="app.convertToPrivate('${item.id}')" title="Convert to Private">
                                    Convert to Private
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    async confirmFundedLesson(requestId) {
        const request = this.data.lessonRequests.find(r => r.id === requestId);
        if (!request) return;

        // Create a funded lesson from the request
        const lesson = {
            studentName: request.studentName,
            instrument: request.instrument,
            tutorId: request.tutorId,
            day: request.day || '',
            time: request.time || '',
            status: 'active',
            funded: true,
            fundedConfirmedAt: new Date().toISOString()
        };

        const result = await DatabaseService.addLesson(lesson);
        if (result.success) {
            // Remove the request
            await DatabaseService.deleteDocument('lessonRequests', requestId);
            this.logActivity('lesson', `Funded lesson confirmed for ${request.studentName}`, { lessonId: result.id });
            this.showToast('Funded lesson confirmed!', 'success');
            await this.loadAllData();
            this.renderFundedLessons();
        } else {
            this.showToast('Error confirming lesson', 'error');
        }
    }

    async convertToPrivate(id) {
        // Check if it's a request or a lesson
        const request = this.data.lessonRequests.find(r => r.id === id);
        const lesson = this.data.lessons.find(l => l.id === id);

        if (request) {
            // Convert request to private lesson
            const newLesson = {
                studentName: request.studentName,
                instrument: request.instrument,
                tutorId: request.tutorId,
                day: request.day || '',
                time: request.time || '',
                status: 'active',
                funded: false,
                fundedConverted: true,
                convertedAt: new Date().toISOString()
            };

            const result = await DatabaseService.addLesson(newLesson);
            if (result.success) {
                await DatabaseService.deleteDocument('lessonRequests', id);
                this.logActivity('lesson', `Funded request converted to private for ${request.studentName}`, { lessonId: result.id });
                this.showToast('Moved to private lessons', 'success');
                await this.loadAllData();
                this.renderFundedLessons();
            }
        } else if (lesson) {
            // Convert funded lesson to private
            const result = await DatabaseService.updateLesson(id, {
                funded: false,
                fundedConverted: true,
                convertedAt: new Date().toISOString()
            });

            if (result.success) {
                this.logActivity('lesson', `Funded lesson converted to private for student`, { lessonId: id });
                this.showToast('Converted to private lesson', 'success');
                await this.loadAllData();
                this.renderFundedLessons();
            }
        }
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
        
        container.innerHTML = this.data.groups.map(group => {
            // Get staff assigned to this group (tutors who lead this group)
            const groupStaff = this.data.tutors.filter(t => {
                const tutorGroupIds = t.groupIds || (t.groupId ? [t.groupId] : []);
                return tutorGroupIds.includes(group.id);
            });
            const staffDisplay = groupStaff.length > 0
                ? groupStaff.map(s => s.name).join(', ')
                : (group.leader || 'No leader assigned');

            // Custom header color
            const headerColor = group.headerColor || '#c9a962';
            const headerStyle = `background: ${headerColor}; color: ${this.getContrastColor(headerColor)};`;

            return `
                <div class="group-card" data-id="${group.id}">
                    <div class="group-card-header" style="${headerStyle}">
                        <div class="group-name">${group.name}</div>
                        <div class="group-type">${group.type}</div>
                    </div>
                    <div class="group-card-body">
                        <div class="group-meta">
                            <div class="group-meta-item">
                                <span class="group-meta-value discipline-tag discipline-${categoryColors[group.category] || 'music'}">${group.category}</span>
                            </div>
                        </div>
                        <div class="group-leader">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            ${staffDisplay}
                        </div>
                        <div class="group-meeting">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 6v6l4 2"/>
                            </svg>
                            ${group.meetingTime || 'TBA'}
                        </div>
                    </div>
                    <div class="group-card-actions">
                        <button class="btn btn-outline btn-sm" onclick="app.showNotifyStaffModal('group', '${group.id}')" title="Email leaders">Notify</button>
                        <button class="btn btn-outline btn-sm" onclick="app.showEditGroupModal('${group.id}')">Edit</button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Bind edit/delete buttons for groups
        this.bindRowActions('group');
    }

    // ========================================
    // Instruments Rendering
    // ========================================

    // Instrument hire costs per year based on type
    getInstrumentCost(type) {
        const costs = {
            'violin': 120, 'flute': 120, 'clarinet': 120, 'trumpet': 120, 'trombone': 120,
            'oboe': 220, 'cello': 220, 'alto sax': 220, 'alto saxophone': 220,
            'tenor sax': 220, 'tenor saxophone': 220, 'baritone sax': 220, 'baritone saxophone': 220,
            'bassoon': 220, 'double bass': 220, 'piccolo': 220, 'saxophone': 220
        };
        const typeLower = (type || '').toLowerCase();
        for (const [key, value] of Object.entries(costs)) {
            if (typeLower.includes(key)) return value;
        }
        return 120; // Default cost
    }

    renderInstruments() {
        const table = document.getElementById('instruments-table');
        const tbody = document.getElementById('instruments-body');
        if (!tbody) return;

        // Update sortable headers
        const thead = table?.querySelector('thead tr');
        if (thead) {
            thead.innerHTML = `
                <th class="sortable" onclick="app.sortData('instruments', 'name')">Instrument ${this.getSortIcon('instruments', 'name')}</th>
                <th class="sortable" onclick="app.sortData('instruments', 'type')">Type ${this.getSortIcon('instruments', 'type')}</th>
                <th class="sortable" onclick="app.sortData('instruments', 'size')">Size ${this.getSortIcon('instruments', 'size')}</th>
                <th class="sortable" onclick="app.sortData('instruments', 'serialNumber')">Serial # ${this.getSortIcon('instruments', 'serialNumber')}</th>
                <th class="sortable" onclick="app.sortData('instruments', 'cost')">Cost ${this.getSortIcon('instruments', 'cost')}</th>
                <th class="sortable" onclick="app.sortData('instruments', 'condition')">Condition ${this.getSortIcon('instruments', 'condition')}</th>
                <th class="sortable" onclick="app.sortData('instruments', 'status')">Status ${this.getSortIcon('instruments', 'status')}</th>
                <th class="th-actions"></th>
            `;
        }

        if (this.data.instruments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="no-data">No instruments found. Add your first instrument!</td></tr>';
            return;
        }

        // Apply filtering and sorting
        let instruments = this.getFilteredData('instruments', this.data.instruments);
        instruments = this.getSortedData('instruments', instruments);

        tbody.innerHTML = instruments.map(inst => {
            const cost = inst.cost || this.getInstrumentCost(inst.type);
            return `
                <tr data-id="${inst.id}">
                    <td><strong>${inst.name}</strong></td>
                    <td>${inst.type}</td>
                    <td>${inst.size || '—'}</td>
                    <td>${inst.serialNumber || '—'}</td>
                    <td>$${cost}/yr</td>
                    <td>${inst.condition || 'Good'}</td>
                    <td><span class="status-badge status-${inst.status === 'Available' ? 'active' : 'assigned'}">${inst.status}</span></td>
                    <td>
                        <div class="row-actions">
                            <button class="row-action-btn" title="Edit" onclick="app.showEditInstrumentModal('${inst.id}')">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                            <button class="row-action-btn" title="Delete" onclick="app.handleDelete('instrument', '${inst.id}')">
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

        this.bindRowActions('instrument');
    }

    // ========================================
    // Hires Rendering
    // ========================================

    renderHires(filter = 'active') {
        const table = document.getElementById('hires-table');
        const tbody = document.getElementById('hires-body');
        if (!tbody) return;

        // Store current filter for later reference
        this.currentHiresFilter = filter;

        // Update sortable headers
        const thead = table?.querySelector('thead tr');
        if (thead) {
            thead.innerHTML = `
                <th class="sortable" onclick="app.sortData('hires', 'instrumentName')">Instrument ${this.getSortIcon('hires', 'instrumentName')}</th>
                <th class="sortable" onclick="app.sortData('hires', 'studentName')">Student ${this.getSortIcon('hires', 'studentName')}</th>
                <th class="sortable" onclick="app.sortData('hires', 'hireDate')">Hire Date ${this.getSortIcon('hires', 'hireDate')}</th>
                <th class="sortable" onclick="app.sortData('hires', 'expectedReturn')">Return Due ${this.getSortIcon('hires', 'expectedReturn')}</th>
                <th>Cost</th>
                <th>Agreement</th>
                <th>File</th>
                <th class="sortable" onclick="app.sortData('hires', 'status')">Status ${this.getSortIcon('hires', 'status')}</th>
                <th class="th-actions"></th>
            `;
        }

        // Filter by tab selection
        let hires = this.data.instrumentHires;
        if (filter === 'active') {
            hires = hires.filter(h => h.status === 'active');
        } else if (filter === 'overdue') {
            hires = hires.filter(h => h.status === 'overdue');
        } else if (filter === 'due-soon') {
            hires = hires.filter(h => h.status === 'due-soon');
        } else if (filter === 'archive') {
            hires = hires.filter(h => h.status === 'returned');
        }

        if (hires.length === 0) {
            const emptyMessage = filter === 'archive' ? 'No returned instruments in archive' :
                                 filter === 'overdue' ? 'No overdue hires' :
                                 filter === 'due-soon' ? 'No hires due soon' :
                                 'No active hires';
            tbody.innerHTML = `<tr><td colspan="9" class="no-data">${emptyMessage}</td></tr>`;
            return;
        }

        // Apply filtering and sorting
        hires = this.getFilteredData('hires', hires);
        hires = this.getSortedData('hires', hires);

        tbody.innerHTML = hires.map(hire => {
            const statusClasses = {
                'active': 'active',
                'overdue': 'waiting',
                'due-soon': 'assigned',
                'returned': 'pending'
            };
            const statusClass = statusClasses[hire.status] || 'pending';
            // Get cost from hire record or calculate from instrument type
            const instrument = this.data.instruments.find(i => i.id === hire.instrumentId);
            const cost = hire.cost || instrument?.cost || this.getInstrumentCost(hire.instrumentName || hire.instrument || '');

            // Agreement file download button
            const agreementCell = hire.agreementFile
                ? `<button class="btn btn-outline btn-sm" onclick="app.downloadAgreement('${hire.id}')" title="Download ${hire.agreementFile.fileName}">
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                           <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                       </svg>
                       Download
                   </button>`
                : '<span class="text-muted">No file</span>';

            // Mark as returned button (only for non-returned hires)
            const returnedBtn = hire.status !== 'returned' ? `
                <button class="row-action-btn success" title="Mark as Returned" data-action="return-hire" data-id="${hire.id}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                </button>
            ` : '';

            return `
                <tr data-id="${hire.id}">
                    <td><strong>${hire.instrumentName || hire.instrument}</strong></td>
                    <td>${hire.studentName}</td>
                    <td>${this.formatDate(hire.hireDate)}</td>
                    <td>${this.formatDate(hire.expectedReturn)}</td>
                    <td>$${cost}/yr</td>
                    <td>${hire.agreement ? '✓ Signed' : '✗ Pending'}</td>
                    <td>${agreementCell}</td>
                    <td><span class="status-badge status-${statusClass}">${hire.status === 'due-soon' ? 'due soon' : hire.status}</span></td>
                    <td>
                        <div class="row-actions">
                            ${returnedBtn}
                            <button class="row-action-btn" title="Edit" data-action="edit-hire" data-id="${hire.id}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                            <button class="row-action-btn" title="Delete" data-action="delete-hire" data-id="${hire.id}">
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

        this.bindRowActions('hire');
    }

    downloadAgreement(hireId) {
        const hire = this.data.instrumentHires.find(h => h.id === hireId);
        if (!hire?.agreementFile) {
            this.showToast('No agreement file found', 'error');
            return;
        }
        // In a real app, this would download from Firebase Storage
        // For now, show info about the file
        this.showToast(`File: ${hire.agreementFile.fileName} (Uploaded: ${this.formatDate(hire.agreementFile.uploadedAt)})`, 'info');
    }

    // ========================================
    // Forms Rendering
    // ========================================

    renderForms() {
        const container = document.getElementById('forms-grid');
        if (!container) return;
        
        // Map form IDs to actual HTML files
        const formUrls = {
            'music-tuition-2026': 'music-tuition-2026.html'
        };

        // Default built-in forms (these always exist as static HTML)
        const defaultForms = [
            {
                id: 'music-tuition-2026',
                name: 'Music Tuition Signups 2026',
                description: 'Registration for itinerant music lessons',
                status: 'active',
                responses: this.data.lessonRequests?.filter(r => r.source === 'music-tuition-2026').length || 0,
                createdAt: '2026-01-01',
                isBuiltIn: true
            }
        ];
        
        // Merge database forms with defaults (database forms can override defaults)
        const databaseForms = this.data.forms || [];
        const allForms = [...defaultForms, ...databaseForms];
        
        if (allForms.length === 0) {
            container.innerHTML = '<div class="no-data-card">No signup forms created yet. Create your first form!</div>';
            return;
        }
        
        container.innerHTML = allForms.map(form => {
            const formUrl = formUrls[form.id] || `${form.id}.html`;
            const hasPublicPage = formUrls[form.id] !== undefined;

            return `
                <div class="form-card" data-id="${form.id}">
                    <div class="form-status ${form.status}">${form.status === 'active' ? 'Active' : form.status === 'draft' ? 'Draft' : 'Closed'}</div>
                    ${form.isBuiltIn ? '<span class="form-badge">Built-in</span>' : ''}
                    <h3 class="form-name">${form.name}</h3>
                    <p class="form-description">${form.description}</p>
                    <div class="form-stats">
                        <span class="form-responses">${form.responses || 0} responses</span>
                    </div>
                    <div class="form-actions">
                        ${hasPublicPage ? `<a href="${formUrl}" target="_blank" class="btn btn-primary btn-sm">Open Form</a>` : ''}
                        <button class="btn btn-outline btn-sm" onclick="app.showEditFormModal('${form.id}')">Edit</button>
                        <button class="btn btn-outline btn-sm" onclick="app.viewFormResponses('${form.id}')">Responses</button>
                        ${hasPublicPage ? `<button class="btn btn-outline btn-sm" onclick="app.copyFormLink('${form.id}')">Copy Link</button>` : ''}
                        ${!form.isBuiltIn ? `<button class="btn btn-outline btn-sm btn-danger-outline" onclick="app.confirmDeleteForm('${form.id}')">Delete</button>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    showEditFormModal(formId) {
        // Check database forms first, then built-in forms
        let form = this.data.forms?.find(f => f.id === formId);

        // Handle built-in form (music-tuition-2026)
        if (!form && formId === 'music-tuition-2026') {
            // Load built-in form config from localStorage or create default
            const savedConfig = localStorage.getItem('mgs_music_tuition_config');
            form = savedConfig ? JSON.parse(savedConfig) : {
                id: 'music-tuition-2026',
                name: 'Music Tuition Signups 2026',
                description: 'Registration for itinerant music lessons',
                status: 'active',
                isBuiltIn: true,
                instruments: [],
                questions: [
                    { label: 'Student First Name', name: 'studentFirstName', type: 'text', required: true },
                    { label: 'Student Last Name', name: 'studentLastName', type: 'text', required: true },
                    { label: 'Year Level', name: 'yearLevel', type: 'year', required: true },
                    { label: 'Class', name: 'class', type: 'text', required: false },
                    { label: 'Parent/Guardian Name', name: 'parentName', type: 'text', required: true },
                    { label: 'Parent Email', name: 'parentEmail', type: 'email', required: true },
                    { label: 'Parent Phone', name: 'parentPhone', type: 'tel', required: true },
                    { label: 'Instrument', name: 'instrument', type: 'select', required: true },
                    { label: 'Funded Lesson Request', name: 'fundedRequest', type: 'checkbox', required: false },
                    { label: 'Additional Notes', name: 'notes', type: 'textarea', required: false }
                ]
            };
        }

        if (!form) {
            this.showToast('Form not found', 'error');
            return;
        }

        // Store current questions for editing
        this.editingFormQuestions = JSON.parse(JSON.stringify(form.questions || []));
        this.editingFormIsBuiltIn = form.isBuiltIn || false;

        const content = `
            <form id="edit-form-form" class="modal-form">
                <input type="hidden" name="id" value="${formId}">
                <div class="form-row">
                    <div class="form-group" style="flex: 2;">
                        <label>Form Name</label>
                        <input type="text" name="name" value="${form.name || ''}" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>Status</label>
                        <select name="status">
                            <option value="draft" ${form.status === 'draft' ? 'selected' : ''}>Draft</option>
                            <option value="active" ${form.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="closed" ${form.status === 'closed' ? 'selected' : ''}>Closed</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" rows="2">${form.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Available Options (comma-separated, for dropdown questions)</label>
                    <input type="text" name="instruments" value="${(form.instruments || []).join(', ')}" placeholder="Guitar, Piano, Drums, Violin">
                </div>

                <div class="form-questions-section">
                    <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin: var(--spacing-lg) 0 var(--spacing-md);">
                        <h4 style="margin: 0;">Form Questions</h4>
                        <button type="button" class="btn btn-outline btn-sm" onclick="app.addFormQuestion()">+ Add Question</button>
                    </div>
                    <div id="form-questions-list" class="form-questions-list">
                        ${this.renderFormQuestionsList()}
                    </div>
                </div>
            </form>
        `;

        this.showModal('Edit Form', content, () => this.updateForm());
    }

    renderFormQuestionsList() {
        if (!this.editingFormQuestions || this.editingFormQuestions.length === 0) {
            return '<p class="text-muted" style="text-align: center; padding: var(--spacing-md);">No questions added yet. Click "Add Question" to start building your form.</p>';
        }

        return this.editingFormQuestions.map((q, index) => `
            <div class="form-question-item" data-index="${index}">
                <div class="question-header">
                    <span class="question-number">${index + 1}</span>
                    <div class="question-controls">
                        ${index > 0 ? `<button type="button" class="btn-icon-sm" onclick="app.moveFormQuestion(${index}, -1)" title="Move up">&uarr;</button>` : ''}
                        ${index < this.editingFormQuestions.length - 1 ? `<button type="button" class="btn-icon-sm" onclick="app.moveFormQuestion(${index}, 1)" title="Move down">&darr;</button>` : ''}
                        <button type="button" class="btn-icon-sm btn-danger" onclick="app.removeFormQuestion(${index})" title="Delete">×</button>
                    </div>
                </div>
                <div class="question-content">
                    <div class="form-row">
                        <div class="form-group" style="flex: 2;">
                            <label>Question Label</label>
                            <input type="text" value="${(q.label || '').replace(/"/g, '&quot;')}" onchange="app.updateFormQuestion(${index}, 'label', this.value)" placeholder="e.g., Student Name">
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Type</label>
                            <select onchange="app.updateFormQuestion(${index}, 'type', this.value)">
                                <option value="text" ${q.type === 'text' ? 'selected' : ''}>Text</option>
                                <option value="email" ${q.type === 'email' ? 'selected' : ''}>Email</option>
                                <option value="tel" ${q.type === 'tel' ? 'selected' : ''}>Phone</option>
                                <option value="select" ${q.type === 'select' ? 'selected' : ''}>Dropdown</option>
                                <option value="checkbox" ${q.type === 'checkbox' ? 'selected' : ''}>Checkbox</option>
                                <option value="textarea" ${q.type === 'textarea' ? 'selected' : ''}>Long Text</option>
                                <option value="year" ${q.type === 'year' ? 'selected' : ''}>Year Level</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group" style="flex: 1;">
                            <label>Field Name (internal)</label>
                            <input type="text" value="${(q.name || '').replace(/"/g, '&quot;')}" onchange="app.updateFormQuestion(${index}, 'name', this.value)" placeholder="e.g., studentName">
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>
                                <input type="checkbox" ${q.required ? 'checked' : ''} onchange="app.updateFormQuestion(${index}, 'required', this.checked)">
                                Required field
                            </label>
                        </div>
                    </div>
                    ${q.type === 'select' ? `
                        <div class="form-group">
                            <label>Options (comma-separated)</label>
                            <input type="text" value="${(q.options || []).join(', ')}" onchange="app.updateFormQuestion(${index}, 'options', this.value.split(',').map(o => o.trim()).filter(o => o))" placeholder="Option 1, Option 2, Option 3">
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    addFormQuestion() {
        if (!this.editingFormQuestions) {
            this.editingFormQuestions = [];
        }

        this.editingFormQuestions.push({
            label: '',
            name: '',
            type: 'text',
            required: false,
            options: []
        });

        document.getElementById('form-questions-list').innerHTML = this.renderFormQuestionsList();
    }

    removeFormQuestion(index) {
        if (!this.editingFormQuestions) return;
        this.editingFormQuestions.splice(index, 1);
        document.getElementById('form-questions-list').innerHTML = this.renderFormQuestionsList();
    }

    moveFormQuestion(index, direction) {
        if (!this.editingFormQuestions) return;
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= this.editingFormQuestions.length) return;

        const temp = this.editingFormQuestions[index];
        this.editingFormQuestions[index] = this.editingFormQuestions[newIndex];
        this.editingFormQuestions[newIndex] = temp;

        document.getElementById('form-questions-list').innerHTML = this.renderFormQuestionsList();
    }

    updateFormQuestion(index, field, value) {
        if (!this.editingFormQuestions || !this.editingFormQuestions[index]) return;
        this.editingFormQuestions[index][field] = value;

        // Re-render if type changed (to show/hide options field)
        if (field === 'type') {
            document.getElementById('form-questions-list').innerHTML = this.renderFormQuestionsList();
        }
    }

    async updateForm() {
        const formEl = document.getElementById('edit-form-form');
        const formData = new FormData(formEl);
        const id = formData.get('id');

        // Filter out empty questions
        const validQuestions = (this.editingFormQuestions || []).filter(q => q.label && q.name);

        const updates = {
            name: formData.get('name'),
            description: formData.get('description'),
            status: formData.get('status'),
            instruments: formData.get('instruments').split(',').map(i => i.trim()).filter(i => i),
            questions: validQuestions
        };

        // Handle built-in form differently - save to localStorage
        if (this.editingFormIsBuiltIn && id === 'music-tuition-2026') {
            const config = {
                id: id,
                ...updates,
                isBuiltIn: true
            };
            localStorage.setItem('mgs_music_tuition_config', JSON.stringify(config));
            this.showToast('Form configuration saved! Note: Changes to built-in form require manual HTML updates for the public form.', 'info');
            this.editingFormQuestions = null;
            this.editingFormIsBuiltIn = false;
            this.closeModal();
            this.renderCurrentPage();
            return;
        }

        const result = await DatabaseService.updateForm(id, updates);

        if (result.success) {
            this.showToast('Form updated successfully!', 'success');
            this.editingFormQuestions = null;
            this.editingFormIsBuiltIn = false;
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error updating form', 'error');
        }
    }

    confirmDeleteForm(formId) {
        const form = this.data.forms?.find(f => f.id === formId);
        if (!form) {
            this.showToast('Form not found', 'error');
            return;
        }

        const content = `
            <div class="confirm-delete">
                <div class="confirm-icon danger">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                </div>
                <h3>Delete "${form.name}"?</h3>
                <p>This will permanently delete this form. Any responses will still be available in Lesson Requests.</p>
            </div>
        `;

        this.showModal('Delete Form', content, () => this.deleteForm(formId));
        document.getElementById('modal-save').textContent = 'Delete';
        document.getElementById('modal-save').classList.add('btn-danger');
    }

    async deleteForm(formId) {
        const result = await DatabaseService.deleteForm(formId);

        if (result.success) {
            this.showToast('Form deleted successfully', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error deleting form', 'error');
        }
    }

    viewFormResponses(formId) {
        // Navigate to requests page filtered by form
        this.navigateTo('requests');
        this.showToast('Showing responses for this form', 'info');
    }

    copyFormLink(formId) {
        // Map form IDs to actual HTML files
        const formUrls = {
            'music-tuition-2026': 'music-tuition-2026.html'
        };

        const filename = formUrls[formId] || `${formId}.html`;
        const link = `${window.location.origin}/${filename}`;
        
        navigator.clipboard.writeText(link).then(() => {
            this.showToast('Link copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = link;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Link copied to clipboard!', 'success');
        });
    }

    // ========================================
    // Templates Rendering
    // ========================================
    
    renderTemplates() {
        const container = document.getElementById('templates-grid');
        if (!container) return;

        // Custom templates from database (including overrides of built-in templates)
        const customTemplates = this.data.templates || [];

        // Built-in templates (from EventTemplates) - check for custom overrides
        const builtInTemplates = [
            { id: 'school-during', name: 'School Performance During School Hours', description: 'For performances held at school during the school day', icon: 'school', isBuiltIn: true },
            { id: 'school-after', name: 'School Performance After School Hours', description: 'For performances held at school after the school day', icon: 'evening', isBuiltIn: true },
            { id: 'offsite-during', name: 'Offsite Performance During School Hours', description: 'For performances held at external venues during school hours', icon: 'offsite', isBuiltIn: true },
            { id: 'offsite-after', name: 'Offsite Performance After School Hours', description: 'For performances held at external venues after school hours', icon: 'offsite-evening', isBuiltIn: true }
        ].map(t => {
            // Check if there's a custom override for this built-in template
            const customOverride = customTemplates.find(ct => ct.builtInId === t.id);
            if (customOverride) {
                // Use the custom override data
                return {
                    ...t,
                    id: customOverride.id,
                    name: customOverride.name,
                    description: customOverride.description,
                    tasks: customOverride.tasks,
                    isCustomized: true,
                    originalBuiltInId: t.id,
                    taskCount: `${customOverride.tasks?.length || 0} phases • ${(customOverride.tasks || []).reduce((sum, phase) => sum + (phase.items?.length || 0), 0)} tasks`
                };
            }
            // Use the original built-in template
            const template = EventTemplates[t.id];
            if (template) {
                const phaseCount = template.tasks.length;
                const taskCount = template.tasks.reduce((sum, phase) => sum + phase.items.length, 0);
                t.taskCount = `${phaseCount} phases • ${taskCount} tasks`;
            }
            return t;
        });

        // Filter custom templates to only show ones that aren't overrides
        const standaloneCustomTemplates = customTemplates.filter(t => !t.builtInId).map(t => ({
            ...t,
            isBuiltIn: false,
            icon: 'custom',
            taskCount: `${t.tasks?.length || 0} phases • ${(t.tasks || []).reduce((sum, phase) => sum + (phase.items?.length || 0), 0)} tasks`
        }));

        const allTemplates = [...builtInTemplates, ...standaloneCustomTemplates];
        
        const iconSvgs = {
            'school': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>',
            'evening': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>',
            'offsite': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z"/></svg>',
            'offsite-evening': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
            'custom': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
        };
        
        container.innerHTML = allTemplates.map(template => `
            <div class="template-card" data-template="${template.id}">
                <div class="template-icon ${template.icon}">
                    ${iconSvgs[template.icon] || iconSvgs['custom']}
                </div>
                <div class="template-content">
                    <h3 class="template-name">${template.name}</h3>
                    <p class="template-description">${template.description}</p>
                    <div class="template-meta">
                        <span class="template-tasks">${template.taskCount || ''}</span>
                        ${template.isCustomized ? '<span class="template-badge custom">Customized</span>' :
                          template.isBuiltIn ? '<span class="template-badge">Built-in</span>' :
                          '<span class="template-badge custom">Custom</span>'}
                    </div>
                </div>
                <div class="template-actions">
                    <button class="btn btn-outline btn-sm" onclick="app.showTemplateModal('${template.isCustomized ? template.id : template.id}')">View</button>
                    ${template.isCustomized ? `
                        <button class="btn btn-outline btn-sm" onclick="app.showEditTemplateModal('${template.id}')">Edit</button>
                        <button class="btn btn-outline btn-sm" onclick="app.resetBuiltInTemplate('${template.id}', '${template.originalBuiltInId}')">Reset</button>
                    ` : template.isBuiltIn ? `
                        <button class="btn btn-outline btn-sm" onclick="app.editBuiltInTemplate('${template.id}')">Edit</button>
                    ` : `
                        <button class="btn btn-outline btn-sm" onclick="app.showEditTemplateModal('${template.id}')">Edit</button>
                        <button class="btn btn-outline btn-sm" onclick="app.deleteTemplate('${template.id}')">Delete</button>
                    `}
                </div>
            </div>
        `).join('');
    }
    
    showAddTemplateModal() {
        const content = `
            <div class="template-phases-editor" id="template-phases-editor">
                <div class="form-group">
                    <label>Template Name <span class="required">*</span></label>
                    <input type="text" id="template-name" required placeholder="e.g., Community Concert">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="template-description" rows="2" placeholder="Brief description of when to use this template"></textarea>
                </div>

                <h4 style="margin-top: var(--spacing-lg);">Task Phases</h4>
                <p class="help-text">Add phases and tasks that will be included in events using this template.</p>

                <div id="phases-container">
                    <div class="phase-item" data-phase-index="0">
                        <div class="phase-header">
                            <input type="text" class="phase-name-input" placeholder="Phase name (e.g., Planning)" value="Planning">
                            <button type="button" class="btn btn-outline btn-sm" onclick="app.removePhase(0)">Remove Phase</button>
                        </div>
                        <div class="phase-tasks-list">
                            <div class="task-input-row">
                                <input type="text" class="task-input" placeholder="Task description">
                                <button type="button" class="btn-icon" onclick="app.removeTask(this)">×</button>
                            </div>
                        </div>
                        <button type="button" class="btn btn-outline btn-sm" onclick="app.addTaskToPhase(0)">+ Add Task</button>
                    </div>
                </div>

                <button type="button" class="btn btn-outline" onclick="app.addPhase()" style="margin-top: var(--spacing-md);">+ Add Phase</button>
            </div>
        `;

        this.showModal('Create Event Template', content, () => this.saveTemplate());
    }
    
    showEditTemplateModal(templateId) {
        const template = this.data.templates?.find(t => t.id === templateId);
        if (!template) {
            this.showToast('Template not found', 'error');
            return;
        }

        // Store the template ID for the update function
        this.editingTemplateId = templateId;

        const phasesHtml = (template.tasks || []).map((phase, pIndex) => `
            <div class="phase-item" data-phase-index="${pIndex}">
                <div class="phase-header">
                    <input type="text" class="phase-name-input" placeholder="Phase name" value="${phase.phase || ''}">
                    <button type="button" class="btn btn-outline btn-sm" onclick="app.removePhase(${pIndex})">Remove Phase</button>
                </div>
                <div class="phase-tasks-list">
                    ${(phase.items || []).map(task => `
                        <div class="task-input-row">
                            <input type="text" class="task-input" placeholder="Task description" value="${task}">
                            <button type="button" class="btn-icon" onclick="app.removeTask(this)">×</button>
                        </div>
                    `).join('')}
                </div>
                <button type="button" class="btn btn-outline btn-sm" onclick="app.addTaskToPhase(${pIndex})">+ Add Task</button>
            </div>
        `).join('');

        const defaultPhaseHtml = `
            <div class="phase-item" data-phase-index="0">
                <div class="phase-header">
                    <input type="text" class="phase-name-input" placeholder="Phase name (e.g., Planning)" value="">
                    <button type="button" class="btn btn-outline btn-sm" onclick="app.removePhase(0)">Remove Phase</button>
                </div>
                <div class="phase-tasks-list">
                    <div class="task-input-row">
                        <input type="text" class="task-input" placeholder="Task description">
                        <button type="button" class="btn-icon" onclick="app.removeTask(this)">×</button>
                    </div>
                </div>
                <button type="button" class="btn btn-outline btn-sm" onclick="app.addTaskToPhase(0)">+ Add Task</button>
            </div>
        `;

        const content = `
            <div class="template-phases-editor" id="template-phases-editor">
                <input type="hidden" id="template-id" value="${templateId}">
                <div class="form-group">
                    <label>Template Name <span class="required">*</span></label>
                    <input type="text" id="template-name" required value="${template.name || ''}">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="template-description" rows="2">${template.description || ''}</textarea>
                </div>

                <h4 style="margin-top: var(--spacing-lg);">Task Phases</h4>
                <p class="help-text">Add phases and tasks that will be included in events using this template.</p>

                <div id="phases-container">
                    ${phasesHtml || defaultPhaseHtml}
                </div>

                <button type="button" class="btn btn-outline" onclick="app.addPhase()" style="margin-top: var(--spacing-md);">+ Add Phase</button>
            </div>
        `;

        this.showModal('Edit Template', content, () => this.updateTemplate());
    }
    
    addPhase() {
        const container = document.getElementById('phases-container');
        const phaseIndex = container.querySelectorAll('.phase-item').length;
        
        const phaseHtml = `
            <div class="phase-item" data-phase-index="${phaseIndex}">
                <div class="phase-header">
                    <input type="text" class="phase-name-input" placeholder="Phase name (e.g., Logistics)">
                    <button type="button" class="btn btn-outline btn-sm" onclick="app.removePhase(${phaseIndex})">Remove Phase</button>
                </div>
                <div class="phase-tasks-list">
                    <div class="task-input-row">
                        <input type="text" class="task-input" placeholder="Task description">
                        <button type="button" class="btn-icon" onclick="app.removeTask(this)">×</button>
                    </div>
                </div>
                <button type="button" class="btn btn-outline btn-sm" onclick="app.addTaskToPhase(${phaseIndex})">+ Add Task</button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', phaseHtml);
    }
    
    removePhase(index) {
        const phase = document.querySelector(`.phase-item[data-phase-index="${index}"]`);
        if (phase && document.querySelectorAll('.phase-item').length > 1) {
            phase.remove();
        } else {
            this.showToast('Must have at least one phase', 'error');
        }
    }
    
    addTaskToPhase(phaseIndex) {
        const phase = document.querySelector(`.phase-item[data-phase-index="${phaseIndex}"]`);
        if (!phase) return;
        
        const tasksList = phase.querySelector('.phase-tasks-list');
        const taskHtml = `
            <div class="task-input-row">
                <input type="text" class="task-input" placeholder="Task description">
                <button type="button" class="btn-icon" onclick="app.removeTask(this)">×</button>
            </div>
        `;
        tasksList.insertAdjacentHTML('beforeend', taskHtml);
    }
    
    removeTask(button) {
        const row = button.closest('.task-input-row');
        const tasksList = row.closest('.phase-tasks-list');
        if (tasksList.querySelectorAll('.task-input-row').length > 1) {
            row.remove();
        }
    }
    
    async saveTemplate() {
        const name = document.getElementById('template-name').value.trim();
        const description = document.getElementById('template-description').value.trim();
        
        if (!name) {
            this.showToast('Please enter a template name', 'error');
            return;
        }
        
        // Gather phases and tasks
        const tasks = [];
        document.querySelectorAll('.phase-item').forEach((phase, order) => {
            const phaseName = phase.querySelector('.phase-name-input').value.trim();
            const items = [];
            phase.querySelectorAll('.task-input').forEach(input => {
                const task = input.value.trim();
                if (task) items.push(task);
            });
            
            if (phaseName && items.length > 0) {
                tasks.push({ phase: phaseName, order: order + 1, items });
            }
        });
        
        if (tasks.length === 0) {
            this.showToast('Please add at least one phase with tasks', 'error');
            return;
        }
        
        try {
            await DatabaseService.addTemplate({
                name,
                description,
                tasks
            });
            
            await this.loadAllData();
            this.renderTemplates();
            this.closeModal();
            this.showToast('Template created successfully', 'success');
        } catch (error) {
            console.error('Error creating template:', error);
            this.showToast('Error creating template', 'error');
        }
    }
    
    async updateTemplate() {
        const id = document.getElementById('template-id')?.value || this.editingTemplateId;
        const name = document.getElementById('template-name').value.trim();
        const description = document.getElementById('template-description').value.trim();
        
        if (!name) {
            this.showToast('Please enter a template name', 'error');
            return;
        }
        
        // Gather phases and tasks
        const tasks = [];
        document.querySelectorAll('.phase-item').forEach((phase, order) => {
            const phaseName = phase.querySelector('.phase-name-input').value.trim();
            const items = [];
            phase.querySelectorAll('.task-input').forEach(input => {
                const task = input.value.trim();
                if (task) items.push(task);
            });
            
            if (phaseName && items.length > 0) {
                tasks.push({ phase: phaseName, order: order + 1, items });
            }
        });
        
        if (tasks.length === 0) {
            this.showToast('Please add at least one phase with tasks', 'error');
            return;
        }
        
        try {
            await DatabaseService.updateTemplate(id, {
                name,
                description,
                tasks
            });
            
            await this.loadAllData();
            this.renderTemplates();
            this.closeModal();
            this.showToast('Template updated successfully', 'success');
        } catch (error) {
            console.error('Error updating template:', error);
            this.showToast('Error updating template', 'error');
        }
    }
    
    deleteTemplate(templateId) {
        const template = this.data.templates?.find(t => t.id === templateId);
        if (!template) return;

        const content = `
            <div class="confirm-delete">
                <div class="confirm-icon warning">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <h3>Delete Template?</h3>
                <p>Are you sure you want to delete "${template.name}"? This cannot be undone.</p>
            </div>
        `;

        this.showModal('Delete Template', content, () => this.confirmDeleteTemplate(templateId));
        document.getElementById('modal-save').textContent = 'Delete';
        document.getElementById('modal-save').classList.add('btn-danger');
    }

    async confirmDeleteTemplate(templateId) {
        try {
            await DatabaseService.deleteTemplate(templateId);
            await this.loadAllData();
            this.closeModal();
            document.getElementById('modal-save').textContent = 'Save';
            document.getElementById('modal-save').classList.remove('btn-danger');
            this.renderTemplates();
            this.showToast('Template deleted', 'success');
        } catch (error) {
            console.error('Error deleting template:', error);
            this.showToast('Error deleting template', 'error');
        }
    }

    editBuiltInTemplate(templateId) {
        // Get the built-in template data
        const builtInTemplate = EventTemplates[templateId];
        if (!builtInTemplate) {
            this.showToast('Template not found', 'error');
            return;
        }

        // Store that we're editing a built-in template
        this.editingBuiltInTemplateId = templateId;

        const phasesHtml = builtInTemplate.tasks.map((phase, pIndex) => `
            <div class="phase-item" data-phase-index="${pIndex}">
                <div class="phase-header">
                    <input type="text" class="phase-name-input" placeholder="Phase name" value="${phase.phase || ''}">
                    <button type="button" class="btn btn-outline btn-sm" onclick="app.removePhase(${pIndex})">Remove Phase</button>
                </div>
                <div class="phase-tasks-list">
                    ${(phase.items || []).map(task => `
                        <div class="task-input-row">
                            <input type="text" class="task-input" placeholder="Task description" value="${task}">
                            <button type="button" class="btn-icon" onclick="app.removeTask(this)">×</button>
                        </div>
                    `).join('')}
                </div>
                <button type="button" class="btn btn-outline btn-sm" onclick="app.addTaskToPhase(${pIndex})">+ Add Task</button>
            </div>
        `).join('');

        const content = `
            <div class="template-phases-editor" id="template-phases-editor">
                <input type="hidden" id="template-id" value="${templateId}">
                <div class="form-group">
                    <label>Template Name <span class="required">*</span></label>
                    <input type="text" id="template-name" required value="${builtInTemplate.name || ''}">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="template-description" rows="2">${builtInTemplate.description || ''}</textarea>
                </div>

                <h4 style="margin-top: var(--spacing-lg);">Task Phases</h4>
                <p class="help-text">Edit the phases and tasks for this template. Changes will be saved as your custom version.</p>

                <div id="phases-container">
                    ${phasesHtml}
                </div>

                <button type="button" class="btn btn-outline" onclick="app.addPhase()" style="margin-top: var(--spacing-md);">+ Add Phase</button>
            </div>
        `;

        this.showModal('Edit Template', content, () => this.saveBuiltInTemplateEdit());
    }

    async saveBuiltInTemplateEdit() {
        const templateId = this.editingBuiltInTemplateId;
        const name = document.getElementById('template-name').value.trim();
        const description = document.getElementById('template-description').value.trim();

        if (!name) {
            this.showToast('Please enter a template name', 'error');
            return;
        }

        // Gather phases and tasks
        const tasks = [];
        document.querySelectorAll('.phase-item').forEach((phase, order) => {
            const phaseName = phase.querySelector('.phase-name-input').value.trim();
            const items = [];
            phase.querySelectorAll('.task-input').forEach(input => {
                const task = input.value.trim();
                if (task) items.push(task);
            });

            if (phaseName && items.length > 0) {
                tasks.push({ phase: phaseName, order: order + 1, items });
            }
        });

        if (tasks.length === 0) {
            this.showToast('Please add at least one phase with tasks', 'error');
            return;
        }

        try {
            // Check if there's already a custom version of this built-in template
            const existingCustom = this.data.templates?.find(t => t.builtInId === templateId);

            if (existingCustom) {
                // Update the existing custom version
                await DatabaseService.updateTemplate(existingCustom.id, {
                    name,
                    description,
                    tasks,
                    builtInId: templateId
                });
            } else {
                // Create a new custom version linked to the built-in template
                await DatabaseService.addTemplate({
                    name,
                    description,
                    tasks,
                    builtInId: templateId
                });
            }

            this.editingBuiltInTemplateId = null;
            await this.loadAllData();
            this.renderTemplates();
            this.closeModal();
            this.showToast('Template saved successfully', 'success');
        } catch (error) {
            console.error('Error saving template:', error);
            this.showToast('Error saving template', 'error');
        }
    }

    async resetBuiltInTemplate(customId, builtInId) {
        if (!confirm('Reset this template to its original built-in version? Your customizations will be lost.')) {
            return;
        }

        try {
            await DatabaseService.deleteTemplate(customId);
            await this.loadAllData();
            this.renderTemplates();
            this.showToast('Template reset to built-in version', 'success');
        } catch (error) {
            console.error('Error resetting template:', error);
            this.showToast('Error resetting template', 'error');
        }
    }

    // ========================================
    // Settings Rendering
    // ========================================

    renderSettings() {
        // Render term dates
        const termContainer = document.getElementById('term-dates-list');
        if (termContainer) {
            const terms = this.data.settings?.termDates || {
                term1: { start: '2026-02-02', end: '2026-04-17' },
                term2: { start: '2026-05-04', end: '2026-07-10' },
                term3: { start: '2026-07-27', end: '2026-10-02' },
                term4: { start: '2026-10-19', end: '2026-12-11' }
            };
            termContainer.innerHTML = Object.entries(terms).map(([term, dates]) => `
                <div class="term-date-item" data-term="${term}">
                    <span class="term-name">${term.replace('term', 'Term ')}</span>
                    <span class="term-range">${this.formatDate(dates.start)} — ${this.formatDate(dates.end)}</span>
                    <button class="btn btn-outline btn-sm" onclick="app.showEditTermModal('${term}')">Edit</button>
                </div>
            `).join('') + `
                <div style="margin-top: var(--spacing-md); padding-top: var(--spacing-md); border-top: 1px solid var(--color-border);">
                    <button class="btn btn-outline" onclick="app.showEditAllTermsModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        Edit All Term Dates
                    </button>
                </div>
            `;
        }
        
        // Fill school settings
        if (this.data.settings?.schoolName) {
            document.getElementById('setting-school-name').value = this.data.settings.schoolName;
        }
        if (this.data.settings?.academyName) {
            document.getElementById('setting-academy-name').value = this.data.settings.academyName;
        }
        
        // Render users
        this.renderUsers();
        
        // Render categories
        this.renderCategories();
    }
    
    renderUsers() {
        const container = document.getElementById('users-list');
        if (!container) return;

        // Show admin profile - either from database or current logged in user
        const adminUser = this.data.users?.find(u => u.role === 'admin') || null;
        const currentUser = this.currentUser;

        const displayName = adminUser?.name || currentUser?.displayName || 'Admin';
        const displayEmail = adminUser?.email || currentUser?.email || '';
        const userId = adminUser?.id || 'current';

        container.innerHTML = `
            <div class="user-row">
                <div class="user-avatar admin">${this.getInitials(displayName)}</div>
                <div class="user-info">
                    <span class="user-name">${displayName}</span>
                    <span class="user-email">${displayEmail}</span>
                </div>
                <span class="user-role role-admin">Admin</span>
                <div class="user-actions">
                    <button class="btn btn-outline btn-sm" onclick="app.showEditAdminModal('${userId}')">Edit</button>
                </div>
            </div>
        `;
    }
    
    formatRole(role) {
        const roleMap = {
            'admin': 'Admin',
            'staff': 'Staff',
            'tutor': 'Tutor',
            'viewer': 'View Only'
        };
        return roleMap[role] || role;
    }

    showEditAdminModal(userId) {
        // Get admin user from database or use current logged in user
        const adminUser = this.data.users?.find(u => u.id === userId || u.role === 'admin');
        const currentUser = this.currentUser;

        const displayName = adminUser?.name || currentUser?.displayName || '';
        const displayEmail = adminUser?.email || currentUser?.email || '';

        const content = `
            <form id="edit-admin-form">
                <input type="hidden" id="admin-user-id" value="${adminUser?.id || 'new'}">
                <div class="form-group">
                    <label>Name <span class="required">*</span></label>
                    <input type="text" id="admin-name" required value="${displayName}" placeholder="Enter your name">
                </div>
                <div class="form-group">
                    <label>Email <span class="required">*</span></label>
                    <input type="email" id="admin-email" required value="${displayEmail}" placeholder="Enter your email">
                </div>
                <p class="help-text" style="margin-top: var(--spacing-md); padding: var(--spacing-sm); background: var(--color-bg-tertiary); border-radius: var(--radius-sm);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    This updates your display name and email in the portal.
                </p>
            </form>
        `;
        this.showModal('Edit Admin Profile', content, () => this.saveAdminProfile());
    }

    async saveAdminProfile() {
        const id = document.getElementById('admin-user-id').value;
        const name = document.getElementById('admin-name').value.trim();
        const email = document.getElementById('admin-email').value.trim();

        if (!name || !email) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        try {
            if (id === 'new') {
                // Create new admin user
                await DatabaseService.addUser({
                    name,
                    email,
                    role: 'admin',
                    active: true
                });
            } else {
                // Update existing admin user
                await DatabaseService.updateUser(id, { name, email });
            }

            await this.loadAllData();
            this.renderUsers();
            this.closeModal();
            this.showToast('Admin profile updated', 'success');
        } catch (error) {
            console.error('Error saving admin profile:', error);
            this.showToast('Error saving profile', 'error');
        }
    }

    renderCategories() {
        const container = document.getElementById('categories-list');
        if (!container) return;
        
        // Default categories if none in settings
        const defaultCategories = [
            { name: 'Music', color: '#8b5cf6' },
            { name: 'Performing Arts', color: '#ec4899' },
            { name: 'Production', color: '#06b6d4' },
            { name: 'Concert', color: '#c9a962' },
            { name: 'Competition', color: '#ef4444' },
            { name: 'Workshop', color: '#22c55e' },
            { name: 'Exam', color: '#3b82f6' }
        ];
        
        const categories = this.data.settings?.categories || defaultCategories;
        
        container.innerHTML = categories.map((cat, index) => `
            <div class="category-row" data-category-index="${index}">
                <div class="category-color-preview" style="background: ${cat.color};"></div>
                <span class="category-name">${cat.name}</span>
                <span class="category-badge-preview" style="background: ${cat.color}20; color: ${cat.color};">${cat.name}</span>
                <div class="category-actions">
                    <button class="btn btn-outline btn-sm" onclick="app.editCategory(${index})">Edit</button>
                    <button class="btn btn-outline btn-sm" onclick="app.deleteCategory(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    async addCategory() {
        const nameInput = document.getElementById('new-category-name');
        const colorInput = document.getElementById('new-category-color');

        const name = nameInput.value.trim();
        const color = colorInput.value;

        if (!name) {
            this.showToast('Please enter a category name', 'error');
            return;
        }

        const categories = [...(this.data.settings?.categories || this.getDefaultCategories())];
        categories.push({ name, color });

        // Clear inputs and refresh
        nameInput.value = '';
        await this.saveCategoriesAndRefresh(categories);
    }
    
    editCategory(index) {
        const defaultCategories = this.getDefaultCategories();
        const categories = [...(this.data.settings?.categories || defaultCategories)];
        const cat = categories[index];
        if (!cat) return;

        this.editingCategoryIndex = index;

        const content = `
            <form id="edit-category-form">
                <div class="form-group">
                    <label>Category Name <span class="required">*</span></label>
                    <input type="text" id="category-name" required value="${cat.name}">
                </div>
                <div class="form-group">
                    <label>Category Color</label>
                    <div style="display: flex; gap: var(--spacing-sm); align-items: center;">
                        <input type="color" id="category-color" value="${cat.color}" style="width: 50px; height: 40px; border: none; cursor: pointer;">
                        <input type="text" id="category-color-hex" value="${cat.color}" style="width: 100px;" placeholder="#000000">
                    </div>
                </div>
                <div class="form-group">
                    <label>Preview</label>
                    <span id="category-preview" class="category-badge-preview" style="background: ${cat.color}20; color: ${cat.color};">${cat.name}</span>
                </div>
            </form>
        `;

        this.showModal('Edit Category', content, () => this.saveEditedCategory());

        // Bind color picker to update preview
        setTimeout(() => {
            const colorInput = document.getElementById('category-color');
            const hexInput = document.getElementById('category-color-hex');
            const nameInput = document.getElementById('category-name');
            const preview = document.getElementById('category-preview');

            const updatePreview = () => {
                const color = colorInput.value;
                const name = nameInput.value || 'Category';
                hexInput.value = color;
                preview.style.background = color + '20';
                preview.style.color = color;
                preview.textContent = name;
            };

            colorInput?.addEventListener('input', updatePreview);
            hexInput?.addEventListener('input', () => {
                colorInput.value = hexInput.value;
                updatePreview();
            });
            nameInput?.addEventListener('input', updatePreview);
        }, 100);
    }

    async saveEditedCategory() {
        const name = document.getElementById('category-name').value.trim();
        const color = document.getElementById('category-color').value;

        if (!name) {
            this.showToast('Please enter a category name', 'error');
            return;
        }

        const defaultCategories = this.getDefaultCategories();
        const categories = [...(this.data.settings?.categories || defaultCategories)];
        categories[this.editingCategoryIndex] = { name, color };

        this.closeModal();
        await this.saveCategoriesAndRefresh(categories);
    }

    deleteCategory(index) {
        const defaultCategories = this.getDefaultCategories();
        const categories = [...(this.data.settings?.categories || defaultCategories)];
        const cat = categories[index];

        const content = `
            <div class="confirm-delete">
                <div class="confirm-icon warning">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <h3>Delete Category?</h3>
                <p>Are you sure you want to delete "${cat?.name || 'this category'}"?</p>
            </div>
        `;

        this.deletingCategoryIndex = index;
        this.showModal('Delete Category', content, () => this.confirmDeleteCategory());
        document.getElementById('modal-save').textContent = 'Delete';
        document.getElementById('modal-save').classList.add('btn-danger');
    }

    async confirmDeleteCategory() {
        const defaultCategories = this.getDefaultCategories();
        const categories = [...(this.data.settings?.categories || defaultCategories)];
        categories.splice(this.deletingCategoryIndex, 1);

        this.closeModal();
        document.getElementById('modal-save').textContent = 'Save';
        document.getElementById('modal-save').classList.remove('btn-danger');

        await this.saveCategoriesAndRefresh(categories);
    }

    getDefaultCategories() {
        return [
            { name: 'Music', color: '#8b5cf6' },
            { name: 'Performing Arts', color: '#ec4899' },
            { name: 'Production', color: '#06b6d4' },
            { name: 'Concert', color: '#c9a962' },
            { name: 'Competition', color: '#ef4444' },
            { name: 'Workshop', color: '#22c55e' },
            { name: 'Exam', color: '#3b82f6' }
        ];
    }
    
    async saveCategoriesAndRefresh(categories) {
        await DatabaseService.updateSettings({ categories });
        this.data.settings = { ...this.data.settings, categories };
        this.renderCategories();
        this.showToast('Categories updated', 'success');
    }

    // Calculate term from a date based on term dates in settings
    getTermFromDate(dateStr) {
        if (!dateStr) return 'Term 1';

        const date = new Date(dateStr);
        const termDates = this.data.settings?.termDates || {
            term1: { start: '2026-02-02', end: '2026-04-17' },
            term2: { start: '2026-05-04', end: '2026-07-10' },
            term3: { start: '2026-07-27', end: '2026-10-02' },
            term4: { start: '2026-10-19', end: '2026-12-11' }
        };

        for (let i = 1; i <= 4; i++) {
            const term = termDates[`term${i}`];
            if (term) {
                const start = new Date(term.start);
                const end = new Date(term.end);
                if (date >= start && date <= end) {
                    return `Term ${i}`;
                }
            }
        }

        // Date doesn't fall within any term - it's during holidays
        return 'Holidays';
    }

    // ========================================
    // User Management
    // ========================================
    
    showAddUserModal() {
        const content = `
            <form id="add-user-form">
                <div class="form-group">
                    <label>Full Name <span class="required">*</span></label>
                    <input type="text" id="user-name" required placeholder="Enter full name">
                </div>
                <div class="form-group">
                    <label>Email <span class="required">*</span></label>
                    <input type="email" id="user-email" required placeholder="Enter email address">
                </div>
                <div class="form-group">
                    <label>Role <span class="required">*</span></label>
                    <select id="user-role" required>
                        <option value="admin">Admin - Full access</option>
                        <option value="staff" selected>Staff - Can manage students & events</option>
                        <option value="tutor">Tutor - Can view assigned students</option>
                        <option value="viewer">View Only - Read-only access</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Phone (optional)</label>
                    <input type="tel" id="user-phone" placeholder="Enter phone number">
                </div>
                <div class="form-group">
                    <label>Notes (optional)</label>
                    <textarea id="user-notes" rows="2" placeholder="Any notes about this user"></textarea>
                </div>
                <p class="help-text" style="margin-top: var(--spacing-md); padding: var(--spacing-sm); background: var(--color-bg-tertiary); border-radius: var(--radius-sm);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    Note: This creates a portal user record. For login access, the user must also be added to Firebase Authentication separately.
                </p>
            </form>
        `;
        this.showModal('Add Portal User', content, () => this.saveUser());
    }
    
    showEditUserModal(userId) {
        const user = this.data.users?.find(u => u.id === userId);
        if (!user) {
            this.showToast('User not found', 'error');
            return;
        }

        this.editingUserId = userId;

        const content = `
            <form id="edit-user-form">
                <input type="hidden" id="edit-user-id" value="${user.id}">
                <div class="form-group">
                    <label>Full Name <span class="required">*</span></label>
                    <input type="text" id="user-name" required value="${user.name || ''}">
                </div>
                <div class="form-group">
                    <label>Email <span class="required">*</span></label>
                    <input type="email" id="user-email" required value="${user.email || ''}">
                </div>
                <div class="form-group">
                    <label>Role <span class="required">*</span></label>
                    <select id="user-role" required>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin - Full access</option>
                        <option value="staff" ${user.role === 'staff' ? 'selected' : ''}>Staff - Can manage students & events</option>
                        <option value="tutor" ${user.role === 'tutor' ? 'selected' : ''}>Tutor - Can view assigned students</option>
                        <option value="viewer" ${user.role === 'viewer' ? 'selected' : ''}>View Only - Read-only access</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" id="user-phone" value="${user.phone || ''}">
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="user-notes" rows="2">${user.notes || ''}</textarea>
                </div>
            </form>
        `;
        this.showModal('Edit User', content, () => this.updateUser());
    }
    
    async saveUser() {
        const name = document.getElementById('user-name').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const role = document.getElementById('user-role').value;
        const phone = document.getElementById('user-phone').value.trim();
        const notes = document.getElementById('user-notes').value.trim();
        
        if (!name || !email) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Check if email already exists
        const existingUser = this.data.users?.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            this.showToast('A user with this email already exists', 'error');
            return;
        }
        
        try {
            await DatabaseService.addUser({
                name,
                email,
                role,
                phone,
                notes,
                active: true
            });
            
            await this.loadAllData();
            this.renderUsers();
            this.closeModal();
            this.showToast('User added successfully', 'success');
        } catch (error) {
            console.error('Error adding user:', error);
            this.showToast('Error adding user', 'error');
        }
    }
    
    async updateUser() {
        const id = document.getElementById('edit-user-id').value;
        const name = document.getElementById('user-name').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const role = document.getElementById('user-role').value;
        const phone = document.getElementById('user-phone').value.trim();
        const notes = document.getElementById('user-notes').value.trim();
        
        if (!name || !email) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Check if email already exists (excluding current user)
        const existingUser = this.data.users?.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== id);
        if (existingUser) {
            this.showToast('A user with this email already exists', 'error');
            return;
        }
        
        try {
            await DatabaseService.updateUser(id, {
                name,
                email,
                role,
                phone,
                notes
            });
            
            await this.loadAllData();
            this.renderUsers();
            this.closeModal();
            this.showToast('User updated successfully', 'success');
        } catch (error) {
            console.error('Error updating user:', error);
            this.showToast('Error updating user', 'error');
        }
    }
    
    deleteUser(userId) {
        const user = this.data.users?.find(u => u.id === userId);
        if (!user) return;

        const content = `
            <div class="confirm-delete">
                <div class="confirm-icon danger">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                </div>
                <h3>Delete User?</h3>
                <p>Are you sure you want to delete <strong>${user.name}</strong>? This cannot be undone.</p>
            </div>
        `;

        this.showModal('Delete User', content, () => this.confirmDeleteUser(userId));
        document.getElementById('modal-save').textContent = 'Delete';
        document.getElementById('modal-save').classList.add('btn-danger');
    }

    async confirmDeleteUser(userId) {
        try {
            await DatabaseService.deleteUser(userId);
            this.closeModal();
            await this.loadAllData();
            this.renderUsers();
            this.showToast('User deleted', 'success');
        } catch (error) {
            console.error('Error deleting user:', error);
            this.showToast('Error deleting user', 'error');
        }
    }
    
    // ========================================
    // Term Dates Management
    // ========================================
    
    showEditTermModal(termKey) {
        const terms = this.data.settings?.termDates || {};
        const term = terms[termKey] || { start: '', end: '' };
        const termNum = termKey.replace('term', '');

        const content = `
            <form id="edit-term-form">
                <input type="hidden" id="term-key" value="${termKey}">
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date <span class="required">*</span></label>
                        <input type="date" id="term-start" required value="${term.start || ''}">
                    </div>
                    <div class="form-group">
                        <label>End Date <span class="required">*</span></label>
                        <input type="date" id="term-end" required value="${term.end || ''}">
                    </div>
                </div>
            </form>
        `;
        this.showModal(`Edit Term ${termNum} Dates`, content, () => this.saveTermDates());
    }
    
    showEditAllTermsModal() {
        const terms = this.data.settings?.termDates || {
            term1: { start: '2026-02-02', end: '2026-04-17' },
            term2: { start: '2026-05-04', end: '2026-07-10' },
            term3: { start: '2026-07-27', end: '2026-10-02' },
            term4: { start: '2026-10-19', end: '2026-12-11' }
        };

        const content = `
            <form id="edit-all-terms-form">
                <div class="term-dates-grid">
                    ${[1, 2, 3, 4].map(num => `
                        <div class="term-date-edit-row">
                            <h4>Term ${num}</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Start Date</label>
                                    <input type="date" id="term${num}-start" value="${terms[`term${num}`]?.start || ''}">
                                </div>
                                <div class="form-group">
                                    <label>End Date</label>
                                    <input type="date" id="term${num}-end" value="${terms[`term${num}`]?.end || ''}">
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <p class="help-text" style="margin-top: var(--spacing-md);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    Term dates are used to calculate lesson schedules and event planning.
                </p>
            </form>
        `;
        this.showModal('Edit Term Dates', content, () => this.saveAllTermDates());
    }
    
    async saveTermDates() {
        const termKey = document.getElementById('term-key').value;
        const start = document.getElementById('term-start').value;
        const end = document.getElementById('term-end').value;
        
        if (!start || !end) {
            this.showToast('Please enter both start and end dates', 'error');
            return;
        }
        
        if (new Date(start) >= new Date(end)) {
            this.showToast('End date must be after start date', 'error');
            return;
        }
        
        try {
            const termDates = { ...(this.data.settings?.termDates || {}) };
            termDates[termKey] = { start, end };

            const result = await DatabaseService.updateSettings({ termDates });
            if (result.success) {
                this.data.settings = { ...this.data.settings, termDates };
                this.renderSettings();
                this.closeModal();
                this.showToast('Term dates updated', 'success');
            } else {
                this.showToast('Error saving term dates', 'error');
            }
        } catch (error) {
            console.error('Error saving term dates:', error);
            this.showToast('Error saving term dates', 'error');
        }
    }
    
    async saveAllTermDates() {
        const termDates = {};
        let hasError = false;
        
        for (let i = 1; i <= 4; i++) {
            const start = document.getElementById(`term${i}-start`).value;
            const end = document.getElementById(`term${i}-end`).value;
            
            if (start && end) {
                if (new Date(start) >= new Date(end)) {
                    this.showToast(`Term ${i}: End date must be after start date`, 'error');
                    hasError = true;
                    break;
                }
                termDates[`term${i}`] = { start, end };
            } else if (start || end) {
                this.showToast(`Term ${i}: Please enter both start and end dates`, 'error');
                hasError = true;
                break;
            }
        }
        
        if (hasError) return;
        
        if (Object.keys(termDates).length === 0) {
            this.showToast('Please enter at least one term date', 'error');
            return;
        }
        
        try {
            const result = await DatabaseService.updateSettings({ termDates });
            if (result.success) {
                this.data.settings = { ...this.data.settings, termDates };
                this.renderSettings();
                this.closeModal();
                this.showToast('All term dates updated', 'success');
            } else {
                this.showToast('Error saving term dates', 'error');
            }
        } catch (error) {
            console.error('Error saving term dates:', error);
            this.showToast('Error saving term dates', 'error');
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
                this.showExportModal();
                break;
            case 'import-csv':
                this.showCSVImportModal();
                break;
            case 'add-form':
                this.showAddFormModal();
                break;
            case 'notify-staff':
                this.showNotifyStaffModal();
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
            document.querySelectorAll('[data-action="view-request"]').forEach(btn => {
                btn.addEventListener('click', () => this.showViewRequestModal(btn.dataset.id));
            });
        }
        
        // Event-specific actions
        if (type === 'event') {
            document.querySelectorAll('[data-action="view-event-tasks"]').forEach(btn => {
                btn.addEventListener('click', () => this.showEventTasksModal(btn.dataset.id));
            });
            document.querySelectorAll('[data-action="view-event-details"]').forEach(btn => {
                btn.addEventListener('click', () => this.showEventDetailsPage(btn.dataset.id));
            });
        }
        
        // Group-specific actions
        if (type === 'group') {
            document.querySelectorAll('[data-action="view-group-members"]').forEach(btn => {
                btn.addEventListener('click', () => this.showGroupMembersModal(btn.dataset.id));
            });
        }

        // Hire-specific actions
        if (type === 'hire') {
            document.querySelectorAll('[data-action="return-hire"]').forEach(btn => {
                btn.addEventListener('click', () => this.handleReturnHire(btn.dataset.id));
            });
        }

        // Tutor-specific actions
        if (type === 'tutor') {
            document.querySelectorAll('[data-action="send-portal-link"]').forEach(btn => {
                btn.addEventListener('click', () => this.sendTutorPortalLink(btn.dataset.id));
            });
        }
    }

    async handleEdit(type, id) {
        switch (type) {
            case 'lesson':
                this.showEditLessonModal(id);
                break;
            case 'student':
                this.showEditStudentModal(id);
                break;
            case 'tutor':
                this.showEditTutorModal(id);
                break;
            case 'event':
                this.showEditEventModal(id);
                break;
            case 'group':
                this.showEditGroupModal(id);
                break;
            case 'instrument':
                this.showEditInstrumentModal(id);
                break;
            case 'hire':
                this.showEditHireModal(id);
                break;
            case 'request':
                this.showEditRequestModal(id);
                break;
            default:
                this.showToast(`Edit ${type} not implemented`, 'info');
        }
    }

    // ========================================
    // Edit Modals
    // ========================================

    showEditLessonModal(id) {
        const lesson = this.data.lessons.find(l => l.id === id);
        if (!lesson) return;

        // Find matching tutor by ID or name
        const matchedTutor = lesson.tutorId 
            ? this.data.tutors.find(t => t.id === lesson.tutorId)
            : this.data.tutors.find(t => t.name === lesson.tutorName);
        const matchedTutorId = matchedTutor?.id || '';

        // Find matching student by ID or name
        const matchedStudent = lesson.studentId 
            ? this.data.students.find(s => s.id === lesson.studentId)
            : this.data.students.find(s => s.name === lesson.studentName);
        const matchedStudentId = matchedStudent?.id || '';

        const tutorOptions = this.data.tutors.map(t => 
            `<option value="${t.id}" ${t.id === matchedTutorId ? 'selected' : ''}>${t.name}</option>`
        ).join('');
        const studentOptions = this.data.students.map(s => 
            `<option value="${s.id}" ${s.id === matchedStudentId ? 'selected' : ''}>${s.name} (${s.class || ''})</option>`
        ).join('');
        
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const dayOptions = days.map(d => 
            `<option value="${d}" ${d === lesson.day ? 'selected' : ''}>${d}</option>`
        ).join('');

        const content = `
            <form id="edit-lesson-form" class="modal-form">
                <input type="hidden" name="id" value="${id}">
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
                    <input type="text" name="instrument" value="${lesson.instrument || ''}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Day</label>
                        <select name="day" required>
                            ${dayOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Time</label>
                        <input type="text" name="time" value="${lesson.time || ''}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="active" ${lesson.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="paused" ${lesson.status === 'paused' ? 'selected' : ''}>Paused</option>
                        <option value="cancelled" ${lesson.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="checkbox-label funded-checkbox">
                        <input type="checkbox" name="funded" ${lesson.funded ? 'checked' : ''}>
                        <span>Funded Lesson</span>
                        <small class="form-hint">Check this if the lesson is funded/subsidised</small>
                    </label>
                </div>
            </form>
        `;

        this.showModal('Edit Lesson', content, () => this.updateLesson());
    }

    async updateLesson() {
        const form = document.getElementById('edit-lesson-form');
        const formData = new FormData(form);
        const id = formData.get('id');

        const lesson = {
            studentId: formData.get('studentId'),
            tutorId: formData.get('tutorId'),
            instrument: formData.get('instrument'),
            day: formData.get('day'),
            time: formData.get('time'),
            status: formData.get('status'),
            funded: formData.get('funded') === 'on'
        };
        
        const result = await DatabaseService.updateLesson(id, lesson);

        if (result.success) {
            const student = this.data.students.find(s => s.id === lesson.studentId);
            this.logActivity('lesson', `Lesson updated for ${student?.name || 'Unknown'}`, { lessonId: id });
            this.showToast('Lesson updated successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error updating lesson', 'error');
        }
    }

    showEditStudentModal(id) {
        const student = this.data.students.find(s => s.id === id);
        if (!student) return;

        // Get assigned tutor from lessons
        const studentLessons = this.data.lessons.filter(l =>
            l.studentId === student.id ||
            l.studentName?.toLowerCase() === student.name?.toLowerCase()
        );
        const activeLessons = studentLessons.filter(l => l.status === 'active');
        const assignedTutors = [...new Set(activeLessons.map(l => {
            const tutor = this.getTutorById(l.tutorId) || this.data.tutors.find(t => t.name === l.tutorName);
            return tutor?.name;
        }).filter(Boolean))];

        // Group checkboxes
        const studentGroupIds = student.groupIds || [];
        const groupCheckboxes = this.data.groups.map(g =>
            `<label class="checkbox-label">
                <input type="checkbox" name="groups" value="${g.id}" ${studentGroupIds.includes(g.id) ? 'checked' : ''}>
                <span>${g.name}</span>
            </label>`
        ).join('');

        const content = `
            <form id="edit-student-form" class="modal-form">
                <input type="hidden" name="id" value="${id}">
                <div class="form-group">
                    <label>Student Name</label>
                    <input type="text" name="name" value="${student.name || ''}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Year</label>
                        <input type="number" name="year" min="1" max="13" value="${student.year || ''}">
                    </div>
                    <div class="form-group">
                        <label>Class</label>
                        <input type="text" name="class" value="${student.class || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Instrument(s)</label>
                    <input type="text" name="instruments" value="${(student.instruments || []).join(', ')}">
                </div>
                <div class="form-group">
                    <label>Assigned Tutor(s)</label>
                    <div style="padding: 0.75rem; background: var(--color-bg-tertiary); border-radius: var(--radius-sm); color: var(--color-text-secondary);">
                        ${assignedTutors.length > 0 ? assignedTutors.join(', ') : 'No tutor assigned (create a lesson to assign)'}
                    </div>
                    <small class="form-hint">Tutors are assigned through lessons. Edit lessons to change tutor assignments.</small>
                </div>
                <div class="form-group">
                    <label>Performing Arts Groups</label>
                    <div class="checkbox-group">
                        ${groupCheckboxes || '<span class="text-muted">No groups created yet</span>'}
                    </div>
                    <small class="form-hint">Select the groups this student is a member of</small>
                </div>
                <h4 style="margin: var(--spacing-lg) 0 var(--spacing-md); border-top: 1px solid var(--color-border); padding-top: var(--spacing-lg);">Parent/Guardian Info</h4>
                <div class="form-group">
                    <label>Parent/Guardian Name</label>
                    <input type="text" name="parentName" value="${student.parentName || ''}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Parent Email</label>
                        <input type="email" name="parentEmail" value="${student.parentEmail || ''}">
                    </div>
                    <div class="form-group">
                        <label>Parent Phone</label>
                        <input type="tel" name="parentPhone" value="${student.parentPhone || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="active" ${student.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="assigned" ${student.status === 'assigned' ? 'selected' : ''}>Assigned</option>
                        <option value="waiting" ${student.status === 'waiting' ? 'selected' : ''}>Waiting</option>
                        <option value="inactive" ${student.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
            </form>
        `;

        this.showModal('Edit Student', content, () => this.updateStudent());
    }

    async updateStudent() {
        const form = document.getElementById('edit-student-form');
        const formData = new FormData(form);
        const id = formData.get('id');
        
        // Get selected groups
        const groupCheckboxes = form.querySelectorAll('input[name="groups"]:checked');
        const groupIds = Array.from(groupCheckboxes).map(cb => cb.value);
        
        const student = {
            name: formData.get('name'),
            year: parseInt(formData.get('year')) || null,
            class: formData.get('class'),
            instruments: formData.get('instruments').split(',').map(i => i.trim()).filter(i => i),
            groupIds: groupIds,
            parentName: formData.get('parentName') || '',
            parentEmail: formData.get('parentEmail') || '',
            parentPhone: formData.get('parentPhone') || '',
            status: formData.get('status')
        };
        
        const result = await DatabaseService.updateStudent(id, student);

        if (result.success) {
            this.logActivity('student', `Student updated: ${student.name}`, { studentId: id });
            this.showToast('Student updated successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error updating student', 'error');
        }
    }

    showEditTutorModal(id) {
        const tutor = this.data.tutors.find(t => t.id === id);
        if (!tutor) return;
        
        // Handle both old groupId and new groupIds format
        const tutorGroupIds = tutor.groupIds || (tutor.groupId ? [tutor.groupId] : []);
        
        const groupCheckboxes = this.data.groups.map(g => 
            `<label class="checkbox-label">
                <input type="checkbox" name="groups" value="${g.id}" ${tutorGroupIds.includes(g.id) ? 'checked' : ''}>
                <span>${g.name}</span>
            </label>`
        ).join('');
        
        const content = `
            <form id="edit-tutor-form" class="modal-form">
                <input type="hidden" name="id" value="${id}">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value="${tutor.name || ''}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value="${tutor.email || ''}">
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" value="${tutor.phone || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Instruments Taught (comma-separated)</label>
                    <input type="text" name="instruments" value="${(tutor.instruments || []).join(', ')}">
                    <small class="form-hint">Leave blank if not a music tutor</small>
                </div>
                <div class="form-group">
                    <label>Groups Led</label>
                    <div class="checkbox-group">
                        ${groupCheckboxes || '<span class="text-muted">No groups created yet</span>'}
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Color</label>
                        <input type="color" name="color" value="${tutor.color || '#8b5cf6'}" style="width: 60px; height: 38px;">
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select name="active">
                            <option value="true" ${tutor.active !== false ? 'selected' : ''}>Active</option>
                            <option value="false" ${tutor.active === false ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Funded Lesson Slots</label>
                    <input type="number" name="fundedSlots" value="${tutor.fundedSlots || 0}" min="0">
                    <small class="form-hint">Maximum funded lesson slots for this tutor</small>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="lessonNotifications" ${tutor.lessonNotifications ? 'checked' : ''}>
                        <span>Lesson Approval Notifications</span>
                    </label>
                    <small class="form-hint">When enabled, tutor receives email when assigned new students</small>
                </div>
            </form>
        `;

        this.showModal('Edit Staff Member', content, () => this.updateTutor());
    }

    async updateTutor() {
        const form = document.getElementById('edit-tutor-form');
        const formData = new FormData(form);
        const id = formData.get('id');
        
        const name = formData.get('name');
        const initials = name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
        
        // Get all checked groups
        const groupIds = formData.getAll('groups');
        
        const tutor = {
            name: name,
            initials: initials,
            email: formData.get('email'),
            phone: formData.get('phone'),
            instruments: (formData.get('instruments') || '').split(',').map(i => i.trim()).filter(i => i),
            groupIds: groupIds,
            color: formData.get('color'),
            active: formData.get('active') === 'true',
            fundedSlots: parseInt(formData.get('fundedSlots')) || 0,
            lessonNotifications: formData.get('lessonNotifications') === 'on'
        };

        const result = await DatabaseService.updateTutor(id, tutor);
        
        if (result.success) {
            // Update groups with this leader
            for (const groupId of groupIds) {
                await DatabaseService.updateGroup(groupId, { leader: name });
            }
            
            this.showToast('Staff member updated successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error updating tutor', 'error');
        }
    }

    showEditEventModal(id) {
        const event = this.data.events.find(e => e.id === id);
        if (!event) return;

        // Get categories from settings or use defaults
        const categories = this.data.settings?.categories || this.getDefaultCategories();
        const categoryOptions = categories.map(c =>
            `<option value="${c.name}" ${c.name === event.category ? 'selected' : ''}>${c.name}</option>`
        ).join('');

        const currentTemplate = event.template || event.templateType || '';
        const builtInTemplates = [
            { value: 'school-during', label: 'School (During Hours)' },
            { value: 'school-after', label: 'School (After Hours)' },
            { value: 'offsite-during', label: 'Offsite (During Hours)' },
            { value: 'offsite-after', label: 'Offsite (After Hours)' }
        ];
        const customTemplates = this.data.templates || [];
        
        const templateOptions = `
            <optgroup label="Built-in Templates">
                ${builtInTemplates.map(t => 
                    `<option value="${t.value}" ${t.value === currentTemplate ? 'selected' : ''}>${t.label}</option>`
                ).join('')}
            </optgroup>
            ${customTemplates.length > 0 ? `
                <optgroup label="Custom Templates">
                    ${customTemplates.map(t => 
                        `<option value="${t.id}" ${t.id === currentTemplate ? 'selected' : ''}>${t.name}</option>`
                    ).join('')}
                </optgroup>
            ` : ''}
        `;

        // Groups checkboxes
        const eventGroupIds = event.groupIds || [];
        const groupCheckboxes = this.data.groups.map(g => 
            `<label class="checkbox-label">
                <input type="checkbox" name="groups" value="${g.id}" ${eventGroupIds.includes(g.id) ? 'checked' : ''}>
                <span>${g.name}</span>
            </label>`
        ).join('');

        // Staff checkboxes  
        const eventStaffIds = event.staffIds || [];
        const staffCheckboxes = this.data.tutors.map(t => 
            `<label class="checkbox-label">
                <input type="checkbox" name="staff" value="${t.id}" ${eventStaffIds.includes(t.id) ? 'checked' : ''}>
                <span>${t.name}</span>
            </label>`
        ).join('');

        const content = `
            <form id="edit-event-form" class="modal-form">
                <input type="hidden" name="id" value="${id}">
                <div class="form-group">
                    <label>Event Name</label>
                    <input type="text" name="name" value="${event.name || ''}" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description">${event.description || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" name="date" id="edit-event-date" value="${event.date || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Time</label>
                        <input type="text" name="time" value="${event.time || ''}" placeholder="e.g. 7:00 PM">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" name="location" value="${event.location || ''}" placeholder="e.g. Main Hall">
                    </div>
                    <div class="form-group">
                        <label>Term <small>(auto-calculated from date)</small></label>
                        <input type="text" name="term" id="edit-event-term" value="${event.term || 'Term 1'}" readonly style="background: var(--color-bg-tertiary); cursor: not-allowed;">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Category</label>
                        <select name="category">
                            ${categoryOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Template</label>
                        <select name="template">
                            <option value="">Select template...</option>
                            ${templateOptions}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Performing Groups</label>
                    <div class="checkbox-group">
                        ${groupCheckboxes || '<span class="text-muted">No groups created yet</span>'}
                    </div>
                    <small class="form-hint">Select the groups performing at this event</small>
                </div>
                <div class="form-group">
                    <label>Staff Involved</label>
                    <div class="checkbox-group">
                        ${staffCheckboxes || '<span class="text-muted">No staff added yet</span>'}
                    </div>
                    <small class="form-hint">These staff will receive task notifications</small>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="notes" rows="3" placeholder="Additional notes about this event...">${event.notes || ''}</textarea>
                </div>
            </form>
        `;
        
        this.showModal('Edit Event', content, () => this.updateEvent());

        // Add date change listener to auto-update term
        setTimeout(() => {
            const dateInput = document.getElementById('edit-event-date');
            const termInput = document.getElementById('edit-event-term');
            if (dateInput && termInput) {
                dateInput.addEventListener('change', () => {
                    const term = this.getTermFromDate(dateInput.value);
                    termInput.value = term;
                });
            }
        }, 100);
    }

    async updateEvent() {
        const form = document.getElementById('edit-event-form');
        const formData = new FormData(form);
        const id = formData.get('id');
        
        // Get selected groups
        const groupCheckboxes = form.querySelectorAll('input[name="groups"]:checked');
        const groupIds = Array.from(groupCheckboxes).map(cb => cb.value);
        
        // Get selected staff
        const staffCheckboxes = form.querySelectorAll('input[name="staff"]:checked');
        const staffIds = Array.from(staffCheckboxes).map(cb => cb.value);
        
        const event = {
            name: formData.get('name'),
            description: formData.get('description'),
            date: formData.get('date'),
            time: formData.get('time'),
            location: formData.get('location'),
            term: formData.get('term'),
            category: formData.get('category'),
            template: formData.get('template'),
            groupIds: groupIds,
            staffIds: staffIds,
            notes: formData.get('notes')
        };
        
        const result = await DatabaseService.updateEvent(id, event);

        if (result.success) {
            this.logActivity('event', `Event updated: ${event.name}`, { eventId: id });
            this.showToast('Event updated successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error updating event', 'error');
        }
    }

    // Event Task Templates - tasks with days before event, organized by phase
    getEventTemplateTasks(templateType) {
        // Helper function to convert template phase format to task list format
        const convertTemplateToTaskList = (phases) => {
            const tasks = [];
            phases.forEach((phase, phaseIndex) => {
                // Calculate default daysBefore based on phase order (spread across weeks)
                const baseDays = Math.max(0, (phases.length - phaseIndex) * 7);

                (phase.items || []).forEach((taskName, taskIndex) => {
                    tasks.push({
                        phase: phase.phase,
                        name: taskName,
                        daysBefore: Math.max(0, baseDays - taskIndex),
                        assignTo: 'coordinator'
                    });
                });
            });
            return tasks;
        };

        // First, check if there's a custom template that overrides a built-in template
        const customOverride = this.data.templates?.find(t => t.builtInId === templateType);
        if (customOverride && customOverride.tasks) {
            return convertTemplateToTaskList(customOverride.tasks);
        }

        // Then check if it's a direct custom template reference
        const customTemplate = this.data.templates?.find(t => t.id === templateType);
        if (customTemplate && customTemplate.tasks) {
            return convertTemplateToTaskList(customTemplate.tasks);
        }

        // Then check built-in templates from EventTemplates
        const builtInTemplate = EventTemplates[templateType];
        if (builtInTemplate && builtInTemplate.tasks) {
            return convertTemplateToTaskList(builtInTemplate.tasks);
        }

        // Default fallback to school-during
        return convertTemplateToTaskList(EventTemplates['school-during'].tasks);
    }

    showEventTasksModal(eventId) {
        const event = this.data.events.find(e => e.id === eventId);
        if (!event) return;
        
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get staff involved in event
        const eventStaff = (event.staffIds || [])
            .map(sid => this.data.tutors.find(t => t.id === sid))
            .filter(s => s);
        
        // Get template tasks or use existing tasks
        const templateTasks = this.getEventTemplateTasks(event.template || event.templateType);
        
        // Merge with any saved task completion status
        const savedTasks = event.tasks || [];
        const tasks = templateTasks.map((task, index) => {
            const savedTask = savedTasks.find(t => t.name === task.name) || {};
            const dueDate = new Date(eventDate);
            dueDate.setDate(dueDate.getDate() - task.daysBefore);
            
            const isOverdue = !savedTask.completed && dueDate < today;
            const isDueToday = dueDate.toDateString() === today.toDateString();
            const isDueSoon = !isOverdue && !isDueToday && dueDate <= new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
            
            // Handle both legacy single assignedTo and new assignedToIds array
            let assignedToIds = savedTask.assignedToIds || [];
            if (!assignedToIds.length && savedTask.assignedTo) {
                assignedToIds = [savedTask.assignedTo];
            }

            return {
                ...task,
                id: index,
                dueDate: dueDate,
                completed: savedTask.completed || false,
                completedBy: savedTask.completedBy || null,
                completedDate: savedTask.completedDate || null,
                assignedToIds: assignedToIds,
                isOverdue,
                isDueToday,
                isDueSoon
            };
        });
        
        // Group tasks by phase
        const phases = [...new Set(tasks.map(t => t.phase))];
        const tasksByPhase = phases.map(phase => ({
            name: phase,
            tasks: tasks.filter(t => t.phase === phase)
        }));
        
        const completedCount = tasks.filter(t => t.completed).length;
        const overdueCount = tasks.filter(t => t.isOverdue).length;
        
        // Staff options for assignment dropdown
        const staffOptions = eventStaff.map(s => 
            `<option value="${s.id}">${s.name}</option>`
        ).join('');
        
        const content = `
            <div class="event-tasks-modal">
                <div class="event-tasks-header">
                    <div class="event-info">
                        <h3>${event.name}</h3>
                        <p>Event Date: <strong>${this.formatDate(event.date)}</strong> ${event.time ? '· ' + event.time : ''}</p>
                        ${event.location ? `<p>Location: <strong>${event.location}</strong></p>` : ''}
                    </div>
                    <div class="tasks-summary">
                        <div class="progress-ring">
                            <span class="progress-value">${Math.round((completedCount / tasks.length) * 100)}%</span>
                        </div>
                        <div class="progress-text">
                            <span class="tasks-progress">${completedCount}/${tasks.length} complete</span>
                            ${overdueCount > 0 ? `<span class="tasks-overdue">${overdueCount} overdue</span>` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="tasks-phases" id="event-tasks-list">
                    ${tasksByPhase.map(phase => {
                        const phaseCompleted = phase.tasks.filter(t => t.completed).length;
                        const phaseOverdue = phase.tasks.filter(t => t.isOverdue).length;
                        
                        return `
                            <div class="task-phase ${phaseCompleted === phase.tasks.length ? 'phase-complete' : ''} ${phaseOverdue > 0 ? 'phase-overdue' : ''}">
                                <div class="phase-header">
                                    <div class="phase-title">
                                        <span class="phase-name">${phase.name}</span>
                                        <span class="phase-progress">${phaseCompleted}/${phase.tasks.length}</span>
                                    </div>
                                    ${phaseOverdue > 0 ? `<span class="phase-warning">${phaseOverdue} overdue</span>` : ''}
                                </div>
                                <div class="phase-tasks">
                                    ${phase.tasks.map(task => {
                                        const assignedStaffList = task.assignedToIds
                                            .map(id => eventStaff.find(s => s.id === id))
                                            .filter(s => s);

                                        return `
                                            <div class="task-item ${task.completed ? 'completed' : ''} ${task.isOverdue ? 'overdue' : ''} ${task.isDueToday ? 'due-today' : ''} ${task.isDueSoon ? 'due-soon' : ''}" data-task-id="${task.id}">
                                                <label class="task-checkbox">
                                                    <input type="checkbox" ${task.completed ? 'checked' : ''} data-event-id="${eventId}" data-task-name="${task.name}">
                                                    <span class="checkmark"></span>
                                                </label>
                                                <div class="task-content">
                                                    <span class="task-name">${task.name}</span>
                                                    <div class="task-meta">
                                                        <span class="task-due">
                                                            ${task.daysBefore === 0 ? 'Event day' :
                                                              task.daysBefore === 1 ? '1 day before' :
                                                              `${task.daysBefore} days before`}
                                                            <span class="task-date">(${this.formatDate(task.dueDate)})</span>
                                                        </span>
                                                        ${eventStaff.length > 0 ? `
                                                            <div class="task-assignees-group modal-assignees" onclick="app.showTaskAssignmentModal('${eventId}', '${task.name.replace(/'/g, "\\'")}')">
                                                                ${assignedStaffList.length > 0 ? assignedStaffList.map(s => `
                                                                    <div class="staff-avatar-sm" style="background: ${s.color || '#8b5cf6'};" title="${s.name}">
                                                                        ${s.initials || s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                                    </div>
                                                                `).join('') : '<span class="assign-link">Assign...</span>'}
                                                            </div>
                                                        ` : ''}
                                                    </div>
                                                </div>
                                                <div class="task-status">
                                                    ${task.completed ? '<span class="status-complete">✓</span>' :
                                                      task.isOverdue ? '<span class="status-overdue">Overdue</span>' :
                                                      task.isDueToday ? '<span class="status-today">Today</span>' :
                                                      task.isDueSoon ? '<span class="status-soon">Soon</span>' : ''}
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                ${eventStaff.length > 0 ? `
                    <div class="tasks-staff">
                        <h4>Staff Involved</h4>
                        <div class="staff-avatars">
                            ${eventStaff.map(s => `
                                <div class="staff-avatar-item" title="${s.name}">
                                    <div class="staff-avatar" style="background: ${s.color || '#8b5cf6'};">${s.initials}</div>
                                    <span>${s.name.split(' ')[0]}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : '<p class="help-text">Add staff to this event to assign tasks.</p>'}
            </div>
        `;
        
        this.showModal(`Event Tasks: ${event.name}`, content, null);
        document.getElementById('modal-save').style.display = 'none';
        
        // Bind checkbox changes
        setTimeout(() => {
            document.querySelectorAll('#event-tasks-list input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    this.toggleEventTask(e.target.dataset.eventId, e.target.dataset.taskName, e.target.checked);
                });
            });
            // Bind staff assignment changes
            document.querySelectorAll('#event-tasks-list select.task-assign').forEach(select => {
                select.addEventListener('change', (e) => {
                    this.assignEventTask(e.target.dataset.eventId, e.target.dataset.taskName, e.target.value);
                });
            });
        }, 100);
    }

    // Show full-page event details
    showEventDetailsPage(eventId) {
        this.currentEventId = eventId;
        this.navigateTo('event-details');
    }

    renderEventDetails() {
        const container = document.getElementById('event-details-content');
        const titleEl = document.getElementById('event-details-title');
        if (!container || !this.currentEventId) return;

        const event = this.data.events.find(e => e.id === this.currentEventId);
        if (!event) {
            container.innerHTML = '<div class="no-data-card">Event not found</div>';
            return;
        }

        // Update page title
        titleEl.textContent = `${event.name} - Event Details`;

        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get staff involved in event
        const eventStaff = (event.staffIds || [])
            .map(sid => this.data.tutors.find(t => t.id === sid))
            .filter(s => s);

        // Get template tasks
        const templateTasks = this.getEventTemplateTasks(event.template || event.templateType);
        const savedTasks = event.tasks || [];

        // Process template tasks with due dates and status
        const tasks = templateTasks.map((task, index) => {
            const savedTask = savedTasks.find(t => t.name === task.name) || {};
            const dueDate = new Date(eventDate);
            dueDate.setDate(dueDate.getDate() - task.daysBefore);

            const isOverdue = !savedTask.completed && dueDate < today;
            const isDueToday = dueDate.toDateString() === today.toDateString();

            // Handle both legacy single assignedTo and new assignedToIds array
            let assignedToIds = savedTask.assignedToIds || [];
            if (!assignedToIds.length && savedTask.assignedTo) {
                assignedToIds = [savedTask.assignedTo];
            }

            return {
                ...task,
                id: index,
                dueDate: dueDate,
                completed: savedTask.completed || false,
                assignedToIds: assignedToIds,
                notes: savedTask.notes || '',
                isOverdue,
                isDueToday
            };
        });

        // Add custom tasks (tasks not from template)
        const customTasks = savedTasks.filter(t => t.isCustom).map((task, idx) => {
            const dueDate = task.dueDate ? new Date(task.dueDate) : eventDate;
            const isOverdue = !task.completed && dueDate < today;
            const isDueToday = dueDate.toDateString() === today.toDateString();

            let assignedToIds = task.assignedToIds || [];
            if (!assignedToIds.length && task.assignedTo) {
                assignedToIds = [task.assignedTo];
            }

            return {
                name: task.name,
                phase: task.phase || 'Custom Tasks',
                id: `custom-${idx}`,
                dueDate: dueDate,
                completed: task.completed || false,
                assignedToIds: assignedToIds,
                notes: task.notes || '',
                isOverdue,
                isDueToday,
                isCustom: true
            };
        });

        const allTasks = [...tasks, ...customTasks];

        // Group tasks by phase
        const phases = [...new Set(allTasks.map(t => t.phase))];
        const tasksByPhase = phases.map(phase => ({
            name: phase,
            tasks: allTasks.filter(t => t.phase === phase)
        }));

        // Staff avatars HTML
        const staffAvatarsHtml = eventStaff.length > 0 ? `
            <div class="event-staff-avatars">
                ${eventStaff.map(s => `
                    <div class="event-staff-avatar" style="background: ${s.color || '#8b5cf6'};" title="${s.name}">
                        ${s.initials || s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                `).join('')}
            </div>
        ` : '';

        // Staff options for assignment dropdown
        const staffOptions = eventStaff.map(s =>
            `<option value="${s.id}">${s.name}</option>`
        ).join('');

        container.innerHTML = `
            <div class="event-details-header">
                <div class="event-details-meta">
                    <div class="event-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="10" r="3"/>
                            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z"/>
                        </svg>
                        <span>Location:</span>
                        <strong>${event.location || 'TBD'}</strong>
                    </div>
                    <div class="event-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>Date:</span>
                        <strong>${this.formatDate(event.date)}</strong>
                    </div>
                    <div class="event-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span>Time:</span>
                        <strong>${event.time || 'TBD'}</strong>
                    </div>
                    ${staffAvatarsHtml ? `
                        <div class="event-meta-item" style="margin-left: auto;">
                            <span>Linked Staff:</span>
                            ${staffAvatarsHtml}
                        </div>
                    ` : ''}
                </div>
                ${event.notes ? `
                    <div class="event-description-box">
                        <h4>Description:</h4>
                        <p>${event.notes}</p>
                    </div>
                ` : ''}
            </div>

            <div class="event-task-header-row">
                <div>Description</div>
                <div style="text-align: center;">Assigned:</div>
                <div>Notes</div>
                <div style="text-align: center;">Due Date:</div>
                <div style="text-align: center;">Status:</div>
                <div style="text-align: center;">Actions</div>
            </div>

            <div class="event-tasks-section">
                ${tasksByPhase.map(phase => `
                    <div class="event-tasks-phase">
                        <div class="event-tasks-phase-header">${phase.name}</div>
                        ${phase.tasks.map(task => {
                            const assignedStaffList = task.assignedToIds
                                .map(id => eventStaff.find(s => s.id === id))
                                .filter(s => s);
                            const statusClass = task.completed ? 'completed' : (task.isOverdue ? 'overdue' : 'pending');

                            return `
                                <div class="event-task-row" data-task-id="${task.id}">
                                    <div class="event-task-name ${task.isOverdue && !task.completed ? 'overdue' : ''}">
                                        ${task.name}
                                        ${task.isOverdue && !task.completed ? '<span class="overdue-label">OVERDUE</span>' : ''}
                                    </div>
                                    <div class="event-task-assigned">
                                        ${eventStaff.length > 0 ? `
                                            <div class="task-assignees-group" onclick="app.showTaskAssignmentModal('${event.id}', '${task.name.replace(/'/g, "\\'")}')">
                                                ${assignedStaffList.length > 0 ? assignedStaffList.map(s => `
                                                    <div class="event-staff-avatar" style="background: ${s.color || '#8b5cf6'}; width: 28px; height: 28px; font-size: 0.7rem;" title="${s.name}">
                                                        ${s.initials || s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                    </div>
                                                `).join('') : `
                                                    <div class="assign-placeholder" title="Click to assign">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                                            <circle cx="12" cy="7" r="4"/>
                                                            <path d="M5.5 21a8.5 8.5 0 0117 0"/>
                                                            <line x1="12" y1="14" x2="12" y2="20"/>
                                                            <line x1="9" y1="17" x2="15" y2="17"/>
                                                        </svg>
                                                    </div>
                                                `}
                                            </div>
                                        ` : '—'}
                                    </div>
                                    <div class="event-task-notes">
                                        <input type="text" class="task-notes-input"
                                            value="${(task.notes || '').replace(/"/g, '&quot;')}"
                                            placeholder="Add note..."
                                            data-event-id="${event.id}"
                                            data-task-name="${task.name.replace(/"/g, '&quot;')}"
                                            onblur="app.saveTaskNote(this)">
                                    </div>
                                    <div class="event-task-date ${task.isOverdue && !task.completed ? 'overdue' : ''}">
                                        ${this.formatDate(task.dueDate)}
                                    </div>
                                    <div class="event-task-status">
                                        <div class="status-icon ${statusClass}" data-event-id="${event.id}" data-task-name="${task.name}" data-completed="${task.completed}" onclick="app.toggleEventTaskFromDetails('${event.id}', '${task.name.replace(/'/g, "\\'")}', ${!task.completed})">
                                            ${task.completed ? `
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="14" height="14">
                                                    <polyline points="20 6 9 17 4 12"/>
                                                </svg>
                                            ` : `
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                                    <circle cx="12" cy="12" r="10"/>
                                                    <path d="M12 16v-4M12 8h.01"/>
                                                </svg>
                                            `}
                                        </div>
                                        ${task.isOverdue && !task.completed && assignedStaffList.length > 0 ? `
                                            <button class="btn btn-sm btn-outline notify-btn" onclick="app.sendOverdueTaskNotification('${event.id}', '${task.name.replace(/'/g, "\\'")}'); event.stopPropagation();" title="Send reminder to assigned staff">
                                                Notify
                                            </button>
                                        ` : ''}
                                    </div>
                                    <div class="event-task-actions">
                                        <button class="btn-icon-sm" onclick="app.showEditTaskModal('${event.id}', '${task.name.replace(/'/g, "\\'")}', ${task.isCustom || false})" title="Edit task">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                            </svg>
                                        </button>
                                        ${task.isCustom ? `
                                            <button class="btn-icon-sm btn-danger" onclick="app.deleteTask('${event.id}', '${task.name.replace(/'/g, "\\'")}')" title="Delete task">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                                    <polyline points="3 6 5 6 21 6"/>
                                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                                </svg>
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `).join('')}
            </div>

            <div class="event-tasks-actions">
                <button class="btn btn-outline" onclick="app.showAddTaskModal('${event.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Custom Task
                </button>
            </div>
        `;

    }

    showAddTaskModal(eventId) {
        const event = this.data.events.find(e => e.id === eventId);
        if (!event) return;

        // Get staff involved in event
        const eventStaff = (event.staffIds || [])
            .map(sid => this.data.tutors.find(t => t.id === sid))
            .filter(s => s);

        // Get existing phases from template tasks
        const templateTasks = this.getEventTemplateTasks(event.template || event.templateType);
        const existingPhases = [...new Set(templateTasks.map(t => t.phase))];
        // Add default phases if none exist
        const defaultPhases = ['Planning', 'Logistics', 'Communications', 'Event Day', 'Post-Event'];
        const phases = existingPhases.length > 0 ? existingPhases : defaultPhases;

        const phaseOptions = phases.map(p => `<option value="${p}">${p}</option>`).join('');

        const staffCheckboxes = eventStaff.length > 0 ? eventStaff.map(s => `
            <label class="staff-checkbox-item">
                <input type="checkbox" name="new-task-assignee" value="${s.id}">
                <div class="event-staff-avatar" style="background: ${s.color || '#8b5cf6'}; width: 24px; height: 24px; font-size: 0.65rem;">
                    ${s.initials || s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <span>${s.name}</span>
            </label>
        `).join('') : '<p class="text-muted">No staff linked to this event</p>';

        const content = `
            <form id="add-task-form">
                <input type="hidden" id="new-task-event-id" value="${eventId}">
                <div class="form-group">
                    <label>Task Name <span class="required">*</span></label>
                    <input type="text" id="new-task-name" required placeholder="e.g., Book catering">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Due Date</label>
                        <input type="date" id="new-task-due-date" value="${event.date}">
                    </div>
                    <div class="form-group">
                        <label>Phase</label>
                        <select id="new-task-phase">
                            ${phaseOptions}
                            <option value="Custom Tasks">Custom Tasks</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Assign To</label>
                    <div class="staff-checkbox-list">
                        ${staffCheckboxes}
                    </div>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <input type="text" id="new-task-notes" placeholder="Optional notes...">
                </div>
            </form>
        `;

        this.showModal('Add Custom Task', content, () => this.saveNewTask());
    }

    async saveNewTask() {
        const eventId = document.getElementById('new-task-event-id').value;
        const taskName = document.getElementById('new-task-name').value.trim();
        const dueDate = document.getElementById('new-task-due-date').value;
        const phase = document.getElementById('new-task-phase').value;
        const notes = document.getElementById('new-task-notes').value.trim();
        const checkboxes = document.querySelectorAll('input[name="new-task-assignee"]:checked');
        const assignedToIds = Array.from(checkboxes).map(cb => cb.value);

        if (!taskName) {
            this.showToast('Please enter a task name', 'error');
            return;
        }

        const event = this.data.events.find(e => e.id === eventId);
        if (!event) return;

        // Initialize tasks array if needed
        if (!event.tasks) {
            event.tasks = [];
        }

        // Check if task with same name exists
        if (event.tasks.find(t => t.name === taskName)) {
            this.showToast('A task with this name already exists', 'error');
            return;
        }

        // Add the new custom task
        event.tasks.push({
            name: taskName,
            completed: false,
            assignedToIds: assignedToIds,
            notes: notes,
            dueDate: dueDate,
            phase: phase,
            isCustom: true
        });

        // Update in database
        const result = await DatabaseService.updateEvent(eventId, { tasks: event.tasks });

        if (result.success) {
            this.logActivity('task', `New task "${taskName}" added to ${event.name}`, { eventId, taskName });
            this.closeModal();
            this.showToast('Task added successfully', 'success');
            this.renderEventDetails();
        } else {
            this.showToast('Error adding task', 'error');
        }
    }

    showEditTaskModal(eventId, taskName, isCustom) {
        const event = this.data.events.find(e => e.id === eventId);
        if (!event) return;

        // Get staff involved in event
        const eventStaff = (event.staffIds || [])
            .map(sid => this.data.tutors.find(t => t.id === sid))
            .filter(s => s);

        // Find the task
        const savedTask = (event.tasks || []).find(t => t.name === taskName);

        // Get task info from template if not custom
        const templateTasks = this.getEventTemplateTasks(event.template || event.templateType);
        const templateTask = templateTasks.find(t => t.name === taskName);

        // Current values
        let currentAssignees = savedTask?.assignedToIds || [];
        if (!currentAssignees.length && savedTask?.assignedTo) {
            currentAssignees = [savedTask.assignedTo];
        }
        const currentNotes = savedTask?.notes || '';
        const currentPhase = savedTask?.phase || templateTask?.phase || 'Custom Tasks';

        // Calculate due date
        let currentDueDate = event.date;
        if (savedTask?.dueDate) {
            currentDueDate = savedTask.dueDate;
        } else if (templateTask?.daysBefore !== undefined) {
            const eventDate = new Date(event.date);
            eventDate.setDate(eventDate.getDate() - templateTask.daysBefore);
            currentDueDate = eventDate.toISOString().split('T')[0];
        }

        // Get phases
        const existingPhases = [...new Set(templateTasks.map(t => t.phase))];
        const defaultPhases = ['Planning', 'Logistics', 'Communications', 'Event Day', 'Post-Event'];
        const phases = existingPhases.length > 0 ? existingPhases : defaultPhases;
        const phaseOptions = phases.map(p => `<option value="${p}" ${currentPhase === p ? 'selected' : ''}>${p}</option>`).join('');

        const staffCheckboxes = eventStaff.length > 0 ? eventStaff.map(s => `
            <label class="staff-checkbox-item">
                <input type="checkbox" name="edit-task-assignee" value="${s.id}" ${currentAssignees.includes(s.id) ? 'checked' : ''}>
                <div class="event-staff-avatar" style="background: ${s.color || '#8b5cf6'}; width: 24px; height: 24px; font-size: 0.65rem;">
                    ${s.initials || s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <span>${s.name}</span>
            </label>
        `).join('') : '<p class="text-muted">No staff linked to this event</p>';

        const content = `
            <form id="edit-task-form">
                <input type="hidden" id="edit-task-event-id" value="${eventId}">
                <input type="hidden" id="edit-task-original-name" value="${taskName}">
                <input type="hidden" id="edit-task-is-custom" value="${isCustom}">
                <div class="form-group">
                    <label>Task Name ${isCustom ? '<span class="required">*</span>' : ''}</label>
                    <input type="text" id="edit-task-name" value="${taskName}" ${isCustom ? '' : 'readonly style="background: var(--color-bg-tertiary); cursor: not-allowed;"'}>
                    ${!isCustom ? '<small class="text-muted">Template tasks cannot be renamed</small>' : ''}
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Due Date</label>
                        <input type="date" id="edit-task-due-date" value="${currentDueDate}">
                    </div>
                    <div class="form-group">
                        <label>Phase</label>
                        <select id="edit-task-phase" ${isCustom ? '' : 'disabled style="background: var(--color-bg-tertiary); cursor: not-allowed;"'}>
                            ${phaseOptions}
                            <option value="Custom Tasks" ${currentPhase === 'Custom Tasks' ? 'selected' : ''}>Custom Tasks</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Assign To</label>
                    <div class="staff-checkbox-list">
                        ${staffCheckboxes}
                    </div>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <input type="text" id="edit-task-notes" value="${currentNotes}" placeholder="Optional notes...">
                </div>
            </form>
        `;

        this.showModal(`Edit Task: ${taskName}`, content, () => this.saveEditTask());
    }

    async saveEditTask() {
        const eventId = document.getElementById('edit-task-event-id').value;
        const originalName = document.getElementById('edit-task-original-name').value;
        const isCustom = document.getElementById('edit-task-is-custom').value === 'true';
        const taskName = document.getElementById('edit-task-name').value.trim();
        const dueDate = document.getElementById('edit-task-due-date').value;
        const phase = document.getElementById('edit-task-phase').value;
        const notes = document.getElementById('edit-task-notes').value.trim();
        const checkboxes = document.querySelectorAll('input[name="edit-task-assignee"]:checked');
        const assignedToIds = Array.from(checkboxes).map(cb => cb.value);

        if (isCustom && !taskName) {
            this.showToast('Please enter a task name', 'error');
            return;
        }

        const event = this.data.events.find(e => e.id === eventId);
        if (!event) return;

        // Initialize tasks array if needed
        if (!event.tasks) {
            event.tasks = [];
        }

        // Check if renamed task already exists (for custom tasks)
        if (isCustom && taskName !== originalName && event.tasks.find(t => t.name === taskName)) {
            this.showToast('A task with this name already exists', 'error');
            return;
        }

        // Find existing task entry
        const existingTaskIndex = event.tasks.findIndex(t => t.name === originalName);

        if (existingTaskIndex >= 0) {
            // Update existing task
            const existingTask = event.tasks[existingTaskIndex];
            event.tasks[existingTaskIndex] = {
                ...existingTask,
                name: isCustom ? taskName : originalName,
                assignedToIds: assignedToIds,
                notes: notes,
                dueDate: dueDate,
                phase: isCustom ? phase : existingTask.phase
            };
        } else {
            // Create new task entry (for template tasks that haven't been saved before)
            event.tasks.push({
                name: originalName,
                completed: false,
                assignedToIds: assignedToIds,
                notes: notes,
                dueDate: dueDate,
                phase: phase,
                isCustom: false
            });
        }

        // Update in database
        const result = await DatabaseService.updateEvent(eventId, { tasks: event.tasks });

        if (result.success) {
            this.logActivity('task', `Task "${isCustom ? taskName : originalName}" updated on ${event.name}`, { eventId, taskName: isCustom ? taskName : originalName });
            this.closeModal();
            this.showToast('Task updated successfully', 'success');
            this.renderEventDetails();
        } else {
            this.showToast('Error updating task', 'error');
        }
    }

    async deleteTask(eventId, taskName) {
        if (!confirm(`Are you sure you want to delete the task "${taskName}"?`)) {
            return;
        }

        const event = this.data.events.find(e => e.id === eventId);
        if (!event || !event.tasks) return;

        // Remove the task
        const taskIndex = event.tasks.findIndex(t => t.name === taskName);
        if (taskIndex === -1) {
            this.showToast('Task not found', 'error');
            return;
        }

        event.tasks.splice(taskIndex, 1);

        // Update in database
        const result = await DatabaseService.updateEvent(eventId, { tasks: event.tasks });

        if (result.success) {
            this.logActivity('task', `Task "${taskName}" deleted from ${event.name}`, { eventId, taskName });
            this.showToast('Task deleted successfully', 'success');
            this.renderEventDetails();
        } else {
            this.showToast('Error deleting task', 'error');
        }
    }

    async toggleEventTaskFromDetails(eventId, taskName, completed) {
        await this.toggleEventTask(eventId, taskName, completed);
        // Re-render the details page to reflect changes
        this.renderEventDetails();
    }

    async assignEventTaskFromDetails(eventId, taskName, staffIds) {
        await this.assignEventTask(eventId, taskName, staffIds);
        // Re-render the details page to reflect changes
        this.renderEventDetails();
    }

    showTaskAssignmentModal(eventId, taskName) {
        const event = this.data.events.find(e => e.id === eventId);
        if (!event) return;

        // Get staff involved in event
        const eventStaff = (event.staffIds || [])
            .map(sid => this.data.tutors.find(t => t.id === sid))
            .filter(s => s);

        if (eventStaff.length === 0) {
            this.showToast('No staff linked to this event', 'warning');
            return;
        }

        // Get currently assigned staff for this task
        const savedTask = (event.tasks || []).find(t => t.name === taskName);
        let currentAssignees = savedTask?.assignedToIds || [];
        if (!currentAssignees.length && savedTask?.assignedTo) {
            currentAssignees = [savedTask.assignedTo];
        }

        const staffCheckboxes = eventStaff.map(s => `
            <label class="staff-checkbox-item">
                <input type="checkbox" name="task-assignee" value="${s.id}" ${currentAssignees.includes(s.id) ? 'checked' : ''}>
                <div class="event-staff-avatar" style="background: ${s.color || '#8b5cf6'};">
                    ${s.initials || s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <span>${s.name}</span>
            </label>
        `).join('');

        const content = `
            <form id="task-assignment-form">
                <input type="hidden" id="task-event-id" value="${eventId}">
                <input type="hidden" id="task-name" value="${taskName}">
                <p style="margin-bottom: var(--spacing-md); color: var(--color-text-secondary);">
                    Select staff members to assign to this task:
                </p>
                <div class="staff-checkbox-list">
                    ${staffCheckboxes}
                </div>
            </form>
        `;

        this.showModal(`Assign: ${taskName}`, content, () => this.saveTaskAssignment());
    }

    async saveTaskAssignment() {
        const eventId = document.getElementById('task-event-id').value;
        const taskName = document.getElementById('task-name').value;
        const checkboxes = document.querySelectorAll('input[name="task-assignee"]:checked');
        const staffIds = Array.from(checkboxes).map(cb => cb.value);

        await this.assignEventTaskFromDetails(eventId, taskName, staffIds);
        this.closeModal();
    }

    async saveTaskNote(inputEl) {
        const eventId = inputEl.dataset.eventId;
        const taskName = inputEl.dataset.taskName;
        const notes = inputEl.value.trim();

        const event = this.data.events.find(e => e.id === eventId);
        if (!event) return;

        // Initialize tasks array if needed
        if (!event.tasks) {
            event.tasks = [];
        }

        // Find or create task entry
        let task = event.tasks.find(t => t.name === taskName);
        if (task) {
            task.notes = notes;
        } else {
            event.tasks.push({
                name: taskName,
                completed: false,
                assignedToIds: [],
                notes: notes
            });
        }

        // Update in database (silent - no toast for notes)
        await DatabaseService.updateEvent(eventId, { tasks: event.tasks });
    }

    showEventActionsMenu() {
        if (!this.currentEventId) return;

        const event = this.data.events.find(e => e.id === this.currentEventId);
        if (!event) return;

        const content = `
            <div class="actions-menu">
                <button class="action-menu-item" onclick="app.closeModal(); setTimeout(() => app.showEditEventModal('${event.id}'), 100);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Event Details
                </button>
                <button class="action-menu-item" onclick="app.closeModal(); app.duplicateEvent('${event.id}');">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                    Duplicate Event
                </button>
                <button class="action-menu-item" onclick="app.closeModal(); app.markAllTasksComplete('${event.id}');">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Mark All Tasks Complete
                </button>
                <button class="action-menu-item" onclick="app.closeModal(); app.confirmResetAllTasks('${event.id}');">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                        <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16"/>
                        <path d="M8 16H3v5"/>
                    </svg>
                    Reset All Tasks
                </button>
                <button class="action-menu-item" onclick="app.closeModal(); setTimeout(() => app.showNotifyStaffModal('event', '${event.id}'), 100);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    Notify Staff
                </button>
                <button class="action-menu-item" onclick="app.closeModal(); app.sendEventPortalLinks('${event.id}');">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    Send Staff Portal Links
                </button>
                <div class="action-menu-divider"></div>
                <button class="action-menu-item danger" onclick="app.closeModal(); setTimeout(() => app.handleDelete('event', '${event.id}'), 100);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                    Delete Event
                </button>
            </div>
        `;
        this.showModal('Event Actions', content, null);
        document.getElementById('modal-save').style.display = 'none';
    }

    // In-app confirmation for reset all tasks
    confirmResetAllTasks(eventId) {
        const content = `
            <div class="confirm-delete">
                <div class="confirm-icon warning">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <h3>Reset All Tasks?</h3>
                <p>This will mark all tasks as incomplete. This action cannot be undone.</p>
            </div>
        `;
        this.showModal('Confirm Reset', content, () => this.resetAllTasks(eventId));
        document.getElementById('modal-save').textContent = 'Reset Tasks';
        document.getElementById('modal-save').classList.add('btn-warning');
    }

    async duplicateEvent(eventId) {
        const event = this.data.events.find(e => e.id === eventId);
        if (!event) return;

        const newEvent = {
            ...event,
            name: `${event.name} (Copy)`,
            tasks: [] // Reset tasks for the copy
        };
        delete newEvent.id;

        try {
            await DatabaseService.addEvent(newEvent);
            await this.loadAllData();
            this.showToast('Event duplicated successfully', 'success');
            this.navigateTo('events');
        } catch (error) {
            console.error('Error duplicating event:', error);
            this.showToast('Error duplicating event', 'error');
        }
    }

    async markAllTasksComplete(eventId) {
        const event = this.data.events.find(e => e.id === eventId);
        if (!event) return;

        const templateTasks = this.getEventTemplateTasks(event.template || event.templateType);
        const tasks = templateTasks.map(task => ({
            name: task.name,
            completed: true,
            completedDate: new Date().toISOString()
        }));

        try {
            await DatabaseService.updateEvent(eventId, { tasks });
            event.tasks = tasks;
            this.renderEventDetails();
            this.showToast('All tasks marked as complete', 'success');
        } catch (error) {
            console.error('Error marking tasks complete:', error);
            this.showToast('Error updating tasks', 'error');
        }
    }

    async resetAllTasks(eventId) {
        const event = this.data.events.find(e => e.id === eventId);
        if (!event) return;

        try {
            this.closeModal();
            await DatabaseService.updateEvent(eventId, { tasks: [] });
            event.tasks = [];
            this.renderEventDetails();
            this.showToast('All tasks have been reset', 'success');
        } catch (error) {
            console.error('Error resetting tasks:', error);
            this.showToast('Error resetting tasks', 'error');
        }
    }

    async toggleEventTask(eventId, taskName, completed) {
        const event = this.data.events.find(e => e.id === eventId);
        if (!event) return;
        
        // Initialize tasks array if needed
        if (!event.tasks) {
            event.tasks = [];
        }
        
        // Find or create task entry
        let task = event.tasks.find(t => t.name === taskName);
        if (task) {
            task.completed = completed;
            task.completedDate = completed ? new Date().toISOString() : null;
        } else {
            event.tasks.push({
                name: taskName,
                completed: completed,
                completedDate: completed ? new Date().toISOString() : null
            });
        }
        
        // Update in database
        const result = await DatabaseService.updateEvent(eventId, { tasks: event.tasks });

        if (result.success) {
            // Log task completion/uncompletion
            const statusText = completed ? 'completed' : 'marked incomplete';
            this.logActivity('task', `Task "${taskName}" ${statusText} on ${event.name}`, { eventId, taskName });

            // Update UI - safely check for elements before manipulating
            const taskElement = document.querySelector(`[data-task-name="${taskName}"]`);
            const taskItem = taskElement?.closest('.task-item');

            if (taskItem) {
                if (completed) {
                    taskItem.classList.add('completed');
                    taskItem.classList.remove('overdue', 'due-today', 'due-soon');
                    const statusEl = taskItem.querySelector('.task-status');
                    if (statusEl) {
                        statusEl.innerHTML = '<span class="status-complete">✓</span>';
                    }
                } else {
                    taskItem.classList.remove('completed');
                    // Recalculate status would require more logic, so just refresh
                    this.showEventTasksModal(eventId);
                }
            }

            // Update summary counts - safely check for element
            const progressEl = document.querySelector('.tasks-progress');
            if (progressEl) {
                const completedCount = event.tasks.filter(t => t.completed).length;
                const totalCount = document.querySelectorAll('#event-tasks-list .task-item').length;
                progressEl.textContent = `${completedCount}/${totalCount} complete`;
            }
        }
    }

    async assignEventTask(eventId, taskName, staffIds) {
        const event = this.data.events.find(e => e.id === eventId);
        if (!event) return;

        // Normalize staffIds to array
        const assignedIds = Array.isArray(staffIds) ? staffIds : (staffIds ? [staffIds] : []);

        // Initialize tasks array if needed
        if (!event.tasks) {
            event.tasks = [];
        }

        // Find or create task entry
        let task = event.tasks.find(t => t.name === taskName);
        if (task) {
            task.assignedToIds = assignedIds;
            delete task.assignedTo; // Remove legacy field
        } else {
            event.tasks.push({
                name: taskName,
                completed: false,
                assignedToIds: assignedIds
            });
        }

        // Update in database
        const result = await DatabaseService.updateEvent(eventId, { tasks: event.tasks });

        if (result.success) {
            const count = assignedIds.length;
            this.showToast(count > 0 ? `Task assigned to ${count} staff member${count > 1 ? 's' : ''}` : 'Task unassigned', 'success');
        }
    }

    showEditGroupModal(id) {
        const group = this.data.groups.find(g => g.id === id);
        if (!group) return;

        const types = ['Ensemble', 'Choir', 'Band', 'Club', 'Crew', 'Group', 'Chamber'];
        const typeOptions = types.map(t =>
            `<option value="${t}" ${t === group.type ? 'selected' : ''}>${t}</option>`
        ).join('');

        const categories = ['Music', 'Drama', 'Dance', 'Kapa Haka', 'Pasifika'];
        const categoryOptions = categories.map(c =>
            `<option value="${c}" ${c === group.category ? 'selected' : ''}>${c}</option>`
        ).join('');

        // Get current leader IDs (handle both array and legacy string format)
        const currentLeaderIds = group.leaderIds || [];

        // Create staff checkboxes with current leaders checked
        const staffCheckboxes = this.data.tutors.map(t => {
            const isChecked = currentLeaderIds.includes(t.id) || group.leader === t.name;
            return `<label class="checkbox-label">
                <input type="checkbox" name="leaderIds" value="${t.id}" ${isChecked ? 'checked' : ''}>
                <span>${t.name}</span>
            </label>`;
        }).join('');

        const content = `
            <form id="edit-group-form" class="modal-form">
                <input type="hidden" name="id" value="${id}">
                <div class="form-row">
                    <div class="form-group" style="flex: 3;">
                        <label>Group Name</label>
                        <input type="text" name="name" value="${group.name || ''}" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>Header Color</label>
                        <input type="color" name="headerColor" value="${group.headerColor || '#c9a962'}" style="width: 100%; height: 38px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); cursor: pointer;">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Type</label>
                        <select name="type">
                            ${typeOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select name="category">
                            ${categoryOptions}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Meeting Time</label>
                    <input type="text" name="meetingTime" value="${group.meetingTime || ''}">
                </div>
                <div class="form-group">
                    <label>Group Leaders</label>
                    <div class="checkbox-group">
                        ${staffCheckboxes || '<span class="text-muted">No staff added yet.</span>'}
                    </div>
                    <small class="form-hint">Selected staff will be assigned as leaders</small>
                </div>
                <div class="form-group">
                    <label>Member Count</label>
                    <input type="number" name="memberCount" value="${group.memberCount || 0}" min="0">
                </div>
                <div class="modal-danger-zone" style="margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
                    <button type="button" class="btn btn-outline btn-danger-outline" onclick="app.confirmDeleteGroup('${id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                        Delete Group
                    </button>
                </div>
            </form>
        `;

        this.showModal('Edit Group', content, () => this.updateGroup());
    }

    confirmDeleteGroup(id) {
        const group = this.data.groups.find(g => g.id === id);
        if (!group) return;

        if (confirm(`Are you sure you want to delete "${group.name}"? This action cannot be undone.`)) {
            this.handleDelete('group', id);
            this.closeModal();
        }
    }

    async updateGroup() {
        const form = document.getElementById('edit-group-form');
        const formData = new FormData(form);
        const id = formData.get('id');

        // Get selected leader IDs from checkboxes
        const leaderIds = formData.getAll('leaderIds');
        const leaderNames = leaderIds.map(lid => {
            const tutor = this.data.tutors.find(t => t.id === lid);
            return tutor?.name;
        }).filter(Boolean);

        const group = {
            name: formData.get('name'),
            type: formData.get('type'),
            category: formData.get('category'),
            meetingTime: formData.get('meetingTime'),
            leaderIds: leaderIds,
            leader: leaderNames.join(', '),
            memberCount: parseInt(formData.get('memberCount')) || 0,
            headerColor: formData.get('headerColor') || '#c9a962'
        };

        const result = await DatabaseService.updateGroup(id, group);

        if (result.success) {
            // Update staff profiles to reflect group leadership
            await this.updateStaffGroupAssignments(id, leaderIds);

            this.showToast('Group updated successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error updating group', 'error');
        }
    }

    async updateStaffGroupAssignments(groupId, newLeaderIds) {
        // Update each staff member's groupIds based on whether they're assigned as leader
        for (const tutor of this.data.tutors) {
            const currentGroupIds = tutor.groupIds || [];
            const isCurrentlyInGroup = currentGroupIds.includes(groupId);
            const shouldBeInGroup = newLeaderIds.includes(tutor.id);

            if (shouldBeInGroup && !isCurrentlyInGroup) {
                // Add group to staff
                const updatedGroupIds = [...currentGroupIds, groupId];
                await DatabaseService.updateTutor(tutor.id, { groupIds: updatedGroupIds });
            } else if (!shouldBeInGroup && isCurrentlyInGroup) {
                // Remove group from staff
                const updatedGroupIds = currentGroupIds.filter(gid => gid !== groupId);
                await DatabaseService.updateTutor(tutor.id, { groupIds: updatedGroupIds });
            }
        }
    }

    showGroupMembersModal(groupId) {
        const group = this.data.groups.find(g => g.id === groupId);
        if (!group) return;
        
        // Get staff leading this group
        const groupStaff = this.data.tutors.filter(t => {
            const tutorGroupIds = t.groupIds || (t.groupId ? [t.groupId] : []);
            return tutorGroupIds.includes(groupId);
        });
        
        // Get students in this group (students with this groupId)
        const groupStudents = this.data.students.filter(s => 
            s.groupIds && s.groupIds.includes(groupId)
        );
        
        const staffList = groupStaff.length > 0
            ? groupStaff.map(s => `
                <div class="member-item staff">
                    <div class="member-avatar" style="background: ${s.color || '#8b5cf6'};">${s.initials}</div>
                    <div class="member-info">
                        <div class="member-name">${s.name}</div>
                        <div class="member-role">Staff Leader</div>
                    </div>
                </div>
            `).join('')
            : '<div class="no-members">No staff assigned</div>';
        
        const studentList = groupStudents.length > 0
            ? groupStudents.map(s => `
                <div class="member-item student">
                    <div class="member-avatar">${s.name.charAt(0)}</div>
                    <div class="member-info">
                        <div class="member-name">${s.name}</div>
                        <div class="member-role">Year ${s.year} · ${s.class}</div>
                    </div>
                </div>
            `).join('')
            : '<div class="no-members">No students in this group yet</div>';
        
        const content = `
            <div class="group-members-modal">
                <div class="members-section">
                    <h4>Staff Leaders</h4>
                    <div class="members-list">
                        ${staffList}
                    </div>
                </div>
                <div class="members-section">
                    <h4>Student Members (${groupStudents.length})</h4>
                    <div class="members-list">
                        ${studentList}
                    </div>
                </div>
                <div class="members-footer">
                    <p class="help-text">To add students to this group, edit the student's profile and assign them to groups.</p>
                </div>
            </div>
        `;
        
        this.showModal(`${group.name} Members`, content, null);
        document.getElementById('modal-save').style.display = 'none';
    }

    showGroupResponsesModal(groupId) {
        const group = this.data.groups.find(g => g.id === groupId);
        if (!group) return;

        const responses = group.responses || [];

        const responsesList = responses.length > 0
            ? responses.map((r, index) => `
                <div class="response-item">
                    <div class="response-header">
                        <strong>${r.studentName || 'Unknown Student'}</strong>
                        <span class="response-date">${r.submittedAt ? this.formatDate(r.submittedAt) : ''}</span>
                    </div>
                    <div class="response-details">
                        ${r.year ? `<span>Year ${r.year}</span>` : ''}
                        ${r.class ? `<span>${r.class}</span>` : ''}
                        ${r.email ? `<span>${r.email}</span>` : ''}
                    </div>
                    ${r.notes ? `<div class="response-notes">${r.notes}</div>` : ''}
                    <div class="response-actions">
                        <button class="btn btn-sm btn-outline" onclick="app.removeGroupResponse('${groupId}', ${index})">Remove</button>
                    </div>
                </div>
            `).join('')
            : '<div class="no-responses">No signups for this group yet.</div>';

        const content = `
            <div class="group-responses-modal">
                <div class="responses-summary">
                    <p><strong>${responses.length}</strong> total signups for ${group.name}</p>
                </div>
                <div class="responses-list">
                    ${responsesList}
                </div>
                <div class="responses-footer">
                    <button class="btn btn-outline" onclick="app.addGroupResponseManual('${groupId}')">
                        + Add Signup Manually
                    </button>
                </div>
            </div>
        `;

        this.showModal(`${group.name} - Signups`, content, null);
        document.getElementById('modal-save').style.display = 'none';
    }

    async removeGroupResponse(groupId, responseIndex) {
        if (!confirm('Remove this signup?')) return;

        const group = this.data.groups.find(g => g.id === groupId);
        if (!group || !group.responses) return;

        group.responses.splice(responseIndex, 1);
        const result = await DatabaseService.updateGroup(groupId, { responses: group.responses });

        if (result.success) {
            this.showToast('Signup removed', 'success');
            this.closeModal();
            this.renderGroups();
        } else {
            this.showToast('Error removing signup', 'error');
        }
    }

    addGroupResponseManual(groupId) {
        const group = this.data.groups.find(g => g.id === groupId);
        if (!group) return;

        const content = `
            <form id="add-group-response-form" class="modal-form">
                <input type="hidden" id="group-response-id" value="${groupId}">
                <div class="form-group">
                    <label>Student Name <span class="required">*</span></label>
                    <input type="text" id="response-student-name" required placeholder="Full name">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Year Level</label>
                        <select id="response-year">
                            ${[7, 8, 9, 10, 11, 12, 13].map(y => `<option value="${y}">Year ${y}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Class</label>
                        <input type="text" id="response-class" placeholder="e.g., 10A">
                    </div>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="response-email" placeholder="student@school.nz">
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="response-notes" rows="2" placeholder="Any additional notes..."></textarea>
                </div>
            </form>
        `;

        this.showModal(`Add Signup to ${group.name}`, content, () => this.saveGroupResponse());
    }

    async saveGroupResponse() {
        const groupId = document.getElementById('group-response-id').value;
        const studentName = document.getElementById('response-student-name').value.trim();
        const year = document.getElementById('response-year').value;
        const studentClass = document.getElementById('response-class').value.trim();
        const email = document.getElementById('response-email').value.trim();
        const notes = document.getElementById('response-notes').value.trim();

        if (!studentName) {
            this.showToast('Please enter student name', 'error');
            return;
        }

        const group = this.data.groups.find(g => g.id === groupId);
        if (!group) return;

        if (!group.responses) {
            group.responses = [];
        }

        group.responses.push({
            studentName,
            year,
            class: studentClass,
            email,
            notes,
            submittedAt: new Date().toISOString()
        });

        const result = await DatabaseService.updateGroup(groupId, { responses: group.responses });

        if (result.success) {
            this.showToast('Signup added successfully', 'success');
            this.closeModal();
            this.renderGroups();
        } else {
            this.showToast('Error adding signup', 'error');
        }
    }

    showEditInstrumentModal(id) {
        const instrument = this.data.instruments.find(i => i.id === id);
        if (!instrument) return;

        const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
        const conditionOptions = conditions.map(c => 
            `<option value="${c}" ${c === instrument.condition ? 'selected' : ''}>${c}</option>`
        ).join('');

        const statuses = ['Available', 'On Hire', 'Under Repair', 'Retired'];
        const statusOptions = statuses.map(s => 
            `<option value="${s}" ${s === instrument.status ? 'selected' : ''}>${s}</option>`
        ).join('');

        const content = `
            <form id="edit-instrument-form" class="modal-form">
                <input type="hidden" name="id" value="${id}">
                <div class="form-group">
                    <label>Instrument Name</label>
                    <input type="text" name="name" value="${instrument.name || ''}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Type</label>
                        <input type="text" name="type" value="${instrument.type || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Size</label>
                        <input type="text" name="size" value="${instrument.size || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Condition</label>
                        <select name="condition">
                            ${conditionOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select name="status">
                            ${statusOptions}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Serial Number</label>
                    <input type="text" name="serialNumber" value="${instrument.serialNumber || ''}">
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="notes" rows="3" placeholder="Add any notes about this instrument...">${instrument.notes || ''}</textarea>
                </div>
            </form>
        `;

        this.showModal('Edit Instrument', content, () => this.updateInstrument());
    }

    async updateInstrument() {
        const form = document.getElementById('edit-instrument-form');
        const formData = new FormData(form);
        const id = formData.get('id');
        
        const instrument = {
            name: formData.get('name'),
            type: formData.get('type'),
            size: formData.get('size'),
            condition: formData.get('condition'),
            status: formData.get('status'),
            serialNumber: formData.get('serialNumber'),
            notes: formData.get('notes')
        };
        
        const result = await DatabaseService.updateInstrument(id, instrument);
        
        if (result.success) {
            this.showToast('Instrument updated successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error updating instrument', 'error');
        }
    }

    showEditHireModal(id) {
        const hire = this.data.instrumentHires.find(h => h.id === id);
        if (!hire) return;

        const statuses = ['active', 'returned', 'overdue', 'due-soon'];
        const statusOptions = statuses.map(s =>
            `<option value="${s}" ${s === hire.status ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>`
        ).join('');

        // Show existing file info if present with delete button
        const existingFileHtml = hire.agreementFile ? `
            <div class="existing-file" id="existing-agreement-file">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <path d="M14 2v6h6M9 15l2 2 4-4"/>
                </svg>
                <span class="existing-file-name">${hire.agreementFile.fileName}</span>
                <span class="existing-file-date">Uploaded: ${this.formatDate(hire.agreementFile.uploadedAt)}</span>
                <button type="button" class="btn btn-danger btn-sm" onclick="app.markFileForDeletion('${id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                    Delete
                </button>
            </div>
            <input type="hidden" name="deleteExistingFile" id="delete-existing-file" value="false">
        ` : '';

        const content = `
            <form id="edit-hire-form" class="modal-form">
                <input type="hidden" name="id" value="${id}">
                <div class="form-group">
                    <label>Instrument</label>
                    <input type="text" value="${hire.instrumentName || 'Unknown'}" disabled>
                </div>
                <div class="form-group">
                    <label>Student Name</label>
                    <input type="text" name="studentName" value="${hire.studentName || ''}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Hire Date</label>
                        <input type="date" name="hireDate" value="${hire.hireDate || ''}">
                    </div>
                    <div class="form-group">
                        <label>Expected Return</label>
                        <input type="date" name="expectedReturn" value="${hire.expectedReturn || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        ${statusOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Hire Agreement</label>
                    ${existingFileHtml}
                    <div class="file-upload-area" id="agreement-upload-area">
                        <input type="file" name="agreementFile" id="agreement-file-input" accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                        <div class="file-upload-content" onclick="document.getElementById('agreement-file-input').click()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                            </svg>
                            <span class="file-upload-text">${hire.agreementFile ? 'Upload new agreement to replace' : 'Click to upload agreement'}</span>
                            <span class="file-upload-hint">PDF, JPG or PNG (max 5MB)</span>
                        </div>
                        <div class="file-selected" style="display: none;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <path d="M14 2v6h6M9 15l2 2 4-4"/>
                            </svg>
                            <span class="file-name"></span>
                            <button type="button" class="btn-icon remove-file" onclick="app.clearAgreementFile()">×</button>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="notes" rows="3" placeholder="Add any notes about this hire...">${hire.notes || ''}</textarea>
                </div>
            </form>
        `;

        this.showModal('Edit Hire Record', content, () => this.updateHire());

        // Attach file input change listener
        setTimeout(() => {
            const fileInput = document.getElementById('agreement-file-input');
            if (fileInput) {
                fileInput.addEventListener('change', (e) => this.handleAgreementFileSelect(e));
            }
        }, 100);
    }

    markFileForDeletion(hireId) {
        const fileEl = document.getElementById('existing-agreement-file');
        const deleteInput = document.getElementById('delete-existing-file');
        if (fileEl) {
            fileEl.style.display = 'none';
            fileEl.insertAdjacentHTML('afterend', `
                <div class="file-deleted-notice">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v4M12 16h.01"/>
                    </svg>
                    <span>File will be deleted on save</span>
                    <button type="button" class="btn btn-outline btn-sm" onclick="app.undoFileDelete()">Undo</button>
                </div>
            `);
        }
        if (deleteInput) {
            deleteInput.value = 'true';
        }
    }

    undoFileDelete() {
        const fileEl = document.getElementById('existing-agreement-file');
        const notice = document.querySelector('.file-deleted-notice');
        const deleteInput = document.getElementById('delete-existing-file');
        if (fileEl) fileEl.style.display = 'flex';
        if (notice) notice.remove();
        if (deleteInput) deleteInput.value = 'false';
    }

    async updateHire() {
        const form = document.getElementById('edit-hire-form');
        const formData = new FormData(form);
        const id = formData.get('id');
        const agreementFile = formData.get('agreementFile');
        const deleteExistingFile = formData.get('deleteExistingFile') === 'true';

        // Get existing hire data
        const existingHire = this.data.instrumentHires.find(h => h.id === id);

        // Handle file: delete, replace, or keep
        let agreementData = null;
        if (deleteExistingFile) {
            // User wants to delete the file
            agreementData = null;
        } else if (agreementFile && agreementFile.size > 0) {
            // New file uploaded
            agreementData = {
                fileName: agreementFile.name,
                fileSize: agreementFile.size,
                uploadedAt: new Date().toISOString()
            };
        } else {
            // Keep existing file
            agreementData = existingHire?.agreementFile || null;
        }

        const newStatus = formData.get('status');
        const hire = {
            studentName: formData.get('studentName'),
            hireDate: formData.get('hireDate'),
            expectedReturn: formData.get('expectedReturn'),
            status: newStatus,
            agreement: !!agreementData,
            agreementFile: agreementData,
            notes: formData.get('notes')
        };

        const result = await DatabaseService.update('instrumentHires', id, hire);

        if (result.success) {
            // Update instrument status based on hire status
            const instrumentId = existingHire?.instrumentId;
            if (instrumentId) {
                if (newStatus === 'returned' && existingHire?.status !== 'returned') {
                    await DatabaseService.updateInstrument(instrumentId, { status: 'Available' });
                } else if (newStatus === 'active' && existingHire?.status === 'returned') {
                    await DatabaseService.updateInstrument(instrumentId, { status: 'On Hire' });
                }
            }

            this.showToast('Hire record updated successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error updating hire record', 'error');
        }
    }

    async handleReturnHire(id) {
        const hire = this.data.instrumentHires.find(h => h.id === id);
        if (!hire) return;

        const result = await DatabaseService.update('instrumentHires', id, {
            status: 'returned',
            returnedDate: new Date().toISOString().split('T')[0]
        });

        if (result.success) {
            // Update instrument status to Available
            if (hire.instrumentId) {
                await DatabaseService.updateInstrument(hire.instrumentId, { status: 'Available' });
            }

            this.showToast('Instrument marked as returned', 'success');
            await this.loadAllData();
            this.renderHires(this.currentHiresFilter || 'active');
        } else {
            this.showToast('Error updating hire record', 'error');
        }
    }

    async handleDelete(type, id) {
        // Show confirmation modal instead of browser confirm
        const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
        
        const content = `
            <div class="confirm-delete">
                <div class="confirm-icon warning">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <h3>Delete ${typeLabel}?</h3>
                <p>This action cannot be undone. Are you sure you want to permanently delete this ${type}?</p>
            </div>
        `;
        
        this.showModal(`Delete ${typeLabel}`, content, () => this.confirmDelete(type, id));
        document.getElementById('modal-save').textContent = 'Delete';
        document.getElementById('modal-save').classList.add('btn-danger');
    }

    async confirmDelete(type, id) {
        const collectionMap = {
            lesson: 'lessons',
            student: 'students',
            tutor: 'tutors',
            event: 'events',
            request: 'lessonRequests',
            group: 'groups',
            instrument: 'instruments',
            hire: 'instrumentHires'
        };
        
        const result = await DatabaseService.delete(collectionMap[type], id);
        
        // Reset the save button
        document.getElementById('modal-save').textContent = 'Save';
        document.getElementById('modal-save').classList.remove('btn-danger');
        
        if (result.success) {
            this.closeModal();
            this.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`, 'success');
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error deleting item', 'error');
        }
    }

    async handleApproveRequest(id) {
        const request = this.data.lessonRequests.find(r => r.id === id);
        if (!request) return;
        
        // Find tutors who teach this instrument
        const matchingTutors = this.data.tutors.filter(t => 
            t.instruments && t.instruments.some(i => 
                i.toLowerCase().includes(request.instrument.toLowerCase()) ||
                request.instrument.toLowerCase().includes(i.toLowerCase())
            )
        );
        
        let tutorOptions = '';
        if (matchingTutors.length > 0) {
            tutorOptions = matchingTutors.map(t => 
                `<option value="${t.id}">${t.name} - ${t.instruments.join(', ')}</option>`
            ).join('');
        } else {
            // Show all tutors if no exact match
            tutorOptions = this.data.tutors.map(t => 
                `<option value="${t.id}">${t.name} - ${(t.instruments || []).join(', ')}</option>`
            ).join('');
        }
        
        const content = `
            <div class="approve-request-form">
                <div class="request-summary">
                    <div class="summary-row">
                        <span class="label">Student:</span>
                        <span class="value">${request.studentName}</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Year:</span>
                        <span class="value">${request.year}</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Instrument:</span>
                        <span class="value">${request.instrument}</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Parent Email:</span>
                        <span class="value">${request.parentEmail || 'Not provided'}</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Received:</span>
                        <span class="value">${this.formatDate(request.received)}</span>
                    </div>
                </div>
                <form id="approve-request-form" class="modal-form">
                    <input type="hidden" name="requestId" value="${id}">
                    <div class="form-group">
                        <label>Assign Tutor *</label>
                        <select name="tutorId" required>
                            <option value="">Select a tutor...</option>
                            ${tutorOptions}
                        </select>
                        ${matchingTutors.length > 0 ? 
                            `<small class="form-hint">Showing tutors who teach ${request.instrument}</small>` : 
                            `<small class="form-hint warning">No tutors found for ${request.instrument} - showing all tutors</small>`
                        }
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Lesson Day</label>
                            <select name="day">
                                <option value="">To be scheduled...</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Time</label>
                            <input type="text" name="time" placeholder="e.g., 9:00 AM">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label funded-checkbox">
                            <input type="checkbox" name="funded">
                            <span>Funded Lesson</span>
                            <small class="form-hint">Check this if the lesson is funded/subsidised</small>
                        </label>
                    </div>
                </form>
            </div>
        `;
        
        this.showModal('Approve Lesson Request', content, () => this.confirmApproveRequest());
        document.getElementById('modal-save').textContent = 'Approve & Create Lesson';
    }

    async confirmApproveRequest() {
        const form = document.getElementById('approve-request-form');
        const formData = new FormData(form);

        const requestId = formData.get('requestId');
        const tutorId = formData.get('tutorId');

        if (!tutorId) {
            this.showToast('Please select a tutor', 'error');
            return;
        }

        const request = this.data.lessonRequests.find(r => r.id === requestId);
        const tutor = this.data.tutors.find(t => t.id === tutorId);
        const isFunded = formData.get('funded') === 'on';

        // Create a new lesson with all relevant data from the request
        const lesson = {
            studentName: request.studentName.split(' (')[0], // Remove class from name
            tutorId: tutorId,
            tutorName: tutor.name,
            instrument: request.instrument,
            day: formData.get('day') || 'TBC',
            time: formData.get('time') || 'TBC',
            status: 'active',
            funded: isFunded,
            // Store parent contact from request
            parentEmail: request.parentEmail || '',
            parentPhone: request.parentPhone || '',
            parentName: request.parentName || ''
        };

        // Add the lesson
        const lessonResult = await DatabaseService.addLesson(lesson);

        if (lessonResult.success) {
            // Delete the request (remove from list) instead of just changing status
            await DatabaseService.deleteLessonRequest(requestId);

            // Send notification email to tutor if they have notifications enabled
            if (tutor.lessonNotifications && tutor.email) {
                try {
                    await EmailService.sendLessonNotification(lesson, tutor, { name: request.studentName });
                    this.showToast('Request approved, lesson created, and tutor notified!', 'success');
                } catch (emailError) {
                    console.error('Error sending notification:', emailError);
                    this.showToast('Request approved and lesson created! (Email notification failed)', 'success');
                }
            } else {
                this.showToast('Request approved and lesson created!', 'success');
            }

            // Log activity
            await this.logActivity('lesson', `Approved lesson request: ${request.studentName} - ${request.instrument}`);

            document.getElementById('modal-save').textContent = 'Save';
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error creating lesson', 'error');
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

    showViewRequestModal(id) {
        const request = this.data.lessonRequests.find(r => r.id === id);
        if (!request) return;

        // Build detail rows for all available data
        const detailRows = [];

        // Student Details
        if (request.studentName) detailRows.push({ label: 'Student Name', value: request.studentName });
        if (request.studentEmail) detailRows.push({ label: 'Student Email', value: request.studentEmail });
        if (request.year || request.yearLevel) detailRows.push({ label: 'Year Level', value: request.year || request.yearLevel });

        // Parent Details
        if (request.parentName) detailRows.push({ label: 'Parent/Guardian Name', value: request.parentName });
        if (request.parentEmail) detailRows.push({ label: 'Parent Email', value: request.parentEmail });
        if (request.parentPhone) detailRows.push({ label: 'Parent Phone', value: request.parentPhone });

        // Lesson Details
        if (request.instrument) detailRows.push({ label: 'Instrument', value: request.instrument });
        if (request.lessonType) detailRows.push({ label: 'Lesson Type', value: request.lessonType === 'funded' ? 'Funded (subsidised)' : 'Private' });
        if (request.fundedRequested !== undefined) detailRows.push({ label: 'Funded Requested', value: request.fundedRequested ? 'Yes' : 'No' });
        if (request.tutorPreference) detailRows.push({ label: 'Tutor Preference', value: request.tutorPreference });
        if (request.styles && request.styles.length > 0) detailRows.push({ label: 'Style Preference', value: request.styles.join(', ') });

        // Experience
        if (request.experience) detailRows.push({ label: 'Experience', value: request.experience });
        if (request.otherInstruments) detailRows.push({ label: 'Other Instruments', value: request.otherInstruments });

        // Meta
        if (request.notes) detailRows.push({ label: 'Notes', value: request.notes });
        if (request.source) detailRows.push({ label: 'Form Source', value: request.source });
        if (request.received || request.submittedAt) detailRows.push({ label: 'Date Received', value: this.formatDate(request.received || request.submittedAt) });
        detailRows.push({ label: 'Status', value: `<span class="status-badge status-${request.status === 'awaiting' || request.status === 'pending' ? 'pending' : request.status}">${request.status}</span>` });

        const detailsHtml = detailRows.map(row => `
            <div class="detail-row">
                <span class="detail-label">${row.label}</span>
                <span class="detail-value">${row.value}</span>
            </div>
        `).join('');

        const content = `
            <div class="request-details-view">
                <style>
                    .request-details-view .detail-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 0.75rem 0;
                        border-bottom: 1px solid var(--color-border);
                    }
                    .request-details-view .detail-row:last-child {
                        border-bottom: none;
                    }
                    .request-details-view .detail-label {
                        color: var(--color-text-secondary);
                        font-size: 0.9rem;
                    }
                    .request-details-view .detail-value {
                        color: var(--color-text-primary);
                        font-weight: 500;
                        text-align: right;
                        max-width: 60%;
                    }
                </style>
                ${detailsHtml}
            </div>
        `;

        this.showModal('Lesson Request Details', content, null);
        document.getElementById('modal-save').style.display = 'none';
    }

    showEditRequestModal(id) {
        const request = this.data.lessonRequests.find(r => r.id === id);
        if (!request) return;

        const statusOptions = ['awaiting', 'waitlist'].map(s =>
            `<option value="${s}" ${s === request.status ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`
        ).join('');

        const content = `
            <form id="edit-request-form" class="modal-form">
                <input type="hidden" name="requestId" value="${request.id}">
                <div class="form-group">
                    <label>Student Name</label>
                    <input type="text" name="studentName" value="${request.studentName || ''}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Year Level</label>
                        <input type="number" name="year" value="${request.year || ''}" min="0" max="13">
                    </div>
                    <div class="form-group">
                        <label>Instrument</label>
                        <input type="text" name="instrument" value="${request.instrument || ''}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Parent Email</label>
                    <input type="email" name="parentEmail" value="${request.parentEmail || ''}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Status</label>
                        <select name="status">
                            ${statusOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Discipline</label>
                        <select name="discipline">
                            <option value="Music" ${request.discipline === 'Music' ? 'selected' : ''}>Music</option>
                            <option value="Drama" ${request.discipline === 'Drama' ? 'selected' : ''}>Drama</option>
                            <option value="Dance" ${request.discipline === 'Dance' ? 'selected' : ''}>Dance</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="notes" rows="3">${request.notes || ''}</textarea>
                </div>
            </form>
        `;

        this.showModal('Edit Lesson Request', content, () => this.saveEditRequest());
    }

    async saveEditRequest() {
        const form = document.getElementById('edit-request-form');
        const formData = new FormData(form);

        const requestId = formData.get('requestId');
        const updates = {
            studentName: formData.get('studentName'),
            year: parseInt(formData.get('year')) || null,
            instrument: formData.get('instrument'),
            parentEmail: formData.get('parentEmail'),
            status: formData.get('status'),
            discipline: formData.get('discipline'),
            notes: formData.get('notes')
        };

        const result = await DatabaseService.updateLessonRequest(requestId, updates);

        if (result.success) {
            this.closeModal();
            this.showToast('Request updated successfully!', 'success');
            await this.loadAllData();
            this.renderRequests();
            this.renderRecentRequests();
        } else {
            this.showToast('Error updating request', 'error');
        }
    }

    // ========================================
    // Modal Displays
    // ========================================

    showModal(title, content, onSave = null) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal-overlay').classList.add('visible');

        // Ensure modal footer is always visible
        const modalFooter = document.getElementById('modal-footer');
        if (modalFooter) {
            modalFooter.style.display = 'flex';
        }

        // Ensure cancel button is visible
        const cancelBtn = document.getElementById('modal-cancel');
        if (cancelBtn) {
            cancelBtn.style.display = 'inline-flex';
        }

        const saveBtn = document.getElementById('modal-save');
        // Reset button state to defaults
        saveBtn.textContent = 'Save';
        saveBtn.classList.remove('btn-warning', 'btn-danger');
        saveBtn.disabled = false;
        saveBtn.style.opacity = '1';

        if (onSave) {
            saveBtn.style.display = 'inline-flex';
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
                <div class="form-group">
                    <label class="checkbox-label funded-checkbox">
                        <input type="checkbox" name="funded">
                        <span>Funded Lesson</span>
                        <small class="form-hint">Check this if the lesson is funded/subsidised</small>
                    </label>
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
            status: 'active',
            funded: formData.get('funded') === 'on'
        };
        
        const result = await DatabaseService.addLesson(lesson);

        if (result.success) {
            const student = this.data.students.find(s => s.id === lesson.studentId);
            const tutor = this.data.tutors.find(t => t.id === lesson.tutorId);
            this.logActivity('lesson', `New lesson created for ${student?.name || 'Unknown'} with ${tutor?.name || 'No tutor'}`, { lessonId: result.id });

            // Send notification to tutor if notifications enabled
            if (tutor?.lessonNotifications && tutor?.email) {
                await this.sendTutorLessonNotification(tutor, student, lesson, result.id);
            }

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
        
        // Group checkboxes
        const groupCheckboxes = this.data.groups.map(g => 
            `<label class="checkbox-label">
                <input type="checkbox" name="groups" value="${g.id}">
                <span>${g.name}</span>
            </label>`
        ).join('');
        
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
                    <label>Performing Arts Groups</label>
                    <div class="checkbox-group">
                        ${groupCheckboxes || '<span class="text-muted">No groups created yet</span>'}
                    </div>
                    <small class="form-hint">Select the groups this student is a member of</small>
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
        
        // Get selected groups
        const groupCheckboxes = form.querySelectorAll('input[name="groups"]:checked');
        const groupIds = Array.from(groupCheckboxes).map(cb => cb.value);
        
        const student = {
            name: formData.get('name'),
            year: parseInt(formData.get('year')),
            class: formData.get('class'),
            instruments: formData.get('instruments').split(',').map(i => i.trim()).filter(i => i),
            tutorId: formData.get('tutorId') || null,
            groupIds: groupIds,
            parentEmail: formData.get('parentEmail'),
            status: formData.get('tutorId') ? 'assigned' : 'waiting'
        };
        
        const result = await DatabaseService.addStudent(student);

        if (result.success) {
            this.logActivity('student', `New student added: ${student.name}`, { studentId: result.id });
            this.showToast('Student added successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error adding student', 'error');
        }
    }

    showAddEventModal() {
        // Get categories from settings or use defaults
        const categories = this.data.settings?.categories || this.getDefaultCategories();
        const categoryOptions = categories.map(c =>
            `<option value="${c.name}">${c.name}</option>`
        ).join('');

        // Groups checkboxes
        const groupCheckboxes = this.data.groups.map(g =>
            `<label class="checkbox-label">
                <input type="checkbox" name="groups" value="${g.id}">
                <span>${g.name}</span>
            </label>`
        ).join('');

        // Staff checkboxes
        const staffCheckboxes = this.data.tutors.map(t =>
            `<label class="checkbox-label">
                <input type="checkbox" name="staff" value="${t.id}">
                <span>${t.name}</span>
            </label>`
        ).join('');

        // Build template options including custom templates
        const customTemplates = this.data.templates || [];
        const templateOptions = `
            <optgroup label="Built-in Templates">
                <option value="school-during">School (During Hours)</option>
                <option value="school-after">School (After Hours)</option>
                <option value="offsite-during">Offsite (During Hours)</option>
                <option value="offsite-after">Offsite (After Hours)</option>
            </optgroup>
            ${customTemplates.length > 0 ? `
                <optgroup label="Custom Templates">
                    ${customTemplates.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </optgroup>
            ` : ''}
        `;

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
                        <input type="date" name="date" id="add-event-date" required>
                    </div>
                    <div class="form-group">
                        <label>Time</label>
                        <input type="text" name="time" placeholder="e.g. 7:00 PM">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" name="location" placeholder="e.g. Main Hall">
                    </div>
                    <div class="form-group">
                        <label>Term <small>(auto-calculated from date)</small></label>
                        <input type="text" name="term" id="add-event-term" value="Term 1" readonly style="background: var(--color-bg-tertiary); cursor: not-allowed;">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Category</label>
                        <select name="category">
                            ${categoryOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Template</label>
                        <select name="template">
                            ${templateOptions}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Performing Groups</label>
                    <div class="checkbox-group">
                        ${groupCheckboxes || '<span class="text-muted">No groups created yet</span>'}
                    </div>
                    <small class="form-hint">Select the groups performing at this event</small>
                </div>
                <div class="form-group">
                    <label>Staff Involved</label>
                    <div class="checkbox-group">
                        ${staffCheckboxes || '<span class="text-muted">No staff added yet</span>'}
                    </div>
                    <small class="form-hint">These staff will receive task notifications</small>
                </div>
            </form>
        `;

        this.showModal('Create New Event', content, () => this.saveEvent());

        // Add date change listener to auto-update term
        setTimeout(() => {
            const dateInput = document.getElementById('add-event-date');
            const termInput = document.getElementById('add-event-term');
            if (dateInput && termInput) {
                dateInput.addEventListener('change', () => {
                    const term = this.getTermFromDate(dateInput.value);
                    termInput.value = term;
                });
            }
        }, 100);
    }

    async saveEvent() {
        const form = document.getElementById('add-event-form');
        const formData = new FormData(form);
        
        // Get selected groups
        const groupCheckboxes = form.querySelectorAll('input[name="groups"]:checked');
        const groupIds = Array.from(groupCheckboxes).map(cb => cb.value);
        
        // Get selected staff
        const staffCheckboxes = form.querySelectorAll('input[name="staff"]:checked');
        const staffIds = Array.from(staffCheckboxes).map(cb => cb.value);
        
        const event = {
            name: formData.get('name'),
            description: formData.get('description'),
            date: formData.get('date'),
            time: formData.get('time'),
            location: formData.get('location'),
            term: formData.get('term'),
            category: formData.get('category'),
            template: formData.get('template'),
            groupIds: groupIds,
            staffIds: staffIds,
            status: 'upcoming',
            tasks: [] // Initialize empty tasks array
        };
        
        const result = await DatabaseService.addEvent(event);

        if (result.success) {
            this.logActivity('event', `New event created: ${event.name}`, { eventId: result.id, date: event.date });
            this.showToast('Event created successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error creating event', 'error');
        }
    }

    showAddTutorModal() {
        const groupCheckboxes = this.data.groups.map(g => 
            `<label class="checkbox-label">
                <input type="checkbox" name="groups" value="${g.id}">
                <span>${g.name}</span>
            </label>`
        ).join('');
        
        const content = `
            <form id="add-tutor-form" class="modal-form">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" name="name" placeholder="Full name" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" placeholder="staff@email.com">
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" placeholder="021 123 4567">
                    </div>
                </div>
                <div class="form-group">
                    <label>Instruments Taught (comma separated)</label>
                    <input type="text" name="instruments" placeholder="e.g., Guitar, Bass, Ukulele">
                    <small class="form-hint">Leave blank if not a music tutor</small>
                </div>
                <div class="form-group">
                    <label>Groups Led</label>
                    <div class="checkbox-group">
                        ${groupCheckboxes || '<span class="text-muted">No groups created yet</span>'}
                    </div>
                    <small class="form-hint">Select groups this person leads</small>
                </div>
            </form>
        `;
        
        this.showModal('Add Staff Member', content, () => this.saveTutor());
    }

    async saveTutor() {
        const form = document.getElementById('add-tutor-form');
        const formData = new FormData(form);
        
        const name = formData.get('name');
        const initials = name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
        const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#22c55e', '#3b82f6'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Get all checked groups
        const groupIds = formData.getAll('groups');
        
        const tutor = {
            name: name,
            initials: initials,
            email: formData.get('email'),
            phone: formData.get('phone'),
            instruments: (formData.get('instruments') || '').split(',').map(i => i.trim()).filter(i => i),
            groupIds: groupIds,
            color: color,
            active: true
        };
        
        const result = await DatabaseService.addTutor(tutor);
        
        if (result.success) {
            // Update groups with this leader
            for (const groupId of groupIds) {
                await DatabaseService.updateGroup(groupId, { leader: name });
            }

            this.logActivity('staff', `New staff member added: ${name}`, { staffId: result.id });
            this.showToast('Staff member added successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error adding staff member', 'error');
        }
    }

    showAddGroupModal() {
        // Create staff checkboxes for leader selection
        const staffCheckboxes = this.data.tutors.map(t =>
            `<label class="checkbox-label">
                <input type="checkbox" name="leaderIds" value="${t.id}">
                <span>${t.name}</span>
            </label>`
        ).join('');

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
                    <label>Group Leaders</label>
                    <div class="checkbox-group">
                        ${staffCheckboxes || '<span class="text-muted">No staff added yet. Add staff first.</span>'}
                    </div>
                    <small class="form-hint">Selected staff will be assigned as leaders of this group</small>
                </div>
            </form>
        `;

        this.showModal('Create New Group', content, () => this.saveGroup());
    }

    async saveGroup() {
        const form = document.getElementById('add-group-form');
        const formData = new FormData(form);

        // Get selected leader IDs from checkboxes
        const leaderIds = formData.getAll('leaderIds');
        const leaderNames = leaderIds.map(lid => {
            const tutor = this.data.tutors.find(t => t.id === lid);
            return tutor?.name;
        }).filter(Boolean);

        const group = {
            name: formData.get('name'),
            type: formData.get('type'),
            category: formData.get('category'),
            meetingTime: formData.get('meetingTime'),
            leaderIds: leaderIds,
            leader: leaderNames.join(', '),
            memberCount: 0
        };

        const result = await DatabaseService.addGroup(group);

        if (result.success) {
            // Update staff profiles to reflect group leadership
            await this.updateStaffGroupAssignments(result.id, leaderIds);

            this.logActivity('group', `New group created: ${group.name}`, { groupId: result.id });
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
                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="notes" rows="3" placeholder="Add any notes about this instrument..."></textarea>
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
            notes: formData.get('notes'),
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
                <div class="form-group">
                    <label>Hire Agreement</label>
                    <div class="file-upload-area" id="agreement-upload-area">
                        <input type="file" name="agreementFile" id="agreement-file-input" accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                        <div class="file-upload-content" onclick="document.getElementById('agreement-file-input').click()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                            </svg>
                            <span class="file-upload-text">Click to upload agreement</span>
                            <span class="file-upload-hint">PDF, JPG or PNG (max 5MB)</span>
                        </div>
                        <div class="file-selected" style="display: none;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <path d="M14 2v6h6M9 15l2 2 4-4"/>
                            </svg>
                            <span class="file-name"></span>
                            <button type="button" class="btn-icon remove-file" onclick="app.clearAgreementFile()">×</button>
                        </div>
                    </div>
                    <small class="form-hint">Upload signed hire agreement document</small>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="notes" rows="3" placeholder="Add any notes about this hire..."></textarea>
                </div>
            </form>
        `;

        this.showModal('New Instrument Hire', content, () => this.saveHire());

        // Attach file input change listener
        setTimeout(() => {
            const fileInput = document.getElementById('agreement-file-input');
            if (fileInput) {
                fileInput.addEventListener('change', (e) => this.handleAgreementFileSelect(e));
            }
        }, 100);
    }

    handleAgreementFileSelect(e) {
        const file = e.target.files[0];
        const uploadArea = document.getElementById('agreement-upload-area');
        if (!uploadArea) return;

        const uploadContent = uploadArea.querySelector('.file-upload-content');
        const fileSelected = uploadArea.querySelector('.file-selected');
        const fileName = uploadArea.querySelector('.file-name');

        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                this.showToast('File size must be less than 5MB', 'error');
                e.target.value = '';
                return;
            }
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                this.showToast('Please upload a PDF, JPG or PNG file', 'error');
                e.target.value = '';
                return;
            }
            uploadContent.style.display = 'none';
            fileSelected.style.display = 'flex';
            fileName.textContent = file.name;
        } else {
            uploadContent.style.display = 'flex';
            fileSelected.style.display = 'none';
        }
    }

    clearAgreementFile() {
        const fileInput = document.getElementById('agreement-file-input');
        const uploadArea = document.getElementById('agreement-upload-area');
        if (fileInput) fileInput.value = '';
        if (uploadArea) {
            uploadArea.querySelector('.file-upload-content').style.display = 'flex';
            uploadArea.querySelector('.file-selected').style.display = 'none';
        }
    }

    async saveHire() {
        const form = document.getElementById('add-hire-form');
        const formData = new FormData(form);

        const instrumentId = formData.get('instrumentId');
        const instrument = this.data.instruments.find(i => i.id === instrumentId);
        const agreementFile = formData.get('agreementFile');

        // Handle file upload if present
        let agreementData = null;
        if (agreementFile && agreementFile.size > 0) {
            agreementData = {
                fileName: agreementFile.name,
                fileSize: agreementFile.size,
                uploadedAt: new Date().toISOString()
            };
        }

        const hire = {
            instrumentId: instrumentId,
            instrumentName: instrument?.name || 'Unknown',
            studentName: formData.get('studentName'),
            hireDate: formData.get('hireDate'),
            expectedReturn: formData.get('expectedReturn'),
            agreement: !!agreementData,
            agreementFile: agreementData,
            notes: formData.get('notes'),
            status: 'active'
        };

        const result = await DatabaseService.addInstrumentHire(hire);

        if (result.success) {
            // Update instrument status
            await DatabaseService.updateInstrument(instrumentId, { status: 'On Hire' });

            this.showToast(agreementData ? 'Hire recorded with agreement!' : 'Hire recorded successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error recording hire', 'error');
        }
    }

    showAddFormModal() {
        const content = `
            <form id="add-form-form" class="modal-form">
                <div class="form-group">
                    <label>Form Name</label>
                    <input type="text" name="name" placeholder="e.g., Music Tuition Signups 2026" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" placeholder="What is this form for?" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Available Instruments</label>
                    <input type="text" name="instruments" placeholder="Guitar, Piano, Drums (comma-separated)">
                </div>
            </form>
        `;
        
        this.showModal('Create Signup Form', content, () => this.saveForm());
    }

    async saveForm() {
        const form = document.getElementById('add-form-form');
        const formData = new FormData(form);
        
        const signupForm = {
            name: formData.get('name'),
            description: formData.get('description'),
            status: formData.get('status'),
            instruments: formData.get('instruments').split(',').map(i => i.trim()).filter(i => i),
            responses: 0,
            createdAt: new Date().toISOString()
        };
        
        const result = await DatabaseService.addForm(signupForm);
        
        if (result.success) {
            this.showToast('Form created successfully!', 'success');
            this.closeModal();
            await this.loadAllData();
            this.renderCurrentPage();
        } else {
            this.showToast('Error creating form', 'error');
        }
    }

    showTemplateModal(templateId) {
        // First check built-in templates
        let template = EventTemplates[templateId];
        
        // If not found in built-in, check custom templates from database
        if (!template) {
            const customTemplate = this.data.templates?.find(t => t.id === templateId);
            if (customTemplate) {
                template = customTemplate;
            }
        }
        
        if (!template) {
            this.showToast('Template not found', 'error');
            return;
        }
        
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
        const content = `
            <div class="confirm-delete">
                <div class="confirm-icon warning">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
                <h3>Load Demo Data?</h3>
                <p>This will add sample students, tutors, lessons, events, and instruments to your database.</p>
            </div>
        `;

        this.showModal('Load Demo Data', content, async () => {
            this.closeModal();
            this.showLoading(true);

            try {
                // Use DummyData from dummyData.js
                const result = await DatabaseService.importAllData(DummyData);

                // Also save settings separately since it's not an array
                if (DummyData.settings) {
                    await DatabaseService.updateSettings(DummyData.settings);
                }

                if (result.success) {
                    this.showToast(`Demo data loaded! (${result.count} records)`, 'success');
                    await this.loadAllData();
                    this.renderCurrentPage();
                } else {
                    this.showToast('Error loading demo data: ' + (result.error || 'Unknown error'), 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                this.showToast('Error loading demo data: ' + error.message, 'error');
            }

            this.showLoading(false);
        });

        document.getElementById('modal-save').textContent = 'Load Data';
    }

    showWipeDataModal() {
        const dataOptions = [
            { value: 'all', label: 'All Data', description: 'Delete everything' },
            { value: 'students', label: 'Students', description: 'Student records' },
            { value: 'tutors', label: 'Staff/Tutors', description: 'Staff and tutor records' },
            { value: 'lessons', label: 'Lessons', description: 'All lesson schedules' },
            { value: 'lessonRequests', label: 'Lesson Requests', description: 'Pending requests' },
            { value: 'events', label: 'Events', description: 'All events' },
            { value: 'groups', label: 'Groups', description: 'Performing arts groups' },
            { value: 'instruments', label: 'Instruments', description: 'Instrument inventory' },
            { value: 'instrumentHires', label: 'Instrument Hires', description: 'Hire agreements' },
            { value: 'forms', label: 'Forms', description: 'Custom signup forms' },
            { value: 'activities', label: 'Activity Log', description: 'Recent activity history' }
        ];

        const optionsHtml = dataOptions.map(opt => `
            <label class="checkbox-label" style="display: flex; align-items: center; padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--color-border);">
                <input type="checkbox" name="wipe-section" value="${opt.value}" ${opt.value === 'all' ? 'onchange="app.toggleWipeAll(this)"' : ''}>
                <span style="flex: 1; margin-left: var(--spacing-sm);">
                    <strong>${opt.label}</strong>
                    <small style="display: block; color: var(--color-text-muted);">${opt.description}</small>
                </span>
            </label>
        `).join('');

        const content = `
            <div class="confirm-delete">
                <div class="confirm-icon danger">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                </div>
                <h3>Wipe Data</h3>
                <p>Select which data to permanently delete. This action cannot be undone!</p>
                <div class="wipe-options" style="margin: var(--spacing-md) 0; max-height: 300px; overflow-y: auto;">
                    ${optionsHtml}
                </div>
                <div class="form-group" style="margin-top: var(--spacing-lg);">
                    <label>Enter password to confirm:</label>
                    <input type="password" id="wipe-password" placeholder="Enter admin password">
                </div>
            </div>
        `;

        this.showModal('Wipe Data', content, () => this.confirmWipeData());
        document.getElementById('modal-save').textContent = 'Wipe Selected';
        document.getElementById('modal-save').classList.add('btn-danger');
    }

    toggleWipeAll(checkbox) {
        const allCheckboxes = document.querySelectorAll('input[name="wipe-section"]');
        allCheckboxes.forEach(cb => {
            if (cb.value !== 'all') {
                cb.checked = checkbox.checked;
                cb.disabled = checkbox.checked;
            }
        });
    }

    async confirmWipeData() {
        const password = document.getElementById('wipe-password').value;
        const adminPassword = 'MGSArts2026!'; // Admin password for wiping data

        if (password !== adminPassword) {
            this.showToast('Incorrect password', 'error');
            return;
        }

        const selectedCheckboxes = document.querySelectorAll('input[name="wipe-section"]:checked');
        const selectedValues = Array.from(selectedCheckboxes).map(cb => cb.value);

        if (selectedValues.length === 0) {
            this.showToast('Please select data to wipe', 'error');
            return;
        }

        this.closeModal();
        this.showLoading(true);

        try {
            let collections = [];
            if (selectedValues.includes('all')) {
                collections = ['students', 'tutors', 'lessons', 'events', 'groups', 'instruments', 'instrumentHires', 'lessonRequests', 'forms', 'users', 'templates', 'activities'];
            } else {
                collections = selectedValues;
            }

            let totalDeleted = 0;
            for (const collectionName of collections) {
                const result = await DatabaseService.clearCollection(collectionName);
                if (result.success) {
                    totalDeleted += result.count || 0;
                }
            }

            this.showToast(`Data wiped! (${totalDeleted} records deleted)`, 'success');
            await this.loadAllData();
            this.renderCurrentPage();
        } catch (error) {
            console.error('Error wiping data:', error);
            this.showToast('Error wiping data: ' + error.message, 'error');
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

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Store the file for later processing
        this.pendingImportFile = file;

        const content = `
            <div class="confirm-delete">
                <div class="confirm-icon warning">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                </div>
                <h3>Import Data?</h3>
                <p>This will import data from <strong>${file.name}</strong>. Existing records may be updated.</p>
            </div>
        `;

        this.showModal('Import Data', content, () => this.confirmImportData());
        document.getElementById('modal-save').textContent = 'Import';

        // Reset the file input
        e.target.value = '';
    }

    async confirmImportData() {
        const file = this.pendingImportFile;
        if (!file) {
            this.closeModal();
            return;
        }

        this.closeModal();
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
    // CSV Import/Export
    // ========================================

    showExportModal() {
        const dataTypes = [
            { value: 'students', label: 'Students' },
            { value: 'tutors', label: 'Staff/Tutors' },
            { value: 'lessons', label: 'Lesson List' },
            { value: 'lessonRequests', label: 'Lesson Requests' },
            { value: 'events', label: 'Upcoming Events' },
            { value: 'groups', label: 'Performing Arts Groups' },
            { value: 'instruments', label: 'Instrument List' },
            { value: 'instrumentHires', label: 'Instrument Hire' }
        ];

        const typeOptions = dataTypes.map(t =>
            `<option value="${t.value}">${t.label}</option>`
        ).join('');

        const content = `
            <form id="export-form" class="modal-form">
                <div class="form-group">
                    <label>Data Type</label>
                    <select id="export-type">
                        <option value="all">All Data (JSON)</option>
                        ${typeOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Format</label>
                    <select id="export-format">
                        <option value="csv">CSV (Spreadsheet)</option>
                        <option value="json">JSON</option>
                    </select>
                </div>
                <p class="help-text" style="margin-top: var(--spacing-md);">
                    CSV format can be opened in Excel, Google Sheets, or any spreadsheet application.
                </p>
            </form>
        `;

        this.showModal('Export Data', content, () => this.performExport());
        document.getElementById('modal-save').textContent = 'Export';

        // Handle type change to update format options
        setTimeout(() => {
            const typeSelect = document.getElementById('export-type');
            const formatSelect = document.getElementById('export-format');
            typeSelect.addEventListener('change', () => {
                if (typeSelect.value === 'all') {
                    formatSelect.value = 'json';
                    formatSelect.disabled = true;
                } else {
                    formatSelect.disabled = false;
                }
            });
        }, 100);
    }

    async performExport() {
        const type = document.getElementById('export-type').value;
        const format = document.getElementById('export-format').value;

        this.closeModal();
        this.showLoading(true);

        try {
            if (type === 'all') {
                await this.exportData();
            } else if (format === 'csv') {
                await this.exportAsCSV(type);
            } else {
                await this.exportTypeAsJSON(type);
            }
        } catch (error) {
            console.error('Export error:', error);
            this.showToast('Error exporting data', 'error');
        }

        this.showLoading(false);
    }

    async exportAsCSV(type) {
        const data = this.data[type] || [];
        if (data.length === 0) {
            this.showToast('No data to export', 'info');
            return;
        }

        // Get headers from first item
        const headers = Object.keys(data[0]).filter(h => h !== 'id' && h !== 'createdAt' && h !== 'updatedAt');

        // Build CSV content
        const csvRows = [];
        csvRows.push(headers.join(','));

        for (const item of data) {
            const values = headers.map(h => {
                let val = item[h];
                if (val === null || val === undefined) val = '';
                if (Array.isArray(val)) val = val.join('; ');
                if (typeof val === 'object') val = JSON.stringify(val);
                // Escape quotes and wrap in quotes if contains comma or quote
                val = String(val).replace(/"/g, '""');
                if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                    val = `"${val}"`;
                }
                return val;
            });
            csvRows.push(values.join(','));
        }

        const csv = csvRows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mgs-${type}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('CSV exported successfully!', 'success');
    }

    async exportTypeAsJSON(type) {
        const data = this.data[type] || [];
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mgs-${type}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('JSON exported successfully!', 'success');
    }

    showCSVImportModal() {
        const dataTypes = [
            { value: 'students', label: 'Students', fields: ['name', 'class', 'year', 'email', 'parentEmail', 'instrument'] },
            { value: 'tutors', label: 'Staff/Tutors', fields: ['name', 'email', 'phone', 'instruments', 'role'] },
            { value: 'lessons', label: 'Lesson List', fields: ['studentName', 'tutorName', 'instrument', 'day', 'time', 'location', 'type'] },
            { value: 'lessonRequests', label: 'Lesson Requests', fields: ['studentName', 'instrument', 'parentEmail', 'notes', 'status', 'preferredDay'] },
            { value: 'events', label: 'Upcoming Events', fields: ['name', 'date', 'time', 'location', 'category', 'term', 'description'] },
            { value: 'groups', label: 'Performing Arts Groups', fields: ['name', 'type', 'category', 'meetingDay', 'meetingTime', 'location', 'description'] },
            { value: 'instruments', label: 'Instrument List', fields: ['name', 'type', 'brand', 'serialNumber', 'condition', 'location'] },
            { value: 'instrumentHires', label: 'Instrument Hire', fields: ['studentName', 'instrumentName', 'startDate', 'status', 'notes', 'hireType'] }
        ];

        const typeOptions = dataTypes.map(t =>
            `<option value="${t.value}" data-fields="${t.fields.join(',')}">${t.label}</option>`
        ).join('');

        const content = `
            <form id="csv-import-form" class="modal-form">
                <div class="form-group">
                    <label>Data Type to Import</label>
                    <select id="csv-import-type">
                        ${typeOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>CSV File</label>
                    <input type="file" id="csv-import-file" accept=".csv" class="form-control">
                </div>
                <div id="csv-mapping-section" style="display: none;">
                    <h4 style="margin: var(--spacing-lg) 0 var(--spacing-md);">Column Mapping</h4>
                    <p class="help-text" style="margin-bottom: var(--spacing-md);">Map your CSV columns to the correct fields:</p>
                    <div id="csv-mapping-fields"></div>
                </div>
                <div id="csv-preview-section" style="display: none;">
                    <h4 style="margin: var(--spacing-lg) 0 var(--spacing-md);">Preview</h4>
                    <div id="csv-preview" class="csv-preview"></div>
                </div>
            </form>
        `;

        this.showModal('Import CSV Data', content, () => this.performCSVImport());
        document.getElementById('modal-save').textContent = 'Import';
        document.getElementById('modal-save').disabled = true;
        document.getElementById('modal-save').style.opacity = '0.5';

        setTimeout(() => {
            const fileInput = document.getElementById('csv-import-file');
            fileInput.addEventListener('change', (e) => this.handleCSVFileSelect(e));

            // Update mapping when type changes (if file already loaded)
            const typeSelect = document.getElementById('csv-import-type');
            typeSelect.addEventListener('change', () => {
                if (this.csvImportData) {
                    this.showCSVMappingFields();
                }
            });
        }, 100);
    }

    async handleCSVFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const rows = this.parseCSV(text);

            if (rows.length < 2) {
                this.showToast('CSV file must have headers and at least one data row', 'error');
                return;
            }

            this.csvImportData = {
                headers: rows[0],
                rows: rows.slice(1)
            };

            // Show mapping section
            this.showCSVMappingFields();

        } catch (error) {
            console.error('CSV parse error:', error);
            this.showToast('Error reading CSV file', 'error');
        }
    }

    parseCSV(text) {
        const rows = [];
        let currentRow = [];
        let currentCell = '';
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (inQuotes) {
                if (char === '"' && nextChar === '"') {
                    currentCell += '"';
                    i++; // Skip next quote
                } else if (char === '"') {
                    inQuotes = false;
                } else {
                    currentCell += char;
                }
            } else {
                if (char === '"') {
                    inQuotes = true;
                } else if (char === ',') {
                    currentRow.push(currentCell.trim());
                    currentCell = '';
                } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
                    currentRow.push(currentCell.trim());
                    if (currentRow.some(c => c)) rows.push(currentRow);
                    currentRow = [];
                    currentCell = '';
                    if (char === '\r') i++; // Skip \n in \r\n
                } else if (char !== '\r') {
                    currentCell += char;
                }
            }
        }

        // Handle last cell/row
        if (currentCell || currentRow.length > 0) {
            currentRow.push(currentCell.trim());
            if (currentRow.some(c => c)) rows.push(currentRow);
        }

        return rows;
    }

    showCSVMappingFields() {
        const type = document.getElementById('csv-import-type').value;
        const typeSelect = document.getElementById('csv-import-type');
        const selectedOption = typeSelect.options[typeSelect.selectedIndex];
        const requiredFields = selectedOption.dataset.fields.split(',');

        const csvHeaders = this.csvImportData.headers;

        const mappingHtml = requiredFields.map(field => {
            const options = csvHeaders.map((h, i) =>
                `<option value="${i}" ${h.toLowerCase().includes(field.toLowerCase()) ? 'selected' : ''}>${h}</option>`
            ).join('');

            return `
                <div class="form-row" style="margin-bottom: var(--spacing-sm);">
                    <div class="form-group" style="flex: 1;">
                        <label style="font-size: 0.85rem;">${this.formatFieldName(field)}</label>
                    </div>
                    <div class="form-group" style="flex: 2;">
                        <select id="csv-map-${field}" class="form-control">
                            <option value="">-- Skip this field --</option>
                            ${options}
                        </select>
                    </div>
                </div>
            `;
        }).join('');

        document.getElementById('csv-mapping-fields').innerHTML = mappingHtml;
        document.getElementById('csv-mapping-section').style.display = 'block';

        // Show preview
        this.updateCSVPreview();

        // Enable save button
        document.getElementById('modal-save').disabled = false;
        document.getElementById('modal-save').style.opacity = '1';
    }

    formatFieldName(field) {
        return field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    updateCSVPreview() {
        const previewData = this.csvImportData.rows.slice(0, 3);
        const previewHtml = `
            <table class="csv-preview-table">
                <thead>
                    <tr>${this.csvImportData.headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${previewData.map(row =>
                        `<tr>${row.map(cell => `<td>${cell || '-'}</td>`).join('')}</tr>`
                    ).join('')}
                </tbody>
            </table>
            <p class="help-text">${this.csvImportData.rows.length} rows to import</p>
        `;

        document.getElementById('csv-preview').innerHTML = previewHtml;
        document.getElementById('csv-preview-section').style.display = 'block';
    }

    async performCSVImport() {
        const type = document.getElementById('csv-import-type').value;
        const typeSelect = document.getElementById('csv-import-type');
        const selectedOption = typeSelect.options[typeSelect.selectedIndex];
        const requiredFields = selectedOption.dataset.fields.split(',');

        // Build column mapping
        const mapping = {};
        for (const field of requiredFields) {
            const select = document.getElementById(`csv-map-${field}`);
            if (select && select.value !== '') {
                mapping[field] = parseInt(select.value);
            }
        }

        this.closeModal();
        this.showLoading(true);

        try {
            // Date fields that need NZ format conversion
            const dateFields = ['date', 'startDate'];

            const records = [];
            for (const row of this.csvImportData.rows) {
                const record = {};
                for (const [field, colIndex] of Object.entries(mapping)) {
                    let value = row[colIndex] || '';
                    // Convert date fields from NZ format (DD/MM/YYYY) to ISO (YYYY-MM-DD)
                    if (dateFields.includes(field) && value) {
                        value = this.parseNZDate(value);
                    }
                    record[field] = value;
                }
                records.push(record);
            }

            // Add records to database
            let successCount = 0;
            for (const record of records) {
                const result = await DatabaseService.add(type, record);
                if (result.success) successCount++;
            }

            this.showToast(`Imported ${successCount} of ${records.length} records`, 'success');
            await this.loadAllData();
            this.renderCurrentPage();

        } catch (error) {
            console.error('CSV import error:', error);
            this.showToast('Error importing CSV data', 'error');
        }

        this.showLoading(false);
    }

    // Direct CSV import from Settings page (simplified flow)
    async handleCSVImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        const importType = document.getElementById('csv-import-type').value;

        try {
            const text = await file.text();
            const rows = this.parseCSV(text);

            if (rows.length < 2) {
                this.showToast('CSV file must have headers and at least one data row', 'error');
                e.target.value = '';
                return;
            }

            const headers = rows[0];
            const dataRows = rows.slice(1);

            // Show preview modal
            this.showCSVPreviewModal(importType, headers, dataRows);

        } catch (error) {
            console.error('CSV parse error:', error);
            this.showToast('Error reading CSV file', 'error');
        }

        e.target.value = '';
    }

    showCSVPreviewModal(importType, headers, dataRows) {
        // Define expected fields for each type
        const fieldMappings = {
            students: ['name', 'class', 'year', 'instruments', 'parentEmail'],
            lessons: ['studentName', 'tutorName', 'instrument', 'day', 'time'],
            tutors: ['name', 'email', 'phone', 'instruments']
        };

        const expectedFields = fieldMappings[importType] || [];

        // Auto-map columns based on header names
        const mapping = {};
        headers.forEach((header, index) => {
            const normalizedHeader = header.toLowerCase().replace(/[^a-z]/g, '');
            for (const field of expectedFields) {
                const normalizedField = field.toLowerCase();
                if (normalizedHeader.includes(normalizedField) ||
                    normalizedField.includes(normalizedHeader)) {
                    mapping[field] = index;
                    break;
                }
            }
        });

        // Generate mapping form
        const mappingHtml = expectedFields.map(field => {
            const options = headers.map((h, i) =>
                `<option value="${i}" ${mapping[field] === i ? 'selected' : ''}>${h}</option>`
            ).join('');

            return `
                <div class="form-row" style="margin-bottom: var(--spacing-sm); display: flex; align-items: center; gap: var(--spacing-md);">
                    <label style="flex: 1; font-weight: 500;">${this.formatFieldName(field)}</label>
                    <select id="csv-map-${field}" class="form-control" style="flex: 2;">
                        <option value="">-- Skip --</option>
                        ${options}
                    </select>
                </div>
            `;
        }).join('');

        // Generate preview table
        const previewRows = dataRows.slice(0, 5);
        const previewHtml = `
            <table class="csv-preview-table">
                <thead>
                    <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${previewRows.map(row =>
                        `<tr>${row.map(cell => `<td>${cell || '-'}</td>`).join('')}</tr>`
                    ).join('')}
                </tbody>
            </table>
        `;

        const content = `
            <div class="csv-import-preview">
                <h4 style="margin-bottom: var(--spacing-md);">Column Mapping</h4>
                <p class="help-text" style="margin-bottom: var(--spacing-md);">Match your CSV columns to the correct fields:</p>
                ${mappingHtml}

                <h4 style="margin: var(--spacing-lg) 0 var(--spacing-md);">Preview (${dataRows.length} rows)</h4>
                <div style="overflow-x: auto;">
                    ${previewHtml}
                </div>
            </div>
        `;

        // Store data for import
        this.pendingCSVImport = { importType, headers, dataRows, expectedFields };

        this.showModal(`Import ${importType.charAt(0).toUpperCase() + importType.slice(1)} from CSV`, content, () => this.confirmCSVImport());
        document.getElementById('modal-save').textContent = 'Import';
    }

    async confirmCSVImport() {
        const { importType, dataRows, expectedFields } = this.pendingCSVImport;

        // Build mapping from form
        const mapping = {};
        for (const field of expectedFields) {
            const select = document.getElementById(`csv-map-${field}`);
            if (select && select.value !== '') {
                mapping[field] = parseInt(select.value);
            }
        }

        this.closeModal();
        this.showLoading(true);

        try {
            let successCount = 0;
            let errorCount = 0;

            // Date fields that need NZ format conversion
            const dateFields = ['date', 'startDate'];

            for (const row of dataRows) {
                const record = {};
                for (const [field, colIndex] of Object.entries(mapping)) {
                    let value = row[colIndex] || '';
                    // Handle arrays (instruments, etc.)
                    if (field === 'instruments') {
                        value = value.split(/[,;]/).map(v => v.trim()).filter(v => v);
                    }
                    // Convert date fields from NZ format (DD/MM/YYYY) to ISO (YYYY-MM-DD)
                    if (dateFields.includes(field) && value && typeof value === 'string') {
                        value = this.parseNZDate(value);
                    }
                    record[field] = value;
                }

                // Skip empty records
                if (!Object.values(record).some(v => v && (Array.isArray(v) ? v.length : true))) {
                    continue;
                }

                // Add type-specific defaults
                if (importType === 'students') {
                    record.status = record.status || 'active';
                } else if (importType === 'lessons') {
                    record.status = record.status || 'active';
                } else if (importType === 'tutors') {
                    record.active = true;
                    record.initials = this.getInitials(record.name);
                    const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#22c55e', '#3b82f6'];
                    record.color = colors[Math.floor(Math.random() * colors.length)];
                }

                try {
                    let result;
                    switch (importType) {
                        case 'students':
                            result = await DatabaseService.addStudent(record);
                            break;
                        case 'lessons':
                            result = await DatabaseService.addLesson(record);
                            break;
                        case 'tutors':
                            result = await DatabaseService.addTutor(record);
                            break;
                    }
                    if (result?.success) successCount++;
                    else errorCount++;
                } catch (err) {
                    errorCount++;
                }
            }

            this.logActivity('import', `Imported ${successCount} ${importType} from CSV`, { count: successCount });

            if (errorCount === 0) {
                this.showToast(`Successfully imported ${successCount} ${importType}!`, 'success');
            } else {
                this.showToast(`Imported ${successCount} of ${successCount + errorCount} records`, 'warning');
            }

            await this.loadAllData();
            this.renderCurrentPage();

        } catch (error) {
            console.error('CSV import error:', error);
            this.showToast('Error importing CSV data', 'error');
        }

        this.showLoading(false);
    }

    downloadCSVTemplate(type) {
        const templates = {
            students: {
                headers: ['Name', 'Class', 'Year', 'Email', 'Parent Email', 'Instrument'],
                example: ['John Smith', '10A', '10', 'john.smith@school.nz', 'parent@email.com', 'Piano']
            },
            tutors: {
                headers: ['Name', 'Email', 'Phone', 'Instruments', 'Role'],
                example: ['Mrs Jones', 'jones@school.nz', '021 123 4567', 'Piano, Keyboard', 'Tutor']
            },
            lessons: {
                headers: ['Student Name', 'Tutor Name', 'Instrument', 'Day', 'Time', 'Location', 'Type'],
                example: ['John Smith', 'Mrs Jones', 'Piano', 'Monday', '9:00 AM', 'Music Room 1', 'private']
            },
            lessonRequests: {
                headers: ['Student Name', 'Instrument', 'Parent Email', 'Notes', 'Status', 'Preferred Day'],
                example: ['Jane Doe', 'Violin', 'parent@email.com', 'Beginner level', 'pending', 'Tuesday']
            },
            events: {
                headers: ['Name', 'Date', 'Time', 'Location', 'Category', 'Term', 'Description'],
                example: ['Spring Concert', '2025-09-15', '7:00 PM', 'School Hall', 'Concert', 'Term 3', 'Annual spring concert']
            },
            groups: {
                headers: ['Name', 'Type', 'Category', 'Meeting Day', 'Meeting Time', 'Location', 'Description'],
                example: ['Junior Choir', 'Choir', 'Vocal', 'Wednesday', '3:30 PM', 'Music Room 2', 'For Years 7-9']
            },
            instruments: {
                headers: ['Name', 'Type', 'Brand', 'Serial Number', 'Condition', 'Location'],
                example: ['Flute #1', 'Woodwind', 'Yamaha', 'FL12345', 'Good', 'Music Office']
            },
            instrumentHires: {
                headers: ['Student Name', 'Instrument Name', 'Start Date', 'Status', 'Notes', 'Hire Type'],
                example: ['John Smith', 'Flute #1', '2025-02-01', 'active', 'Term hire', 'term']
            }
        };

        const template = templates[type];
        if (!template) {
            this.showToast('Unknown template type', 'error');
            return;
        }

        const csv = [template.headers.join(','), template.example.join(',')].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mgs-${type}-template.csv`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Template downloaded!', 'success');
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

    // Parse date from NZ format (DD/MM/YYYY) or other formats to ISO (YYYY-MM-DD)
    parseNZDate(dateStr) {
        if (!dateStr) return '';

        // Already in ISO format (YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
        }

        // NZ format: DD/MM/YYYY or D/M/YYYY
        const nzMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (nzMatch) {
            const day = nzMatch[1].padStart(2, '0');
            const month = nzMatch[2].padStart(2, '0');
            const year = nzMatch[3];
            return `${year}-${month}-${day}`;
        }

        // Try parsing as-is (e.g., "15 Feb 2025")
        const date = new Date(dateStr);
        if (!isNaN(date)) {
            return date.toISOString().split('T')[0];
        }

        return dateStr;
    }

    getInitials(name) {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    getContrastColor(hexColor) {
        // Convert hex to RGB
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        // Calculate relative luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        // Return black or white based on luminance
        return luminance > 0.5 ? '#1a1f2e' : '#f4f4f5';
    }

    handleSearch(type, query) {
        // Implement search filtering
        query = query.toLowerCase().trim();
        
        // Table-based pages
        const tableTypes = {
            'lessons': 'lessons-body',
            'students': 'students-body',
            'events': 'events-body',
            'instruments': 'instruments-body',
            'hires': 'hires-body'
        };
        
        if (tableTypes[type]) {
            const tbody = document.getElementById(tableTypes[type]);
            if (tbody) {
                tbody.querySelectorAll('tr').forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            }
            return;
        }
        
        // Grid-based pages (tutors and groups)
        if (type === 'tutors') {
            const grid = document.getElementById('tutors-grid');
            if (grid) {
                grid.querySelectorAll('.tutor-card').forEach(card => {
                    const text = card.textContent.toLowerCase();
                    card.style.display = text.includes(query) ? '' : 'none';
                });
            }
            return;
        }
        
        if (type === 'groups') {
            const grid = document.getElementById('groups-grid');
            if (grid) {
                grid.querySelectorAll('.group-card').forEach(card => {
                    const text = card.textContent.toLowerCase();
                    card.style.display = text.includes(query) ? '' : 'none';
                });
            }
            return;
        }
    }

    // ========================================
    // Sorting and Filtering
    // ========================================

    sortData(tableType, column) {
        const state = this.sortState[tableType];

        // Toggle direction if same column, otherwise reset to asc
        if (state.column === column) {
            state.direction = state.direction === 'asc' ? 'desc' : 'asc';
        } else {
            state.column = column;
            state.direction = 'asc';
        }

        // Re-render the table
        switch (tableType) {
            case 'lessons':
                this.renderLessons();
                break;
            case 'students':
                this.renderStudents();
                break;
            case 'events':
                this.renderEvents();
                break;
            case 'instruments':
                this.renderInstruments();
                break;
            case 'hires':
                this.renderHires(this.currentHiresFilter || 'active');
                break;
        }
    }

    getSortedData(tableType, data) {
        const state = this.sortState[tableType];
        if (!state.column) return data;

        return [...data].sort((a, b) => {
            let aVal = this.getSortValue(a, state.column, tableType);
            let bVal = this.getSortValue(b, state.column, tableType);

            // Handle null/undefined
            if (aVal == null) aVal = '';
            if (bVal == null) bVal = '';

            // String comparison
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            let result = 0;
            if (aVal < bVal) result = -1;
            if (aVal > bVal) result = 1;

            return state.direction === 'asc' ? result : -result;
        });
    }

    getSortValue(item, column, tableType) {
        // Special handling for columns that need data lookup
        switch (column) {
            case 'studentName':
                const student = this.getStudentById(item.studentId);
                return student?.name || item.studentName || '';
            case 'tutorName':
                const tutor = this.getTutorById(item.tutorId);
                return tutor?.name || item.tutorName || '';
            case 'class':
                const studentForClass = this.getStudentById(item.studentId);
                return studentForClass?.class || item.class || '';
            case 'dayTime':
                return `${item.day || ''} ${item.time || ''}`;
            default:
                return item[column];
        }
    }

    getSortIcon(tableType, column) {
        const state = this.sortState[tableType];
        if (state.column !== column) {
            return `<svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>
            </svg>`;
        }
        return state.direction === 'asc'
            ? `<svg class="sort-icon active" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <path d="M7 15l5 5 5-5"/>
            </svg>`
            : `<svg class="sort-icon active" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <path d="M7 9l5-5 5 5"/>
            </svg>`;
    }

    filterData(tableType, column, value) {
        if (value === '' || value === 'all') {
            delete this.filterState[tableType][column];
        } else {
            this.filterState[tableType][column] = value;
        }

        // Re-render the table
        switch (tableType) {
            case 'lessons':
                this.renderLessons();
                break;
            case 'students':
                this.renderStudents();
                break;
            case 'events':
                this.renderEvents();
                break;
            case 'instruments':
                this.renderInstruments();
                break;
            case 'hires':
                this.renderHires(this.currentHiresFilter || 'active');
                break;
        }
    }

    getFilteredData(tableType, data) {
        const filters = this.filterState[tableType];
        if (!Object.keys(filters).length) return data;

        return data.filter(item => {
            for (const [column, value] of Object.entries(filters)) {
                const itemValue = this.getSortValue(item, column, tableType);
                if (String(itemValue).toLowerCase() !== String(value).toLowerCase()) {
                    return false;
                }
            }
            return true;
        });
    }

    handleTabClick(e) {
        const tab = e.target.dataset.tab;
        const hiresTab = e.target.dataset.hiresTab;
        const lessonsTab = e.target.dataset.lessonsTab;
        const tabContainer = e.target.closest('.page-tabs');

        tabContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Handle requests page tabs
        if (this.currentPage === 'requests' && tab) {
            this.renderRequests(tab);
        }

        // Handle hires page tabs
        if (this.currentPage === 'hires' && hiresTab) {
            this.renderHires(hiresTab);
        }

        // Handle lessons page tabs
        if (this.currentPage === 'lessons' && lessonsTab) {
            this.lessonsTab = lessonsTab;
            this.renderLessons();
        }

        // Handle funded lessons page tabs
        const fundedTab = e.target.dataset.fundedTab;
        if (this.currentPage === 'funded-lessons' && fundedTab) {
            this.fundedLessonsTab = fundedTab;
            this.renderFundedLessons();
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
        let container = document.getElementById('toast-container');
        
        // Create container if it doesn't exist
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
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

    // ========================================
    // Email Notifications
    // ========================================

    async sendEventNotification(eventId) {
        const event = this.data.events.find(e => e.id === eventId);
        if (!event) return;

        // Get staff with emails
        const staff = (event.staffIds || [])
            .map(id => this.data.tutors.find(t => t.id === id))
            .filter(t => t && t.email);

        if (staff.length === 0) {
            this.showToast('No staff with email addresses assigned to this event', 'warning');
            return;
        }

        // Build task list with assigned staff names
        let tasksList = '';
        if (event.tasks && event.tasks.length > 0) {
            tasksList = '\n\nTASKS:\n' + event.tasks.map(task => {
                // Handle both legacy assignedTo and new assignedToIds
                let assignedIds = task.assignedToIds || [];
                if (!assignedIds.length && task.assignedTo) {
                    assignedIds = [task.assignedTo];
                }
                const assignedNames = assignedIds
                    .map(id => this.data.tutors.find(t => t.id === id)?.name)
                    .filter(n => n);
                const assignedText = assignedNames.length > 0 ? assignedNames.join(', ') : 'Unassigned';
                return `- ${task.name} [${assignedText}]`;
            }).join('\n');
        }

        // Try EmailJS first, fall back to mailto:
        if (EmailService.isConfigured()) {
            this.showToast('Sending emails...', 'info');
            const result = await EmailService.sendEventNotification(event, staff, this.data.tutors);
            if (result.success || (Array.isArray(result) && result.some(r => r.success))) {
                const successCount = Array.isArray(result) ? result.filter(r => r.success).length : 1;
                this.showToast(`Email sent to ${successCount} staff member(s)`, 'success');
            } else {
                this.showToast('Failed to send emails: ' + (result.error || 'Unknown error'), 'error');
            }
        } else {
            // Fallback to mailto:
            const staffEmails = staff.map(t => t.email);
            const subject = encodeURIComponent(`Event Assignment: ${event.name}`);
            const eventDate = this.formatDate(event.date);
            const body = encodeURIComponent(
                `You have been assigned to the following event:\n\n` +
                `Event: ${event.name}\n` +
                `Date: ${eventDate}\n` +
                `Time: ${event.time || 'TBC'}\n` +
                `Location: ${event.location || 'TBC'}\n\n` +
                `Description: ${event.description || 'No description'}` +
                tasksList +
                `\n\nPlease check the Arts Portal for task assignments and updates.`
            );
            window.open(`mailto:${staffEmails.join(',')}?subject=${subject}&body=${body}`, '_blank');
            this.showToast('Email draft opened (configure EmailJS for direct sending)', 'info');
        }
    }

    async sendGroupNotification(groupId) {
        const group = this.data.groups.find(g => g.id === groupId);
        if (!group) return;

        // Get leaders with emails
        const leaders = (group.leaderIds || [])
            .map(id => this.data.tutors.find(t => t.id === id))
            .filter(t => t && t.email);

        if (leaders.length === 0) {
            this.showToast('No group leaders with email addresses assigned', 'warning');
            return;
        }

        // Try EmailJS first, fall back to mailto:
        if (EmailService.isConfigured()) {
            this.showToast('Sending emails...', 'info');
            const result = await EmailService.sendGroupNotification(group, leaders);
            if (result.success || (Array.isArray(result) && result.some(r => r.success))) {
                const successCount = Array.isArray(result) ? result.filter(r => r.success).length : 1;
                this.showToast(`Email sent to ${successCount} leader(s)`, 'success');
            } else {
                this.showToast('Failed to send emails: ' + (result.error || 'Unknown error'), 'error');
            }
        } else {
            // Fallback to mailto:
            const leaderEmails = leaders.map(t => t.email);
            const subject = encodeURIComponent(`Group Assignment: ${group.name}`);
            const body = encodeURIComponent(
                `You have been assigned as a leader of the following group:\n\n` +
                `Group: ${group.name}\n` +
                `Type: ${group.type || 'N/A'}\n` +
                `Category: ${group.category || 'N/A'}\n` +
                `Members: ${group.members || 0}\n\n` +
                `Meeting: ${group.meetingDay || 'TBC'} ${group.meetingTime || ''}\n` +
                `Location: ${group.location || 'TBC'}\n\n` +
                `Please check the Arts Portal for more details.`
            );
            window.open(`mailto:${leaderEmails.join(',')}?subject=${subject}&body=${body}`, '_blank');
            this.showToast('Email draft opened (configure EmailJS for direct sending)', 'info');
        }
    }

    async sendTutorPortalLink(tutorId) {
        const tutor = this.data.tutors.find(t => t.id === tutorId);
        if (!tutor) {
            this.showToast('Tutor not found', 'error');
            return;
        }

        if (!tutor.email) {
            this.showToast('Tutor has no email address. Please add an email first.', 'warning');
            return;
        }

        this.showToast('Generating portal link...', 'info');

        try {
            // Get or create tutor token
            const tokenResult = await DatabaseService.getOrCreateTutorToken(tutorId);

            if (!tokenResult.success) {
                this.showToast('Failed to generate portal link: ' + tokenResult.error, 'error');
                return;
            }

            // Build the portal URL
            const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
            const portalUrl = `${baseUrl}/tutor-portal.html?token=${tokenResult.token}`;

            // Count lessons for this tutor
            const lessonCount = this.data.lessons.filter(l => l.tutorId === tutorId).length;

            // Send the email
            if (EmailService.isConfigured()) {
                const result = await EmailService.sendTutorPortalLink(tutor, portalUrl, lessonCount);

                if (result.success) {
                    this.logActivity('email', `Tutor portal link sent to ${tutor.name}`, { tutorId });
                    this.showToast(`Portal link sent to ${tutor.name}`, 'success');
                } else {
                    this.showToast('Failed to send email: ' + (result.error || 'Unknown error'), 'error');
                }
            } else {
                // Fallback - show the link in a modal
                const content = `
                    <p style="margin-bottom: 1rem;">EmailJS not configured. Here is the portal link for <strong>${tutor.name}</strong>:</p>
                    <div style="background: var(--color-bg-secondary); padding: 1rem; border-radius: var(--radius-md); word-break: break-all; font-family: monospace; font-size: 0.85rem;">
                        ${portalUrl}
                    </div>
                    <p style="margin-top: 1rem; color: var(--color-text-secondary); font-size: 0.9rem;">
                        Copy this link and send it to the tutor manually, or configure EmailJS for automatic sending.
                    </p>
                `;
                this.showModal('Tutor Portal Link', content, null);
                document.getElementById('modal-save').style.display = 'none';
            }
        } catch (error) {
            console.error('Error sending portal link:', error);
            this.showToast('Error generating portal link', 'error');
        }
    }

    async sendTutorLessonNotification(tutor, student, lesson, lessonId) {
        try {
            // Get or create tutor token for portal access
            const tokenResult = await DatabaseService.getOrCreateTutorToken(tutor.id);
            if (!tokenResult.success) return;

            const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
            const portalUrl = `${baseUrl}/tutor-portal.html?token=${tokenResult.token}`;

            if (EmailService.isConfigured()) {
                const result = await EmailService.sendLessonAssignmentNotification(tutor, student, lesson, portalUrl);
                if (result.success) {
                    this.logActivity('email', `Lesson notification sent to ${tutor.name} for ${student?.name}`, { tutorId: tutor.id, lessonId });
                }
            }
        } catch (error) {
            console.error('Error sending lesson notification:', error);
        }
    }

    async sendOverdueTaskNotification(eventId, taskName) {
        const event = this.data.events.find(e => e.id === eventId);
        if (!event) {
            this.showToast('Event not found', 'error');
            return;
        }

        // Find the task and get assigned staff
        const savedTasks = event.tasks || [];
        const savedTask = savedTasks.find(t => t.name === taskName);
        const assignedIds = savedTask?.assignedToIds || (savedTask?.assignedTo ? [savedTask.assignedTo] : []);

        if (assignedIds.length === 0) {
            this.showToast('No staff assigned to this task', 'warning');
            return;
        }

        const assignedStaff = assignedIds
            .map(id => this.data.tutors.find(t => t.id === id))
            .filter(s => s && s.email);

        if (assignedStaff.length === 0) {
            this.showToast('No staff with email addresses assigned', 'warning');
            return;
        }

        this.showToast(`Sending reminders to ${assignedStaff.length} staff...`, 'info');

        try {
            const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
            let successCount = 0;

            for (const staff of assignedStaff) {
                const tokenResult = await DatabaseService.getOrCreateStaffToken(staff.id);
                if (!tokenResult.success) continue;

                const portalUrl = `${baseUrl}/staff-portal.html?token=${tokenResult.token}`;

                if (EmailService.isConfigured()) {
                    const result = await EmailService.sendOverdueTaskNotification(staff, event, { name: taskName, dueDate: savedTask?.dueDate }, portalUrl);
                    if (result.success) successCount++;
                }

                await new Promise(resolve => setTimeout(resolve, 200));
            }

            if (successCount > 0) {
                this.logActivity('email', `Overdue task reminder sent for "${taskName}" on ${event.name} (${successCount} staff)`, { eventId, taskName });
                this.showToast(`Reminder sent to ${successCount} staff member${successCount > 1 ? 's' : ''}`, 'success');
            } else {
                this.showToast('Failed to send reminders', 'error');
            }
        } catch (error) {
            console.error('Error sending overdue task notification:', error);
            this.showToast('Error sending reminders', 'error');
        }
    }

    async sendEventPortalLinks(eventId) {
        const event = this.data.events.find(e => e.id === eventId);
        if (!event) {
            this.showToast('Event not found', 'error');
            return;
        }

        // Get staff assigned to this event with emails
        const eventStaff = (event.staffIds || [])
            .map(id => this.data.tutors.find(t => t.id === id))
            .filter(s => s && s.email);

        if (eventStaff.length === 0) {
            this.showToast('No staff with email addresses assigned to this event', 'warning');
            return;
        }

        this.showToast(`Sending portal links to ${eventStaff.length} staff...`, 'info');

        try {
            const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
            let successCount = 0;
            let failCount = 0;

            for (const staff of eventStaff) {
                // Get or create staff token
                const tokenResult = await DatabaseService.getOrCreateStaffToken(staff.id);

                if (!tokenResult.success) {
                    failCount++;
                    continue;
                }

                const portalUrl = `${baseUrl}/staff-portal.html?token=${tokenResult.token}`;

                // Count events and tasks for this staff member
                const staffEvents = this.data.events.filter(e => e.staffIds?.includes(staff.id));
                const taskCount = staffEvents.reduce((sum, e) => {
                    const myTasks = (e.tasks || []).filter(t => {
                        const assignedIds = t.assignedToIds || (t.assignedTo ? [t.assignedTo] : []);
                        return assignedIds.includes(staff.id);
                    });
                    return sum + myTasks.length;
                }, 0);

                if (EmailService.isConfigured()) {
                    const result = await EmailService.sendStaffPortalLink(staff, portalUrl, staffEvents.length, taskCount);
                    if (result.success) {
                        successCount++;
                    } else {
                        failCount++;
                    }
                } else {
                    // Just count as success for now, we'll show the links
                    successCount++;
                }

                // Small delay between emails
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            if (EmailService.isConfigured()) {
                if (successCount > 0) {
                    this.logActivity('email', `Staff portal links sent for ${event.name} (${successCount} staff)`, { eventId: event.id });
                }
                if (successCount > 0 && failCount === 0) {
                    this.showToast(`Portal links sent to ${successCount} staff member(s)`, 'success');
                } else if (successCount > 0) {
                    this.showToast(`Sent to ${successCount}, failed for ${failCount}`, 'warning');
                } else {
                    this.showToast('Failed to send portal links', 'error');
                }
            } else {
                // Show info about EmailJS not being configured
                this.showToast('EmailJS not configured - configure it to send portal links automatically', 'info');
            }
        } catch (error) {
            console.error('Error sending portal links:', error);
            this.showToast('Error sending portal links', 'error');
        }
    }

    async sendLessonNotification(lessonId) {
        const lesson = this.data.lessons.find(l => l.id === lessonId);
        if (!lesson) return;

        const tutor = this.getTutorById(lesson.tutorId);
        if (!tutor || !tutor.email) {
            this.showToast('Tutor has no email address', 'warning');
            return;
        }

        const student = this.getStudentById(lesson.studentId);

        // Generate a token for this lesson
        this.showToast('Generating lesson link...', 'info');
        const tokenResult = await DatabaseService.createLessonToken(lessonId, tutor.id);
        let responseUrl = '';

        if (tokenResult.success) {
            // Build the response URL (using the current origin)
            const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
            responseUrl = `${baseUrl}/lesson-response.html?token=${tokenResult.token}`;
        }

        // Build email with response buttons info
        const responseSection = responseUrl ? `

CONFIRM YOUR LESSON:
Click the link below to view lesson details and confirm:
${responseUrl}

You can click "Accept Lesson" or "Add to Waitlist" directly from the link above.
` : '';

        // Try EmailJS first, fall back to mailto:
        if (EmailService.isConfigured()) {
            this.showToast('Sending email...', 'info');
            const result = await EmailService.sendLessonNotification(lesson, tutor, student, responseUrl);
            if (result.success) {
                this.showToast(`Email sent to ${tutor.name}`, 'success');
            } else {
                this.showToast('Failed to send email: ' + (result.error || 'Unknown error'), 'error');
            }
        } else {
            // Fallback to mailto:
            const subject = encodeURIComponent(`New Lesson Assignment: ${student?.name || lesson.studentName || 'Student'}`);
            const body = encodeURIComponent(
                `You have been assigned a new lesson:\n\n` +
                `Student: ${student?.name || lesson.studentName || 'Unknown'}\n` +
                `Instrument: ${lesson.instrument || 'N/A'}\n` +
                `Day: ${lesson.day || 'TBC'}\n` +
                `Time: ${lesson.time || 'TBC'}\n` +
                `Location: ${lesson.location || 'TBC'}` +
                responseSection +
                `\n\nPlease check the Arts Portal for more details.`
            );
            window.open(`mailto:${tutor.email}?subject=${subject}&body=${body}`, '_blank');
            this.showToast('Email draft opened (configure EmailJS for direct sending)', 'info');
        }
    }

    showNotifyStaffModal(type, id) {
        let content = '';
        let notifyFn = null;
        let entity = null;
        let staffList = [];

        // If called without type (from quick actions), show custom notification form with checkboxes
        if (!type) {
            const allStaff = this.data.tutors || [];
            const staffWithEmail = allStaff.filter(s => s.email);

            const staffCheckboxes = allStaff.map(s => `
                <label class="staff-checkbox-item ${!s.email ? 'disabled' : ''}">
                    <input type="checkbox" name="staff" value="${s.id}" ${!s.email ? 'disabled' : ''}>
                    <div class="avatar" style="background: ${s.color || '#888'}">${s.initials || this.getInitials(s.name)}</div>
                    <div class="staff-info">
                        <span class="staff-name">${s.name}</span>
                        <span class="staff-email ${!s.email ? 'no-email' : ''}">${s.email || 'No email'}</span>
                    </div>
                </label>
            `).join('');

            const emailConfigured = EmailService.isConfigured();
            const emailMethodMessage = emailConfigured
                ? `<span class="email-method native">Email will be sent directly from the app.</span>`
                : `<span class="email-method mailto">This will open your email client with a pre-filled message.</span>`;

            content = `
                <div class="notify-staff-modal">
                    <div class="form-group">
                        <label>Select Staff Members</label>
                        <div class="staff-checkbox-list">
                            ${staffCheckboxes}
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Subject</label>
                        <input type="text" id="notify-staff-subject" class="form-control" placeholder="Email subject">
                    </div>
                    <div class="form-group">
                        <label>Message</label>
                        <textarea id="notify-staff-message" class="form-control" rows="5" placeholder="Type your message here..."></textarea>
                    </div>
                    <p class="text-muted" style="margin-top: var(--spacing-md); font-size: 0.85rem;">
                        ${emailMethodMessage}
                    </p>
                </div>
            `;

            this.showModal('Notify Staff', content, async () => {
                const selectedStaffIds = Array.from(document.querySelectorAll('.staff-checkbox-list input[name="staff"]:checked'))
                    .map(cb => cb.value);
                const subject = document.getElementById('notify-staff-subject').value;
                const message = document.getElementById('notify-staff-message').value;

                if (selectedStaffIds.length === 0) {
                    this.showToast('Please select at least one staff member', 'warning');
                    return;
                }
                if (!subject.trim()) {
                    this.showToast('Please enter a subject', 'warning');
                    return;
                }
                if (!message.trim()) {
                    this.showToast('Please enter a message', 'warning');
                    return;
                }

                const selectedStaff = selectedStaffIds
                    .map(id => this.data.tutors.find(t => t.id === id))
                    .filter(s => s && s.email);

                if (selectedStaff.length === 0) {
                    this.showToast('No selected staff have email addresses', 'error');
                    return;
                }

                this.closeModal();

                if (emailConfigured) {
                    this.showToast('Sending emails...', 'info');
                    const recipients = selectedStaff.map(s => ({ email: s.email, name: s.name }));
                    const results = await EmailService.sendToMultiple(recipients, subject, message, 'general');
                    const successCount = results.filter(r => r.success).length;
                    if (successCount > 0) {
                        this.showToast(`Email sent to ${successCount} staff member(s)!`, 'success');
                    } else {
                        this.showToast('Failed to send emails', 'error');
                    }
                } else {
                    const emails = selectedStaff.map(s => s.email).join(',');
                    const mailtoSubject = encodeURIComponent(subject);
                    const mailtoBody = encodeURIComponent(message);
                    window.open(`mailto:${emails}?subject=${mailtoSubject}&body=${mailtoBody}`, '_blank');
                    this.showToast('Email draft opened', 'info');
                }
            });
            document.getElementById('modal-save').textContent = 'Send Email';
            return;
        }

        // Event, Group, or Lesson specific notifications
        let preSelectedIds = [];
        let entityName = '';

        if (type === 'event') {
            entity = this.data.events.find(e => e.id === id);
            if (!entity) return;
            preSelectedIds = entity.staffIds || [];
            entityName = entity.name;
            staffList = preSelectedIds
                .map(sid => this.data.tutors.find(t => t.id === sid))
                .filter(t => t);
        } else if (type === 'group') {
            entity = this.data.groups.find(g => g.id === id);
            if (!entity) return;
            preSelectedIds = entity.leaderIds || [];
            entityName = entity.name;
            staffList = preSelectedIds
                .map(lid => this.data.tutors.find(t => t.id === lid))
                .filter(t => t);
        } else if (type === 'lesson') {
            entity = this.data.lessons.find(l => l.id === id);
            if (!entity) return;
            const tutor = this.getTutorById(entity.tutorId);
            if (tutor) {
                preSelectedIds = [tutor.id];
                staffList = [tutor];
            }
            entityName = `${entity.studentName || 'Student'} - ${entity.instrument || 'Lesson'}`;
        }

        const emailConfigured = EmailService.isConfigured();
        const allStaff = this.data.tutors || [];

        // Build staff checkboxes with pre-selected items
        const staffCheckboxes = allStaff.map(s => {
            const isPreSelected = preSelectedIds.includes(s.id);
            return `
                <label class="staff-checkbox-item ${!s.email ? 'disabled' : ''} ${isPreSelected ? 'pre-selected' : ''}">
                    <input type="checkbox" name="staff" value="${s.id}" ${!s.email ? 'disabled' : ''} ${isPreSelected ? 'checked' : ''}>
                    <div class="avatar" style="background: ${s.color || '#888'}">${s.initials || this.getInitials(s.name)}</div>
                    <div class="staff-info">
                        <span class="staff-name">${s.name}</span>
                        <span class="staff-email ${!s.email ? 'no-email' : ''}">${s.email || 'No email'}</span>
                    </div>
                    ${isPreSelected ? '<span class="assigned-badge">Assigned</span>' : ''}
                </label>
            `;
        }).join('');

        // Default subject and message based on type
        let defaultSubject = '';
        let defaultMessage = '';

        if (type === 'event') {
            defaultSubject = `Event: ${entity.name}`;
            defaultMessage = '';
        } else if (type === 'group') {
            defaultSubject = `Group: ${entity.name}`;
            defaultMessage = '';
        } else if (type === 'lesson') {
            const student = this.getStudentById(entity.studentId);
            defaultSubject = `New Lesson Assignment: ${student?.name || entity.studentName || 'Student'}`;
            defaultMessage = `You have been assigned a new lesson:

Student: ${student?.name || entity.studentName || 'Unknown'}
Instrument: ${entity.instrument || 'N/A'}
Day: ${entity.day || 'TBC'}
Time: ${entity.time || 'TBC'}
Location: ${entity.location || 'TBC'}

Please check the MGS Arts Portal for more details.`;
        }

        const emailMethodMessage = emailConfigured
            ? `<span class="email-method native">Email will be sent directly from the app.</span>`
            : `<span class="email-method mailto">This will open your email client with a pre-filled message.</span>`;

        content = `
            <div class="notify-staff-modal">
                <div class="form-group">
                    <label>Recipients <small>(assigned staff are pre-selected)</small></label>
                    <div class="staff-checkbox-list">
                        ${staffCheckboxes}
                    </div>
                </div>
                <div class="form-group">
                    <label>Subject</label>
                    <input type="text" id="notify-staff-subject" class="form-control" value="${defaultSubject.replace(/"/g, '&quot;')}">
                </div>
                <div class="form-group">
                    <label>Message</label>
                    <textarea id="notify-staff-message" class="form-control" rows="6" placeholder="Type your message here...">${defaultMessage}</textarea>
                </div>
                <p class="text-muted" style="margin-top: var(--spacing-md); font-size: 0.85rem;">
                    ${emailMethodMessage}
                </p>
            </div>
        `;

        this.showModal(`Notify Staff - ${entityName}`, content, async () => {
            const selectedStaffIds = Array.from(document.querySelectorAll('.staff-checkbox-list input[name="staff"]:checked'))
                .map(cb => cb.value);
            const subject = document.getElementById('notify-staff-subject').value;
            const message = document.getElementById('notify-staff-message').value;

            if (selectedStaffIds.length === 0) {
                this.showToast('Please select at least one staff member', 'warning');
                return;
            }
            if (!subject.trim()) {
                this.showToast('Please enter a subject', 'warning');
                return;
            }
            if (!message.trim()) {
                this.showToast('Please enter a message', 'warning');
                return;
            }

            const selectedStaff = selectedStaffIds
                .map(id => this.data.tutors.find(t => t.id === id))
                .filter(s => s && s.email);

            if (selectedStaff.length === 0) {
                this.showToast('No selected staff have email addresses', 'error');
                return;
            }

            this.closeModal();

            if (emailConfigured) {
                this.showToast('Sending emails...', 'info');
                const recipients = selectedStaff.map(s => ({ email: s.email, name: s.name }));
                const results = await EmailService.sendToMultiple(recipients, subject, message, type);
                const successCount = results.filter(r => r.success).length;
                if (successCount > 0) {
                    this.showToast(`Email sent to ${successCount} staff member(s)!`, 'success');
                } else {
                    this.showToast('Failed to send emails', 'error');
                }
            } else {
                const emails = selectedStaff.map(s => s.email).join(',');
                const mailtoSubject = encodeURIComponent(subject);
                const mailtoBody = encodeURIComponent(message);
                window.open(`mailto:${emails}?subject=${mailtoSubject}&body=${mailtoBody}`, '_blank');
                this.showToast('Email draft opened', 'info');
            }
        });
        document.getElementById('modal-save').textContent = 'Send Email';
    }
}

// Initialize app
const app = new App();
window.app = app; // Make available for inline handlers
