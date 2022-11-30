"use strict";

const express = require("express");
const router = express.Router();
const ogs = require("open-graph-scraper");

router.get("/:id", async (req, res, next) => {
  const site = req.params.id;
  const options = { url: site };
  const data = await ogs(options);
  console.log(data.result);

  if (data.error === true) {
    return res.send(new Error("There was an error fetching site data"));
  }

  const result = data.result;
  let siteInfo;
  if (data.result.success) {
    siteInfo = {
      name: result.ogSiteName ?? result.ogTitle ?? "Not Found",
      description: result.ogDescription ?? "Not Found",
      url: result.ogUrl ?? result.requestUrl ?? "Not Found",
      img: result.ogImage ? result.ogImage.url : "/images/post-placeholder.png"
    };
  } else {
    siteInfo = {
      name: "Not Found",
      description: "Not Found",
      url: site,
      img: "/images/post-placeholder.png"
    };
  }

  console.log(siteInfo);

  res.send(siteInfo);
});

module.exports = router;
