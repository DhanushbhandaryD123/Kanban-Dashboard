import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const shape = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  avatar: u.avatar,
  role: u.role,
});

// POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password, role: "owner" });
  res.status(201).json({ user: shape(user), token: generateToken(user._id) });
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid email or password" });

  res.json({ user: shape(user), token: generateToken(user._id) });
};

// GET /api/auth/me
export const me = async (req, res) => res.json({ user: shape(req.user) });

// POST /api/auth/forgot-password  (stub: returns a reset token)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No account with that email" });
  // In production: email a signed reset link. Here we return a short-lived token.
  res.json({ message: "Reset link generated", resetToken: generateToken(user._id) });
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  req.user.password = password;
  await req.user.save();
  res.json({ message: "Password updated" });
};
