//services/reservationService.js
const mysql = require("../database/mapper.js");
const {
  selectByDate,
  selectPendingList,
  updateRstatus,
} = require("../database/sqls/reservation.js");

//[1]담당자 - 해당 날짜의 모든 예약 조회
const findByDate = async (managerId, targetDay) => {
  return await mysql.rquery(selectByDate, [managerId, targetDay]);
};

//[2]status가 f1인 모든 상담내역 조회 ->
const findsPendingList = async (managerId) => {
  console.log("서비스로 넘어온 managerId:", managerId);
  return await mysql.rquery(selectPendingList, [managerId]);
};

//[3]승인버튼 누르면 reservation table의 status 를 f2, 반려 누르면 f4로 => 업뎃
const modifyRstatus = async (resvId, managerId, resvStatus, rejectReason) => {
  return await mysql.rquery(updateRstatus, [
    resvId,
    managerId,
    resvStatus,
    rejectReason,
  ]);
};
module.exports = { findByDate, findsPendingList, modifyRstatus };
