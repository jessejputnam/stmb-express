"use strict";

const { S3 } = require("aws-sdk");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3UploadBanner = async (file, pageId) => {
  const s3 = new S3();

  const param = {
    Bucket: bucketName,
    Key: pageId + "/" + "banner/" + Date.now() + "-" + file.originalname,
    Body: file.buffer
  };

  return await s3.upload(param).promise();
};

module.exports = s3UploadBanner;
