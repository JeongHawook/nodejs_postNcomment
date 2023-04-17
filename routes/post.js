const express = require("express");
const router = express.Router();
const Post = require("../schemas/post");

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

module.exports = router;
