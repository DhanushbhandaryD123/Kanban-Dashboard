import { User } from "../models/User.js";

export const updateProfile = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Name is required" });
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  }
  if (trimmed.length > 50) {
    return res.status(400).json({ message: "Name must be 50 characters or fewer" });
  }

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = trimmed;
  await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
  });
};
