"use strict";

const filterS3Url = (url) => {
  return url.split("https://stmb-imgs.s3.us-west-2.amazonaws.com/")[1];
};

module.exports = filterS3Url;
