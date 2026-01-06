const express = require("express");
const router = express.Router();
const mypageService = require("../services/mypageService.js");

// 담당자
// 담당자 정보
router.get("/managerInfo/:id", async (req, res) => {
  let id = req.params.id;
  console.log(id);
  let post = await mypageService.findManagerById(id);
  res.send(post);
});

// 지원자 정보
router.get("/dependantInfoList/:id", async (req, res) => {
  let id = req.params.id;
  console.log(id);
  let post = await mypageService.findDependantById(id);
  console.log("post:", post);
  res.send(post);
});

// 본인 정보 변경
router.put("/changeManagerInfo/:id", async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  console.log(data);
  let post = await mypageService.updateManagerInfo(id, data);
  res.send(post);
});

// 담당 지원자 정보 변경
router.put("/changeDependantInfo/:id", async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  console.log(data);
  let post = await mypageService.updateDependantInfo(id, data);
  res.send(post);
});

// 담당자 지원자 정보 등록
router.post("/addDependantInfo", async (req, res) => {
  let data = req.body;
  console.log(data);
  let post = await mypageService.addDependantInfo(data);
  res.send(post);
});

module.exports = router;
