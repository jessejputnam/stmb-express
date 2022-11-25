"use strict";

// const {S3} = require("aws-sdk/clients/s3");
const multer = require("multer");

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage = multer.memoryStorage();

const uploadImg = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 }
});

module.exports = uploadImg;
