// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protectAdmin } = require("../middleware/authMiddleware");

// Get all users (protected)
router.get("/", protectAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by ID (protected)
router.get("/:id", protectAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get users by division
router.get("/division/:divisionName", async (req, res) => {
  try {
    const { divisionName } = req.params;
    const users = await User.find({ divisionName });
    if (!users.length) {
      return res
        .status(404)
        .json({ message: "No users found in this division" });
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new user (protected)
router.post("/", protectAdmin, async (req, res) => {
  try {
    const {
      name,
      pictureUrl,
      position,
      divisionName,
      divisionBlurb,
      header,
      blurb,
      links,
    } = req.body;
    if (
      !name ||
      !pictureUrl ||
      !position ||
      !divisionName ||
      !divisionBlurb ||
      !header ||
      !blurb
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }
    const newUser = new User({
      name,
      pictureUrl,
      position,
      divisionName,
      divisionBlurb,
      header,
      blurb,
      links,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update user (protected)
router.put("/:id", protectAdmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user (protected)
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
