// boardRouter.js
const express = require("express");
const multer = require("multer");

const router = express.Router();
const applicationService = require("../services/applicationServiceJH.js");

const upload = multer({
  storage: "storage",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 제한 등
});
// 지원자 정보
router.get(`/dependantInfo/:no`, async (req, res) => {
  let no = req.params.no;
  let post = await applicationService.dependantFindById(no);
  res.send(post);
});

//해당 지원자와 똑같은 센터의 담당자 조회
router.get("/dependants/:deptNo/managers", async (req, res, next) => {
  try {
    const { deptNo } = req.params;
    console.log("[ROUTER] managers deptNo:", deptNo);

    const rows = await applicationService.findManagerByDependant(deptNo);
    console.log("[ROUTER] managers rows:", rows);

    res.json(rows);
  } catch (err) {
    console.error("[ROUTER] managers error:", err);
    next(err);
  }
});

// 담당자 배정하기
router.put("/application/:applicationNo/manager", async (req, res, next) => {
  try {
    const { applicationNo } = req.params;
    const data = req.body; // { manager_id: 'teacher01', updater_id: 'admin01' ... }

    await applicationService.assignManagerInfo(applicationNo, data);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// 대기단계 선택시 상태확인
router.get(`/application/:no`, async (req, res) => {
  let no = req.params.no;
  let post = await applicationService.findById(no);
  res.send(post);
});

// 대기단계 승인요청 (담당자)
router.put("/compApplication/:id", async (req, res) => {
  const no = Number(req.params.id);
  const post = await applicationService.applicationModifyInfo(no, req.body);
  res.send(post);
});

// 대기단계 승인 (관리자)
router.put("/approveStatus/:no", async (req, res) => {
  const no = Number(req.params.no);
  const post = await applicationService.applicationApproveInfo(no, req.body);
  res.send(post);
});

// 대기단계 반려 (관리자)
router.put("/rejectstatus/:no", async (req, res) => {
  const no = Number(req.params.no);
  const post = await applicationService.applicationRejectInfo(no, req.body);
  res.send(post);
});

// 지원계획서 갯수 파악
router.get("/planning/:no", async (req, res) => {
  let no = req.params.no;
  let post = await applicationService.findPlanningById(no);
  res.send(post ?? [{ counts: 0 }]);
});

// 검토 중, 반려, 승인 지원계획서 불러오기
router.get("/planningReview/:no", async (req, res) => {
  let no = req.params.no;
  let post = await applicationService.findplanningReviewById(no);
  res.send(post ?? []);
});

// 지원계획서 승인요청(담당자)
router.post("/submitPlanningInfo/:no", async (req, res) => {
  let data = req.body;
  console.log(data);
  let no = req.params.no;
  let post = await applicationService.addPlanningInfo(no, data);
  res.send(post);
});

// 반려된 지원계획서 승인(관리자)
router.put("/successPlanningInfo/:no", async (req, res) => {
  let no = req.params.no;
  let data = req.body;
  console.log(no, data);
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

// 지원계획서 임시 저장(담당자) 0111
router.post("/firstPlanSave/:no", async (req, res) => {
  let data = req.body;
  console.log(data);
  let no = req.params.no;
  let post = await applicationService.addPlanSaveInfo(no, data);
  res.send(post);
});

// 지언계획서 임시 저장(이미 한번 했을 경우) 0111
router.put("/firstSaveOneMore/:no", async (req, res) => {
  let data = req.body;
  console.log(data);
  let no = req.params.no;
  console.log("no: ", no);
  let post = await applicationService.modifyFirstSaveInfo(no, data);
  res.send(post);
});

// 지원계획서 임시 저장 삭제(담당자) 0111
router.put("/delFirstSave/:no", async (req, res) => {
  let no = req.params.no;
  let post = await applicationService.removeFirstSaveInfo(no);
  res.send(post);
});

// 지원서 전체 가져오기(일반사용자 및 담당자)
router.get("/searchApplicationById/:id/:authority", async (req, res) => {
  let { id, authority } = req.params;
  let { search, value, badge } = req.query;
  let result = await applicationService.findAppById(
    id,
    search,
    value,
    badge,
    authority
  );
  res.send(result);
});

// 지원신청서 등록(일반사용자 및 담당자)
router.post("/addApplicationById/:id/:authority", async (req, res) => {
  let input = req.body;
  let { id, authority } = req.params;
  let result = await applicationService.insertAppById(input, id, authority);
  res.send(result);
});

// 지원신청서 조회(일반사용자 및 담당자)
router.get(`/applicationInfo/:no`, async (req, res) => {
  let { no } = req.params;
  let result = await applicationService.findAppByNo(no);
  res.send(result);
});
// 지원신청서 수정(일반사용자 및 담당자)
router.put(`/application/update`, async (req, res) => {
  const { updateList } = req.body;
  let result = await applicationService.updateApp(updateList);
  res.send(result);
});

// 검토 중, 반려, 승인 지원결과서 불러오기
router.get("/resultReview/:no", async (req, res) => {
  let no = req.params.no;
  let post = await applicationService.findResultReviewById(no);
  res.send(post ?? []);
});

// 지원결과서 승인요청(담당자)
router.post(
  "/submitResultInfo/:no",
  upload.array("files"),
  async (req, res) => {
    let data = req.body;
    console.log(data);
    let no = req.params.no;
    let post = await applicationService.addResultInfo(no, data);
    res.send(post);
  }
);

// 지원결과서 승인(관리자)
router.put("/successResultInfo/:no", async (req, res) => {
  let no = req.params.no;
  let data = req.body;
  console.log(data);
  let post = await applicationService.updateResultInfo(no, data);
  res.send(post);
});

// 지원결과서 반려(관리자)
router.put("/rejectResultInfo/:no", async (req, res) => {
  let no = req.params.no;
  let data = req.body;
  console.log(data);
  let post = await applicationService.updateRejectResultInfo(no, data);
  res.send(post);
});

// 지원결과서 반려 후 승인요청(담당자)
router.put("/submitChangingResultInfo/:no", async (req, res) => {
  let no = req.params.no;
  let data = req.body;
  console.log(data);
  let post = await applicationService.updateChangingResultInfo(no, data);
  res.send(post);
});

// 수정사유 등록
router.post(`/applicationHistory`, async (req, res) => {
  let input = req.body;
  console.log(input);
  let result = await applicationService.addAppHistory(input);
});

// 지원결과서 임시저장 0111
router.post("/saveFirstResult", async (req, res) => {
  let data = req.body;
  console.log(data);
  let post = await applicationService.addFirstResultInfo(data);
  res.send(post);
});

// 지원결과서 임시 저장(이미 한번 했을 경우) 0111
router.put("/saveResultOneMOre/:no", async (req, res) => {
  let data = req.body;
  console.log(data);
  let no = req.params.no;
  console.log("no: ", no);
  let post = await applicationService.modifyResultFirstSaveInfo(no, data);
  res.send(post);
});

// 지원결과서 임시저장 삭제 0111
router.delete("/delResultFirstSave/:no", async (req, res) => {
  let no = req.params.no;
  let post = await applicationService.removeResultFirstSaveInfo(no);
  res.send(post);
});

module.exports = router;
