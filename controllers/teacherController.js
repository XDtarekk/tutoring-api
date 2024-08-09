const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerTeacher = async (req, res) => {
  const { name, email, password, number, dateOfBirth, departments, classes } = req.body;

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
      classes,
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
