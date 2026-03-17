const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Helper to remove password from user object
const safeUser = (user) => {
  const { password, ...safe } = user;
  return safe;
};

/**
 * POST /api/auth/signup
 * Body: { email, password, name }
 * Returns: { message, user }
 */
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'user', // Default role
      }
    });

    return res.status(201).json({
      message: 'User created successfully.',
      user: safeUser(user),
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Failed to create user.' });
  }
});

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

  try {
    const user = await prisma.user.findUnique({ where: { email } });

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
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully.' });
});

/**
 * GET /api/auth/me
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const requiresPasswordSetup = user.password === null;
    return res.status(200).json({
      user: {
        ...safeUser(user),
        requiresPasswordSetup
      },
      tempPassword: requiresPasswordSetup ? generateTempPassword() : null
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// Utility to generate a 12-character random "old password" for display
const generateTempPassword = () => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let retVal = "";
  for (let i = 0; i < 12; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return retVal;
};

/**
 * POST /api/auth/google
 * Body: { idToken }
 */
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'Google ID token is required.' });
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      console.error('[Auth] GOOGLE_CLIENT_ID is missing from environment variables.');
      return res.status(500).json({ message: 'Server error: Google Client ID is not configured.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Email not provided by Google.' });
    }

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId },
          { email }
        ]
      }
    });

    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = await prisma.user.create({
        data: {
          email,
          googleId,
          name: name || 'Google User',
          avatar,
          role: 'user',
        }
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, avatar }
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const requiresPasswordSetup = user.password === null;
    const tempPassword = requiresPasswordSetup ? generateTempPassword() : null;

    return res.status(200).json({
      message: 'Google login successful.',
      token,
      user: {
        ...safeUser(user),
        requiresPasswordSetup
      },
      tempPassword
    });
  } catch (error) {
    console.error('Google login error:', error.message);
    return res.status(400).json({ message: `Google verification failed: ${error.message}` });
  }
});

/**
 * POST /api/auth/setup-password
 * Body: { newPassword }
 */
router.post('/setup-password', authMiddleware, async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    return res.status(200).json({
      message: 'Password set successfully.',
      user: safeUser(updatedUser),
    });
  } catch (error) {
    console.error('Setup password error:', error);
    return res.status(500).json({ message: 'Failed to update password.' });
  }
});

module.exports = router;
