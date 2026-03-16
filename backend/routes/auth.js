const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findByEmail, safeUser } = require('../data/users');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { token, user }
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = findByEmail(email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(200).json({
    message: 'Login successful.',
    token,
    user: safeUser(user),
  });
});

/**
 * POST /api/auth/logout
 * Stateless logout — client discards the token.
 */
router.post('/logout', (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully.' });
});

/**
 * GET /api/auth/me
 * Returns the current authenticated user's info.
 * Requires: Authorization: Bearer <token>
 */
router.get('/me', authMiddleware, (req, res) => {
  return res.status(200).json({ user: req.user });
});

module.exports = router;
