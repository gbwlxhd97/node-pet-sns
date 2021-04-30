var express = require("express");
var router = express.Router();
const authRouter = require("./auth");
const postRouter = require("./posts");
const postCtr = require("../controller/postCtr");

router.get("/", postCtr.list);

router.use("/auth", authRouter); //use는 post,get과 같은 메소드에 상관없이 auth라는 url로 접근하게 되면 모든 요청을 authRouter로 보냄
router.use("/posts", postRouter);

module.exports = router;
