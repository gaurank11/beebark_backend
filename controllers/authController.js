const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Sign Up Controller
const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    // Create a new user
    const user = await User.create({ name, email, password });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

module.exports = { signUp };
