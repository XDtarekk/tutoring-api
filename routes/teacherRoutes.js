const express = require('express');
const { registerTeacher, authTeacher } = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerTeacher);
router.post('/login', authTeacher);

router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

module.exports = router;
