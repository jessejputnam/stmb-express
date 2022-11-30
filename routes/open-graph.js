"use strict";

const express = require("express");
const router = express.Router();
const ogs = require("open-graph-scraper");

router.get("/:id", async (req, res, next) => {
  const site = req.params.id;
  const options = { url: site };
  const data = await ogs(options);

  if (data.error == true) {
    return res.send(new Error("There was an error fetching site data"));
  }

  let siteInfo;
  if (data.result.success) {
    siteInfo = {
      name: data.result.ogSiteName ?? data.result.ogTitle ?? "Not Found",
      description: data.result.ogDescription ?? "Not Found",
      url: data.result.ogUrl ?? "Not Found",
      img: data.result.ogImage ? data.result.ogImage.url : "Not Found"
    };
  } else {
    siteInfo = {
      name: "Not Found",
      description: "Not Found",
      url: "Not Found",
      img: "Not Found"
    };
  }

  res.send(siteInfo);
});

module.exports = router;
