//routers/reservationRouter.js
const express = require("express");
const router = express.Router();
const reservationService = require("../services/reservationService");

//[1]담당자 - 해당 날짜의 모든 예약 조회
router.get("/resvByDate/:managerId/:date", async (req, res) => {
  const { managerId, date } = req.params;
  const rows = await reservationService.findByDate(managerId, date);
  res.json(rows);
});

//[2]status가 f1인 모든 상담내역 조회 ->
router.get("/resvByPendingList/:managerId", async (req, res) => {
  const { managerId } = req.params;
  const rows = await reservationService.findByRstatus(managerId);
  res.json(rows);
});

//[3]승인버튼 누르면 reservation table의 status 를 f2, 반려 누르면 f4로 => 업뎃
router.put("/updateRstatus", async (req, res) => {
  const { resvId, managerId, resvStatus, rejectReason } = req.body; //body, params.
  const rows = await reservationService.modifyRstatus(
    resvId,
    managerId,
    resvStatus,
    rejectReason
  );
});

module.exports = router;
