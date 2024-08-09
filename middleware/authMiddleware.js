const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try to find the user in both Student and Teacher collections
      let user = await Student.findById(decoded.id).select('-passwordHash');
      
      if (!user) {
        user = await Teacher.findById(decoded.id).select('-passwordHash');
      }

      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: 'Not authorized, no user found' });
      }
      
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
