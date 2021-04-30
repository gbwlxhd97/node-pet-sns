const express = require("express");
const router = express.Router();
const authCtr = require("../../controller/authCtr");

router.post("/register", authCtr.register);
router.post("/login", authCtr.login);

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/logout", (req, res) => {
  res.clearCookie("access_token"); //로그아웃시 쿠키 지워주기
  res.redirect("/");
});
module.exports = router;
