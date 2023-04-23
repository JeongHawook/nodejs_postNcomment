const chai = require("chai");
const { expect } = require("chai");
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
        it("should throw an AppError with a code of 4000 if the database query fails", async () => {
            // Replace Posts.findAll with a mock function that throws the AppError
            const Posts = {
                findAll: () => {
                    throw new AppError(4000);
                },
            };

            // Replace the app's Posts object with the mock object
            app.set("Posts", Posts);
            console.log(app.get);
            // Make the request and check the response
            const response = await chai.request(app).get("/posts");
            console.log(Posts);
            expect(response.status).to.equal(400); //500 is the status code used for server errors
            expect(response.body).to.be.an("object");
            expect(response.body.details).to.equal(
                "데이터 형식이 옳바르지않습니다"
            );
            // expect(response.body.details).to.equal("Empty Array on POSTS");
        });
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
