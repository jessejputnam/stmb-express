"use strict";

const { S3 } = require("aws-sdk");

const bucketName = process.env.AWS_BUCKET_NAME;

const s3UploadBanner = async (file, pageId) => {
  const s3 = new S3();

  console.log("FILE:", file);

  const contentType = file.mimetype;

  const param = {
    Bucket: bucketName,
    Key: pageId + "/" + "banner/" + Date.now() + "-" + file.originalname,
    Body: file.buffer,
    ContentType: contentType
  };

  return await s3.upload(param).promise();
};

module.exports = s3UploadBanner;
