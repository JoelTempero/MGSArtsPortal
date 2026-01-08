// ========================================
// MGS Arts Portal - Main Application
// ========================================

class App {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentDate = new Date(2026, 0, 8); // January 8, 2026
        this.theme = localStorage.getItem('theme') || 'dark';
        
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindEvents();
        this.setupNavigation();
        this.renderDashboard();
        
        // Check for demo login
        const isLoggedIn = sessionStorage.getItem('loggedIn');
        if (isLoggedIn) {
            this.showApp();
        }
    }

    // ========================================
    // Theme Management
    // ========================================
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    // ========================================
    // Authentication (Demo)
    // ========================================

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Demo authentication
        if (email === 'r.horn@middleton.school.nz' && password === 'demo123') {
            sessionStorage.setItem('loggedIn', 'true');
            this.showApp();
            this.showToast('Welcome to MGS Arts Portal!', 'success');
        } else {
            this.showToast('Invalid credentials. Check the login hint below.', 'error');
        }
    }

    handleLogout() {
        sessionStorage.removeItem('loggedIn');
        document.getElementById('login-screen').classList.add('active');
        document.getElementById('app-screen').classList.remove('active');
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }

    showApp() {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('app-screen').classList.add('active');
    }

    // ========================================
    // Navigation
    // ========================================

    setupNavigation() {
        // Nav group toggles
        document.querySelectorAll('.nav-group-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const group = toggle.dataset.group;
                const items = document.querySelector(`.nav-group-items[data-group="${group}"]`);
                toggle.classList.toggle('expanded');
                items.classList.toggle('expanded');
            });
        });
    }

    navigateTo(page) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });

        // Update active page
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        this.currentPage = page;
        this.closeSidebar();

        // Render page content
        this.renderPage(page);
    }

    renderPage(page) {
        switch(page) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'planner':
                this.renderPlanner();
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
            case 'hires':
                this.renderHires();
                break;
            case 'groups':
                this.renderGroups();
                break;
            case 'instrument-list':
                this.renderInstruments();
                break;
        }
    }

    // ========================================
    // Sidebar Management
    // ========================================

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const menuToggle = document.getElementById('menu-toggle');
        
        sidebar.classList.toggle('open');
        overlay.classList.toggle('visible');
        menuToggle.classList.toggle('active');
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const menuToggle = document.getElementById('menu-toggle');
        
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
        menuToggle.classList.remove('active');
    }

    // ========================================
    // Dashboard Rendering
    // ========================================

    renderDashboard() {
        this.renderUpcomingEvents();
        this.renderRecentRequests();
        this.updateLessonCount();
    }

    renderUpcomingEvents() {
        const container = document.getElementById('events-list');
        if (!container) return;

        const upcomingEvents = MockData.events.slice(0, 4);
        
        container.innerHTML = upcomingEvents.map(event => `
            <div class="event-item">
                <div class="event-info">
                    <span class="event-name">${event.name}</span>
                    <span class="event-date">${event.date}</span>
                </div>
                ${event.alert ? `
                    <div class="event-badge warning">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            <path d="M12 9v4M12 17h.01"/>
                        </svg>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    renderRecentRequests() {
        const container = document.getElementById('recent-requests');
        if (!container) return;

        const recentRequests = MockData.lessonRequests.slice(0, 3);
        
        container.innerHTML = recentRequests.map(request => `
            <div class="request-item">
                <div class="request-info">
                    <span class="request-name">${request.studentName.split('(')[0].trim()}</span>
                    <span class="request-detail">Year ${request.year} • ${request.instrument}</span>
                </div>
                <span class="discipline-tag discipline-${getDisciplineColor(request.discipline)}">${request.discipline}</span>
            </div>
        `).join('');
    }

    updateLessonCount() {
        const total = MockData.todaysLessons.length;
        const totalEl = document.getElementById('total-lessons');
        if (totalEl) {
            totalEl.textContent = total;
        }
    }

    // ========================================
    // Day Planner Rendering
    // ========================================

    renderPlanner() {
        const tbody = document.getElementById('planner-body');
        if (!tbody) return;

        tbody.innerHTML = MockData.todaysLessons.map(lesson => {
            const student = getStudentById(lesson.studentId);
            const tutor = getTutorById(lesson.tutorId);
            
            return `
                <tr>
                    <td>${lesson.time}</td>
                    <td>
                        <div class="cell-student">
                            <div class="student-avatar ${getDisciplineColor(lesson.discipline)}">${student.name.charAt(0)}</div>
                            <div class="student-info">
                                <span class="student-name">${student.name}</span>
                                <span class="student-class">${student.class}</span>
                            </div>
                        </div>
                    </td>
                    <td><span class="discipline-tag discipline-${getDisciplineColor(lesson.discipline)}">${lesson.discipline}</span></td>
                    <td>${lesson.instrument}</td>
                    <td>
                        <div class="cell-tutor">
                            <div class="tutor-avatar" style="background: ${tutor.color}; color: white;">${tutor.initials}</div>
                            <span>${tutor.name}</span>
                        </div>
                    </td>
                    <td>
                        <div class="row-actions">
                            <button class="row-action-btn" title="Edit">
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
    }

    // ========================================
    // Lessons List Rendering
    // ========================================

    renderLessons() {
        const tbody = document.getElementById('lessons-body');
        if (!tbody) return;

        tbody.innerHTML = MockData.lessons.map(lesson => {
            const student = getStudentById(lesson.studentId);
            const tutor = getTutorById(lesson.tutorId);
            
            return `
                <tr>
                    <td>
                        <div class="cell-student">
                            <div class="student-avatar ${getDisciplineColor(lesson.discipline)}">${student.name.charAt(0)}</div>
                            <span class="student-name">${student.name}</span>
                        </div>
                    </td>
                    <td>${student.class}</td>
                    <td><span class="discipline-tag discipline-${getDisciplineColor(lesson.discipline)}">${lesson.discipline}</span></td>
                    <td>${lesson.instrument}</td>
                    <td>${lesson.dayTime}</td>
                    <td>
                        <div class="cell-tutor">
                            <div class="tutor-avatar" style="background: ${tutor.color}; color: white;">${tutor.initials}</div>
                            <span>${tutor.name}</span>
                        </div>
                    </td>
                    <td><span class="status-badge ${getStatusClass(lesson.status)}">${lesson.status}</span></td>
                </tr>
            `;
        }).join('');
    }

    // ========================================
    // Students Rendering
    // ========================================

    renderStudents() {
        const tbody = document.getElementById('students-body');
        if (!tbody) return;

        tbody.innerHTML = MockData.students.map(student => {
            const tutor = getTutorById(student.tutorId);
            const disciplineClass = getDisciplineColor(student.disciplines[0]);
            
            return `
                <tr>
                    <td>
                        <div class="cell-student">
                            <div class="student-avatar ${disciplineClass}">${student.name.charAt(0)}</div>
                            <span class="student-name">${student.name}</span>
                        </div>
                    </td>
                    <td>${student.year}</td>
                    <td>${student.class}</td>
                    <td>
                        ${student.disciplines.map(d => `<span class="discipline-tag discipline-${getDisciplineColor(d)}">${d}</span>`).join(' ')}
                    </td>
                    <td>
                        <div class="cell-tutor">
                            <div class="tutor-avatar" style="background: ${tutor.color}; color: white;">${tutor.initials}</div>
                            <span>${tutor.name}</span>
                        </div>
                    </td>
                    <td><span class="status-badge ${getStatusClass(student.status)}">${student.status}</span></td>
                    <td>
                        <div class="row-actions">
                            <button class="row-action-btn" title="Edit">
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
    }

    // ========================================
    // Tutors Rendering
    // ========================================

    renderTutors() {
        const container = document.getElementById('tutors-grid');
        if (!container) return;

        container.innerHTML = MockData.tutors.map(tutor => `
            <div class="tutor-card">
                <div class="tutor-card-header">
                    <div class="tutor-avatar-large" style="background: ${tutor.color};">${tutor.initials}</div>
                    <div class="tutor-header-info">
                        <div class="tutor-name">${tutor.name}</div>
                        <div class="tutor-role">Tutor</div>
                    </div>
                </div>
                <div class="tutor-disciplines">
                    ${tutor.disciplines.map(d => `<span class="discipline-tag discipline-${getDisciplineColor(d)}">${d}</span>`).join('')}
                    ${tutor.instruments.map(i => `<span class="discipline-tag" style="background: var(--color-bg-elevated); color: var(--color-text-secondary);">${i}</span>`).join('')}
                </div>
                <div class="tutor-stats">
                    <div class="tutor-stat">
                        <div class="tutor-stat-value">${tutor.studentCount}</div>
                        <div class="tutor-stat-label">Students</div>
                    </div>
                    <div class="tutor-stat">
                        <div class="tutor-stat-value">${tutor.lessonsPerWeek}</div>
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

        tbody.innerHTML = MockData.events.map(event => `
            <tr>
                <td><strong>${event.name}</strong></td>
                <td>${event.description}</td>
                <td>${event.date}</td>
                <td>${event.term}</td>
                <td><span class="discipline-tag discipline-${event.discipline === 'All' ? 'music' : getDisciplineColor(event.discipline)}">${event.discipline}</span></td>
                <td>
                    <div class="row-actions">
                        <button class="row-action-btn" title="Edit">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="row-action-btn" title="Delete">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ========================================
    // Requests Rendering
    // ========================================

    renderRequests() {
        const tbody = document.getElementById('requests-body');
        if (!tbody) return;

        tbody.innerHTML = MockData.lessonRequests.map(request => `
            <tr>
                <td><strong>${request.studentName}</strong></td>
                <td>${request.year}</td>
                <td><span class="discipline-tag discipline-${getDisciplineColor(request.discipline)}">${request.discipline}</span></td>
                <td>${request.instrument}</td>
                <td><span class="status-badge ${getStatusClass(request.status)}">${request.status === 'awaiting' ? 'Awaiting Review' : 'Waiting List'}</span></td>
                <td>${request.received}</td>
                <td style="font-size: 0.8rem; color: var(--color-text-muted);">${request.form}</td>
                <td>
                    <div class="row-actions">
                        <button class="row-action-btn" title="Approve" style="color: var(--color-success);">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 6L9 17l-5-5"/>
                            </svg>
                        </button>
                        <button class="row-action-btn" title="Reject" style="color: var(--color-danger);">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ========================================
    // Instrument Hires Rendering
    // ========================================

    renderHires() {
        const tbody = document.getElementById('hires-body');
        if (!tbody) return;

        tbody.innerHTML = MockData.instrumentHires.map(hire => {
            const statusClass = hire.status === 'overdue' ? 'status-badge' : 
                               hire.status === 'due-soon' ? 'status-badge status-assigned' : 
                               'status-badge status-active';
            const statusText = hire.status === 'overdue' ? 'Overdue' :
                              hire.status === 'due-soon' ? 'Due Soon' : 'In Progress';
            
            return `
                <tr>
                    <td><strong>${hire.instrument}</strong></td>
                    <td>${hire.studentName}</td>
                    <td>${hire.hireDate}</td>
                    <td>${hire.expectedReturn}</td>
                    <td>
                        ${hire.agreement ? 
                            '<span class="status-badge status-active">Uploaded</span>' : 
                            '<button class="btn btn-outline btn-sm">Upload</button>'}
                    </td>
                    <td><span class="${statusClass}" style="${hire.status === 'overdue' ? 'background: var(--color-danger-bg); color: var(--color-danger);' : ''}">${statusText}</span></td>
                    <td>
                        <div class="row-actions">
                            <button class="row-action-btn" title="View">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // ========================================
    // Groups Rendering
    // ========================================

    renderGroups() {
        const container = document.getElementById('groups-grid');
        if (!container) return;

        container.innerHTML = MockData.groups.map(group => `
            <div class="group-card">
                <div class="group-card-header">
                    <div class="group-name">${group.name}</div>
                    <div class="group-type">${group.type}</div>
                </div>
                <div class="group-card-body">
                    <div class="group-meta">
                        <div class="group-meta-item">
                            <span class="group-meta-value">${group.memberCount}</span>
                            <span class="group-meta-label">Members</span>
                        </div>
                        <div class="group-meta-item">
                            <span class="group-meta-value discipline-tag discipline-${getDisciplineColor(group.discipline)}">${group.discipline}</span>
                        </div>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--color-text-muted);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; display: inline; vertical-align: middle; margin-right: 4px;">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                        </svg>
                        ${group.meetingTime}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ========================================
    // Instruments Inventory Rendering
    // ========================================

    renderInstruments() {
        const tbody = document.getElementById('instruments-body');
        if (!tbody) return;

        tbody.innerHTML = MockData.instruments.map(instrument => {
            const statusClass = instrument.status === 'Available' ? 'status-active' : 'status-assigned';
            
            return `
                <tr>
                    <td><strong>${instrument.name}</strong></td>
                    <td>${instrument.type}</td>
                    <td>${instrument.size}</td>
                    <td>${instrument.condition}</td>
                    <td><span class="status-badge ${statusClass}">${instrument.status}</span></td>
                    <td>
                        <div class="row-actions">
                            <button class="row-action-btn" title="Edit">
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
    }

    // ========================================
    // Modal Management
    // ========================================

    showModal(title, content) {
        const overlay = document.getElementById('modal-overlay');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        overlay.classList.add('visible');
    }

    closeModal() {
        const overlay = document.getElementById('modal-overlay');
        overlay.classList.remove('visible');
    }

    // ========================================
    // Toast Notifications
    // ========================================

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '<path d="M20 6L9 17l-5-5"/>',
            error: '<path d="M18 6L6 18M6 6l12 12"/>',
            warning: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
            info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'
        };

        toast.innerHTML = `
            <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${icons[type]}
            </svg>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ========================================
    // Event Binding
    // ========================================

    bindEvents() {
        // Login form
        document.getElementById('login-form')?.addEventListener('submit', (e) => this.handleLogin(e));

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => this.handleLogout());

        // Mobile menu
        document.getElementById('menu-toggle')?.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('sidebar-close')?.addEventListener('click', () => this.closeSidebar());
        document.getElementById('sidebar-overlay')?.addEventListener('click', () => this.closeSidebar());

        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());

        // Navigation
        document.querySelectorAll('[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(item.dataset.page);
            });
        });

        // Modal close
        document.getElementById('modal-close')?.addEventListener('click', () => this.closeModal());
        document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeModal();
        });

        // Quick actions
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAction(e.currentTarget.dataset.action));
        });

        // Search functionality
        this.bindSearchEvents();

        // Tab functionality
        this.bindTabEvents();
    }

    bindSearchEvents() {
        const searchInputs = ['planner-search', 'lessons-search', 'students-search', 'events-search', 'hires-search', 'instruments-search'];
        
        searchInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => this.handleSearch(e.target.value, id.replace('-search', '')));
            }
        });
    }

    bindTabEvents() {
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const parent = e.target.closest('.page-tabs');
                parent.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.showToast(`Filtered by: ${e.target.textContent}`, 'info');
            });
        });
    }

    handleSearch(query, section) {
        // Demo search feedback
        if (query.length > 2) {
            this.showToast(`Searching ${section} for "${query}"...`, 'info');
        }
    }

    handleAction(action) {
        const actions = {
            'add-lesson': () => this.showModal('Add New Lesson', this.getLessonFormHTML()),
            'add-student': () => this.showModal('Add New Student', this.getStudentFormHTML()),
            'add-event': () => this.showModal('Create Event', this.getEventFormHTML()),
            'add-tutor': () => this.showModal('Add Tutor', this.getTutorFormHTML()),
            'add-group': () => this.showModal('Create Group', this.getGroupFormHTML()),
            'add-instrument': () => this.showModal('Add Instrument', this.getInstrumentFormHTML()),
            'new-hire': () => this.showModal('New Instrument Hire', this.getHireFormHTML()),
            'create-form': () => this.showModal('Create Signup Form', this.getSignupFormHTML()),
            'export-data': () => this.handleExport(),
            'import-data': () => this.handleImport(),
            'today': () => this.showToast('Navigated to today', 'info'),
            'prev-day': () => this.showToast('Previous day', 'info'),
            'next-day': () => this.showToast('Next day', 'info')
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    handleExport() {
        this.showToast('Exporting data... (Demo)', 'info');
        setTimeout(() => {
            this.showToast('Data exported successfully!', 'success');
        }, 1500);
    }

    handleImport() {
        this.showModal('Import Data', `
            <div style="text-align: center; padding: 2rem;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 64px; height: 64px; color: var(--color-text-muted); margin-bottom: 1rem;">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <h3 style="margin-bottom: 0.5rem;">Import Data</h3>
                <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">Upload a JSON or CSV file to import data</p>
                <button class="btn btn-primary" onclick="app.showToast('File picker would open here (Demo)', 'info')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Choose File
                </button>
            </div>
        `);
    }

    // Form HTML generators
    getLessonFormHTML() {
        return `
            <form class="modal-form" onsubmit="event.preventDefault(); app.showToast('Lesson created! (Demo)', 'success'); app.closeModal();">
                <div class="form-group">
                    <label>Student</label>
                    <select class="setting-input" required>
                        <option value="">Select student...</option>
                        ${MockData.students.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Discipline</label>
                    <select class="setting-input" required>
                        <option value="Music">Music</option>
                        <option value="Drama">Drama</option>
                        <option value="Dance">Dance</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Instrument/Focus</label>
                    <input type="text" class="setting-input" placeholder="e.g., Guitar, Acting, Contemporary" required>
                </div>
                <div class="form-group">
                    <label>Tutor</label>
                    <select class="setting-input" required>
                        <option value="">Select tutor...</option>
                        ${MockData.tutors.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Day & Time</label>
                    <input type="text" class="setting-input" placeholder="e.g., Thursday 9:00 AM" required>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" style="flex: 1;">Create Lesson</button>
                </div>
            </form>
        `;
    }

    getStudentFormHTML() {
        return `
            <form class="modal-form" onsubmit="event.preventDefault(); app.showToast('Student added! (Demo)', 'success'); app.closeModal();">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" class="setting-input" placeholder="Enter student name" required>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Year Level</label>
                        <select class="setting-input" required>
                            ${[...Array(13)].map((_, i) => `<option value="${i+1}">Year ${i+1}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Class</label>
                        <input type="text" class="setting-input" placeholder="e.g., 7WH" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Discipline(s)</label>
                    <div style="display: flex; gap: 1rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" value="Music"> Music
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" value="Drama"> Drama
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" value="Dance"> Dance
                        </label>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" style="flex: 1;">Add Student</button>
                </div>
            </form>
        `;
    }

    getEventFormHTML() {
        return `
            <form class="modal-form" onsubmit="event.preventDefault(); app.showToast('Event created! (Demo)', 'success'); app.closeModal();">
                <div class="form-group">
                    <label>Event Name</label>
                    <input type="text" class="setting-input" placeholder="Enter event name" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="setting-input" rows="3" placeholder="Event description"></textarea>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" class="setting-input" required>
                    </div>
                    <div class="form-group">
                        <label>Term</label>
                        <select class="setting-input" required>
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                            <option value="Term 4">Term 4</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Discipline</label>
                    <select class="setting-input" required>
                        <option value="All">All</option>
                        <option value="Music">Music</option>
                        <option value="Drama">Drama</option>
                        <option value="Dance">Dance</option>
                    </select>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" style="flex: 1;">Create Event</button>
                </div>
            </form>
        `;
    }

    getTutorFormHTML() {
        return `
            <form class="modal-form" onsubmit="event.preventDefault(); app.showToast('Tutor added! (Demo)', 'success'); app.closeModal();">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" class="setting-input" placeholder="Enter tutor name" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="setting-input" placeholder="tutor@email.com">
                </div>
                <div class="form-group">
                    <label>Discipline(s)</label>
                    <div style="display: flex; gap: 1rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" value="Music"> Music
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" value="Drama"> Drama
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" value="Dance"> Dance
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label>Instruments/Areas Taught</label>
                    <input type="text" class="setting-input" placeholder="e.g., Guitar, Piano, Acting">
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" style="flex: 1;">Add Tutor</button>
                </div>
            </form>
        `;
    }

    getGroupFormHTML() {
        return `
            <form class="modal-form" onsubmit="event.preventDefault(); app.showToast('Group created! (Demo)', 'success'); app.closeModal();">
                <div class="form-group">
                    <label>Group Name</label>
                    <input type="text" class="setting-input" placeholder="e.g., Concert Band" required>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Type</label>
                        <select class="setting-input" required>
                            <option value="Ensemble">Ensemble</option>
                            <option value="Choir">Choir</option>
                            <option value="Band">Band</option>
                            <option value="Club">Club</option>
                            <option value="Crew">Crew</option>
                            <option value="Chamber">Chamber</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Discipline</label>
                        <select class="setting-input" required>
                            <option value="Music">Music</option>
                            <option value="Drama">Drama</option>
                            <option value="Dance">Dance</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Meeting Time</label>
                    <input type="text" class="setting-input" placeholder="e.g., Wednesday 3:30 PM">
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" style="flex: 1;">Create Group</button>
                </div>
            </form>
        `;
    }

    getInstrumentFormHTML() {
        return `
            <form class="modal-form" onsubmit="event.preventDefault(); app.showToast('Instrument added! (Demo)', 'success'); app.closeModal();">
                <div class="form-group">
                    <label>Instrument Name</label>
                    <input type="text" class="setting-input" placeholder="e.g., Cello 7" required>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Type</label>
                        <select class="setting-input" required>
                            <option value="Cello">Cello</option>
                            <option value="Violin">Violin</option>
                            <option value="Viola">Viola</option>
                            <option value="Flute">Flute</option>
                            <option value="Clarinet">Clarinet</option>
                            <option value="Saxophone">Saxophone</option>
                            <option value="Trumpet">Trumpet</option>
                            <option value="Trombone">Trombone</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Size</label>
                        <select class="setting-input">
                            <option value="4/4">4/4 (Full)</option>
                            <option value="3/4">3/4</option>
                            <option value="1/2">1/2</option>
                            <option value="1/4">1/4</option>
                            <option value="Standard">Standard</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Condition</label>
                    <select class="setting-input">
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                    </select>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" style="flex: 1;">Add Instrument</button>
                </div>
            </form>
        `;
    }

    getHireFormHTML() {
        return `
            <form class="modal-form" onsubmit="event.preventDefault(); app.showToast('Hire created! (Demo)', 'success'); app.closeModal();">
                <div class="form-group">
                    <label>Instrument</label>
                    <select class="setting-input" required>
                        <option value="">Select instrument...</option>
                        ${MockData.instruments.filter(i => i.status === 'Available').map(i => `<option value="${i.id}">${i.name} (${i.size})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Student</label>
                    <select class="setting-input" required>
                        <option value="">Select student...</option>
                        ${MockData.students.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                    </select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Hire Date</label>
                        <input type="date" class="setting-input" required>
                    </div>
                    <div class="form-group">
                        <label>Expected Return</label>
                        <input type="date" class="setting-input" required>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" style="flex: 1;">Create Hire</button>
                </div>
            </form>
        `;
    }

    getSignupFormHTML() {
        return `
            <form class="modal-form" onsubmit="event.preventDefault(); app.showToast('Form created! (Demo)', 'success'); app.closeModal();">
                <div class="form-group">
                    <label>Form Name</label>
                    <input type="text" class="setting-input" placeholder="e.g., Music Tuition Signups 2026" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="setting-input" rows="3" placeholder="Form description for parents/students"></textarea>
                </div>
                <div class="form-group">
                    <label>Form Type</label>
                    <select class="setting-input" required>
                        <option value="tuition">Music Tuition Signups</option>
                        <option value="groups">Performing Arts Groups</option>
                        <option value="custom">Custom Form</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Closing Date</label>
                    <input type="date" class="setting-input">
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" style="flex: 1;">Create Form</button>
                </div>
            </form>
        `;
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new App();
});

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}
