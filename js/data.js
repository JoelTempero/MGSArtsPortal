// ========================================
// MGS Arts Portal - Mock Data
// ========================================

const MockData = {
    // Current User
    currentUser: {
        id: 1,
        name: 'R. Horn',
        email: 'r.horn@middleton.school.nz',
        initials: 'RH',
        role: 'admin'
    },

    // Tutors (not users - just stored data)
    tutors: [
        {
            id: 1,
            name: 'Motoi Shibusawa',
            initials: 'MS',
            color: '#8b5cf6',
            disciplines: ['Music'],
            instruments: ['Guitar', 'Bass', 'Ukulele'],
            studentCount: 24,
            lessonsPerWeek: 18
        },
        {
            id: 2,
            name: 'Cameron Finlay',
            initials: 'CF',
            color: '#ec4899',
            disciplines: ['Music'],
            instruments: ['Drums', 'Percussion'],
            studentCount: 16,
            lessonsPerWeek: 12
        },
        {
            id: 3,
            name: 'Lynley Fuglestad',
            initials: 'LF',
            color: '#06b6d4',
            disciplines: ['Music'],
            instruments: ['Piano', 'Keyboard'],
            studentCount: 20,
            lessonsPerWeek: 15
        },
        {
            id: 4,
            name: 'Elizabeth Macfarlane',
            initials: 'EM',
            color: '#f59e0b',
            disciplines: ['Music'],
            instruments: ['Vocals', 'Choir'],
            studentCount: 18,
            lessonsPerWeek: 10
        },
        {
            id: 5,
            name: 'Christine Rudd',
            initials: 'CR',
            color: '#22c55e',
            disciplines: ['Music'],
            instruments: ['Piano', 'Music Theory'],
            studentCount: 14,
            lessonsPerWeek: 10
        },
        {
            id: 6,
            name: 'Lana Law',
            initials: 'LL',
            color: '#3b82f6',
            disciplines: ['Music'],
            instruments: ['Saxophone', 'Clarinet', 'Flute'],
            studentCount: 12,
            lessonsPerWeek: 8
        },
        {
            id: 7,
            name: 'Sarah Mitchell',
            initials: 'SM',
            color: '#ec4899',
            disciplines: ['Drama'],
            instruments: ['Acting', 'Speech & Drama'],
            studentCount: 28,
            lessonsPerWeek: 8
        },
        {
            id: 8,
            name: 'James Cooper',
            initials: 'JC',
            color: '#06b6d4',
            disciplines: ['Dance'],
            instruments: ['Contemporary', 'Jazz'],
            studentCount: 22,
            lessonsPerWeek: 6
        }
    ],

    // Students
    students: [
        { id: 1, name: 'Sam Ure', class: '7WH', year: 7, disciplines: ['Music'], instruments: ['Guitar'], tutorId: 1, status: 'active' },
        { id: 2, name: 'Monty Given', class: '8BR', year: 8, disciplines: ['Music'], instruments: ['Guitar'], tutorId: 1, status: 'active' },
        { id: 3, name: 'Chené Walsh', class: '9PE', year: 9, disciplines: ['Music'], instruments: ['Guitar'], tutorId: 1, status: 'active' },
        { id: 4, name: 'Blake Ramsay', class: '10CH', year: 10, disciplines: ['Music'], instruments: ['Guitar'], tutorId: 1, status: 'active' },
        { id: 5, name: 'Austin Fletcher', class: '7SM', year: 7, disciplines: ['Music'], instruments: ['Drums'], tutorId: 2, status: 'active' },
        { id: 6, name: 'Oliver Owen', class: '8JK', year: 8, disciplines: ['Music'], instruments: ['Guitar'], tutorId: 1, status: 'active' },
        { id: 7, name: 'Ella-Rose McConnell', class: '9TH', year: 9, disciplines: ['Music'], instruments: ['Drums'], tutorId: 2, status: 'active' },
        { id: 8, name: 'Asia Hardanava', class: '10WS', year: 10, disciplines: ['Music'], instruments: ['Guitar'], tutorId: 1, status: 'active' },
        { id: 9, name: 'Annabelle Venter', class: '11AR', year: 11, disciplines: ['Music'], instruments: ['Guitar'], tutorId: 1, status: 'active' },
        { id: 10, name: 'Paige Churton', class: '7LM', year: 7, disciplines: ['Music'], instruments: ['Drums'], tutorId: 2, status: 'active' },
        { id: 11, name: 'Sol Armstrong', class: '8DP', year: 8, disciplines: ['Music'], instruments: ['Guitar'], tutorId: 1, status: 'active' },
        { id: 12, name: 'Gabriel Perry', class: '3r9', year: 3, disciplines: ['Music'], instruments: ['Piano'], tutorId: 3, status: 'active' },
        { id: 13, name: 'Kelsea Andales', class: '7PM', year: 7, disciplines: ['Music'], instruments: ['Drums'], tutorId: 2, status: 'active' },
        { id: 14, name: 'Daniel Reyneke', class: '5r12', year: 5, disciplines: ['Music'], instruments: ['Drums'], tutorId: 2, status: 'waiting' },
        { id: 15, name: 'Wilf Lowe', class: '9BR', year: 9, disciplines: ['Music'], instruments: ['Guitar'], tutorId: 1, status: 'active' },
        { id: 16, name: 'Ayala Moe', class: '11HD', year: 11, disciplines: ['Music'], instruments: ['Vocals'], tutorId: 4, status: 'assigned' },
        { id: 17, name: 'Amber Judkins', class: '11SV', year: 11, disciplines: ['Music'], instruments: ['Piano'], tutorId: 5, status: 'assigned' },
        { id: 18, name: 'Shanna Moe', class: '13WN', year: 13, disciplines: ['Music'], instruments: ['Vocals'], tutorId: 4, status: 'assigned' },
        { id: 19, name: 'Theo Read', class: '13CH', year: 13, disciplines: ['Music'], instruments: ['Saxophone'], tutorId: 6, status: 'assigned' },
        { id: 20, name: 'Emily Watson', class: '10PE', year: 10, disciplines: ['Drama'], instruments: ['Acting'], tutorId: 7, status: 'active' },
        { id: 21, name: 'Jack Morrison', class: '11BR', year: 11, disciplines: ['Drama'], instruments: ['Speech & Drama'], tutorId: 7, status: 'active' },
        { id: 22, name: 'Sophie Chen', class: '9WH', year: 9, disciplines: ['Dance'], instruments: ['Contemporary'], tutorId: 8, status: 'active' },
        { id: 23, name: 'Mia Thompson', class: '10JK', year: 10, disciplines: ['Dance'], instruments: ['Jazz'], tutorId: 8, status: 'active' }
    ],

    // Today's Lessons (Day Planner)
    todaysLessons: [
        { id: 1, studentId: 1, tutorId: 1, time: '8:20 AM - 8:40 AM', discipline: 'Music', instrument: 'Guitar', attendance: 'present' },
        { id: 2, studentId: 2, tutorId: 1, time: '8:40 AM - 9:00 AM', discipline: 'Music', instrument: 'Guitar', attendance: 'present' },
        { id: 3, studentId: 3, tutorId: 1, time: '9:00 AM - 9:20 AM', discipline: 'Music', instrument: 'Guitar', attendance: 'late' },
        { id: 4, studentId: 4, tutorId: 1, time: '9:20 AM - 9:40 AM', discipline: 'Music', instrument: 'Guitar', attendance: 'present' },
        { id: 5, studentId: 5, tutorId: 2, time: '9:30 AM - 10:00 AM', discipline: 'Music', instrument: 'Drums', attendance: 'unmarked' },
        { id: 6, studentId: 6, tutorId: 1, time: '9:40 AM - 10:00 AM', discipline: 'Music', instrument: 'Guitar', attendance: 'unmarked' },
        { id: 7, studentId: 7, tutorId: 2, time: '10:00 AM - 10:30 AM', discipline: 'Music', instrument: 'Drums', attendance: 'unmarked' },
        { id: 8, studentId: 8, tutorId: 1, time: '10:00 AM - 10:20 AM', discipline: 'Music', instrument: 'Guitar', attendance: 'absent' },
        { id: 9, studentId: 9, tutorId: 1, time: '10:20 AM - 10:40 AM', discipline: 'Music', instrument: 'Guitar', attendance: 'unmarked' },
        { id: 10, studentId: 10, tutorId: 2, time: '10:30 AM - 11:00 AM', discipline: 'Music', instrument: 'Drums', attendance: 'unmarked' },
        { id: 11, studentId: 11, tutorId: 1, time: '10:40 AM - 11:00 AM', discipline: 'Music', instrument: 'Guitar', attendance: 'unmarked' },
        { id: 12, studentId: 12, tutorId: 3, time: '11:00 AM - 11:30 AM', discipline: 'Music', instrument: 'Piano', attendance: 'unmarked' },
        { id: 13, studentId: 20, tutorId: 7, time: '11:30 AM - 12:00 PM', discipline: 'Drama', instrument: 'Acting', attendance: 'present' },
        { id: 14, studentId: 22, tutorId: 8, time: '1:00 PM - 1:30 PM', discipline: 'Dance', instrument: 'Contemporary', attendance: 'present' },
        { id: 15, studentId: 23, tutorId: 8, time: '1:30 PM - 2:00 PM', discipline: 'Dance', instrument: 'Jazz', attendance: 'late' }
    ],

    // All Lessons (recurring schedule)
    lessons: [
        { id: 1, studentId: 1, tutorId: 1, dayTime: 'Thursday 8:20 AM', discipline: 'Music', instrument: 'Guitar', status: 'active' },
        { id: 2, studentId: 2, tutorId: 1, dayTime: 'Thursday 8:40 AM', discipline: 'Music', instrument: 'Guitar', status: 'active' },
        { id: 3, studentId: 3, tutorId: 1, dayTime: 'Thursday 9:00 AM', discipline: 'Music', instrument: 'Guitar', status: 'active' },
        { id: 4, studentId: 4, tutorId: 1, dayTime: 'Thursday 9:20 AM', discipline: 'Music', instrument: 'Guitar', status: 'active' },
        { id: 5, studentId: 5, tutorId: 2, dayTime: 'Thursday 9:30 AM', discipline: 'Music', instrument: 'Drums', status: 'active' },
        { id: 6, studentId: 12, tutorId: 3, dayTime: 'On Demand', discipline: 'Music', instrument: 'Piano', status: 'active' },
        { id: 7, studentId: 13, tutorId: 2, dayTime: 'On Demand', discipline: 'Music', instrument: 'Drums', status: 'active' },
        { id: 8, studentId: 14, tutorId: 2, dayTime: '--', discipline: 'Music', instrument: 'Drums', status: 'waiting' },
        { id: 9, studentId: 15, tutorId: 1, dayTime: 'On Demand', discipline: 'Music', instrument: 'Guitar', status: 'active' },
        { id: 10, studentId: 16, tutorId: 4, dayTime: '--', discipline: 'Music', instrument: 'Vocals', status: 'assigned' },
        { id: 11, studentId: 17, tutorId: 5, dayTime: '--', discipline: 'Music', instrument: 'Piano', status: 'assigned' },
        { id: 12, studentId: 18, tutorId: 4, dayTime: '--', discipline: 'Music', instrument: 'Vocals', status: 'assigned' },
        { id: 13, studentId: 19, tutorId: 6, dayTime: 'Tuesday 8:45 AM', discipline: 'Music', instrument: 'Saxophone', status: 'assigned' },
        { id: 14, studentId: 20, tutorId: 7, dayTime: 'Thursday 11:30 AM', discipline: 'Drama', instrument: 'Acting', status: 'active' },
        { id: 15, studentId: 21, tutorId: 7, dayTime: 'Monday 2:00 PM', discipline: 'Drama', instrument: 'Speech & Drama', status: 'active' },
        { id: 16, studentId: 22, tutorId: 8, dayTime: 'Thursday 1:00 PM', discipline: 'Dance', instrument: 'Contemporary', status: 'active' },
        { id: 17, studentId: 23, tutorId: 8, dayTime: 'Thursday 1:30 PM', discipline: 'Dance', instrument: 'Jazz', status: 'active' }
    ],

    // Lesson Requests
    lessonRequests: [
        { id: 1, studentName: 'Charles (Charlie) Watson', year: 5, discipline: 'Music', instrument: 'Piano', status: 'awaiting', received: 'Sep 11th, 2025', form: 'Lesson Signups 2025 (PRIVATE)' },
        { id: 2, studentName: 'Sylvianne (Sylvie) Watson', year: 7, discipline: 'Music', instrument: 'Guitar', status: 'awaiting', received: 'Sep 11th, 2025', form: 'Lesson Signups 2025 (PRIVATE)' },
        { id: 3, studentName: 'Paige Churton', year: 7, discipline: 'Music', instrument: 'Vocals', status: 'awaiting', received: 'Sep 24th, 2025', form: 'Lesson Signups 2025 (PRIVATE)' },
        { id: 4, studentName: 'Phoebe Ko', year: 2, discipline: 'Music', instrument: 'Violin', status: 'awaiting', received: 'Oct 11th, 2025', form: 'Lesson Signups 2025 (PRIVATE)' },
        { id: 5, studentName: 'Ethan Williams', year: 8, discipline: 'Drama', instrument: 'Acting', status: 'waitlist', received: 'Nov 5th, 2025', form: 'Performing Arts 2026' },
        { id: 6, studentName: 'Olivia Brown', year: 9, discipline: 'Dance', instrument: 'Contemporary', status: 'waitlist', received: 'Nov 8th, 2025', form: 'Performing Arts 2026' }
    ],

    // Events
    events: [
        { id: 1, name: 'Easter Assembly', description: 'Easter Assembly performance', date: 'Apr 8th, 2026', term: 'Term 1', discipline: 'All' },
        { id: 2, name: 'Rock Night', description: 'Annual rock band showcase', date: 'May 7th, 2026', term: 'Term 2', discipline: 'Music' },
        { id: 3, name: 'Cafe Acoustique', description: 'Acoustic performance evening', date: 'May 14th, 2026', term: 'Term 2', discipline: 'Music', alert: true },
        { id: 4, name: 'Big Sing', description: 'Regional choir competition', date: 'Jun 6th, 2026', term: 'Term 2', discipline: 'Music', alert: true },
        { id: 5, name: 'Trial Event', description: 'Test event description', date: 'Jul 16th, 2026', term: 'Term 3', discipline: 'Drama', alert: true },
        { id: 6, name: 'CSMF area rehearsal', description: 'CSMF preparation', date: 'Sep 8th, 2026', term: 'Term 3', discipline: 'Music' },
        { id: 7, name: 'CSMF performance day rehearsal', description: 'CSMF final rehearsal', date: 'Nov 7th, 2026', term: 'Term 4', discipline: 'Music', alert: true },
        { id: 8, name: 'Dance Showcase', description: 'End of year dance performance', date: 'Nov 20th, 2026', term: 'Term 4', discipline: 'Dance' },
        { id: 9, name: 'Drama Production', description: 'Annual school play', date: 'Aug 15th, 2026', term: 'Term 3', discipline: 'Drama' }
    ],

    // Instrument Hires
    instrumentHires: [
        { id: 1, instrument: 'Cello 5 (1/2)', studentName: 'Blake Wilson', hireDate: 'Dec 3rd, 2024', expectedReturn: 'Dec 31st, 2024', agreement: false, status: 'overdue' },
        { id: 2, instrument: 'Cello 6 (3/4)', studentName: 'Ella Drake', hireDate: 'Dec 3rd, 2024', expectedReturn: 'Jan 31st, 2025', agreement: true, status: 'in-progress' },
        { id: 3, instrument: 'Trombone 1', studentName: 'Joshua Judkins', hireDate: 'Mar 1st, 2024', expectedReturn: 'Jan 31st, 2025', agreement: true, status: 'in-progress' },
        { id: 4, instrument: 'Trombone 3', studentName: 'Morgan Du', hireDate: 'Dec 3rd, 2024', expectedReturn: 'Jan 31st, 2025', agreement: true, status: 'in-progress' },
        { id: 5, instrument: 'Flute 6', studentName: 'Tiffany Norriss', hireDate: 'Dec 6th, 2024', expectedReturn: 'Jan 31st, 2025', agreement: false, status: 'due-soon' },
        { id: 6, instrument: 'Trumpet 6', studentName: 'Raya Stuart', hireDate: 'Dec 6th, 2024', expectedReturn: 'Jan 31st, 2025', agreement: false, status: 'due-soon' },
        { id: 7, instrument: 'Cello 3 (4/4)', studentName: 'Maria Hoyt', hireDate: 'Dec 3rd, 2024', expectedReturn: 'Jan 31st, 2025', agreement: false, status: 'in-progress' },
        { id: 8, instrument: 'Cello 4 (1/2)', studentName: 'Kaitlynn Cree', hireDate: 'Dec 6th, 2024', expectedReturn: 'Jan 31st, 2025', agreement: false, status: 'due-soon' },
        { id: 9, instrument: 'Violin 5 (3/4)', studentName: 'Laurika de Lange', hireDate: 'Dec 6th, 2024', expectedReturn: 'Jan 31st, 2025', agreement: false, status: 'in-progress' }
    ],

    // Instruments Inventory
    instruments: [
        { id: 1, name: 'Cello 1', type: 'Cello', size: '4/4', condition: 'Good', status: 'Available' },
        { id: 2, name: 'Cello 2', type: 'Cello', size: '4/4', condition: 'Good', status: 'Available' },
        { id: 3, name: 'Cello 3', type: 'Cello', size: '4/4', condition: 'Fair', status: 'On Hire' },
        { id: 4, name: 'Cello 4', type: 'Cello', size: '1/2', condition: 'Good', status: 'On Hire' },
        { id: 5, name: 'Cello 5', type: 'Cello', size: '1/2', condition: 'Good', status: 'On Hire' },
        { id: 6, name: 'Cello 6', type: 'Cello', size: '3/4', condition: 'Excellent', status: 'On Hire' },
        { id: 7, name: 'Violin 1', type: 'Violin', size: '4/4', condition: 'Good', status: 'Available' },
        { id: 8, name: 'Violin 2', type: 'Violin', size: '4/4', condition: 'Fair', status: 'Available' },
        { id: 9, name: 'Violin 3', type: 'Violin', size: '3/4', condition: 'Good', status: 'Available' },
        { id: 10, name: 'Violin 4', type: 'Violin', size: '1/2', condition: 'Good', status: 'Available' },
        { id: 11, name: 'Violin 5', type: 'Violin', size: '3/4', condition: 'Good', status: 'On Hire' },
        { id: 12, name: 'Trombone 1', type: 'Trombone', size: 'Standard', condition: 'Good', status: 'On Hire' },
        { id: 13, name: 'Trombone 2', type: 'Trombone', size: 'Standard', condition: 'Good', status: 'Available' },
        { id: 14, name: 'Trombone 3', type: 'Trombone', size: 'Standard', condition: 'Fair', status: 'On Hire' },
        { id: 15, name: 'Trumpet 1', type: 'Trumpet', size: 'Standard', condition: 'Excellent', status: 'Available' },
        { id: 16, name: 'Trumpet 6', type: 'Trumpet', size: 'Standard', condition: 'Good', status: 'On Hire' },
        { id: 17, name: 'Flute 1', type: 'Flute', size: 'Standard', condition: 'Good', status: 'Available' },
        { id: 18, name: 'Flute 6', type: 'Flute', size: 'Standard', condition: 'Good', status: 'On Hire' }
    ],

    // Groups
    groups: [
        { id: 1, name: 'Concert Band', type: 'Ensemble', discipline: 'Music', memberCount: 32, meetingTime: 'Wednesday 3:30 PM' },
        { id: 2, name: 'Jazz Band', type: 'Ensemble', discipline: 'Music', memberCount: 14, meetingTime: 'Thursday 3:30 PM' },
        { id: 3, name: 'Senior Choir', type: 'Choir', discipline: 'Music', memberCount: 45, meetingTime: 'Tuesday 12:30 PM' },
        { id: 4, name: 'Junior Choir', type: 'Choir', discipline: 'Music', memberCount: 38, meetingTime: 'Monday 12:30 PM' },
        { id: 5, name: 'Rock Band A', type: 'Band', discipline: 'Music', memberCount: 5, meetingTime: 'Friday 3:30 PM' },
        { id: 6, name: 'Rock Band B', type: 'Band', discipline: 'Music', memberCount: 5, meetingTime: 'Friday 4:30 PM' },
        { id: 7, name: 'Drama Club', type: 'Club', discipline: 'Drama', memberCount: 28, meetingTime: 'Wednesday 3:30 PM' },
        { id: 8, name: 'Dance Crew', type: 'Crew', discipline: 'Dance', memberCount: 16, meetingTime: 'Tuesday 3:30 PM' },
        { id: 9, name: 'String Quartet', type: 'Chamber', discipline: 'Music', memberCount: 4, meetingTime: 'Monday 3:30 PM' }
    ]
};

// Helper functions
function getStudentById(id) {
    return MockData.students.find(s => s.id === id);
}

function getTutorById(id) {
    return MockData.tutors.find(t => t.id === id);
}

function getDisciplineColor(discipline) {
    const colors = {
        'Music': 'music',
        'Drama': 'drama',
        'Dance': 'dance'
    };
    return colors[discipline] || 'music';
}

function getStatusClass(status) {
    const classes = {
        'active': 'status-active',
        'waiting': 'status-waiting',
        'assigned': 'status-assigned',
        'awaiting': 'status-pending',
        'waitlist': 'status-waiting'
    };
    return classes[status] || 'status-active';
}

function getAttendanceClass(attendance) {
    const classes = {
        'present': 'attendance-present',
        'late': 'attendance-late',
        'absent': 'attendance-absent',
        'unmarked': 'attendance-unmarked'
    };
    return classes[attendance] || 'attendance-unmarked';
}
