const jwt = require('jsonwebtoken');

// Middleware to verify access token
exports.verifyToken = (req, res, next) => {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user; // user = { id, role, ... }
    next();
  });
};

// Middleware to restrict access to admins only
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
};
