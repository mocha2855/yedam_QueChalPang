// boardRouter.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const applicationService = require("../services/applicationServiceJH.js");

try {
  fs.readdirSync("uploads");
} catch (error) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination(req, file, done) {
    done(null, "uploads/");
  },
  filename(req, file, done) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    done(null, basename + "_" + Date.now() + ext);
  },
});
const upload = multer({ storage: storage });
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
    try {
      const serviceData = {
        planningNo: req.params.no,
        ...req.body,
      };
      // Service 호출 (req.files 전달)
      const result = await applicationService.addResultInfo(
        serviceData,
        req.files
      );

      res.json({ message: "등록 성공", groupId: result.groupId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "서버 에러" });
    }
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

// 파일목록조회
// [GET] 파일 목록 조회
router.get("/attachments/:group_id", async (req, res) => {
  try {
    const groupId = req.params.group_id;
    // 그룹 ID가 없거나 0이면 빈 배열 리턴
    if (!groupId || groupId === "0") {
      return res.json([]);
    }

    const fileList = await applicationService.getAttachmentList(groupId);
    res.json(fileList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "목록 조회 실패" });
  }
});
// 파일 다운로드
router.get("/download/:attachment_no", async (req, res) => {
  try {
    const attachmentNo = req.params.attachment_no;
    const fileInfo = await applicationService.getAttachmentFile(attachmentNo);

    if (!fileInfo) {
      return res.status(404).send("파일을 찾을 수 없습니다.");
    }

    // DB에 저장된 경로 (예: uploads/file_1234.jpg)
    // __dirname은 현재 파일(routers 폴더) 위치이므로 상위로 이동(..) 필요할 수 있음
    // 프로젝트 구조에 따라 경로 조정 필요 (절대경로 추천)
    const filePath = path.join(__dirname, "../", fileInfo.attachment_path);

    // res.download(실제경로, 원본파일명)
    // 이렇게 하면 사용자는 "file_1234.jpg"가 아니라 "원본이름.jpg"로 다운받게 됨
    res.download(filePath, fileInfo.attachment_orginal, (err) => {
      if (err) {
        console.error("다운로드 에러:", err);
        res.status(500).send("다운로드 중 에러 발생");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 에러");
  }
});
module.exports = router;
