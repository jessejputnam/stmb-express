// "use strict";

// const S3 = require("aws-sdk/clients/s3");
// const multer = require("multer");
// const multerS3 = require("multer-s3");

// const Page = require("../models/page");
// const Post = require("../models/post");

// const bucketName = process.env.AWS_BUCKET_NAME;
// const region = process.env.AWS_BUCKET_REGION;
// const accessKeyId = process.env.AWS_ACCESS_KEY;
// const secretAccessKey = process.env.AWS_SECRET_KEY;

// const s3 = new S3({
//   region,
//   accessKeyId,
//   secretAccessKey
// });

// exports.upload_banner_img_post = (req, res, next) => {
//   // const imgType = req.body.imgType;
//   // console.log(req.body);
//   // const pageId = req.body.pageId;
//   // const folder = req.body.folder;
//   // const file = req.body.file;
//   // console.log(pageId, folder, file);

//   const bucketPath = `${bucketName}/${pageId}/${folder}`;

//   const upload = multer({
//     // Create mutler s3 function for storage
//     storage: multerS3({
//       acl: "public-read",
//       s3,
//       bucket: bucketPath,
//       metadata: function (req, file, cb) {
//         cb(null, { fieldName: "TESTING_METADATA" });
//       },
//       key: function (req, file, cb) {
//         cb(null, Date.now().toString());
//       }
//     }),
//     // Set limits on file size to 10MB
//     limits: { fileSize: 1024 * 1024 * 10 },
//     // Filter for file types
//     fileFilter: function (req, file, cb) {
//       const filetypes = /jpeg|jpg|png/;
//       const extname = filetypes.test(
//         path.extname(file.originalname).toLowerCase()
//       );
//       const mimetype = filetypes.test(file.mimetype);
//       if (mimetype && extname) {
//         return cb(null, true);
//       } else {
//         cb("Error: Allow images only of extensions jpeg|jpg|png !");
//       }
//     }
//   });

//   // File Upload
//   const singleUpload = upload.single(file);

//   singleUpload(req, res, function (err) {
//     if (err) {
//       return next(err);
//     }

//     // Handle for Page images (banner or profile)
//     const update =
//       folder === "profile"
//         ? { profileImg: req.file.location }
//         : { bannerImg: req.file.location };

//     Page.findByIdAndUpdate(pageId, update, { new: true }, function (err, page) {
//       if (err) {
//         return next(err);
//       }

//       return res.redirect(`/${pageId}`);
//     });
//   });
// };
