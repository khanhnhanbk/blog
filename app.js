require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./server/config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Static files
app.use(express.static("public"));

// Database
connectDB();

// Template engine
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Routes
app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin.js"));

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
