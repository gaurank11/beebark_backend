const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Sign Up
const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Login
const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  try {
    const sessionDuration = rememberMe ? '7d' : '10m';
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: sessionDuration });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

module.exports = { signUp, login };
