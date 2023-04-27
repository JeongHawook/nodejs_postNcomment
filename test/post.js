const chai = require("chai");

const chaiHttp = require("chai-http");
const app = require("../app");
const { Posts } = require("../models");
const AppError = require("../utils/customError");
chai.should();
chai.use(chaiHttp);

describe("Post API", () => {
    describe("GET /posts", () => {
        it("should get all posts", async () => {
            const response = await chai.request(app).get("/posts");
            response.should.have.status(200);
            response.body.should.be.an("object");
            response.body.should.have.property("posts");
            response.body.posts.should.be.an("array");
            // additional assertions for the response data
            const allPosts = await Posts.findAll({
                order: [["createdAt", "DESC"]],
            });
            // compare the relevant properties of the objects
            response.body.posts.forEach((post, i) => {
                post.should.have.property("postId").equal(allPosts[i].postId);
                post.should.have.property("title").equal(allPosts[i].title);
                post.should.have.property("content").equal(allPosts[i].content);
                post.should.have
                    .property("nickname")
                    .equal(allPosts[i].nickname);
                // add more properties as needed
            });
        });
        //오늘 너가 이기나 내가 이기나 해보자. 그래 오전 3:30분. 내가 졌다..허리 끊어지겠다
        it("should return a 4000 error when there are no posts", async function () {});
    });
});

describe("Post API", () => {
    describe("GET /posts/:_postId", () => {
        it("should get all post by postId", async () => {
            const postId = 1;
            const response = await chai.request(app).get(`/posts/${postId}`);
            response.should.have.status(200);
            response.body.should.be.an("object");
            response.body.should.have.property("getPostDetails");
            response.body.getPostDetails.should.be.an("object");
            response.body.getPostDetails.should.have.property("postId", postId);
            // additional assertions for the response data
        });
    });
});
