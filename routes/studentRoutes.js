const express = require('express');
const { registerStudent, authStudent } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', authStudent);


router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

module.exports = router;
