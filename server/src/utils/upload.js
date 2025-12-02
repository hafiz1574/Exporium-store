const path = require("path");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const config = require("../config/env");
const { ensureUploadDir } = require("./storage");

ensureUploadDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname) || ".bin";
    cb(null, `${uuid()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }

    return cb(null, true);
  },
});

module.exports = upload;
