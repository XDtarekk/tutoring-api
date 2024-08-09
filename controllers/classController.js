const Class = require('../models/Class');
const Category = require('../models/Category');

// Create a new class
exports.createClass = async (req, res) => {
  const { name, schedule, categoryId, teacherId } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const newClass = new Class({
      name,
      schedule,
      category: categoryId,
      teacher: teacherId,
    });

    await newClass.save();

    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('category').populate('teacher');
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a class by ID
exports.getClassById = async (req, res) => {
  const { id } = req.params;

  try {
    const classData = await Class.findById(id).populate('category').populate('teacher');
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(classData);
  } catch (error) {
    console.error('Error fetching class by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a class
exports.updateClass = async (req, res) => {
  const { id } = req.params;
  const { name, schedule, categoryId } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updatedClass = await Class.findByIdAndUpdate(id, {
      name,
      schedule,
      category: categoryId,
    }, { new: true });

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a class
exports.deleteClass = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedClass = await Class.findByIdAndDelete(id);
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({ message: 'Class removed' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
