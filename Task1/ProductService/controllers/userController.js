const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to generate the access token (short-lived)
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' }); // 15-minute expiration
};

// Function to generate the refresh token (longer-lived)
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); // 7-day expiration
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
    // Generate tokens after user creation
    const accessToken = generateAccessToken(user._id); // Generate access token
    const refreshToken = generateRefreshToken(user._id); // Generate refresh token

    res.status(201).json({ 
      _id: user._id, 
      username: user.username, 
      role: user.role, 
      accessToken, // Return the access token
      refreshToken // Return the refresh token
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const authUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    // const token = generateToken(user._id);
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Send token in an HTTP-only cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'Strict', // Ensures cookie is only sent in first-party contexts
      maxAge: 7 * 24 * 60 * 60 * 1000, // Token expiry, same as JWT (7 days)
    });

    res.json({ 
      _id: user._id, 
      username: user.username, 
      role: user.role, 
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token found, please log in' });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user.id);

    // Send new access token
    res.json({ accessToken });
  });
};

const logoutUser = (req, res) => {
  // Clear the token cookie
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0) // Set the expiration date to the past to delete the cookie
  });
  
  res.status(200).json({ message: 'Logged out successfully' });
};

const validateToken = (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.status(200).json({ message: 'Token is valid', userId: decoded.id });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { registerUser, authUser, logoutUser, refreshAccessToken, validateToken };
