const express = require("express");
const router = express.Router();
//const User = require("../schemas/user");
const { Users, UserInfos, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/customError");
const { tryCatch } = require("../utils/tryCatch");
const { Transaction } = require("sequelize");

router.post(
    "/signup",
    tryCatch(async (req, res) => {
        const {
            nickname,
            password,
            confirmPassword,
            name,
            age,
            gender,
            email,
            profileImage,
        } = req.body;

        if (!req.body) throw new AppError(4002);
        if (!nickname || !password || !confirmPassword) {
            return res.status(4000).json({
                errorMessage: "요청한 데이터 형식이 올바르지 않습니다.1",
            });
        }
        const nicknameRegex = /^[a-zA-Z0-9]{3,}$/;
        const passwordRegex1 = /^\w{4,}$/;
        if (!nicknameRegex.test(nickname)) {
            return res
                .status(4006)
                .json({ errorMessage: "닉네임의 형식이 일치하지 않습니다." });
        }

        if (password !== confirmPassword) {
            return res
                .status(4003)
                .json({ errorMessage: "password가 일치하지 않습니다" });
        }
        if (!passwordRegex1.test(password)) {
            return res
                .status(4006)
                .json({ errorMessage: "패스워드 형식이 일치하지 않습니다" });
        }
        if (password.includes(nickname.toLowerCase()))
            return res.status(4005).json({
                errorMessage: "패스워드에 닉네임이 포함되어 있습니다.",
            });

        const getUser = await Users.findOne({
            where: { nickname: nickname },
        });

        if (getUser)
            return res
                .status(4006)
                .json({ errorMessage: "중복된 닉네임입니다." });

        const bcryptPassword = await bcrypt.hash(password, 10);

        const t = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        });
        try {
            const user = await Users.create(
                {
                    name: name,
                    nickname: nickname,
                    password: bcryptPassword,
                },
                {
                    transaction: t,
                }
            );

            const userInfo = await UserInfos.create(
                {
                    userId: user.userId,
                    nickname: nickname,
                    email: email,
                    name: name,
                    age: age,
                    profileImage: profileImage,
                    gender: gender.toUpperCase(),
                },
                {
                    transaction: t,
                }
            );

            await t.commit();
        } catch (error) {
            console.log(error);
            await t.rollback();
            return res.status(400).json({ errorMessage: "회원가입 실패" });
        }
        return res.status(201).json({ message: "회원가입에 성공하셨습니다." });
    })
);

router.post(
    "/login",
    tryCatch(async (req, res) => {
        const { nickname, password } = req.body;
        if (!nickname || !password)
            return res.status(400).json({
                errorMessage: "요청한 데이터 형식이 올바르지 않습니다.1",
            });

        if (typeof nickname !== "string" || typeof password !== "string")
            return res
                .status(412)
                .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
        try {
            const getUser = await Users.findOne({
                where: { nickname: nickname },
            });

            const passwordMatch = await bcrypt.compare(
                password,
                getUser.password
            );

            if (getUser && !passwordMatch)
                return res.status(401).json({
                    errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
                });

            const token = jwt.sign(
                { userId: getUser.userId, nickname: getUser.nickname },
                process.env.JWT_SECRET
            );
            res.cookie("Authorization", `Bearer ${token}`);
            return res.status(200).json({ token: token });
        } catch (error) {
            return res
                .status(404)
                .json({ errorMessage: "로그인에 실패하였습니다." });
        }
    })
);

module.exports = router;
