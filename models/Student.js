const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    default: 'student',
  },
  passwordHash: {
    type: String,
    required: true,
  },
  hoursPurchased: {
    type: Number,
    default: 0,
  },
  classesCompleted: {
    type: Number,
    default: 0,
  },
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
