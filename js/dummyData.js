// ========================================
// MGS Arts Portal - Dummy Data for Testing
// ========================================

const DummyData = {
    // Tutors (Music Itinerant Teachers)
    tutors: [
        {
            name: 'Motoi Shibusawa',
            initials: 'MS',
            email: 'motoi.shibusawa@email.com',
            phone: '021 123 4567',
            color: '#8b5cf6',
            instruments: ['Guitar', 'Bass', 'Ukulele'],
            active: true
        },
        {
            name: 'Cameron Finlay',
            initials: 'CF',
            email: 'cameron.finlay@email.com',
            phone: '021 234 5678',
            color: '#ec4899',
            instruments: ['Drums', 'Percussion'],
            active: true
        },
        {
            name: 'Lynley Fuglestad',
            initials: 'LF',
            email: 'lynley.fuglestad@email.com',
            phone: '021 345 6789',
            color: '#06b6d4',
            instruments: ['Piano', 'Keyboard'],
            active: true
        },
        {
            name: 'Elizabeth Macfarlane',
            initials: 'EM',
            email: 'elizabeth.macfarlane@email.com',
            phone: '021 456 7890',
            color: '#f59e0b',
            instruments: ['Vocals', 'Choir'],
            active: true
        },
        {
            name: 'Christine Rudd',
            initials: 'CR',
            email: 'christine.rudd@email.com',
            phone: '021 567 8901',
            color: '#22c55e',
            instruments: ['Piano', 'Music Theory'],
            active: true
        },
        {
            name: 'Lana Law',
            initials: 'LL',
            email: 'lana.law@email.com',
            phone: '021 678 9012',
            color: '#3b82f6',
            instruments: ['Saxophone', 'Clarinet', 'Flute'],
            active: true
        }
    ],

    // Students
    students: [
        { name: 'Sam Ure', class: '7WH', year: 7, instruments: ['Guitar'], status: 'active', parentEmail: 'ure.family@email.com', parentPhone: '021 111 1001' },
        { name: 'Monty Given', class: '8BR', year: 8, instruments: ['Guitar'], status: 'active', parentEmail: 'given.family@email.com', parentPhone: '021 111 1002' },
        { name: 'Chené Walsh', class: '9PE', year: 9, instruments: ['Guitar'], status: 'active', parentEmail: 'walsh.family@email.com', parentPhone: '021 111 1003' },
        { name: 'Blake Ramsay', class: '10CH', year: 10, instruments: ['Guitar'], status: 'active', parentEmail: 'ramsay.family@email.com', parentPhone: '021 111 1004' },
        { name: 'Austin Fletcher', class: '7SM', year: 7, instruments: ['Drums'], status: 'active', parentEmail: 'fletcher.family@email.com', parentPhone: '021 111 1005' },
        { name: 'Oliver Owen', class: '8JK', year: 8, instruments: ['Guitar'], status: 'active', parentEmail: 'owen.family@email.com', parentPhone: '021 111 1006' },
        { name: 'Ella-Rose McConnell', class: '9TH', year: 9, instruments: ['Drums'], status: 'active', parentEmail: 'mcconnell.family@email.com', parentPhone: '021 111 1007' },
        { name: 'Asia Hardanava', class: '10WS', year: 10, instruments: ['Guitar'], status: 'active', parentEmail: 'hardanava.family@email.com', parentPhone: '021 111 1008' },
        { name: 'Annabelle Venter', class: '11AR', year: 11, instruments: ['Guitar'], status: 'active', parentEmail: 'venter.family@email.com', parentPhone: '021 111 1009' },
        { name: 'Paige Churton', class: '7LM', year: 7, instruments: ['Drums'], status: 'active', parentEmail: 'churton.family@email.com', parentPhone: '021 111 1010' },
        { name: 'Sol Armstrong', class: '8DP', year: 8, instruments: ['Guitar'], status: 'active', parentEmail: 'armstrong.family@email.com', parentPhone: '021 111 1011' },
        { name: 'Gabriel Perry', class: '3r9', year: 3, instruments: ['Piano'], status: 'active', parentEmail: 'perry.family@email.com', parentPhone: '021 111 1012' },
        { name: 'Kelsea Andales', class: '7PM', year: 7, instruments: ['Drums'], status: 'active', parentEmail: 'andales.family@email.com', parentPhone: '021 111 1013' },
        { name: 'Daniel Reyneke', class: '5r12', year: 5, instruments: ['Drums'], status: 'waiting', parentEmail: 'reyneke.family@email.com', parentPhone: '021 111 1014' },
        { name: 'Wilf Lowe', class: '9BR', year: 9, instruments: ['Guitar'], status: 'active', parentEmail: 'lowe.family@email.com', parentPhone: '021 111 1015' },
        { name: 'Ayala Moe', class: '11HD', year: 11, instruments: ['Vocals'], status: 'assigned', parentEmail: 'moe.family@email.com', parentPhone: '021 111 1016' },
        { name: 'Amber Judkins', class: '11SV', year: 11, instruments: ['Piano'], status: 'assigned', parentEmail: 'judkins.family@email.com', parentPhone: '021 111 1017' },
        { name: 'Shanna Moe', class: '13WN', year: 13, instruments: ['Vocals'], status: 'assigned', parentEmail: 'moe2.family@email.com', parentPhone: '021 111 1018' },
        { name: 'Theo Read', class: '13CH', year: 13, instruments: ['Saxophone'], status: 'assigned', parentEmail: 'read.family@email.com', parentPhone: '021 111 1019' },
        { name: 'Lily Chen', class: '8WH', year: 8, instruments: ['Violin'], status: 'active', parentEmail: 'chen.family@email.com', parentPhone: '021 111 1020' },
        { name: 'Marcus Thompson', class: '10BR', year: 10, instruments: ['Trumpet'], status: 'active', parentEmail: 'thompson.family@email.com', parentPhone: '021 111 1021' },
        { name: 'Sophie Williams', class: '7JK', year: 7, instruments: ['Flute'], status: 'active', parentEmail: 'williams.family@email.com', parentPhone: '021 111 1022' },
        { name: 'Jack Morrison', class: '9SM', year: 9, instruments: ['Trombone'], status: 'active', parentEmail: 'morrison.family@email.com', parentPhone: '021 111 1023' },
        { name: 'Emma Davis', class: '11PE', year: 11, instruments: ['Clarinet'], status: 'active', parentEmail: 'davis.family@email.com', parentPhone: '021 111 1024' },
        { name: 'Noah Wilson', class: '6r8', year: 6, instruments: ['Piano'], status: 'active', parentEmail: 'wilson.family@email.com', parentPhone: '021 111 1025' },
        { name: 'Mia Roberts', class: '8TH', year: 8, instruments: ['Vocals'], status: 'waiting', parentEmail: 'roberts.family@email.com', parentPhone: '021 111 1026' },
        { name: 'Ethan Brown', class: '10WH', year: 10, instruments: ['Guitar'], status: 'active', parentEmail: 'brown.family@email.com', parentPhone: '021 111 1027' },
        { name: 'Olivia Taylor', class: '7BR', year: 7, instruments: ['Piano'], status: 'active', parentEmail: 'taylor.family@email.com', parentPhone: '021 111 1028' },
        { name: 'Liam Anderson', class: '9JK', year: 9, instruments: ['Drums'], status: 'active', parentEmail: 'anderson.family@email.com', parentPhone: '021 111 1029' },
        { name: 'Ava Martinez', class: '12SM', year: 12, instruments: ['Vocals'], status: 'active', parentEmail: 'martinez.family@email.com', parentPhone: '021 111 1030' }
    ],

    // Lessons (will need tutorId references after tutors are created)
    lessons: [
        { studentName: 'Sam Ure', tutorName: 'Motoi Shibusawa', day: 'Thursday', time: '8:20 AM', instrument: 'Guitar', status: 'active' },
        { studentName: 'Monty Given', tutorName: 'Motoi Shibusawa', day: 'Thursday', time: '8:40 AM', instrument: 'Guitar', status: 'active' },
        { studentName: 'Chené Walsh', tutorName: 'Motoi Shibusawa', day: 'Thursday', time: '9:00 AM', instrument: 'Guitar', status: 'active' },
        { studentName: 'Blake Ramsay', tutorName: 'Motoi Shibusawa', day: 'Thursday', time: '9:20 AM', instrument: 'Guitar', status: 'active' },
        { studentName: 'Austin Fletcher', tutorName: 'Cameron Finlay', day: 'Thursday', time: '9:30 AM', instrument: 'Drums', status: 'active' },
        { studentName: 'Oliver Owen', tutorName: 'Motoi Shibusawa', day: 'Monday', time: '9:00 AM', instrument: 'Guitar', status: 'active' },
        { studentName: 'Ella-Rose McConnell', tutorName: 'Cameron Finlay', day: 'Tuesday', time: '10:00 AM', instrument: 'Drums', status: 'active' },
        { studentName: 'Asia Hardanava', tutorName: 'Motoi Shibusawa', day: 'Wednesday', time: '11:00 AM', instrument: 'Guitar', status: 'active' },
        { studentName: 'Annabelle Venter', tutorName: 'Motoi Shibusawa', day: 'Friday', time: '9:30 AM', instrument: 'Guitar', status: 'active' },
        { studentName: 'Paige Churton', tutorName: 'Cameron Finlay', day: 'Monday', time: '11:30 AM', instrument: 'Drums', status: 'active' },
        { studentName: 'Sol Armstrong', tutorName: 'Motoi Shibusawa', day: 'Tuesday', time: '8:30 AM', instrument: 'Guitar', status: 'active' },
        { studentName: 'Gabriel Perry', tutorName: 'Lynley Fuglestad', day: 'Monday', time: '11:00 AM', instrument: 'Piano', status: 'active' },
        { studentName: 'Kelsea Andales', tutorName: 'Cameron Finlay', day: 'Wednesday', time: '9:00 AM', instrument: 'Drums', status: 'active' },
        { studentName: 'Wilf Lowe', tutorName: 'Motoi Shibusawa', day: 'Thursday', time: '1:00 PM', instrument: 'Guitar', status: 'active' },
        { studentName: 'Theo Read', tutorName: 'Lana Law', day: 'Tuesday', time: '8:45 AM', instrument: 'Saxophone', status: 'active' },
        { studentName: 'Lily Chen', tutorName: 'Lynley Fuglestad', day: 'Wednesday', time: '10:00 AM', instrument: 'Piano', status: 'active' },
        { studentName: 'Marcus Thompson', tutorName: 'Lana Law', day: 'Thursday', time: '10:30 AM', instrument: 'Trumpet', status: 'active' },
        { studentName: 'Sophie Williams', tutorName: 'Lana Law', day: 'Monday', time: '9:30 AM', instrument: 'Flute', status: 'active' },
        { studentName: 'Jack Morrison', tutorName: 'Lana Law', day: 'Friday', time: '11:00 AM', instrument: 'Trombone', status: 'active' },
        { studentName: 'Emma Davis', tutorName: 'Lana Law', day: 'Tuesday', time: '1:30 PM', instrument: 'Clarinet', status: 'active' },
        { studentName: 'Noah Wilson', tutorName: 'Christine Rudd', day: 'Wednesday', time: '2:00 PM', instrument: 'Piano', status: 'active' },
        { studentName: 'Ethan Brown', tutorName: 'Motoi Shibusawa', day: 'Friday', time: '10:00 AM', instrument: 'Guitar', status: 'active' },
        { studentName: 'Olivia Taylor', tutorName: 'Lynley Fuglestad', day: 'Thursday', time: '11:30 AM', instrument: 'Piano', status: 'active' },
        { studentName: 'Liam Anderson', tutorName: 'Cameron Finlay', day: 'Friday', time: '9:00 AM', instrument: 'Drums', status: 'active' },
        { studentName: 'Ava Martinez', tutorName: 'Elizabeth Macfarlane', day: 'Monday', time: '1:00 PM', instrument: 'Vocals', status: 'active' }
    ],

    // Events
    events: [
        { name: 'Easter Assembly', description: 'Easter Assembly performance for the school', date: '2026-04-08', term: 'Term 1', category: 'Performing Arts', templateType: 'school-during', status: 'upcoming' },
        { name: 'Rock Night', description: 'Annual rock band showcase featuring student bands', date: '2026-05-07', term: 'Term 2', category: 'Music', templateType: 'school-after', status: 'upcoming' },
        { name: 'Cafe Acoustique', description: 'Acoustic performance evening with coffee and treats', date: '2026-05-14', term: 'Term 2', category: 'Music', templateType: 'school-after', status: 'upcoming' },
        { name: 'Big Sing', description: 'Regional choir competition at Christchurch Town Hall', date: '2026-06-06', term: 'Term 2', category: 'Music', templateType: 'offsite-during', status: 'upcoming' },
        { name: 'Drama Showcase', description: 'Drama class performances and short plays', date: '2026-07-16', term: 'Term 3', category: 'Drama', templateType: 'school-after', status: 'upcoming' },
        { name: 'Kapa Haka Festival', description: 'Regional Kapa Haka competition', date: '2026-08-12', term: 'Term 3', category: 'Kapa Haka', templateType: 'offsite-during', status: 'upcoming' },
        { name: 'Pasifika Showcase', description: 'Celebration of Pasifika culture through music and dance', date: '2026-09-08', term: 'Term 3', category: 'Pasifika', templateType: 'school-after', status: 'upcoming' },
        { name: 'School Production', description: 'Annual school musical - Beauty and the Beast', date: '2026-09-25', term: 'Term 3', category: 'Production', templateType: 'school-after', status: 'upcoming' },
        { name: 'CSMF Performance', description: 'Canterbury Schools Music Festival at Horncastle Arena', date: '2026-11-07', term: 'Term 4', category: 'Music', templateType: 'offsite-after', status: 'upcoming' },
        { name: 'Dance Showcase', description: 'End of year dance performance featuring all dance groups', date: '2026-11-20', term: 'Term 4', category: 'Dance', templateType: 'school-after', status: 'upcoming' },
        { name: 'Prizegiving Performance', description: 'Musical items for end of year prizegiving', date: '2026-12-05', term: 'Term 4', category: 'Music', templateType: 'school-during', status: 'upcoming' },
        { name: 'Carol Service', description: 'Christmas Carol Service with choir and orchestra', date: '2026-12-10', term: 'Term 4', category: 'Music', templateType: 'school-after', status: 'upcoming' }
    ],

    // Groups
    groups: [
        { name: 'Concert Band', type: 'Ensemble', category: 'Music', memberCount: 32, meetingTime: 'Wednesday 3:30 PM', leader: 'Mr Smith' },
        { name: 'Jazz Band', type: 'Ensemble', category: 'Music', memberCount: 14, meetingTime: 'Thursday 3:30 PM', leader: 'Mrs Johnson' },
        { name: 'Senior Choir', type: 'Choir', category: 'Music', memberCount: 45, meetingTime: 'Tuesday 12:30 PM', leader: 'Elizabeth Macfarlane' },
        { name: 'Junior Choir', type: 'Choir', category: 'Music', memberCount: 38, meetingTime: 'Monday 12:30 PM', leader: 'Elizabeth Macfarlane' },
        { name: 'Rock Band A', type: 'Band', category: 'Music', memberCount: 5, meetingTime: 'Friday 3:30 PM', leader: 'Cameron Finlay' },
        { name: 'Rock Band B', type: 'Band', category: 'Music', memberCount: 5, meetingTime: 'Friday 4:30 PM', leader: 'Cameron Finlay' },
        { name: 'String Quartet', type: 'Chamber', category: 'Music', memberCount: 4, meetingTime: 'Monday 3:30 PM', leader: 'Mrs Davies' },
        { name: 'Drama Club', type: 'Club', category: 'Drama', memberCount: 28, meetingTime: 'Wednesday 3:30 PM', leader: 'Miss Thompson' },
        { name: 'Dance Crew', type: 'Crew', category: 'Dance', memberCount: 16, meetingTime: 'Tuesday 3:30 PM', leader: 'Miss Garcia' },
        { name: 'Kapa Haka', type: 'Group', category: 'Kapa Haka', memberCount: 35, meetingTime: 'Thursday 3:30 PM', leader: 'Mr Te Whare' },
        { name: 'Pasifika Group', type: 'Group', category: 'Pasifika', memberCount: 24, meetingTime: 'Wednesday 3:30 PM', leader: 'Mrs Taufa' },
        { name: 'Orchestra', type: 'Ensemble', category: 'Music', memberCount: 28, meetingTime: 'Tuesday 3:30 PM', leader: 'Mr Chen' }
    ],

    // Instruments
    instruments: [
        { name: 'Cello 1', type: 'Cello', size: '4/4', condition: 'Good', status: 'Available', serialNumber: 'CEL-001' },
        { name: 'Cello 2', type: 'Cello', size: '4/4', condition: 'Good', status: 'Available', serialNumber: 'CEL-002' },
        { name: 'Cello 3', type: 'Cello', size: '4/4', condition: 'Fair', status: 'On Hire', serialNumber: 'CEL-003' },
        { name: 'Cello 4', type: 'Cello', size: '1/2', condition: 'Good', status: 'On Hire', serialNumber: 'CEL-004' },
        { name: 'Cello 5', type: 'Cello', size: '1/2', condition: 'Good', status: 'On Hire', serialNumber: 'CEL-005' },
        { name: 'Cello 6', type: 'Cello', size: '3/4', condition: 'Excellent', status: 'On Hire', serialNumber: 'CEL-006' },
        { name: 'Violin 1', type: 'Violin', size: '4/4', condition: 'Good', status: 'Available', serialNumber: 'VLN-001' },
        { name: 'Violin 2', type: 'Violin', size: '4/4', condition: 'Fair', status: 'Available', serialNumber: 'VLN-002' },
        { name: 'Violin 3', type: 'Violin', size: '3/4', condition: 'Good', status: 'Available', serialNumber: 'VLN-003' },
        { name: 'Violin 4', type: 'Violin', size: '1/2', condition: 'Good', status: 'Available', serialNumber: 'VLN-004' },
        { name: 'Violin 5', type: 'Violin', size: '3/4', condition: 'Good', status: 'On Hire', serialNumber: 'VLN-005' },
        { name: 'Trombone 1', type: 'Trombone', size: 'Standard', condition: 'Good', status: 'On Hire', serialNumber: 'TRB-001' },
        { name: 'Trombone 2', type: 'Trombone', size: 'Standard', condition: 'Good', status: 'Available', serialNumber: 'TRB-002' },
        { name: 'Trombone 3', type: 'Trombone', size: 'Standard', condition: 'Fair', status: 'On Hire', serialNumber: 'TRB-003' },
        { name: 'Trumpet 1', type: 'Trumpet', size: 'Standard', condition: 'Excellent', status: 'Available', serialNumber: 'TPT-001' },
        { name: 'Trumpet 2', type: 'Trumpet', size: 'Standard', condition: 'Good', status: 'Available', serialNumber: 'TPT-002' },
        { name: 'Trumpet 3', type: 'Trumpet', size: 'Standard', condition: 'Good', status: 'On Hire', serialNumber: 'TPT-003' },
        { name: 'Flute 1', type: 'Flute', size: 'Standard', condition: 'Good', status: 'Available', serialNumber: 'FLT-001' },
        { name: 'Flute 2', type: 'Flute', size: 'Standard', condition: 'Good', status: 'On Hire', serialNumber: 'FLT-002' },
        { name: 'Clarinet 1', type: 'Clarinet', size: 'Bb', condition: 'Good', status: 'Available', serialNumber: 'CLR-001' },
        { name: 'Clarinet 2', type: 'Clarinet', size: 'Bb', condition: 'Fair', status: 'Available', serialNumber: 'CLR-002' },
        { name: 'Saxophone 1', type: 'Saxophone', size: 'Alto', condition: 'Good', status: 'On Hire', serialNumber: 'SAX-001' },
        { name: 'Saxophone 2', type: 'Saxophone', size: 'Alto', condition: 'Excellent', status: 'Available', serialNumber: 'SAX-002' }
    ],

    // Instrument Hires
    instrumentHires: [
        { instrumentName: 'Cello 5', studentName: 'Blake Wilson', hireDate: '2024-12-03', expectedReturn: '2025-12-31', agreement: false, status: 'overdue' },
        { instrumentName: 'Cello 6', studentName: 'Ella Drake', hireDate: '2024-12-03', expectedReturn: '2026-06-30', agreement: true, status: 'active' },
        { instrumentName: 'Trombone 1', studentName: 'Joshua Judkins', hireDate: '2024-03-01', expectedReturn: '2026-06-30', agreement: true, status: 'active' },
        { instrumentName: 'Trombone 3', studentName: 'Morgan Du', hireDate: '2024-12-03', expectedReturn: '2026-06-30', agreement: true, status: 'active' },
        { instrumentName: 'Flute 2', studentName: 'Tiffany Norriss', hireDate: '2024-12-06', expectedReturn: '2026-02-28', agreement: false, status: 'due-soon' },
        { instrumentName: 'Trumpet 3', studentName: 'Raya Stuart', hireDate: '2024-12-06', expectedReturn: '2026-02-28', agreement: false, status: 'due-soon' },
        { instrumentName: 'Cello 3', studentName: 'Maria Hoyt', hireDate: '2024-12-03', expectedReturn: '2026-06-30', agreement: true, status: 'active' },
        { instrumentName: 'Cello 4', studentName: 'Kaitlynn Cree', hireDate: '2024-12-06', expectedReturn: '2026-02-28', agreement: false, status: 'due-soon' },
        { instrumentName: 'Violin 5', studentName: 'Laurika de Lange', hireDate: '2024-12-06', expectedReturn: '2026-06-30', agreement: true, status: 'active' },
        { instrumentName: 'Saxophone 1', studentName: 'Theo Read', hireDate: '2025-02-01', expectedReturn: '2026-12-31', agreement: true, status: 'active' }
    ],

    // Lesson Requests
    lessonRequests: [
        { studentName: 'Emily Watson (7WH)', year: 7, instrument: 'Piano', status: 'awaiting', received: '2026-01-06', form: 'Music Tuition Signups 2026', parentEmail: 'watson.family@email.com' },
        { studentName: 'James Lee (8BR)', year: 8, instrument: 'Guitar', status: 'awaiting', received: '2026-01-05', form: 'Music Tuition Signups 2026', parentEmail: 'lee.family@email.com' },
        { studentName: 'Sophia Patel (9TH)', year: 9, instrument: 'Drums', status: 'awaiting', received: '2026-01-04', form: 'Music Tuition Signups 2026', parentEmail: 'patel.family@email.com' },
        { studentName: 'Lucas Brown (7SM)', year: 7, instrument: 'Vocals', status: 'awaiting', received: '2026-01-03', form: 'Music Tuition Signups 2026', parentEmail: 'brown2.family@email.com' },
        { studentName: 'Isabella Garcia (10WS)', year: 10, instrument: 'Flute', status: 'waitlist', received: '2025-12-15', form: 'Music Tuition Signups 2026', parentEmail: 'garcia.family@email.com' },
        { studentName: 'Mason Clark (8PE)', year: 8, instrument: 'Saxophone', status: 'waitlist', received: '2025-12-10', form: 'Music Tuition Signups 2026', parentEmail: 'clark.family@email.com' },
        { studentName: 'Charlotte Young (6r8)', year: 6, instrument: 'Piano', status: 'awaiting', received: '2026-01-07', form: 'Music Tuition Signups 2026', parentEmail: 'young.family@email.com' },
        { studentName: 'Benjamin Hall (11CH)', year: 11, instrument: 'Guitar', status: 'awaiting', received: '2026-01-06', form: 'Music Tuition Signups 2026', parentEmail: 'hall.family@email.com' }
    ],

    // Settings
    settings: {
        schoolName: 'Middleton Grange School',
        academyName: 'Middleton Music Academy',
        termDates: {
            term1: { start: '2026-02-02', end: '2026-04-17' },
            term2: { start: '2026-05-04', end: '2026-07-10' },
            term3: { start: '2026-07-27', end: '2026-10-02' },
            term4: { start: '2026-10-19', end: '2026-12-16' }
        },
        emailSettings: {
            sendTutorNotifications: true,
            sendParentReminders: true,
            reminderDaysBefore: 7
        }
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DummyData;
}
