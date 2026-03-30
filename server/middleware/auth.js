import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const jwtSecret = process.env.JWT_SECRET;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  if (!jwtSecret) {
    return res.status(500).json({ message: "JWT secret not configured" });
  }

  try {
    const [scheme, credential] = authHeader.split(" ");
    // Support both "Bearer <token>" and plain token formats.
    const token = scheme?.toLowerCase() === "bearer" ? credential : authHeader;

    if (!token) {
      return res.status(401).json({ message: "Invalid authorization header" });
    }

    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findById(decoded.id).select("_id name email role");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;