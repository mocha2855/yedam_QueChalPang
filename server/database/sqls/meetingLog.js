//database/sqls/meetingLog.js
//[1] 담당자 미팅로그 작성
const insertMeetingLog = `
  INSERT INTO meeting_log
    (resv_id, member_id, log_title, log_content, log_date)
  VALUES
    (?, ?, ?, ?, CURRENT_TIMESTAMP())
  `;

//[2] 해당 지원자의 지원신청서 앞으로 상담예약내역 조회
const selectLogbyAppNo = `
  SELECT
    r.resv_id,
    r.application_no,
    r.dependant_no,
    r.guardian_id, 
    r.start_at as resv_day,
    r.start_at,
    r.resv_status,
    r.reject_reason,  
    CASE 
      WHEN ml.log_id IS NULL THEN 0 ELSE 1
    END AS has_meeting_log
  FROM reservation r
  LEFT JOIN meeting_log ml
  ON ml.resv_id = r.resv_id
  WHERE application_no=?
  ORDER BY resv_day DESC
`;

//[3] 상담일지 상세 조회 (resv_id 기준)
const selectLogDetailByResvId = `
  SELECT
    r.resv_id,
    r.application_no,
    r.dependant_no,
    r.guardian_id,
    r.manager_id,
    r.resv_day,
    r.start_at,
    r.resv_status,
    r.reject_reason,

    ml.log_id,
    ml.member_id,
    ml.log_title,
    ml.log_content,
    ml.log_date,
    ml.attachment_no
  FROM reservation r
  LEFT JOIN meeting_log ml
    ON ml.resv_id = r.resv_id
  WHERE r.resv_id = ?
`;

module.exports = { insertMeetingLog, selectLogbyAppNo, selectLogDetailByResvId } 
