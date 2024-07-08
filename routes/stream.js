const express = require("express");
const { S3Client, HeadObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const Post = require("../models/Post");
const {AWS_ACCESS_KEY,AWS_SECRET_ACCESS_KEY } = require("../config/keys");

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const router = express.Router();

router.get("/video/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.redirect("/error");

    const range = req.headers.range;
    const params = {
      Bucket: "learnflow-app-ak",
      Key: post.videoKey.split("https://learnflow-app-ak.s3.ap-south-1.amazonaws.com/")[1],
    };
    const headObjectCommand = new HeadObjectCommand(params);
    const data = await s3.send(headObjectCommand);

    const fileSize = data.ContentLength;
    const chunkSize = 1 * 1e6; // 1MB chunk size
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, fileSize - 1);
    const contentLength = end - start + 1;

    const getObjectCommand = new GetObjectCommand({
      ...params,
      Range: `bytes=${start}-${end}`,
    });
    const response = await s3.send(getObjectCommand);
    
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
      "Access-Control-Allow-Origin": "*",  // Add this line
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Range",  // Add this line
      "Access-Control-Allow-Methods": "GET, PUT, POST, HEAD"  // Add this line
    });

    response.Body.pipe(res);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
