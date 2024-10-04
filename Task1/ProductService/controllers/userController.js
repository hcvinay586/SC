const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ username, password: hashedPassword, role });
  if (user) {
    res.status(201).json({ 
      _id: user._id, 
      username: user.username, 
      role: user.role, 
      token: generateToken(user._id) 
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const authUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({ 
      _id: user._id, 
      username: user.username, 
      role: user.role, 
      token: generateToken(user._id) 
    });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
};

module.exports = { registerUser, authUser };
