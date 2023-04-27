"use strict";
const express = require("express");
const router = express.Router();
const { tryCatch } = require("../utils/tryCatch");
const { Posts } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const AppError = require("../utils/customError");

//get//
router.get(
    "/",
    tryCatch(async (req, res) => {
        const getPost = await Posts.findAll({
            order: [["createdAt", "DESC"]],
        });
        if (getPost.length < 1) throw new AppError(4000);

        return res.status(200).json({ posts: getPost });
    })
);

//post//
router.post(
    "/",
    authMiddleware,
    tryCatch(async (req, res) => {
        const { title, content } = req.body;
        const { nickname, userId } = res.locals.user;

        if (!title || typeof title !== "string") throw new AppError(4006);

        if (!content || typeof content !== "string") throw new AppError(4006);

        await Posts.create({
            userId: userId,
            nickname,
            title,
            content,
        }).catch((error) => {
            throw new AppError(5001);
        });

        return res.json({ message: "게시글을 생성하셨습니다." });
    })
);

//get PostId//
router.get(
    "/:_postId",
    tryCatch(async (req, res) => {
        const { _postId } = req.params;

        const getPostDetails = await Posts.findByPk(_postId);

        if (!getPostDetails) throw new Error(4000);

        return res.json({ getPostDetails });
    })
);

//PUT//
router.put("/:_postId", authMiddleware, async (req, res) => {
    const { _postId } = req.params;
    const { title, content } = req.body;
    const { userId } = res.locals.user;

    if (!title || typeof title !== "string") throw new AppError(4006);

    if (!content || typeof content !== "string") throw new AppError(4006);

    const postDetail = await Posts.findByPk(_postId);

    if (!postDetail) throw new AppError(4000);

    if (userId !== postDetail.userId) throw new AppError(4003);

    await Posts.update(
        { title: title, content: content },
        {
            where: {
                postId: postDetail.postId,
                userId: userId,
            },
        }
    ).catch((error) => {
        if (error.name === "SequelizeDatabaseError")
            throw new AppError(5002); // error for failure to update
        else throw new AppError(5000); // error for general errors
    });

    return res.json({ message: "게시글을 수정하였습니다." });
});

//delete postId//
router.delete("/:_postId", authMiddleware, async (req, res) => {
    const { _postId } = req.params;
    const { userId } = res.locals.user;

    const getPost = await Posts.findByPk(_postId);

    if (!getPost) throw new AppError(4000);

    if (userId !== getPost.userId) throw new AppError(4003);

    await Posts.destroy({ where: { postId: _postId } }).catch((error) => {
        throw new AppError(5003);
    });

    return res.status(200).json({ message: "댓글 + 게시글을 삭제하셨습니다" });
});

module.exports = router;
