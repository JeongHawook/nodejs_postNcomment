const express = require("express");
const { Post, Comment, User } = require("../models");
// const Comment = require("../schemas/comment");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middlewares/auth-middleware");
//const { MongooseError } = require("mongoose");
const AppError = require("../utils/customError");
const { tryCatch } = require("../utils/tryCatch");
//post//
router.post(
    "/",
    authMiddleware,
    tryCatch(async (req, res) => {
        const { comment } = req.body;
        const { _postId } = req.params;
        const { userId, nickname } = res.locals.user;

        if (typeof comment !== "string" || !comment) throw new AppError(4016);

        const checkPost = await Post.findByPk(_postId);

        if (!checkPost) throw new AppError(4000);

        await Comment.create({
            postId: checkPost.postId,
            userId: userId,
            nickname: nickname,
            comment: comment,
        }).catch(() => {
            throw new AppError(5001);
        });

        return res.status(201).json({ message: "댓글을 작성하였습니다." });
    })
);

//get//

router.get(
    "/",
    tryCatch(async (req, res) => {
        const { _postId } = req.params;

        const getPost = await Post.findByPk(_postId);

        if (!getPost) throw new AppError(4000);

        const getComments = await Comment.findAll({
            postId: _postId,
        }).catch((error) => {
            if (error.name === "SequelizeDatabaseError") {
                throw new AppError(5000); // error for general errors
            }
        });

        if (getComments.length < 1) throw new AppError(4010);

        return res.json({ comments: getComments });
    })
);

//update//
router.put(
    "/:_commentId",
    authMiddleware,
    tryCatch(async (req, res) => {
        const { _postId, _commentId } = req.params;
        const { comment } = req.body;
        const { nickname, userId } = res.locals.nickname;

        if (!comment) {
            return res
                .status(412)
                .json({ message: "댓글 내용을 입력해주세요." });
        }

        if (typeof comment !== "string") throw new AppError(4016);

        try {
            const getPost = Post.findByPk(_postId);
            if (!getPost) throw new AppError(4000);

            const getComment = await Comment.findByPk(_commentId);

            if (!getComment) {
                return res
                    .status(404)
                    .json({ errorMessage: "댓글이 존재하지 않습니다." });
            }
            if (getComment.userId !== userId) throw new AppError(4003);
            await Comment.update(
                { comment: comment },
                {
                    where: {
                        commentId: getComment.commentId,
                    },
                }
            );
            return res.json({ message: "댓글을 수정하셨습니다" });
        } catch (err) {
            return res
                .status(400)
                .json({ errorMessage: "댓글 수정에 실패하였습니다." });
        }
    })
);

//delete//
router.delete("/:_commentId", authMiddleware, async (req, res) => {
    const { _postId, _commentId } = req.params;
    const { nickname, userId } = res.locals.user;

    try {
        const getPost = await Post.findByPk(_postId);

        if (!getPost) throw new AppError(4000);

        const getComment = await Comment.findByPk(_commentId);

        if (!getComment) throw new AppError(4010);

        if (getComment.userId !== userId) throw new AppError(4003);
        await Comment.destroy({ where: { commentId: getComment.commentId } });
        return res.status(200).json({ message: "댓글을 삭제하셨습니다." });
    } catch (err) {
        if (err.name === "MongoServerError") {
            return res
                .status(400)
                .json({ errorMessage: "댓글 삭제에 실패하였습니다." });
        }
        return res
            .status(400)
            .json({ errorMessage: "댓글 삭제에 실패하였습니다." });
    }
});

module.exports = router;
