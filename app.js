var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
const jwtMiddleware = require("./module/jwtMiddleware");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(jwtMiddleware); // index router 앞단에  위치 시켜서 모든 사용자에 대한 정보를 확인한 후에 라우터에 접근할 수 있도록 해줌.
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
app.io = require("socket.io")(); //소켓 실행

app.io.on("connection", (socket) => { //클라이언트가 접속을 했을 때, socket을 결과값으로 받음
  socket.on("chat-msg", (user, msg) => {  //index ejs에 "chat-msg"와 user,msg를 받았으니 emit을 통해 다시클라이언트에게 뿌려줌
    app.io.emit("chat-msg", user, msg);
  });
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
