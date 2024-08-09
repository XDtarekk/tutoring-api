const express = require('express');
const { registerStudent, authStudent, getStudentProfile, updateStudentProfile, deleteStudentAccount, getStudentById, getAllStudents } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', authStudent);

router.get('/profile', protect, getStudentProfile);
router.put('/profile', protect, updateStudentProfile);
router.delete('/profile', protect, deleteStudentAccount);

router.get('/:id', getStudentById);
router.get('/', getAllStudents);

module.exports = router;
