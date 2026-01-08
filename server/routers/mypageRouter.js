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

// 담당자 지원자 정보 삭제
router.delete("/deleteDependantInfo/:id", async (req, res) => {
  let id = req.params.id;
  console.log(id);
  let post = await mypageService.removeDependantInfo(id);
  res.send(post);
  console.log("1111111111111", post);
});

// 보호자
// 보호자 정보
router.get("/guardianInfo/:id", async (req, res) => {
  let id = req.params.id;
  console.log(id);
  let post = await mypageService.findGuardianById(id);
  res.send(post);
});

// 보호자 지원자 정보
router.get("/selectGuardianDependantById/:id", async (req, res) => {
  let id = req.params.id;
  console.log(id);
  let post = await mypageService.findGuardianDependantById(id);
  res.send(post);
});

module.exports = router;
