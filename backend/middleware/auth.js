// ✅ Verify User Token (Basic JWT-like middleware)
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided, authentication required' });
    }

    // In production, verify JWT token here
    // For now, just pass the token
    req.user = { token };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// ✅ Verify Admin Role
const verifyAdmin = (req, res, next) => {
  try {
    // Check if user is admin
    // This would check the user's role from the token
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Authorization failed' });
  }
};

// ✅ Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    status,
    timestamp: new Date(),
  });
};

module.exports = {
  verifyToken,
  verifyAdmin,
  errorHandler,
};
