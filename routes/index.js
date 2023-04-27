const express = require("express");
const router = express.Router();
const usersRouter = require("./user");
const postsRouter = require("./post");
const commentsRouter = require("./comment");
// const errorHandler = require("../middlewares/custom-errHandler");

// 게시글 /posts 라우터
router.use("/posts", postsRouter);

//router.use("/posts/like");

// 댓글 /posts/:_postId/comments
router.use("/posts/:_postId/comments", commentsRouter);

router.use("/auth", usersRouter);

// router.use(errorHandler);

module.exports = router;
