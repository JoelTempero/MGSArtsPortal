// ========================================
// EmailJS Service for MGS Arts Portal
// ========================================

// EmailJS Configuration
const EMAILJS_CONFIG = {
    publicKey: 'gWx8cTGUhvHVfmb3Z',
    serviceId: 'service_i41yqx1',
    templateId: 'template_3tn1dig'
};

class EmailService {
    static initialized = false;

    static init() {
        if (this.initialized) return;

        if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
            emailjs.init(EMAILJS_CONFIG.publicKey);
            this.initialized = true;
            console.log('EmailJS initialized successfully');
        } else {
            console.warn('EmailJS not configured. Please update EMAILJS_CONFIG in js/emailService.js');
        }
    }

    static isConfigured() {
        return EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' &&
               EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID' &&
               EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID';
    }

    /**
     * Send email notification to staff
     * @param {Object} options - Email options
     * @param {string} options.to_email - Recipient email address
     * @param {string} options.to_name - Recipient name
     * @param {string} options.subject - Email subject
     * @param {string} options.message - Email body content
     * @param {string} options.type - Notification type (event, group, lesson)
     * @returns {Promise} - EmailJS send promise
     */
    static async send(options) {
        if (!this.isConfigured()) {
            console.warn('EmailJS not configured');
            return { success: false, error: 'EmailJS not configured' };
        }

        if (!this.initialized) {
            this.init();
        }

        try {
            const templateParams = {
                to_email: options.to_email,
                to_name: options.to_name,
                subject: options.subject,
                message: options.message,
                notification_type: options.type || 'general',
                school_name: 'Middleton Grange School',
                portal_name: 'MGS Arts Portal'
            };

            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams
            );

            console.log('Email sent successfully:', response);
            return { success: true, response };
        } catch (error) {
            console.error('Failed to send email:', error);
            return { success: false, error: error.text || error.message };
        }
    }

    /**
     * Send notification to multiple recipients
     * @param {Array} recipients - Array of { email, name } objects
     * @param {string} subject - Email subject
     * @param {string} message - Email body content
     * @param {string} type - Notification type
     * @returns {Promise} - Results of all send attempts
     */
    static async sendToMultiple(recipients, subject, message, type) {
        const results = [];

        for (const recipient of recipients) {
            const result = await this.send({
                to_email: recipient.email,
                to_name: recipient.name,
                subject,
                message,
                type
            });
            results.push({ recipient, ...result });

            // Small delay between emails to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        return results;
    }

    /**
     * Send event notification to assigned staff
     * @param {Object} event - Event object
     * @param {Array} staff - Array of staff objects with email property
     * @param {Array} allStaff - All staff to resolve task assignee names (optional)
     * @returns {Promise}
     */
    static async sendEventNotification(event, staff, allStaff = []) {
        const recipients = staff.filter(s => s.email).map(s => ({ email: s.email, name: s.name }));

        if (recipients.length === 0) {
            return { success: false, error: 'No staff with email addresses' };
        }

        // Build task list with assigned staff names
        let tasksList = '';
        if (event.tasks && event.tasks.length > 0) {
            tasksList = '\n\nTASKS:\n' + event.tasks.map(task => {
                const assignedStaff = task.assignedTo
                    ? (allStaff.find(s => s.id === task.assignedTo)?.name || 'Unassigned')
                    : 'Unassigned';
                return `- ${task.name} [${assignedStaff}]`;
            }).join('\n');
        }

        const subject = `Event Assignment: ${event.name}`;
        const message = `You have been assigned to the following event:

Event: ${event.name}
Date: ${event.date}
Time: ${event.time || 'TBC'}
Location: ${event.location || 'TBC'}

${event.description || ''}${tasksList}

Please check the MGS Arts Portal for task assignments and updates.`;

        return this.sendToMultiple(recipients, subject, message, 'event');
    }

    /**
     * Send group notification to leaders
     * @param {Object} group - Group object
     * @param {Array} leaders - Array of leader objects with email property
     * @returns {Promise}
     */
    static async sendGroupNotification(group, leaders) {
        const recipients = leaders.filter(l => l.email).map(l => ({ email: l.email, name: l.name }));

        if (recipients.length === 0) {
            return { success: false, error: 'No leaders with email addresses' };
        }

        const subject = `Group Assignment: ${group.name}`;
        const message = `You have been assigned as a leader of the following group:

Group: ${group.name}
Type: ${group.type || 'N/A'}
Category: ${group.category || 'N/A'}
Members: ${group.members || 0}

Meeting: ${group.meetingDay || 'TBC'} ${group.meetingTime || ''}
Location: ${group.location || 'TBC'}

Please check the MGS Arts Portal for more details.`;

        return this.sendToMultiple(recipients, subject, message, 'group');
    }

    /**
     * Send lesson notification to tutor
     * @param {Object} lesson - Lesson object
     * @param {Object} tutor - Tutor object with email property
     * @param {Object} student - Student object
     * @param {string} responseUrl - URL for tutor to respond to lesson (optional)
     * @returns {Promise}
     */
    static async sendLessonNotification(lesson, tutor, student, responseUrl = '') {
        if (!tutor.email) {
            return { success: false, error: 'Tutor has no email address' };
        }

        // Build response section if URL is provided
        const responseSection = responseUrl ? `

CONFIRM YOUR LESSON:
Click the link below to view lesson details and confirm:
${responseUrl}

You can click "Accept Lesson" or "Add to Waitlist" directly from the link above.
` : '';

        const subject = `New Lesson Assignment: ${student?.name || lesson.studentName || 'Student'}`;
        const message = `You have been assigned a new lesson:

Student: ${student?.name || lesson.studentName || 'Unknown'}
Instrument: ${lesson.instrument || 'N/A'}
Day: ${lesson.day || 'TBC'}
Time: ${lesson.time || 'TBC'}
Location: ${lesson.location || 'TBC'}
${responseSection}
Please check the MGS Arts Portal for more details.`;

        return this.send({
            to_email: tutor.email,
            to_name: tutor.name,
            subject,
            message,
            type: 'lesson'
        });
    }
}

// Initialize EmailJS when the script loads
document.addEventListener('DOMContentLoaded', () => {
    EmailService.init();
});

// Export for use in other modules
export { EmailService, EMAILJS_CONFIG };
