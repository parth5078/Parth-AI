const { verifyToken } = require('../config/jwt');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // In development mode, make authentication optional
    if (process.env.NODE_ENV === 'development' && !token) {
      // Create a default user for development
      req.user = { _id: 'dev-user-id' };
      return next();
    }
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = verifyToken(token);
    
    // In development mode, use the decoded user directly
    // In production, this would verify against a database
    req.user = { _id: decoded.userId };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
