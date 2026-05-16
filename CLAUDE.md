# MGS Arts Portal

## Overview
- **Client**: Middleton Grange School
- **Type**: PWA - Performing Arts Management Portal
- **Status**: In Progress

## Tech Stack
- **Frontend**: Vanilla HTML/CSS/JS (no frameworks)
- **Backend**: Firebase (Firestore, Auth, Hosting)
- **Database**: Cloud Firestore
- **Hosting**: Firebase Hosting
- **Email**: EmailJS for notifications
- **PWA**: manifest.json, service worker (sw.js)

## Playbooks In Use
Read these from the Brain folder at session start. Do not copy into this project.
Brain location: `D:/Sidequest Digital/Dev Projects/Brain/`

- `JoelTempero.md` — working profile (always)
- `TokenDiscipline.md` — token cost hygiene (always)
- `CMS-Portal-Backend.md` — portal build workflow
- `DesignSystem.md` — design contract workflow
- `Security.md` — pre-launch security audit
- `Deployment.md` — deployment workflow

## Pages / Portals
- `index.html` - Admin portal (Firebase Auth login)
- `tutor-portal.html` - Tutor portal (token-based access)
- `staff-portal.html` - Staff portal (token-based access)
- `lesson-response.html` - Lesson response/acknowledgment page
- `music-tuition-2026.html` - Public music tuition signup form

## Auth Model
- **Admins**: Firebase Auth (Google OAuth) - all authenticated users are admins
- **Tutors**: Token-based access via `tutorTokens` collection (expiring links)
- **Staff**: Token-based access via `staffTokens` collection (expiring links)
- **Lessons**: Token-based access via `lessonTokens` collection

## Key JS Files
- `js/app.js` - Main application logic
- `js/firebase.js` - Firebase configuration and initialization
- `js/data.js` - Data layer / Firestore operations
- `js/emailService.js` - EmailJS integration
- `js/dummyData.js` - Test/seed data

## Firestore Collections
Students, tutors, lessons, groups, events, eventTasks, instruments, instrumentHires, lessonRequests, forms, templates, settings, activities, users, tutorTokens, staffTokens, lessonTokens

## Build & Dev Commands
- Dev server: Open HTML files directly or use local server
- Deploy: `firebase deploy` (use `leojfx@gmail.com` account)
- Deploy hosting only: `firebase deploy --only hosting`
- Deploy rules only: `firebase deploy --only firestore:rules`
- Switch Firebase account: `firebase login:use leojfx@gmail.com`

## Code Conventions
- Vanilla JS with ES modules (import/export via CDN Firebase SDK)
- Single CSS file (`css/styles.css`)
- Dark theme UI with gold accent (#c9a962)
- Cache-busting via query strings on JS/CSS imports (bump `?v=N` in index.html after changes)

## Current Progress
- Admin portal with login, student/tutor/lesson management
- Tutor portal for lesson acknowledgment and management
- Staff portal for event task management
- Public lesson request and music tuition signup forms
- Instrument hire tracking
- Token-based portal access system
- PWA support with manifest and icons
- OAuth domain auth fixes completed
- Cache-busting implemented for deployments
- 2026 lesson data imported (223 students, 252 lessons from Excel spreadsheet)
- Class field replaced with Year level across all views and forms

## Next Steps
- [ ] Review and commit remaining uncommitted changes (styles.css, firestore.rules, tutor-portal.html)
- [ ] Verify all imported student year levels display correctly
- [ ] Clean up import utility files (generate-import.py, import-lessons.js, update-years.js, year-data.json)
- [ ] Identify and prioritize remaining features or bugs

## Session Log
### 2026-03-20
- Initial project scan and CLAUDE.md created
- Full codebase audit: all features confirmed functional with real Firebase (not demo)
- Built Python pipeline to parse Excel spreadsheet into students + lessons
- Imported 223 students and 252 lessons into Firestore
- Fixed missing year data with bulk update script
- Replaced Class with Year level in lessons table, students table, forms, and search
- Deployed to Firebase Hosting

## Key Decisions
- Token-based access for tutors/staff instead of requiring Firebase Auth accounts
- All Firebase Auth users treated as admins (simple role model)
- No-cache headers on HTML/JS/CSS to ensure deployed updates are picked up immediately
- Firebase deploy uses `leojfx@gmail.com` account (not `joel@tempero.nz`)
- Student year level used instead of class field throughout the app

## Known Issues
- Uncommitted changes in working tree (styles.css, firestore.rules, tutor-portal.html)
- Hardcoded wipe password in app.js (`MGSArts2026!`)
- music-tuition-2026.html has hardcoded tutor-instrument mapping (needs manual updates when tutors change)
