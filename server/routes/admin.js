const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";

const router = express.Router();

// Routes
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin dashboard",
    };
    res.render("admin", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// Login - POST
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ email: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { httpOnly: true });
    // res.status(200).json({ message: "Logged in successfully" });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error);
  }
});

// Dashboard - GET
router.get("/admin/dashboard", async (req, res) => {
  res.render("admin/dashboard", { layout: adminLayout });
});

// Register - GET
router.get("/admin/register", async (req, res) => {
  try {
    const locals = {
      title: "Admin register",
    };
    res.render("admin/register", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});
router.post("/admin/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User Created", user: user._id });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
