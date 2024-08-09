const express = require('express');
const { registerTeacher, authTeacher, updateTeacher, deleteTeacher, addClass, getTeacherById, getAllTeachers } = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerTeacher);
router.post('/login', authTeacher);

router.put('/profile', protect, updateTeacher);
router.delete('/profile', protect, deleteTeacher);
router.post('/classes', protect, addClass);

router.get('/:id', getTeacherById);
router.get('/', getAllTeachers);

module.exports = router;
