//routers/qnaRouter.js
const express = require("express");
const router = express.Router();
const qnaService = require("../services/qnaService");

//보호자
//[1] 본인 질문 전체 조회
router.get("/qlistByMid/:memberId", async (req, res) => {
  const { memberId } = req.params;
  const rows = await qnaService.findQlistByMid(memberId);
  res.json(rows)
})

//[2] 질문 단건 등록
// router.post("/newQna")

//[3] 질문 단건 수정 (답변 달리기 전까지)


//[4] 질문 단건 삭제 (답변 달리기 전까지)


//담당자
//[1] 답변 단건 등록

module.exports = router;
