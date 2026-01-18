// ========================================
// MGS Arts Portal - Firebase Configuration
// ========================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import {
    getFirestore,
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    writeBatch,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCL2ZHktfHNsFX6vI0mVY-i5WqM1Hb94RY",
    authDomain: "mgs-performing-arts.firebaseapp.com",
    projectId: "mgs-performing-arts",
    storageBucket: "mgs-performing-arts.firebasestorage.app",
    messagingSenderId: "968636316312",
    appId: "1:968636316312:web:1b233ae8e176ceea85aeed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ========================================
// Authentication Service
// ========================================

const AuthService = {
    // Sign in with email/password
    async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign out
    async signOut() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    },

    // Send password reset email
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            console.error('Password reset error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    },

    // Listen for auth state changes
    onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback);
    }
};

// ========================================
// Firestore Database Service
// ========================================

const DatabaseService = {
    // ---- Generic CRUD Operations ----

    // Get all documents from a collection
    async getAll(collectionName) {
        try {
            const querySnapshot = await getDocs(collection(db, collectionName));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error(`Error getting ${collectionName}:`, error);
            return [];
        }
    },

    // Get a single document by ID
    async getById(collectionName, id) {
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (error) {
            console.error(`Error getting ${collectionName}/${id}:`, error);
            return null;
        }
    },

    // Add a new document
    async add(collectionName, data) {
        try {
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error(`Error adding to ${collectionName}:`, error);
            return { success: false, error: error.message };
        }
    },

    // Update a document
    async update(collectionName, id, data) {
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error(`Error updating ${collectionName}/${id}:`, error);
            return { success: false, error: error.message };
        }
    },

    // Delete a document
    async delete(collectionName, id) {
        try {
            await deleteDoc(doc(db, collectionName, id));
            return { success: true };
        } catch (error) {
            console.error(`Error deleting ${collectionName}/${id}:`, error);
            return { success: false, error: error.message };
        }
    },

    // Query documents
    async query(collectionName, conditions = [], orderByField = null, orderDirection = 'asc') {
        try {
            let q = collection(db, collectionName);
            
            if (conditions.length > 0) {
                const whereConditions = conditions.map(c => where(c.field, c.operator, c.value));
                q = query(q, ...whereConditions);
            }
            
            if (orderByField) {
                q = query(q, orderBy(orderByField, orderDirection));
            }
            
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error(`Error querying ${collectionName}:`, error);
            return [];
        }
    },

    // Real-time listener for a collection
    onCollectionChange(collectionName, callback) {
        return onSnapshot(collection(db, collectionName), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(data);
        });
    },

    // ---- Specific Data Operations ----

    // Students
    async getStudents() {
        return this.getAll('students');
    },

    async addStudent(student) {
        return this.add('students', student);
    },

    async updateStudent(id, student) {
        return this.update('students', id, student);
    },

    async deleteStudent(id) {
        return this.delete('students', id);
    },

    // Tutors
    async getTutors() {
        return this.getAll('tutors');
    },

    async addTutor(tutor) {
        return this.add('tutors', tutor);
    },

    async updateTutor(id, tutor) {
        return this.update('tutors', id, tutor);
    },

    async deleteTutor(id) {
        return this.delete('tutors', id);
    },

    // Lessons
    async getLessons() {
        return this.getAll('lessons');
    },

    async getLessonsByDay(day) {
        return this.query('lessons', [{ field: 'day', operator: '==', value: day }], 'time');
    },

    async addLesson(lesson) {
        return this.add('lessons', lesson);
    },

    async updateLesson(id, lesson) {
        return this.update('lessons', id, lesson);
    },

    async deleteLesson(id) {
        return this.delete('lessons', id);
    },

    // Events
    async getEvents() {
        return this.getAll('events');
    },

    async addEvent(event) {
        return this.add('events', event);
    },

    async updateEvent(id, event) {
        return this.update('events', id, event);
    },

    async deleteEvent(id) {
        return this.delete('events', id);
    },

    // Event Tasks
    async getEventTasks(eventId) {
        return this.query('eventTasks', [{ field: 'eventId', operator: '==', value: eventId }], 'phase');
    },

    async updateEventTask(id, task) {
        return this.update('eventTasks', id, task);
    },

    // Groups
    async getGroups() {
        return this.getAll('groups');
    },

    async addGroup(group) {
        return this.add('groups', group);
    },

    async updateGroup(id, group) {
        return this.update('groups', id, group);
    },

    async deleteGroup(id) {
        return this.delete('groups', id);
    },

    // Instruments
    async getInstruments() {
        return this.getAll('instruments');
    },

    async addInstrument(instrument) {
        return this.add('instruments', instrument);
    },

    async updateInstrument(id, instrument) {
        return this.update('instruments', id, instrument);
    },

    async deleteInstrument(id) {
        return this.delete('instruments', id);
    },

    // Instrument Hires
    async getInstrumentHires() {
        return this.getAll('instrumentHires');
    },

    async addInstrumentHire(hire) {
        return this.add('instrumentHires', hire);
    },

    async updateInstrumentHire(id, hire) {
        return this.update('instrumentHires', id, hire);
    },

    async deleteInstrumentHire(id) {
        return this.delete('instrumentHires', id);
    },

    // Lesson Requests
    async getLessonRequests() {
        return this.getAll('lessonRequests');
    },

    async addLessonRequest(request) {
        return this.add('lessonRequests', request);
    },

    async updateLessonRequest(id, request) {
        return this.update('lessonRequests', id, request);
    },

    async deleteLessonRequest(id) {
        return this.delete('lessonRequests', id);
    },

    // Settings
    async getSettings() {
        const settings = await this.getById('settings', 'main');
        return settings || {};
    },

    async updateSettings(settings) {
        try {
            const docRef = doc(db, 'settings', 'main');
            await updateDoc(docRef, {
                ...settings,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            // If doc doesn't exist, create it
            try {
                await addDoc(collection(db, 'settings'), {
                    ...settings,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                return { success: true };
            } catch (e) {
                console.error('Error updating settings:', e);
                return { success: false, error: e.message };
            }
        }
    },

    // Forms (signup forms)
    async getForms() {
        return this.getAll('forms');
    },

    async addForm(formData) {
        return this.add('forms', formData);
    },

    async updateForm(id, formData) {
        return this.update('forms', id, formData);
    },

    async deleteForm(id) {
        return this.delete('forms', id);
    },

    // Users (portal access)
    async getUsers() {
        return this.getAll('users');
    },

    async addUser(userData) {
        return this.add('users', userData);
    },

    async updateUser(id, userData) {
        return this.update('users', id, userData);
    },

    async deleteUser(id) {
        return this.delete('users', id);
    },

    // Templates (custom event templates)
    async getTemplates() {
        return this.getAll('templates');
    },

    async addTemplate(templateData) {
        return this.add('templates', templateData);
    },

    async updateTemplate(id, templateData) {
        return this.update('templates', id, templateData);
    },

    async deleteTemplate(id) {
        return this.delete('templates', id);
    },

    // ---- Lesson Tokens ----

    // Create a lesson token for tutor acknowledgment
    async createLessonToken(lessonId, tutorId, expiryDays = 30) {
        // Generate a random token
        const token = this.generateToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiryDays);

        try {
            // Use setDoc with the token as document ID for easy lookup
            await setDoc(doc(db, 'lessonTokens', token), {
                lessonId,
                tutorId,
                createdAt: serverTimestamp(),
                expiresAt: expiresAt.toISOString(),
                used: false
            });

            return { success: true, token };
        } catch (error) {
            console.error('Error creating lesson token:', error);
            return { success: false, error: error.message };
        }
    },

    // Generate a random token string
    generateToken() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < 32; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    },

    // Get lesson token by token string
    async getLessonToken(token) {
        return this.getById('lessonTokens', token);
    },

    // ---- Batch Operations ----

    // Import all data (for seeding/restoring)
    async importAllData(data) {
        const batch = writeBatch(db);
        let count = 0;

        try {
            for (const [collectionName, documents] of Object.entries(data)) {
                if (Array.isArray(documents)) {
                    for (const docData of documents) {
                        const docRef = doc(collection(db, collectionName));
                        batch.set(docRef, {
                            ...docData,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        });
                        count++;
                    }
                }
            }

            await batch.commit();
            return { success: true, count };
        } catch (error) {
            console.error('Error importing data:', error);
            return { success: false, error: error.message };
        }
    },

    // Export all data
    async exportAllData() {
        const collections = ['students', 'tutors', 'lessons', 'events', 'eventTasks', 'groups', 'instruments', 'instrumentHires', 'lessonRequests', 'settings', 'forms', 'users'];
        const data = {};

        for (const collectionName of collections) {
            data[collectionName] = await this.getAll(collectionName);
        }

        return data;
    },

    // Clear a collection
    async clearCollection(collectionName) {
        const docs = await this.getAll(collectionName);
        const batch = writeBatch(db);
        
        docs.forEach(d => {
            batch.delete(doc(db, collectionName, d.id));
        });

        await batch.commit();
        return { success: true, count: docs.length };
    }
};

// ========================================
// Event Templates (static data)
// ========================================

const EventTemplates = {
    'school-during': {
        id: 'school-during',
        name: 'School Performance During School Hours',
        description: 'For performances held at school during the school day',
        tasks: [
            { phase: '4+ weeks prior', order: 1, items: [
                'Secure school calendar booking',
                'Confirm performance repertoire',
                'Inform performer\'s parents and whānau'
            ]},
            { phase: '2 weeks prior', order: 2, items: [
                'Confirm technical requirements, instruments, and personnel',
                'Organise relief',
                'Finalise runsheet (opening/closing, performances, staging/tech)',
                'Inform staff members of performers out of class (specific times)'
            ]},
            { phase: '1 week prior', order: 3, items: [
                'Remind performer\'s parents and whānau',
                'Confirm details with event organiser',
                'Finalise performers instructions (arrival, setup, clothing, equipment)',
                'Provide performers with Performance Pass',
                'Finalise technical setup and timeline'
            ]},
            { phase: 'Pre-performance', order: 4, items: [
                'All equipment is in the right place and available',
                'Performance space is setup',
                'Groups are prepared and communicated with',
                'Performers list to Student Services'
            ]},
            { phase: 'Performance day', order: 5, items: [
                'Meet performers at prearranged space',
                'Mark attendance for Student Services',
                'Manage setup and tech rehearsals',
                'Supervise performers in downtime',
                'Manage pack down',
                'Ensure equipment is correctly returned'
            ]},
            { phase: 'Post-performance', order: 6, items: [
                'Debrief with organisers, group leaders, and technical support'
            ]}
        ]
    },
    'school-after': {
        id: 'school-after',
        name: 'School Performance After School Hours',
        description: 'For performances held at school after the school day',
        tasks: [
            { phase: '4+ weeks prior', order: 1, items: [
                'Ensure venue is booked',
                'Secure school calendar booking',
                'Confirm performance repertoire',
                'Inform performer\'s whānau of event'
            ]},
            { phase: '2 weeks prior', order: 2, items: [
                'Confirm technical requirements, instruments, and personnel',
                'Organise relief if required for setup',
                'Finalise runsheet',
                'Advertise event to Staff and School Community'
            ]},
            { phase: '1 week prior', order: 3, items: [
                'Confirm details with group leaders and technical team',
                'Finalise performers instructions',
                'Remind performer\'s parents and whānau with arrival times',
                'Finalise technical setup design and timeline'
            ]},
            { phase: 'Pre-performance', order: 4, items: [
                'All equipment is in the right place',
                'Performance space is setup',
                'Group is prepared',
                'Performers list confirmed'
            ]},
            { phase: 'Performance day', order: 5, items: [
                'Meet performers at prearranged space',
                'Note attendance of performers',
                'Manage setup and tech rehearsals',
                'Supervise performers in downtime',
                'Manage pack down',
                'Ensure equipment is correctly returned'
            ]},
            { phase: 'Post-performance', order: 6, items: [
                'Debrief the performance, programme, and process'
            ]}
        ]
    },
    'offsite-during': {
        id: 'offsite-during',
        name: 'Offsite Performance During School Hours',
        description: 'For performances held at external venues during school hours',
        tasks: [
            { phase: '4+ weeks prior', order: 1, items: [
                'Ensure venue is booked',
                'Secure school calendar booking',
                'Confirm performance repertoire',
                'Inform performer\'s whānau of event',
                'Finalise transport arrangements',
                'Complete EOTC paperwork'
            ]},
            { phase: '2 weeks prior', order: 2, items: [
                'Confirm technical requirements, instruments, and personnel',
                'Organise relief',
                'Complete parental permission returns',
                'Inform staff members of performers out of class'
            ]},
            { phase: '1 week prior', order: 3, items: [
                'Confirm details with group leaders',
                'Finalise performers instructions',
                'Provide performers with Performance Pass',
                'Remind performer\'s parents and whānau with travel times',
                'Finalise technical requirements'
            ]},
            { phase: 'Pre-performance', order: 4, items: [
                'All equipment is in the right place',
                'Performance space is setup',
                'Group is prepared',
                'Performers list to Student Services'
            ]},
            { phase: 'Performance day', order: 5, items: [
                'Meet performers at prearranged space',
                'Mark attendance for Student Services',
                'Manage setup and tech rehearsals',
                'Supervise performers in downtime',
                'Manage pack down',
                'Ensure equipment is correctly returned/transported'
            ]},
            { phase: 'Post-performance', order: 6, items: [
                'Debrief the performance, programme, and process'
            ]}
        ]
    },
    'offsite-after': {
        id: 'offsite-after',
        name: 'Offsite Performance After School Hours',
        description: 'For performances held at external venues after school hours',
        tasks: [
            { phase: '4+ weeks prior', order: 1, items: [
                'Ensure venue is booked',
                'Secure school calendar booking',
                'Understand venue host\'s requirements',
                'Confirm performance repertoire',
                'Inform performer\'s parents and whānau',
                'Finalise transport arrangements',
                'Complete EOTC paperwork'
            ]},
            { phase: '2 weeks prior', order: 2, items: [
                'Confirm technical requirements, instruments, and personnel',
                'Liaise with venue host about requirements',
                'Organise relief if required',
                'Complete parental permission returns',
                'Inform staff of performers out of class'
            ]},
            { phase: '1 week prior', order: 3, items: [
                'Confirm details with group leaders',
                'Finalise performers instructions',
                'Provide Performance Pass if required',
                'Remind performer\'s whānau with travel times',
                'Finalise technical requirements'
            ]},
            { phase: 'Pre-performance', order: 4, items: [
                'All equipment is in the right place',
                'Performance space is setup',
                'Group is prepared'
            ]},
            { phase: 'Performance day', order: 5, items: [
                'Meet performers at prearranged space',
                'Manage setup and tech rehearsals',
                'Supervise performers in downtime',
                'Manage pack down',
                'Ensure equipment is correctly returned/transported'
            ]},
            { phase: 'Post-performance', order: 6, items: [
                'Debrief the performance, programme, and process'
            ]}
        ]
    }
};

// ========================================
// Exports
// ========================================

export { AuthService, DatabaseService, EventTemplates, db, auth };
