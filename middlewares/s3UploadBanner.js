"use strict";

const { S3 } = require("aws-sdk");

const bucketName = process.env.AWS_BUCKET_NAME;

const s3UploadBanner = async (file, pageId) => {
  const s3 = new S3();

  const extension = file.key.split(".")[1];
  const contentType = "image/" + extension;

  const param = {
    Bucket: bucketName,
    Key: pageId + "/" + "banner/" + Date.now() + "-" + file.originalname,
    Body: file.buffer,
    content_type: contentType
  };

  return await s3.upload(param).promise();
};

module.exports = s3UploadBanner;
