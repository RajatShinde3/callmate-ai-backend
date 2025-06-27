import jwt from 'jsonwebtoken';

const DEMO_USER = { id: 'demo_user', email: 'demo@example.com' };
const SECRET = process.env.JWT_SECRET || 'your_default_secret'; // Use env var in production

// Strict authentication required
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Access token is missing'
    });
  }

  try {
    // Replace demo logic with real JWT verification in production
    const decoded = process.env.NODE_ENV === 'production'
      ? jwt.verify(token, SECRET)
      : DEMO_USER;

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      error: 'Invalid token',
      message: 'Access token is invalid or expired'
    });
  }
};

// Optional authentication – does not fail if token is missing or invalid
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  try {
    const decoded = process.env.NODE_ENV === 'production'
      ? jwt.verify(token, SECRET)
      : DEMO_USER;

    req.user = decoded;
  } catch {
    req.user = null; // token invalid
  }

  next();
};
