"use strict";

const { S3 } = require("aws-sdk");

const bucketName = process.env.AWS_BUCKET_NAME;

const s3UploadPost = async (file, postId) => {
  const s3 = new S3();
  const contentType = file.mimetype;

  const params = {
    Bucket: bucketName,
    Key: postId + "/" + Date.now() + "-" + file.originalname,
    Body: file.buffer,
    ContentType: contentType
  };

  // Upload new image to S3
  try {
    return await s3.upload(params).promise();
  } catch (err) {
    return {
      errorMsg: "Error uploading image"
    };
  }
};

module.exports = s3UploadPost;
