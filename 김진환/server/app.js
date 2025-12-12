const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log("server start");
  console.log(`http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Wellcome!");
});

const boardRouter = require("./routers/boardRouter.js");
app.use("/api", boardRouter);
