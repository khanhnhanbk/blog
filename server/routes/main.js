const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// Routes
router.get("/", async (req, res) => {
  const locals = {
    title: "KN's Blog",
    description: "This is my personal blog.",
  };
  try {
    // Get all posts from DB, sort by date, and limit to 10
    const page = req.query.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const data = await Post.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    // Get total number of posts
    const count = await Post.countDocuments();

    const nextPage =
      page < Math.ceil(count / limit) ? parseInt(page) + 1 : null;

    res.render("index", { locals, data, nextPage });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;
