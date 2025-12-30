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

//[1]-1 초록점찍기용 - 예약이 하나라도 존재하는 날짜 뽑기
router.get("/resvByManager/:managerId", async (req, res) => {
  const { managerId } = req.params;
  const rows = await reservationService.findTresvByManager(managerId); //rows = [{ start_at: '2025-12-28' },{ start_at: '2025-12-29' }]
  res.json(rows.map((r) => r.start_at));
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
  console.log("요청 데이터 상세:", {
    resvId,
    managerId,
    resvStatus,
    rejectReason,
  });

  try {
    const result = await reservationService.modifyRstatus(
      resvId,
      managerId,
      resvStatus,
      rejectReason
    );
    //디버깅용 콘솔추가
    //affectedRows가 뭔지.
    console.log("DB 결과:", result);

    if (result.affectedRows > 0) {
      res.json({ message: "성공적으로 처리되었습니다.", resvId, resvStatus });
    } else {
      res.status(403).json({ message: "해당 예약정보에 접근할 수 없습니다." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "서버에 연결할 수 없습니다.", err: err.message });
  }
});

//[4]담당자 - 예약확정 된 상담내역 단건삭제
router.delete("/cancelReservation/:managerId/:resvId", async (req, res) => {
  const { resvId, managerId } = req.params;
  console.log("요청 데이터 상세:", { resvId, managerId });

  try {
    const result = await reservationService.removeReservation(
      resvId,
      managerId
    );
    if (result.affectedRows > 0) {
      res.json({ message: "삭제성공" }, resvId, managerId);
    } else {
      res.status(403).json({ message: "해당 상담을 삭제할 수 없습니다." });
    }
  } catch (err) {
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
      res.json({ message: "상담예약 신청 완료", resvId: insertId });
    } else {
      res.status(403).json({ message: "예약신청을 전송할 수 없습니다" });
    }
  } catch (err) {
    res.status(500).json({ message: "서버연결 실패", err: err.message });
  }
});

// [7] 보호자 - 날짜별 예약불가 시간 조회 (예약된시간 + 센터점심 + 담당자가차단 빼기)
router.get("/availability/:dependantNo/:date", async (req, res) => {
  const { dependantNo, date } = req.params;
  try {
    const data = await reservationService.findAvailability(dependantNo, date);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "조회 실패", err: err.message });
  }
});

// [7-1] 보호자 - dependant_no로 담당자조회
router.get("/getManagerName/:dependantNo", async (req, res) => {
  const { dependantNo } = req.params;
  try {
    const data = await reservationService.findManagerbyDeptno(dependantNo);
    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "관리자이름 조회 실패", err: err.message });
  }
});

//[7]-4 (보호자 예약) 드롭다운 지원자 선택하기
router.get("/dependants/:guardianId", async (req, res) => {
  try {
    const { guardianId } = req.params;
    const rows = await reservationService.findDependants(guardianId);
    res.json(rows);
  } catch (err) {
    console.error("dependants error:", err);
    res.status(500).json({ message: "dependants fail", err: err.message });
  }
});

//[7]-5 (보호자 예약) 드롭다운 지원자 선택 후 지원자의 지원신청서 선택하기
router.get("/applicationList/:dependantNo", async (req, res) => {
  try {
    const { dependantNo } = req.params;
    const rows = await reservationService.findApplication(dependantNo);
    res.json(rows);
  } catch (err) {
    console.error("applications error:", err);
    res.status(500).json({ message: "applications fail", err: err.message });
  }
});

//[8] (보호자 예약) 완료 후 센터주소 조회해서 지도에 표시하기
router.get("/centerAddrByResvId/:resvId", async (req, res) => {
  const { resvId } = req.params;
  const rows = await reservationService.findCenterAddrByResvId(resvId);
});

module.exports = router;
