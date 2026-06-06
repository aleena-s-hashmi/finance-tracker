const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Token comes in the header as: "Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next(); // Move on to the actual route handler
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

module.exports = authenticateToken; 
