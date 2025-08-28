import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User, { USER_ROLES } from "../models/User.js";

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, institutionId: user.institutionId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

/**
 * POST /api/auth/register
 * Body: { name, email, password, institutionId, role?, department? }
 * Only ADMIN can create other staff. Public can create STUDENT (demo choice).
 */
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, institutionId, role = "STUDENT", department } = req.body;

  // Simple rule: non-admins may only create STUDENT accounts
  if (req.user && req.user.role !== "ADMIN" && role !== "STUDENT") {
    return res.status(403).json({ message: "Only ADMIN can create staff users" });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "User already exists" });

  if (!USER_ROLES.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.create({ name, email, password, institutionId, role, department });
  const token = signToken(user);

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, institutionId: user.institutionId, department: user.department }
  });
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await user.matchPassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, institutionId: user.institutionId, department: user.department }
  });
};

/**
 * GET /api/auth/me
 */
export const me = async (req, res) => {
  res.json({ user: req.user });
};

//Variant 2

// import jwt from "jsonwebtoken";
// import { validationResult } from "express-validator";
// import User, { USER_ROLES } from "../models/User.js";

// // This is for generating the JWT token when a user logs in or registers.
// const signToken = (user) =>
//   jwt.sign(
//     { id: user._id, role: user.role, institutionId: user.institutionId },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
//   );

// /**
//  * POST /api/auth/register
//  * Body: { name, email, password, institutionId, role?, department? }
//  * Only ADMIN can create other staff. Public can create STUDENT (demo choice).
//  */
// export const register = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//   const { name, email, password, institutionId, role = "STUDENT", department } = req.body;

//   // Ensure only an admin can create another admin
//   if (req.user && req.user.role !== "ADMIN" && role === "ADMIN") {
//     return res.status(403).json({ message: "Only ADMIN can create admin users" });
//   }

//   const exists = await User.findOne({ email });
//   if (exists) return res.status(409).json({ message: "User already exists" });

//   if (!USER_ROLES.includes(role)) {
//     return res.status(400).json({ message: "Invalid role" });
//   }

//   const user = await User.create({ name, email, password, institutionId, role, department });
//   const token = signToken(user);

//   res.status(201).json({
//     token,
//     user: { id: user._id, name: user.name, email: user.email, role: user.role, institutionId: user.institutionId, department: user.department }
//   });
// };

