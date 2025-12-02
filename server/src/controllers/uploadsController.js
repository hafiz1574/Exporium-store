const path = require("path");
const fs = require("fs");
const config = require("../config/env");

exports.handleUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const relativePath = `/uploads/${path.basename(req.file.path)}`;

  return res.status(201).json({
    url: relativePath,
    filename: req.file.originalname,
    storedAs: path.basename(req.file.path),
    size: req.file.size,
  });
};

exports.handleDelete = (req, res) => {
  const filename = req.params.id;
  const filePath = path.join(config.uploadDir, filename);

  fs.promises
    .unlink(filePath)
    .then(() => res.status(204).send())
    .catch(() => res.status(404).json({ message: "File not found" }));
};
