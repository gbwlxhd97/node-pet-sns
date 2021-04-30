// 게시물 관련 로직을 담당해줌
const Post = require("../model/post");

const formatDate = (date) => {
  let d = new Date(date);
  let month = "" + (d.getMonth() + 1); //getmonth는 만약 3월달이면 2를 가져옴 그래서 +1 해줌
  let day = "" + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) {
    //만약 2021년 4월 4일 이면 2021 04 04로 표시해주기 위한 조건문
    month = "0" + month;
  }
  if (day.length < 2) {
    day = "0" + day;
  }
  return [year, month, day].join("-");
};

const postCtr = {
  upload: async (req, res) => {
    const { title, content } = req.body;
    const image = req.file.location;
    const publishedDate = formatDate(new Date());
    //formatDate를 통해서 YYYY-MM-dd 형태로 바꿈.
    const post = new Post({
      //new Post는 DB의 Post 스키마임.
      title: title,
      content: content,
      image: image,
      publishedDate: publishedDate,
      user: req.userInfo, //어떤 사람이 업로드했는지 DB에 추가해주기.
    });
    try {
      //위의 정보를 저장하는 코드
      await post.save();
      res.redirect("/"); //게시물업로드가 되었다면 메인페이지 redirect
    } catch (error) {
      res.status(500).send("upload error");
    }
  },
  list: async (req, res) => {
    // 게시물 업로드가 된 업로드파일을 index.ejs 인 메인페이지에다 데이터를 삽입시켜줌
    const posts = await Post.find({}); //find로 전체 게시물 가져와서 posts 변수에 삽입
    res.render("index", { postList: posts }); //postList에 posts 데이터 넣어주기
  },
  detail: async (req, res) => {
    //게시물의 detail view를 보여줌.
    const { id } = req.params; //_id 를 통해서 해당 게시물에 접근
    const post = await Post.findById(id); //id로 해당 게시물 조회
    res.render("detail", { post: post }); //찾아온 결과값을 디테일view로 랜더링 시켜주기.
  },
  updateLayout: async (req, res) => {
    //update 페이지에 진입을 했을 때 ,이전의 데이터들이 미리작성해 놓은 title, content 데이터가 입력 되어 있기. -> 이후 수정하기
    const { id } = req.params;
    const post = await Post.findById(id); //해당게시물 찾아오기
    res.render("update", { post: post });
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
      await Post.findOneAndUpdate(
        id, // 해당 게시물 id 에 접근해야하니 첫째 매개변수에 id 삽입
        { title: title, content: content }, //업데이트 된 내용인 title content에 각각에 값 넣어주기.
        { new: true } //update된 결과값이 반영 되도록 하기.
      );
      res.redirect("/");
    } catch (error) {
      res.status(500).send("update error");
    }
  },
  delete: async (req, res) => {
    const { id } = req.params;

    try {
      await Post.findByIdAndDelete(id); //해당 게시물 id를 삭제하여 내용물도 같이 삭제
      res.redirect("/");
    } catch (error) {
      res.status(500).send("delete error");
    }
  },
  like: async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const check = post.likeUser.some((userId) => {
      return userId === req.userInfo._id; //some 함수는 likeUser(model) 배열을 돌면서 userId를 바탕으로  req.userInfo._id 와같으면 변수 check에 ture 출력
    });
    if (check) {
      //이미 좋아요를 눌른 상태 감소.
      post.likeCount -= 1;
      const idx = post.likeUser.indexOf(req.userInfo._id); //indexOf 함수는 배열 에서 요소를 찾을 때 사용 만약 해당요소가 있다면 0~n 없다면 -1 리턴
      if (idx > -1) {
        //만약 -1 보다 작으면 req.userInfo._id가 userId와 일치하지 않다는것을 뜻함. 현재 조건은 더 큰걸 찾기 때문에 해당요소가 있다고 판단함.
        post.likeUser.splice(idx, 1);
      }
    } else {
      //해당 유저가 좋아요를 누르지 않았다면?
      post.likeCount += 1;
      post.likeUser.push(req.userInfo._id);
    }
    const result = await post.save();
    res.status(200).json({
      check: check,
      post: result,
    });
  },
  comment: async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const user = req.userInfo; //로그인 하면서 받았던 userInfo를 user에 저장하여 댓글을 누가달앗는지 보여주게함
    const { comment } = req.body;
    const commentWrap = {
      comment: comment,
      user: user,
    };
    post.comment.push(commentWrap);
    const result = await post.save();
    res.status(200).json({ post: result });
  },
};

module.exports = postCtr;
