const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
aws.config.loadFromPath(__dirname + "/../config/s3Info.json"); //aws 접근권한 가져오기. 현재 디렉토리에서 seInfo 추가해주기.

const s3 = new aws.S3();
const upload = new multer({
  storage: multerS3({
    s3: s3, // 저장소는 s3에 s3로 저장
    bucket: "node-pet-sns", // aws s3 버킷 이름
    acl: "public-read-write", //권한 설정
    key: (req, file, cb) => {
      cb(null, Date.now() + "." + file.originalname.split(".").pop()); //dog.png -> 가 split를 통해 [dog, png] 만들어지고 pop으로 png배출 즉 확장자 는 빼주는거임
    },
  }),
});

module.exports = upload;
