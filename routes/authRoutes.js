const express = require('express');
const { signUp, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', signUp);
router.post('/login', login);

// Protected route example
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'Access granted to protected route', userId: req.user });
});

module.exports = router;
