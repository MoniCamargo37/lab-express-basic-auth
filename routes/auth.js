const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/userModel");

/* GET sign up view. */
router.get("/signup", function (req, res, next) {
  res.render("auth/signup");
});

/* POST sign up */
router.post("/signup", async function (req, res, next) {
  /*aqui el user inserta su contraseña*/
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.render("auth/signup", { error: "All fields are necessary." });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.render("auth/signup", {
      error:
        "Password needs to contain at least 6 characters, one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  try {
    const userFound = await User.findOne({ email: email });
    if (userFound) {
      res.render("auth/signup", {
        error: `The email ${email} is already registered.`,
      });
      return;
    } else {
      /*encripitamos la contraseña*/
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        username,
        email,
        hashedPassword,
      });
      res.render("profile", { user });
    }
  } catch (error) {
    next(error);
  }
});

/* GET log in view. */
router.get("/login", function (req, res, next) {
  res.render("auth/login");
});

/* POST log in view. */
router.post("/login", async function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render("auth/login", {
      error: "Please introduce email and password to log in",
    });
    return;
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.render("auth/login", { error: `There are no users by ${email}` });
      return;
    } else {
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
      if (passwordMatch) {
        req.session.currentUser = user;
        res.render("profile", { user });
      } else {
        res.render("auth/login", { errorMessage: "incorrect password" });
        return;
      }
    }
  } catch (error) {
    next(error);
  }
});

/* GET logout */
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.clearCookie("lab-express-basic-auth");
      res.redirect("/");
    }
  });
});

module.exports = router;
