const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  schedule: {
    type: [Date],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
}, {
  timestamps: true,
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
