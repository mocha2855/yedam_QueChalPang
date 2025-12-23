//services/reservationService.js
const mysql = require("../database/mapper.js");
const { selectByDate, selectByRstatus } = require("../database/sqls/reservation.js");

//[1]담당자 - 해당 날짜의 모든 예약 조회
const findByDate = async (managerId, targetDay) => {
  return await mysql.rquery(selectByDate, [managerId, targetDay]);
}

//[2]status가 f1인 모든 상담내역 조회 -> 
const findByRstatus = async (managerId) => {
  return await mysql.rquery(selectByRstatus, [managerId]);
}


module.exports = { findByDate, findByRstatus }