const express = require("express");
const router = express.Router();
const Post = require("../schemas/post");
const Comment = require("../schemas/comment");

//////////////
//get  Post //
//////////////
router.get("/", async (req, res) => {
  const getPost = await Post.find({});
  const result = getPost.map((getpost) => {
    return {
      postId: getpost._id,
      user: getpost.user,
      title: getpost.title,
      createdAt: getpost.created_at,
    };
  });
  res.json({ data: result });
});
//////////////
//post Post //
//////////////
router.post("/", async (req, res) => {
  const { user, password, title, content } = req.body;

  if (!user || !password || !title || !content) {
    //params not available
    return res.status(400).json({ message: "데이터형식이 옳바르지 않습니다" });
  }

  /*
  if (
    typeof user !== "string" ||
    typeof password !== "string" ||
    typeof title !== "string" ||
    typeof content !== "string"
  ) {
    return res.json({ message: "데이터형식이 옳바르지 않습니다" });
  }
  */
  const createPost = Post.create({
    user: user,
    password: password,
    title: title,
    content: content,
  });
  res.json({ message: "게시글을 생성하셨습니다." }); //Posts: createPost

  return;
});
//////////////
//get PostId//
//////////////
router.get("/:_postId", async (req, res) => {
  const { _postId } = req.params;

  // if (_postId.length !== 24) {
  //   //길이 통제
  //   return res.json({ message: "데이터 형식이 올바르지 않습니다" });
  // }
  try {
    const getPostDetails = await Post.findById({ _id: _postId });

    const result = {
      postId: getPostDetails._id,
      user: getPostDetails.user,
      title: getPostDetails.title,
      content: getPostDetails.content,
      createdAt: getPostDetails.created_at,
    };
    return res.json({ data: result });
  } catch (err) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }
});
//////////////
//PUT PostId//
//////////////
router.put("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { password, title, content } = req.body;

  if (!password || !title || !content) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }

  try {
    const postDetail = await Post.findById({ _id: _postId });
    if (!postDetail) {
      return res.status(404).json({ message: "게시글 조회에 실패하셨습니다" });
    }

    if (password == postDetail.password) {
      const updatePost = await Post.updateOne(
        { _id: _postId },
        { title: title, content: content }
      );
      return res.json({ message: "게시글을 수정하였습니다." });
    } else {
      return res.status(401).json({
        message:
          "비밀번호가 일치하지 않습니다 / 과제에서는 데이터 형식이 올바르지 않습니다?.",
      });
    }
  } catch (err) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }
});

//////////////
//삭제PostId//
//////////////
router.delete("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      message:
        "과제:데이터 형식이 옳바르지 않습니다/ 개인적으로; 비밀번호를 입력해주세요",
    });
  }
  try {
    const getPost = await Post.findById({ _id: _postId });

    if (!getPost) {
      //[]
      return res.status(404).json({ message: "게시글 조회에 실패했습니다" });
    }

    if (getPost.password == password) {
      const deletePost = await Post.deleteOne({ _id: _postId });
      return res.json({ message: "게시글을 삭제하셨습니다" });
    } else {
      return res.status(401).json({
        message:
          "데이터 형식이 올바르지 않습니다/ 개인적으로 비밀번호가 다릅니다",
      });
    }
  } catch (err) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }
});

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
    const getComments = await Comment.find({ postId: _postId });
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
