// boardRouter.js
const express = require("express");
const router = express.Router();
const applicationService = require("../services/applicationServiceJH.js");

// 접속자 권한 확인
router.get(`/applicationAuthority/:no`, async (req, res) => {
  let no = req.params.no;
  console.log(no);
  let post = await applicationService.authorityFindById(no);
  console.log(post);
  res.send(post);
});

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
router.put("/compApplication/:id", async (req, res) => {
  let data = req.body;
  let no = Number(req.params.id);
  console.log(no, data);
  let post = await applicationService.applicationModifyInfo(no, data);
  res.send(post);
});

// 대기단계 반려사유 입력
router.put("/rejectstatus/:no", async (req, res) => {
  let data = req.body;
  let no = req.params.no;
  console.log(no);
  let post = await applicationService.rejectModifyInfo(no, data);
  res.send(post);
});

// 대기단계 승인 / 재승인
router.put("/compSuccessApplication/:no", async (req, res) => {
  let data = req.body;
  console.log(data);
  let no = req.params.no;
  let post = await applicationService.applicationSuccessModifyInfo(no, data);
  res.send(post);
});

// 지원계획서 갯수 파악
router.get("/planning/:no", async (req, res) => {
  let no = req.params.no;
  let post = await applicationService.findPlanningById(no);
  res.send(post);
});

// 검토 중, 반려, 승인 지원계획서 불러오기
router.get("/planningReview/:no", async (req, res) => {
  let no = req.params.no;
  let post = await applicationService.findplanningReviewById(no);
  res.send(post);
});

// 지원계획서 승인요청(담당자)
router.post("/submitPlanningInfo/:no", async (req, res) => {
  let data = req.body;
  console.log(data);
  let no = req.params.no;
  let post = await applicationService.addPlanningInfo(no, data);
  res.send(post);
});

// 지원계획서 승인(관리자)
router.put("/successPlanningInfo/:no", async (req, res) => {
  let no = req.params.no;
  let data = req.body;
  console.log(data);
  let post = await applicationService.updatePlanningInfo(no, data);
  res.send(post);
});

// 지원계획서 반려(관리자)
router.put("/rejectPlanningInfo/:no", async (req, res) => {
  let no = req.params.no;
  let data = req.body;
  console.log(data);
  let post = await applicationService.updateRejectPlanningInfo(no, data);
  res.send(post);
});

// 지원계획서 반려 후 승인요청(담당자)
router.put("/submitChangingPlanningInfo/:no", async (req, res) => {
  let no = req.params.no;
  let data = req.body;
  console.log(data);
  let post = await applicationService.updateChangingPlanningInfo(no, data);
  res.send(post);
});

module.exports = router;
