const express = require("express");
const router = express.Router();
const Post = require("../schemas/post");
const Comment = require("../schemas/comment");

/////////////////
//post comments//
/////////////////
router.post("/:_postId/comments", async (req, res) => {
  const { user, password, content } = req.body;
  const { _postId } = req.params;
  if (!content) {
    return res.status(400).json({ message: "댓글을 내용을 입력해주세요" });
  }
  if (!user || !password) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }

  try {
    const checkPost = await Post.findById({ _id: _postId });

    const postComment = await Comment.create({
      postId: checkPost._id,
      user: user,
      password: password,
      content: content,
    });
    res.json({ message: "댓글을 생성하였습니다" });
  } catch (err) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }
  //
});
////////////////
//get comments//
////////////////
router.get("/:_postId/comments", async (req, res) => {
  const { _postId } = req.params;

  try {
    const getComments = await Comment.find({ postId: _postId }).sort({
      created_at: -1,
    });
    console.log(getComments);

    const allComments = getComments.map((getComment) => {
      return {
        commentId: getComment._id,
        user: getComment.user,
        content: getComment.content,
        createdAt: getComment.created_at,
      };
    });
    return res.json({ data: allComments });
  } catch (err) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }
});
///////////////////
//update comments//
///////////////////
router.put("/:_postId/comments/:_commentId", async (req, res) => {
  const { _postId, _commentId } = req.params;
  const { password, content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  }

  try {
    // const getPost = Post.findById({ _id: _postId });
    const getComment = await Comment.findOne({
      _id: _commentId,
      postId: _postId,
    });

    if (!getComment) {
      return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    }
    if (getComment.password == password) {
      const updateComment = await Comment.updateOne(
        { _id: getComment._id },
        { content: content }
      );

      return res.json({ message: "댓글을 수정하셨습니다" });
    } else {
      return res.status(401).json({
        message:
          "데이터 형식이 올바르지 않습니다/ 개인적으로 비밀번호가 다릅니다",
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

///////////////////
//delete comments//
///////////////////
router.delete("/:_postId/comments/:_commentId", async (req, res) => {
  const { _postId, _commentId } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }
  try {
    const getComment = await Comment.findById({
      _id: _commentId,
      postId: _postId,
    });
    if (!getComment) {
      return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    }
    if (getComment.password == password) {
      await Comment.deleteOne({ _id: getComment._id });
      return res.json({ message: "댓글을 삭제하셨습니다." });
    } else {
      return res.status(401).json({
        message:
          "데이터 형식이 올바르지 않습니다/ 개인적으로 비밀번호가 다릅니다.",
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }
});

module.exports = router;
