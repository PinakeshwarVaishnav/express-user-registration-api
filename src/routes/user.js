import { verifyToken } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";
import express from "express";

const router = express.Router();

router.get("/:username", verifyToken, async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user_profile: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
