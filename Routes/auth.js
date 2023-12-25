const express = require("express");
const router = express.Router();
const UserModel = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv");

env.config();

// REGISTER a user at localhost:5000/api/auth/register
router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const newpass = await bcrypt.hash(req.body.password, salt);
  try {
    const user = await UserModel.create({
      username: req?.body.username,
      email: req.body.email,
      password: newpass,
    });
    if (user) {
      const authtoken = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "2d" }
      );
      res.status(200).json({ success: true, user, authtoken });
    }
  } catch (error) {
    res.status(404).json(error);
  }
});

// Login a user at localhost:5000/api/auth/login
router.post("/login", async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (user) {
    const password = await bcrypt.compare(req.body.password, user.password);
    if (password) {
      const authtoken = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "2d" }
      );
      res.status(200).json({ success: true, user, authtoken });
    } else {
      res
        .status(404)
        .json({ success: false, msg: "Wrong Credentials! Try Again " });
    }
  } else {
    res
      .status(404)
      .json({ success: false, msg: "Wrong Credentials! Try Again" });
  }
});

module.exports = router;
