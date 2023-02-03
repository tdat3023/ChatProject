const util = require("util");
const multer = require("multer");

let TYPE_FILE = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "video/mp3",
  "video/mp4",
  "video/x-ms-wmv",
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet ",
  "application/rar",
  "application/zip",
  "application/x-zip-compressed",
];

const FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE);

let storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const splitFileName = file.originalname.split(".");
    console.log(splitFileName);
    const fileEx = splitFileName[splitFileName.length - 1];
    console.log(fileEx);

    if (fileEx === "rar") {
      file.mimetype = "application/rar";
    }

    if (TYPE_FILE.indexOf(file.mimetype) === -1) {
      var err = `The file ${file.originalname} is not supported. Only allowed to upload image jpeg or png.`;
      return cb(err, null);
    }

    let filename = `${Date.now()}-zale-${file.originalname}`;
    cb(null, filename);
  },
});

let uploadFile = multer({
  storage,
  limits: { fileSize: FILE_SIZE },
}).single("file");

let uploadManyFiles = multer({
  storage,
  limits: { fileSize: FILE_SIZE },
}).array("files", 10);

let uploadFileMiddleware = util.promisify(uploadFile);
let uploadManyFilesMiddleware = util.promisify(uploadManyFiles);

module.exports = {
  uploadFileMiddleware,
  uploadManyFilesMiddleware,
};
