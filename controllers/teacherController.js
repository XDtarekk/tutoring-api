const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');

// Generate token function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register teacher
exports.registerTeacher = async (req, res) => {
  const { name, email, password, number, dateOfBirth, departments } = req.body;

  try {
    const teacherExists = await Teacher.findOne({ email });

    if (teacherExists) {
      return res.status(400).json({ message: 'Teacher already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const teacher = new Teacher({
      name,
      email,
      number,
      dateOfBirth,
      passwordHash: hashedPassword,
      departments,
    });

    await teacher.save();

    res.status(201).json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      number: teacher.number,
      dateOfBirth: teacher.dateOfBirth,
      departments: teacher.departments,
      classes: teacher.classes,
      token: generateToken(teacher._id),
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Authenticate teacher
exports.authTeacher = async (req, res) => {
  const { email, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });

    if (teacher && (await bcrypt.compare(password, teacher.passwordHash))) {
      res.json({
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        number: teacher.number,
        dateOfBirth: teacher.dateOfBirth,
        departments: teacher.departments,
        classes: teacher.classes,
        token: generateToken(teacher._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update teacher profile
exports.updateTeacher = async (req, res) => {
  const { name, email, number, dateOfBirth, departments } = req.body;

  try {
    const teacher = await Teacher.findById(req.user._id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacher.name = name || teacher.name;
    teacher.email = email || teacher.email;
    teacher.number = number || teacher.number;
    teacher.dateOfBirth = dateOfBirth || teacher.dateOfBirth;
    teacher.departments = departments || teacher.departments;

    await teacher.save();

    res.json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      number: teacher.number,
      dateOfBirth: teacher.dateOfBirth,
      departments: teacher.departments,
      classes: teacher.classes,
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete teacher account
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user._id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await teacher.remove();

    res.json({ message: 'Teacher removed' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new class
exports.addClass = async (req, res) => {
  const { className, schedule, categoryId } = req.body;

  try {
    const teacher = await Teacher.findById(req.user._id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const newClass = new Class({
      name: className,
      schedule,
      teacher: teacher._id,
      category: categoryId,
    });

    await newClass.save();

    teacher.classes.push(newClass._id);
    await teacher.save();

    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error adding class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get teacher by ID
exports.getTeacherById = async (req, res) => {
  const { id } = req.params;

  try {
    const teacher = await Teacher.findById(id).populate('classes');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      number: teacher.number,
      dateOfBirth: teacher.dateOfBirth,
      departments: teacher.departments,
      classes: teacher.classes,
    });
  } catch (error) {
    console.error('Error fetching teacher by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('classes');

    res.json(teachers);
  } catch (error) {
    console.error('Error fetching all teachers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
