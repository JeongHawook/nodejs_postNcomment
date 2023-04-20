const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../routes/post.js");

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe("Tasks API", () => {
  //Test the Get route.
  describe("GET /posts", () => {
    it("It should GET all the posts", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .get("/")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          console.log(err);
          done();
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
  //Test Get by id route
  //Test Post route
  //Test Put route
  //Test Delete route
});
//
