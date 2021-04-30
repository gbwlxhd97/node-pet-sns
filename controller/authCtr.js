const User = require("../model/auth");
const bcrypt = require("bcrypt"); //pw문자를 그대로 db에 넘겨주지않고 암호화해서 넘겨줌
const secretKey = require("../config/secretKey.json");
const jwt = require("jsonwebtoken");
const authCtr = {
  register: async (req, res) => {
    const { username, password } = req.body;

    const exist = await User.findOne({ username: username }); //해당 사용자가 지금 회원가입 되어 있는지 유무 username을 바탕으로 DB에 있는 user를 불러와서 username이 일치하는지 판단
    if (exist) {
      res.status(504).send("user exist!!");
      return;
    }

    const user = new User({
      //일치하는 username이 없다면 회원가입
      username: username,
    });
    const hashedPassword = await bcrypt.hash(password, 10); //hash알고리즘을 10번 돌림.
    user.password = hashedPassword;
    await user.save();
    res.redirect("/");
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      res.status(500).send("user not found");
      return;
    }
    //만약 user가 있다면 입력한 pw와 DB에 저장한 pw를 비교하는 역할을 해줌.
    const vaild = await bcrypt.compare(password, user.password); // 첫번째 인자 지금 유저가 입력한 pw 두번째 인자 DB에 저장한 pw
    if (!vaild) {
      res.status(500).send("password invaild");
    }

    //JWT 발급 과정.
    const data = user.toJSON(); //user를 JSON화
    delete data.password; //유저 정보가 저장되어있지만 pw는 토큰으로 재발급되기때문에 필요가 없는 정보임 그래서 삭제해줌.
    const token = jwt.sign(
      {
        _id: data._id, //사용자 판별
        username: data.username,
      },
      secretKey.key, //암호화 시킬 수 있는 값 토큰을 문자열 형태로 해줄것이기 때문에 ""으로 값을 줌.(값은 자유 문자열인것만 명시해주기) 또한 보안이 중요하기떄문에 외부파일로 config파일에 있음.
      {
        expiresIn: "7d", //토큰의 지속기간 7일 마다 갈아 줌 실무일수록 시간단위는 짧아짐
      }
    );
    res.cookie("access_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, //밀리세컨드 단위이기때문에 7일동안 쿠키 지속 1초,60초,60분 24시간,7일
      httpOnly: true, //http 에서만 접근하도록 해줌
    });
    res.redirect("/");
  },
};

module.exports = authCtr;
