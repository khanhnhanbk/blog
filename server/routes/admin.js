const express = require("express");
const Post = require("../models/Post");

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

module.exports = router;
