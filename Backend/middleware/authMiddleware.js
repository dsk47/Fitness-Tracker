// middleware/authMiddleware.js
const { verifyToken } = require("../utils/jwt");

module.exports = (req, res, next) => {
  try {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No token" });
    const decoded = verifyToken(token);
    req.user = { id: decoded.id };
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
