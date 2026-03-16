const bcrypt = require('bcryptjs');

// In-memory mock user store
// Passwords are hashed with bcrypt
const users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    // Password: password123
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    avatar: 'AU',
  },
];

/**
 * Find a user by email
 * @param {string} email
 * @returns {object|undefined}
 */
const findByEmail = (email) => {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

/**
 * Get a safe user object (no password)
 * @param {object} user
 * @returns {object}
 */
const safeUser = (user) => {
  const { password, ...safe } = user;
  return safe;
};

module.exports = { users, findByEmail, safeUser };
