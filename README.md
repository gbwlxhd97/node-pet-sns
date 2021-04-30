# Node js express를 이용한 pet-sns

### config 폴더 - mongo DB , aws s3, jwt

### controller 폴더 - 로직,알고리즘과 같은 코드 (postCtr, authCtr) 에관한 함수작성.

### model 폴더 - DB스키마 설정.( auth, post)

### Routes 폴더 - 페이지 view를 책임져주는 폴더 -로그인 사용자를 보여줄 auth , 게시물관련 posts 폴더 , 메인 index 파일 메인 index 파일은 (최초로 app.js에서 indexRouter로 접근하기 때문에 메인 index에서 auth, posts를 router로 연결시켜줌.)

### module 폴더 - 미들웨어 담당 부분 (jwtMiddleware, checkUser, multer)

### views 폴더 - 웹페이지 프론트엔드 담당 부분 ejs파일

#### 코드라이언 node js 강의 실습 프로젝트 - express 를 이용한 pet-sns 로 socket.io를 통한 실시간 채팅, JWT로 인한 로그인 회원가입.구현

### 완성 화면
![국희](https://user-images.githubusercontent.com/49021925/116717761-34fd1080-aa14-11eb-9686-819b64bcb15a.PNG)
