const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  content: String,
  image: String,
  publishedDate: String, //YY년도 MM월 DD일 값같은 문자열을 해주기 때문에 string

  likeCount: {
    //좋아요 개수
    type: Number,
    default: 0,
  },
  likeUser: {
    //좋아요 누른 사람
    type: Array,
    default: [],
  },
  comment: {
    // 댓글
    type: Array,
    default: [],
  },
  user: {
    //어떤 유저가 눌럿는지, 댓글달앗는지를 게시물을 업로드했는지 체크
    _id: mongoose.Types.ObjectId, //ObjectId는 mongoDB에서 적용되는 해당 id값임 == django pk값
    username: String,
  },
});

module.exports = mongoose.model("post", postSchema);
