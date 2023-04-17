const express = require("express");
const app = express();
const port = 3300;
const postsRouter = require("./routes/post");
const connect = require("./schemas");
connect();

app.use(express.json());

app.use("/posts", postsRouter);

app.get("/", (req, res) => {
  res.send("hello");
});
app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
