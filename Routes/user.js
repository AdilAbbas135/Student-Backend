const express = require("express");
const UserModel = require("../Models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const { verify_token, verify_token_and_admin } = require("./verify_user");

// Update user at  localhost:5000/api/user/update/id
router.put("/update/:id", verify_token, async (req, res) => {
  if (req.params.id === req.user.userId) {
    // UPDATE USERNAME
    if (req.body.username) {
      const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        { $set: { username: req.body.username } },
        { new: true }
      );
      res.status(200).json({ msg: "User Updated Successfully", user });
    }

    // UPDATE PASSWORD
    if (req.body?.password) {
      const salt = await bcrypt.genSalt(10);
      const newpass = await bcrypt.hash(req.body.password, salt);
      const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        { $set: { password: newpass } },
        { new: true }
      );
      res.status(200).json({ msg: "User Updated Successfully", user });
    }
  } else {
    res.status(404).json({ msg: "You are not allowed to updated that detail" });
  }
});

// Deleting a user at  localhost:5000/api/user/delete/id and the user that is going to delete the account should be admin
router.delete("/delete/:id", verify_token_and_admin, async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(404).json({ err });
  }
});

// Getting all users at  localhost:5000/api/user/getusers and the user that is going to get the account should be admin
router.get("/getusers", verify_token_and_admin, async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(404).send(error);
  }
});

// Getting a user at  localhost:5000/api/user/getuser/id and the user that is going to get the account should be admin
router.get("/getuser/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(200).json({ error: true, msg: "Sorry User Not Found" });
  }
});

module.exports = router;
