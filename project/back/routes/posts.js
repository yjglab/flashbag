const express = require("express");
const { Op } = require("sequelize");
const {
  Post,
  PostImage,
  User,
  Comment,
  Hashtag,
  UserReport,
} = require("../models");
const router = express.Router();

router.get("/keyword/:word", async (req, res, next) => {
  try {
    const where = {};
    if (parseInt(req.query.lastPostId, 10)) {
      where.id = {
        [Op.lt]: parseInt(req.query.lastPostId, 10),
      };
    }
    const word = decodeURIComponent(req.params.word);
    const loadedPosts = await Post.findAll({
      where: {
        ...where,
        [Op.or]: [
          {
            topic: {
              [Op.substring]: word,
            },
          },
          {
            content: {
              [Op.substring]: word,
            },
          },
        ],
      },
      limit: 12,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],

      include: [
        {
          model: User,
          attributes: ["id", "username", "role", "avatar", "rank"],
          include: [
            {
              model: UserReport,
              attributes: ["reporterId"],
            },
          ],
        },

        {
          model: User,
          as: "PostProdders",
          attributes: ["id"],
        },
        {
          model: PostImage,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "username", "role", "avatar", "rank"],
            },
            {
              model: User,
              as: "CommentProdders",
              attributes: ["id"],
            },
          ],
        },
      ],
    });
    console.log("로디드드", loadedPosts);
    res.status(201).json(loadedPosts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const where = {};
    if (parseInt(req.query.lastPostId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastPostId, 10) };
    }
    const loadedPosts = await Post.findAll({
      where,
      limit: 12,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],

      include: [
        {
          model: User,
          attributes: ["id", "username", "role", "avatar", "rank"],
          include: [
            {
              model: UserReport,
              attributes: ["reporterId"],
            },
          ],
        },

        {
          model: User,
          as: "PostProdders",
          attributes: ["id"],
        },
        {
          model: PostImage,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "username", "role", "avatar", "rank"],
            },
            {
              model: User,
              as: "CommentProdders",
              attributes: ["id"],
            },
          ],
        },
      ],
    });
    res.status(201).json(loadedPosts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
