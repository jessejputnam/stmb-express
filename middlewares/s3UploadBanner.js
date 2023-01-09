"use strict";

const { S3 } = require("aws-sdk");
const filterUrl = require("../utils/filterS3Url");

const Page = require("../models/page");

const bucketName = process.env.AWS_BUCKET_NAME;

const s3UploadBanner = async (file, pageId) => {
  const s3 = new S3();

  try {
    const page = await Page.findById(pageId);

    // Delete previous image if not placeholder
    if (page.bannerImg.includes("http")) {
      const key = filterUrl(page.bannerImg);

      const delParams = {
        Bucket: bucketName,
        Key: key
      };

      await s3.deleteObject(delParams).promise();
    }
  } catch (err) {
    return {
      errorMsg: "Error deleting previous banner image"
    };
  }

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
