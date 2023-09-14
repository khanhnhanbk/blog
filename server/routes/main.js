const express = require("express");
const router = express.Router();

// Routes
router.get("/", (req, res) => {
  const locals = {
    title: "Home",
    description: "This is the home page",
  };
  const data = [{ title: "First Post", createdAt: new Date() }];
  res.render("index", { locals, data, nextPage: null });
});

router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;
