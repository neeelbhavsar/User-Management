const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/users");
const router = express();

router.post("/list", auth, async (req, res) => {
  try {
    if (req.user.role == "Admin") {
      let searchQuery = {};
      if (req.body.role && req.body.name) {
        searchQuery["$and"] = [
          {
            $or: [
              { fname: new RegExp(req.body.name, "i") },
              { lname: req.body.name },
            ],
          },
          { role: req.body.role },
        ];
      } else if (req.body.name) {
        searchQuery["name"] = req.body.name;
      } else if (req.body.role) {
        searchQuery["role"] = req.body.role;
      } else {
        searchQuery["role"] = { $nin: ["Admin"] };
      }

      let options = {
        select: "fname lname role",
        limit: req.body.limit ? req.body.limit : 5,
        page: req.body.page ? req.body.page : 1,
      };

      //   const users = await User.find(searchQuery).select("fname lname role");
      const users = await User.paginate(searchQuery, options);
      res.send({ message: "User List Fetched Successfully", data: users });
      return;
    } else {
      res.send({ message: "You cant access this page" });
      return;
    }
  } catch (error) {
    res.send({ message: "Something went wrong", error: error.message });
  }
});

router.put("/user", auth, async (req, res) => {
  const userId = req.query.id;
  console.log(userId);
  try {
    const userObj = await User.findOne({ _id: userId });
    if (!userObj) {
      res.send({ message: "User not found" });
      return;
    }

    const updateUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: req.body },
      { new: true }
    ).select("fname lname role");

    res.send({ message: "User Updated Successfully", data: updateUser });
  } catch (error) {
    res.send({ message: "Something went wrong", error: error.message });
    console.error(error);
  }
});

router.delete("/user", auth, async (req, res) => {
  try {
    const removeUser = await User.deleteMany({ _id: { $in: req.body.users } });
    res.send({ message: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.send({ message: "Something went wrong", error: error.message });
    return;
  }
});

module.exports = router;
