const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const protectAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = { protectAdmin };
