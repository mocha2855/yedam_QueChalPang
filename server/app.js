// app.js
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(port, () => {
  console.log("Server start");
  console.log(`http://localhost:${port}`);
});
app.get("/", (req, res) => {
  res.send("Welcome! Rest Server");
});
const boardRouter = require("./routers/boardRouter.js");
const commentRouter = require("./routers/commentRouter.js");
app.use("/api", boardRouter); // http://localhost:3000/api/boards
app.use("/api", commentRouter); // http://localhost:3000/api/comments
