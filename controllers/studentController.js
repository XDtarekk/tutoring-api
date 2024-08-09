const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerStudent = async (req, res) => {
  const { name, email, password, number, dateOfBirth } = req.body;

  try {
    const studentExists = await Student.findOne({ email });

    if (studentExists) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({
      name,
      email,
      number,
      dateOfBirth,
      passwordHash: hashedPassword,
    });

    await student.save();

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      number: student.number,
      dateOfBirth: student.dateOfBirth,
      token: generateToken(student._id),
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.authStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (student && (await bcrypt.compare(password, student.passwordHash))) {
      res.json({
        _id: student._id,
        name: student.name,
        email: student.email,
        number: student.number,
        dateOfBirth: student.dateOfBirth,
        token: generateToken(student._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
