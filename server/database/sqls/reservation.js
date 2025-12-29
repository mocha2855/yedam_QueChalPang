//database/sqls/reservation.js

//담당자
//[1] 해당 날짜의 모든 예약 조회
// 보호자, 지원자, 희망시간(start_at)
const selectTResvByDate = `
  SELECT
    g.member_name    AS guardian_name,
    d.dependant_name AS dependant_name,
    r.start_at       AS start_at,
    r.resv_day,
    r.resv_status    AS status,
    r.manager_id
  FROM reservation r
  JOIN member g ON g.member_id = r.guardian_id
  JOIN dependant d ON d.dependant_no = r.dependant_no
  WHERE r.manager_id = ?
    AND DATE(start_at) = ?;
`;

//[1]-1. 초록점찍기용 - 예약이 하나라도 존재하는 날짜 뽑기
const selectTResvbyManager = `
  SELECT DISTINCT(start_at) as start_at
  FROM reservation
  WHERE manager_id = ?
  ORDER BY start_at;
`;

//[2]status가 f1(예약확인중)인 모든 상담내역 조회
const selectTResvPendingList = `
  SELECT 
    g.member_name AS guardian_name,
    d.dependant_name AS dependant_name,
    r.resv_id,
    r.resv_status,
    r.start_at,
    r.manager_id
  FROM reservation r
  LEFT JOIN member g
    ON g.member_id = r.guardian_id
  LEFT JOIN dependant d
    ON d.dependant_no = r.dependant_no
  WHERE r.resv_status = 'f1'
    AND r.manager_id = ?;
`;

//[3]승인버튼 누르면 reservation table의 status 를 f2, 반려 누르면 f4로 => 업뎃
const updateResvStatus = `
  UPDATE reservation 
  SET resv_status = ?,
      reject_reason = ?
  WHERE resv_id = ?
    AND manager_id = ?;
`;

//[4]예약확정 된 상담내역 단건삭제
const deleteReserv = `
  DELETE FROM reservation 
  WHERE resv_id = ?
    AND manager_id = ?;
`;

//보호자
//[5]보호자 - 예약 내역 조회
const selectGuardianResv = `
  SELECT
    g.member_name    AS guardian_name,
    d.dependant_name AS dependant_name,    
    r.start_at       AS start_at,
    r.resv_status         AS status,
    r.guardian_id,
    r.manager_id
  FROM reservation r
  JOIN member g
    ON g.member_id = r.guardian_id
  JOIN dependant d
    ON d.dependant_no = r.dependant_no
  WHERE r.guardian_id = ?
`;

//[6]보호자 - 예약 요청
const insertResv = `
INSERT INTO reservation 
  (dependant_no, application_no, guardian_id, manager_id, resv_day, start_at, end_at)
VALUES (?, ?, ?, ?, ?, ?, ?);
`;

// [7-1] (보호자 예약) dependant로 담당자 + 센터 점심시간 조회
const selectCenterLunch = `
SELECT
  d.manager_main AS manager_id,
  c.center_lunch AS center_lunch
FROM dependant d
JOIN member m
  ON m.member_id = d.manager_main
JOIN center c
  ON c.center_no = m.center_no
WHERE d.dependant_no = ?;
`;

// [7-1-1] (보호자 예약) dependant_no로 담당자조회
const selectManagerbyDeptno = `
SELECT
  m.member_id   AS manager_id,
  m.member_name AS manager_name
FROM dependant d
JOIN member m
  ON m.member_id = d.manager_main
WHERE d.dependant_no = ?;
`;

// [7-2] (보호자 예약) 해당 날짜 예약된 시간(time) 목록
const selectReservedTimes = `
SELECT
  TIME(r.start_at) AS reserved_time
FROM reservation r
WHERE r.manager_id = ?
  AND DATE(r.start_at) = ?
  AND r.resv_status IN ('f1','f2','f3')
ORDER BY r.start_at;
`;

// [7-3] (보호자 예약) 해당 날짜 차단된 시간 목록
const selectBlockedTimes = `
SELECT
  block_time
FROM schedule_block
WHERE member_id = ?
  AND block_date = ?
ORDER BY block_time;
`;

//[7]-4 (보호자 예약) 드롭다운 지원자 선택하기
const selectDependant = `
  SELECT dependant_no, dependant_name
  FROM dependant
  WHERE member_id = ?
  ORDER BY dependant_no;
`;

module.exports = {
  selectTResvByDate,
  selectTResvbyManager,
  selectTResvPendingList,
  updateResvStatus,
  deleteReserv,
  selectGuardianResv,
  insertResv,
  selectCenterLunch,
  selectManagerbyDeptno,
  selectReservedTimes,
  selectBlockedTimes,
  selectDependant,
};
