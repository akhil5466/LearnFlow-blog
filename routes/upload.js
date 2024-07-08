const express = require("express");
const { S3Client, HeadObjectCommand, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuid } = require("uuid");
const { ensureAuth } = require("../middleware/auth");
const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = require("../config/keys");

const router = express.Router();

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

router.get("/video", async (req, res) => {
  console.log("Here");
  const range = req.headers.range;
  const params = {
    Bucket: "learnflow-app-ak",
    Key: "105974330780276851754",
  };

  try {
    const headObjectCommand = new HeadObjectCommand(params);
    const data = await s3.send(headObjectCommand);

    const fileSize = data.ContentLength;
    console.log(fileSize);

    const chunkSize = 1 * 1e6;
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

router.get("/", ensureAuth, async (req, res) => {
  const contentType = req.query.contentType;
  const user = req.user;
  const fileName =
    user.googleID +
    "/" +
    req.query.fileName.split(".")[0] +
    uuid() +
    "." +
    contentType.split("/")[1];

  console.log(fileName);

  const command = new PutObjectCommand({
    Bucket: "learnflow-app-ak",
    Key: fileName,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  res.json({
    url,
    key: fileName,
  });
});

module.exports = router;
