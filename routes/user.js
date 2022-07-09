const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()
const User = require("../models/users");
const Session = require("../models/session");
const auth = require("../middleware/auth");
const router = express();

const config = process.env;

router.post("/register", async (req, res) => {
  try {
    const { email, password, fname, lname, role } = req.body;
    const userObj = await User.findOne({ email });
    if (userObj) {
      res.send("User already registered");
      return;
    }

    const user = new User({
      fname: fname,
      lname: lname,
      email: email,
      role: role,
    });

    if (user) {
      const salt = await bcrypt.genSalt(8);
      const bcryptedPassword = await bcrypt.hash(password, salt);
      user.password = bcryptedPassword;
    }
    user.save();

    res.send({ message: "Registration successfully", data: user });
  } catch (error) {
    console.error(error);
    res.send(`Something went wrong: ${error.message}`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = req.headers["x-auth-token"];

    const userObj = await User.findOne({ email });
    const comparePassword = await bcrypt.compare(password, userObj.password);
    console.log(comparePassword, "-----------------");
    if (userObj && comparePassword) {
      const genToken = jwt.sign(
        { userId: userObj._id, email, role: userObj.role },
        process.env.SecurityKey,
        {
          expiresIn: "1h",
        }
      );

      const session = new Session({
        email: userObj.email,
        role: userObj.role,
        token: genToken,
        userId: userObj._id,
      });
      session.save();

      res.send({ message: "User Logged in Successfully", data: session });
    }else {
        res.send({message:"Email or password incorrect"})
    }

    
  } catch (error) {
    res.send(`Something went wrong : ${error.message}`);
    console.error(error);
  }
});

module.exports = router;
