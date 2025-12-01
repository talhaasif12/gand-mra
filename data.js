// data.js - Version 20 (Strict Login + Full Features)

// 1. INITIAL SETUP: Only Admin exists.
const DEFAULT_ADMIN = [
    { id: 'admin', pass: 'admin123', role: 'admin', name: 'System Administrator' }
];

function initSystem() {
    // Unique Key 'v20' to ensure a clean database
    if (!localStorage.getItem('portal_users_v20')) {
        localStorage.setItem('portal_users_v20', JSON.stringify(DEFAULT_ADMIN));
    }
    if (!localStorage.getItem('portal_courses_v20')) localStorage.setItem('portal_courses_v20', JSON.stringify([]));
    if (!localStorage.getItem('portal_regs_v20')) localStorage.setItem('portal_regs_v20', JSON.stringify([])); 
    if (!localStorage.getItem('portal_att_v20')) localStorage.setItem('portal_att_v20', JSON.stringify([]));
    if (!localStorage.getItem('portal_marks_v20')) localStorage.setItem('portal_marks_v20', JSON.stringify([]));
    if (!localStorage.getItem('portal_msgs_v20')) localStorage.setItem('portal_msgs_v20', JSON.stringify([]));
}
initSystem();

// 2. DATA ACCESS
function getAllUsers() { return JSON.parse(localStorage.getItem('portal_users_v20')) || DEFAULT_ADMIN; }
function getAllCourses() { return JSON.parse(localStorage.getItem('portal_courses_v20')) || []; }
function getAllRegs() { return JSON.parse(localStorage.getItem('portal_regs_v20')) || []; }
function getAllMsgs() { return JSON.parse(localStorage.getItem('portal_msgs_v20')) || []; }

// 3. AUTHENTICATION
function authUser(id, password) {
    const users = getAllUsers();
    return users.find(u => u.id === id.trim() && u.pass === password.trim());
}

// 4. ADMIN ACTIONS
function registerUser(id, name, role, pass, program) {
    let users = getAllUsers();
    if (users.find(u => u.id === id)) return { success: false, msg: "User ID already exists!" };
    users.push({ id, name, role, pass, program: role === 'student' ? program : null });
    localStorage.setItem('portal_users_v20', JSON.stringify(users));
    return { success: true, msg: "User Registered Successfully!" };
}

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
    localStorage.setItem('portal_courses_v20', JSON.stringify(courses));
}

// 5. STUDENT ACTIONS
function registerCourse(studentId, courseId) {
    let regs = getAllRegs();
    if (regs.find(r => r.studentId === studentId && r.courseId === courseId)) {
        return { success: false, msg: "Already registered!" };
    }
    regs.push({ studentId, courseId });
    localStorage.setItem('portal_regs_v20', JSON.stringify(regs));
    return { success: true, msg: "Course Registered!" };
}

// 6. TEACHER ACTIONS
function sendNotification(text, teacherName) {
    let msgs = getAllMsgs();
    msgs.unshift({ text, sender: teacherName, date: new Date().toLocaleDateString() });
    localStorage.setItem('portal_msgs_v20', JSON.stringify(msgs));
}

// 7. HELPERS
function calculateGrade(percentage) {
    if (percentage >= 85) return 'A';
    if (percentage >= 75) return 'B';
    if (percentage >= 65) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
}

function checkSession(role) {
    const u = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!u) { window.location.href = 'index.html'; return null; }
    if (u.role !== role) { alert("Access Denied"); window.location.href = 'index.html'; return null; }
    return u;
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}