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
const applicationRouter = require("./routers/applicationRouter.js");
app.use("/api", applicationRouter); // http://localhost:3000/api/application
