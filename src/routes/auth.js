import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, password, fullName, gender, dateOfBirth, country } =
      req.body;

    const existingUser = await User.findOne({
      $or: [{ username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists, login using username and password",
      });
    }

    const newUser = new User({
      username,
      password,
      fullName,
      gender,
      dateOfBirth,
      country,
    });

    await newUser.save();
    console.log("new created user is", newUser);

    return res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(401).json({
      error: "invalid user details, user doesn't exist",
    });
  }

  const ispasswordvalid = await bcrypt.compare(password, user.password);

  if (!ispasswordvalid) {
    return res.status(401).json({
      error: "invalid password",
    });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign(
    { userid: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );

  console.log("token for logged in user is", token);
  return res.json({ token });
});

export default router;
