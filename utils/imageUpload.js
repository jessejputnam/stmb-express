"use strict";

const S3 = require("aws-sdk/clients/s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadImg = function upload(destinationPath) {
  return multer({
    // Filter for file types
    fileFilter: fileFilter,

    // Create mutler s3 function for storage
    // Check with ACL or permissions?
    storage: multerS3({
      acl: "public-read",
      s3,
      bucket: bucketName,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: "TESTING_METADATA" });
      },
      key: function (req, file, cb) {
        const newFileName = "/" + Date.now() + "-" + file.originalname;
        const pageId = String(req.user.creator.page._id);
        const fullPath = pageId + "/" + destinationPath + "/" + newFileName;

        cb(null, fullPath);
      }
    }),

    // Set limits on file size to 10MB
    limits: { fileSize: 1024 * 1024 * 10 }
  });
};

module.exports = uploadImg;
