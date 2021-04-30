//모든 요청에 JWT를 확인을 하고 사용자 확인정보를 표시해주기위한 미들웨어
const jwt = require("jsonwebtoken");
const secretKey = require("../config/secretKey.json");

const jwtMiddleware = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.locals.isAuthenticated = {}; //토큰 없으면 유저인증 정보데이터를 없앰
    return next();
  }

  try {
    const decoded = jwt.verify(token, secretKey.key); // secret key를 바탕으로 토큰 값 해석하기.
    req.userInfo = {
      _id: decoded._id, //해석된 id
      username: decoded.username,
    };
    res.locals.isAuthenticated = { username: decoded.username }; //user 데이터 주기
    return next();
  } catch (error) {
    res.status(500).send("jwt error");
  }
};

module.exports = jwtMiddleware;
