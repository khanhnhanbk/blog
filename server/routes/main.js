const express = require("express");
const router = express.Router();

// Routes
router.get("/", (req, res) => {
  const locals = {
    title: "Home",
    description: "This is the home page",
  };
  res.render("index", { locals });
});

router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;
