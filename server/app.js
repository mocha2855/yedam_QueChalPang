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
const applicationRouter = require("./routers/applicationRouter.js"); // 대기단계 선택
const memberRouter = require("./routers/memberRouter.js"); // member의 라우터
const centerRouter = require("./routers/centerRouter.js"); // center의 라우터
const reservationRouter = require("./routers/reservationRouter.js");
const surveyRouter = require("./routers/surveyRouter.js");

app.use("/api", reservationRouter);
app.use("/api", applicationRouter); // http://localhost:3000/api/application
app.use("/api", memberRouter); // http://localhost:3000/api/members
app.use("/api", centerRouter); // http://localhost:3000/api/members
app.use("/api", surveyRouter); // http://localhost:3000/api/comments
