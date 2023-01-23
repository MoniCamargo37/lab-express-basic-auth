const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const isLoggedIn = require("../middlewares");

/*Get user PAGE*/
router.get("/profile", isLoggedIn, function (req, res, next) {
  const user = req.session.currentUser;
  res.render("profile", { user });
});

/*Get edit page */
router.get("/profile/edit", isLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  res.render("profileEdit", { user });
});

// POST login route ==> to process form data
router.post("/profile/edit", isLoggedIn, async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    res.render("profileEdit");
    return;
  }
  const user = req.session.currentUser;
  try {
    const userInDB = await User.findByIdAndUpdate(
      user._id,
      { username },
      { new: true }
    );
    req.session.currentUser = userInDB;
    res.render("profile", { user: userInDB });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
