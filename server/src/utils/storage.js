const fs = require("fs");
const path = require("path");
const config = require("../config/env");

const ensureUploadDir = () => {
  if (!fs.existsSync(config.uploadDir)) {
    fs.mkdirSync(config.uploadDir, { recursive: true });
  }
};

const resolveUploadPath = (filename) => {
  ensureUploadDir();
  return path.join(config.uploadDir, filename);
};

module.exports = {
  ensureUploadDir,
  resolveUploadPath,
};
