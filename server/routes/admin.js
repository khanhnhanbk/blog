const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/admin");
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

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
router.get("/admin/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin dashboard",
    };
    const data = await Post.find();
    res.render("admin/dashboard", { locals, layout: adminLayout, data });
  } catch (error) {
    console.log(error);
  }
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

// add post - GET
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add post",
    };
    res.render("admin/add-post", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// add post - POST
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body;
    const post = await Post.create({
      title,
      body,
    });
    res.status(201).json({ message: "Post Created", post: post._id });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Post already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
