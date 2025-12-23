// boardRouter.js
const express = require("express");
const router = express.Router();
const applicationService = require("../services/applicationServiceJH.js");

// 대기단계 선택시 상태확인
router.get(`/application/:no`, async (req, res) => {
  let no = req.params.no;
  let post = await applicationService.findById(no);
  res.send(post);
});

// 결재자 선택화면 목록
router.get(`/rejectApplication`, async (req, res) => {
  let no = req.params.no;
  let post = await applicationService.rejectorFindById(no);
  res.send(post);
});

// 대기단계 승인요청
router.put("/compApplication/:no", async (req, res) => {
  const data = req.body;
  console.log(data);
  let no = req.params.no;
  let post = await applicationService.applicationModifyInfo(no, data);
  return post;
});

module.exports = router;
