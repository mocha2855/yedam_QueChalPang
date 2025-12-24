//routers/reservationRouter.js
const express = require("express");
const router = express.Router();
const reservationService = require("../services/reservationService");

//담당자
//[1]담당자 - 해당 날짜의 모든 예약 조회
router.get("/resvByDate/:managerId/:date", async (req, res) => {
  const { managerId, date } = req.params;
  const rows = await reservationService.findByDate(managerId, date);
  res.json(rows);
});

//[2]담당자 - status가 f1인 모든 상담내역 조회 ->
router.get("/resvByPendingList/:managerId", async (req, res) => {
  const { managerId } = req.params;
  const rows = await reservationService.findPendingList(managerId);
  res.json(rows);
});

//[3]담당자 - 승인버튼 누르면 reservation table의 status 를 f2, 반려 누르면 f4로 => 업뎃
router.put("/updateRstatus", async (req, res) => {
  const { resvId, managerId, resvStatus, rejectReason } = req.body; //body, params.
  //디버깅용 콘솔추가 
  console.log("요청 데이터 상세:", { resvId, managerId, resvStatus, rejectReason });

  try {
    const result = await reservationService.modifyRstatus(resvId, managerId, resvStatus, rejectReason);
    //디버깅용 콘솔추가
    //affectedRows가 뭔지.
    console.log("DB 결과:", result);

    if (result.affectedRows > 0) {
      res.json({ message: "성공적으로 처리되었습니다.", resvId, resvStatus });
    } else {
      res.status(403).json({ message: "해당 예약정보에 접근할 수 없습니다." });
    }
  } catch (err) {
    res.status(500).json({ message: "서버에 연결할 수 없습니다.", err: err.message });
  }
});

//[4]담당자 - 예약확정 된 상담내역 단건삭제
router.delete("/cancelReservation/:managerId/:resvId", async (req, res) => {
  const { resvId, managerId } = req.params;
  console.log("요청 데이터 상세:", { resvId, managerId });

  try {
    const result = await reservationService.removeReservation(resvId, managerId);
    if (result.affectedRows > 0) {
      res.json({ message: "삭제성공" }, resvId, managerId);
    } else {
      res.status(403).json({ message: "해당 상담을 삭제할 수 없습니다." })
    }
  }
  catch (err) {
    res.status(500).json({ message: "서버연결 실패", err: err.message });
  }
});

//보호자
//[5]보호자 - 모든 예약 내역 조회
router.get("/gresvByDate/:guardianId", async (req, res) => {
  const { guardianId } = req.params;
  const rows = await reservationService.findByGreserv(guardianId);
  res.json(rows);
});

//[6]보호자 - 예약 요청
router.post("/createReservation", async (req, res) => {

  try {
    const data = req.body;
    const insertId = await reservationService.addReservation(data);

    if (insertId) {
      res.json({ message: "상담예약 신청 완료", resvId: insertId })
    } else {
      res.status(403).json({ message: "예약신청을 전송할 수 없습니다" });
    }
  } catch (err) {
    res.status(500).json({ message: "서버연결 실패", err: err.message })
  }
});

module.exports = router;
