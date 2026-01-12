//routers/qnaRouter.js
const express = require("express");
const router = express.Router();
const qnaService = require("../services/qnaService");

//보호자
//[1] 본인 질문 전체 조회
router.get("/qlistByMid/:memberId", async (req, res) => {
  const { memberId } = req.params;
  const rows = await qnaService.findQlistByMid(memberId);
  res.json(rows);
});

//[2] 질문 단건 등록
router.post("/addQnaByGuardian/:memberId", async (req, res) => {
  const { memberId } = req.params;
  const { dependant_no, qna_title, qna_content, qna_category } = req.body;

  if (!dependant_no || !qna_title || !qna_content || !qna_category) {
    return res
      .status(400)
      .json({ message: "지원자를 선택하고 제목/내용/카테고리를 입력하세요." });
  }

  const insertId = await qnaService.addQna({
    member_id: memberId,
    dependant_no,
    qna_title,
    qna_content,
    qna_category,
  });

  res.status(200).json({ qna_no: insertId });
});

//[2-1] 보호자 - 본인의 지원자목록 조회
router.get("/dependantsByMember/:memberId", async (req, res) => {
  const { memberId } = req.params;
  const rows = await qnaService.findDependantsByMember(memberId);
  res.json(rows);
});

//[3] 보호자 - 질문 단건 상세조회 (답변 포함)
router.get("/qnaDetailByGuardian/:qnaNo", async (req, res) => {
  const { qnaNo } = req.params;
  const data = await qnaService.findQnaDetail(qnaNo);

  if (!data) return res.status(404).json({ message: "해당 문의가 없습니다." });
  res.json(data);
});

//[4] 담당자 - 본인이 담당하는 사람들의 질문 전체조회
router.get("/qlistByManagerMain/:managerId", async (req, res) => {
  const { managerId } = req.params;
  const rows = await qnaService.findQlistByManager(managerId);
  res.json(rows);
});

//[5] 담당자 - 질문 한건 자세히 조회
router.get("/qnaDetailByManager/:qnaNo", async (req, res) => {
  const { qnaNo } = req.params;
  const data = await qnaService.findQnaDetailByManager(qnaNo);

  if (!data) return res.status(404).json({ message: "해당 문의가 없습니다." });
  res.json(data);
});

//[6] 담당자 - 답변등록
router.post("/addAnswerByManager/:qnaNo", async (req, res) => {
  const { qnaNo } = req.params;
  const { qanswer_content, answererId } = req.body;

  if (!qanswer_content || !answererId) {
    return res.status(400).json({ message: "답변 내용을 입력하세요." });
  }

  await qnaService.addAnswerByManager({
    qnaNo,
    answererId,
    qanswer_content,
  });

  res.status(200).json({ ok: true });
});
module.exports = router;
