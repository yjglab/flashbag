const express = require("express");
const multer = require("multer");
const fs = require("fs");

const { User, Post, Userboard, PostImage } = require("../models");
const { isLoggedIn } = require("./middlewares");
const path = require("path");

const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads 폴더가 없으므로 새로 생성합니다");
  fs.mkdirSync("uploads");
}
const upload = multer({
  storage:
    process.env.NODE_ENV === "production"
      ? ""
      : multer.diskStorage({
          destination(req, file, done) {
            done(null, "uploads");
          },
          filename(req, file, done) {
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);

            done(null, basename + "_" + new Date().getTime() + ext); // 덮어쓰기 방지
          },
        }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10mb
});

router.post(
  "/images",
  isLoggedIn,
  upload.array("postImages"),
  async (req, res, next) => {
    try {
      if (req.files.length > 6) {
        return res.status(401).send("이미지는 6장을 초과할 수 없습니다");
      }
      res.json(
        req.files.map((v) =>
          process.env.NODE_ENV === "production" ? "" : v.filename
        )
      );
    } catch (error) {
      console.error(error);
    }
  }
);

router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: { id: req.params.postId, UserId: req.user.id },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      topic: req.body.topic || "토픽 없음",
      content: req.body.content,
      UserId: req.user.id,
    });
    await Userboard.increment(
      {
        rankpoint: 10,
      },
      {
        where: {
          UserId: req.user.id,
        },
      }
    );

    if (req.body.postImagePaths && Array.isArray(req.body.postImagePaths)) {
      const postImages = await Promise.all(
        req.body.postImagePaths.map((path) => PostImage.create({ src: path }))
      );
      await post.addPostImages(postImages);
    }

    const resultPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: User,
          attributes: ["id", "username", "status"],
        },
        {
          model: PostImage,
        },
      ],
    });

    res.status(201).json(resultPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
