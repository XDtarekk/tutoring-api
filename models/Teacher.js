const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  className: {
    type: String,
    required: true,
  },
  schedule: [{
    day: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  }],
});

const TeacherSchema = new Schema({
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
    default: 'teacher',
  },
  passwordHash: {
    type: String,
    required: true,
  },
  departments: [{
    type: String,
  }],
  classes: [ClassSchema],
});

const Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;
