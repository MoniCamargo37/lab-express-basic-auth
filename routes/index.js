const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const user = req.session.currentUser;
  res.render("index", { user });
});

router.get("/main", (req, res, next) => {
  const user = req.session.currentUser;
  res.render("main", { user });
});

router.get("/private", (req, res, next) => {
  const user = req.session.currentUser;
  res.render("private", { user });
});

module.exports = router;
