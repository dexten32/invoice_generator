const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token from Authorization header.
 * Attaches decoded user payload to req.user if valid.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Token has expired.' });
    }
    return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};

module.exports = authMiddleware;
