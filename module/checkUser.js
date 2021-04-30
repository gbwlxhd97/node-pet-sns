//게시물의 CRUD가 해당 사용자인지 판별해주는 것
const checkUser = (req, res, next) => {
  if (!req.userInfo) {
    res.status(400).send("user not login");
    return;
  }
  return next();
};

module.exports = checkUser;
