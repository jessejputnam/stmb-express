"use strict";

const { S3 } = require("aws-sdk");
const filterUrl = require("../utils/filterS3Url");

const Page = require("../models/page");

const bucketName = process.env.AWS_BUCKET_NAME;

const s3UploadProfile = async (file, pageId) => {
  const s3 = new S3();

  // Delete previous image if not placeholder
  try {
    const page = await Page.findById(pageId);

    if (page.profileImg.includes("http")) {
      const key = filterUrl(page.profileImg);

      const delParams = {
        Bucket: bucketName,
        Key: key
      };

      await s3.deleteObject(delParams).promise();
    }
  } catch (err) {
    return {
      errorMsg: "Error deleting previous profile image"
    };
  }

  const contentType = file.mimetype;

  const params = {
    Bucket: bucketName,
    Key: pageId + "/" + "profile/" + Date.now() + "-" + file.originalname,
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

module.exports = s3UploadProfile;
