const express = require("express");
const router = express.Router();
const mypageService = require("../services/mypageService.js");

// 담당자 정보
router.get(`/managerInfo/:id`, async (req, res) => {
  let id = req.params.id;
  console.log(id);
  let post = await mypageService.findManagerById(id);
  res.send(post);
});

// 지원자 정보
router.get(`/dependantInfo/:id`, async (req, res) => {
  let id = req.params.id;
  console.log(id);
  let post = await mypageService.findDependantById(id);
  res.send(post);
});

module.exports = router;
