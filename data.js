// Academic Portal Management System - Data Layer

// SYSTEM INITIALIZATION - Default Administrator Account
const DEFAULT_ADMIN = [
    { id: 'admin2024', pass: 'secure@123', role: 'admin', name: 'Portal Administrator' }
];

function initSystem() {
    // Initialize storage with unique identifier
    if (!localStorage.getItem('academic_users_db')) {
        localStorage.setItem('academic_users_db', JSON.stringify(DEFAULT_ADMIN));
    }
    if (!localStorage.getItem('academic_courses_db')) localStorage.setItem('academic_courses_db', JSON.stringify([]));
    if (!localStorage.getItem('academic_registrations_db')) localStorage.setItem('academic_registrations_db', JSON.stringify([])); 
    if (!localStorage.getItem('academic_attendance_db')) localStorage.setItem('academic_attendance_db', JSON.stringify([]));
    if (!localStorage.getItem('academic_marks_db')) localStorage.setItem('academic_marks_db', JSON.stringify([]));
    if (!localStorage.getItem('academic_messages_db')) localStorage.setItem('academic_messages_db', JSON.stringify([]));
}
initSystem();

// DATA RETRIEVAL FUNCTIONS
function getAllUsers() { return JSON.parse(localStorage.getItem('academic_users_db')) || DEFAULT_ADMIN; }
function getAllCourses() { return JSON.parse(localStorage.getItem('academic_courses_db')) || []; }
function getAllRegs() { return JSON.parse(localStorage.getItem('academic_registrations_db')) || []; }
function getAllMsgs() { return JSON.parse(localStorage.getItem('academic_messages_db')) || []; }

// AUTHENTICATION SYSTEM
function authUser(id, password) {
    const users = getAllUsers();
    return users.find(u => u.id === id.trim() && u.pass === password.trim());
}

// ADMIN MANAGEMENT - User Registration
function registerUser(id, name, role, pass, program) {
    let users = getAllUsers();
    if (users.find(u => u.id === id)) return { success: false, msg: "User ID already exists!" };
    users.push({ id, name, role, pass, program: role === 'student' ? program : null });
    localStorage.setItem('academic_users_db', JSON.stringify(users));
    return { success: true, msg: "User Registered Successfully!" };
}

// ADMIN MANAGEMENT - Course Creation
function createCourse(name, program, section, teacherId) {
    let courses = getAllCourses();
    const teacher = getAllUsers().find(u => u.id === teacherId);
    courses.push({
        id: Date.now(),
        name: name,
        program: program,
        section: section,
        teacherId: teacherId,
        teacherName: teacher ? teacher.name : teacherId
    });
    localStorage.setItem('academic_courses_db', JSON.stringify(courses));
}

// STUDENT OPERATIONS - Course Registration
function registerCourse(studentId, courseId) {
    let regs = getAllRegs();
    if (regs.find(r => r.studentId === studentId && r.courseId === courseId)) {
        return { success: false, msg: "Already registered!" };
    }
    regs.push({ studentId, courseId });
    localStorage.setItem('academic_registrations_db', JSON.stringify(regs));
    return { success: true, msg: "Course Registered!" };
}

// TEACHER OPERATIONS - Notification System
function sendNotification(text, teacherName) {
    let msgs = getAllMsgs();
    msgs.unshift({ text, sender: teacherName, date: new Date().toLocaleDateString() });
    localStorage.setItem('academic_messages_db', JSON.stringify(msgs));
}

// UTILITY FUNCTIONS - Grade Calculation
function calculateGrade(percentage) {
    if (percentage >= 85) return 'A';
    if (percentage >= 75) return 'B';
    if (percentage >= 65) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
}

// SESSION MANAGEMENT
function checkSession(role) {
    const u = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!u) { window.location.href = 'index.html'; return null; }
    if (u.role !== role) { alert("Access Denied"); window.location.href = 'index.html'; return null; }
    return u;
}

// LOGOUT FUNCTION
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
