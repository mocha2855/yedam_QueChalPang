//wervices/meetingLogService.js
const mysql = require("../database/mapper.js");
const {
  insertMeetingLog,
  selectLogbyAppNo,
  selectLogDetailByResvId,
} = require("../database/sqls/meetingLog.js");

//[1] 담당자 미팅로그 작성
const addMeetingLog = async ({ resv_id, member_id, log_title, log_content }) => {
  const detail = await findLogDetailByResvId(resv_id);
  if (detail?.log_id) {
    const err = new Error("meeting_log already exists");
    err.status = 409;
    throw err;
  }

  const result = await mysql.rquery(insertMeetingLog, [
    resv_id,
    member_id,
    log_title,
    log_content,
  ]);

  return result;
};

//[2] 해당 지원자의 지원신청서 앞으로 상담예약내역 조회
const findLogbyAppNo = async (appNo) => {
  return await mysql.rquery(selectLogbyAppNo, [appNo])
}

//[3] 상담일지 상세 조회 (resv_id 기준)
const findLogDetailByResvId = async (resvId) => {
  const rows = await mysql.rquery(selectLogDetailByResvId, [resvId])
  // 보통 1건
  return Array.isArray(rows) ? rows[0] : rows
}

module.exports = { addMeetingLog, findLogbyAppNo, findLogDetailByResvId }