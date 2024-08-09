const express = require('express');
const { createClass, getAllClasses, getClassById, updateClass, deleteClass } = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createClass);
router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.put('/:id', protect, updateClass);
router.delete('/:id', protect, deleteClass);

module.exports = router;
