//services/reservationService.js
const mysql = require("../database/mapper.js");
const {
  selectTResvByDate,
  selectTResvPendingList,
  updateResvStatus,
  deleteReserv,
  selectGuardianResv,
  insertResv,
} = require("../database/sqls/reservation.js");

//[1]담당자 - 해당 날짜의 모든 예약 조회
const findByDate = async (managerId, targetDay) => {
  return await mysql.rquery(selectTResvByDate, [managerId, targetDay]);
};

//[2]담당자 - status가 f1인 모든 상담내역 조회 ->
const findPendingList = async (managerId) => {
  console.log("서비스로 넘어온 managerId:", managerId);
  return await mysql.rquery(selectTResvPendingList, [managerId]);
};

//[3]담당자 - 승인버튼 누르면 reservation table의 status 를 f2, 반려 누르면 f4로 => 업뎃
const modifyRstatus = async (resvId, managerId, resvStatus, rejectReason) => {
  return await mysql.rquery(updateResvStatus, [
    resvStatus,
    rejectReason,
    resvId,
    managerId
  ]);
};

//[4]담당자 - 예약확정 된 상담내역 단건삭제
const removeReservation = async (resvId, managerId) => {
  return await mysql.rquery(deleteReserv, [resvId, managerId]);
};

//[5]보호자 - 예약 내역 조회
const findByGreserv = async (guardianId) => {
  return await mysql.rquery(selectGuardianResv, [guardianId]);
};

//[6]보호자 - 예약 요청
const addReservation = async (data) => {
  const { dependant_no, application_no, guardian_id, manager_id, resv_day, start_at, end_at } = data;
  let result = await mysql.rquery(insertResv, [dependant_no, application_no, guardian_id, manager_id, resv_day, start_at, end_at]);
  return result.insertId;
};

module.exports = { findByDate, findPendingList, modifyRstatus, removeReservation, findByGreserv, addReservation };
