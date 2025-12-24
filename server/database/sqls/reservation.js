//database/sqls/reservation.js

//담당자
//[1] 해당 날짜의 모든 예약 조회()
// 보호자, 지원자, 희망시간(start_at)
const selectByDate = `
  SELECT
    g.member_name    AS guardian_name,
    d.dependant_name AS dependant_name,    
    r.start_at       AS start_at,
    r.resv_status         AS status,
    r.manager_id
  FROM reservation r
  JOIN member g
    ON g.member_id = r.guardian_id
  JOIN dependant d
    ON d.dependant_no = r.dependant_no
  WHERE r.manager_id = ?
    AND resv_day = ?;
`;

//[2]status가 f1(예약확인중)인 모든 상담내역 조회
const selectPendingList = `
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
const updateRstatus = `
  UPDATE reservation 
  SET resv_status = ?,
      reject_reason = ?
  WHERE resv_id = ?,
    AND member_id = ?;
`;

module.exports = { selectByDate, selectPendingList, updateRstatus };
