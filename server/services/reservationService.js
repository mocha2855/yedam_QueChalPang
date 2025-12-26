//services/reservationService.js
const mysql = require("../database/mapper.js");
const {
  selectTResvByDate,
  selectTResvbyManager,
  selectTResvPendingList,
  updateResvStatus,
  deleteReserv,
  selectGuardianResv,
  insertResv,
  selectCenterLunch,
  selectReservedTimes,
  selectBlockedTimes,
  selectDependant,
} = require("../database/sqls/reservation.js");

//[1]담당자 - 해당 날짜의 모든 예약 조회
const findByDate = async (managerId, targetDay) => {
  return await mysql.rquery(selectTResvByDate, [managerId, targetDay]);
};

//[1]-1 초록점찍기용 - 예약이 하나라도 존재하는 날짜 뽑기
const findTresvByManager = async (managerId) => {
  return await mysql.rquery(selectTResvbyManager, [managerId]);
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
    managerId,
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
  const {
    dependant_no,
    application_no,
    guardian_id,
    manager_id,
    resv_day,
    start_at,
    end_at,
  } = data;
  let result = await mysql.rquery(insertResv, [
    dependant_no,
    application_no,
    guardian_id,
    manager_id,
    resv_day,
    start_at,
    end_at,
  ]);
  return result.insertId;
};

// [7] 보호자 - 날짜별 예약불가 시간 조회 (예약된시간 + 센터점심 + 담당자가차단 빼기)
const findAvailability = async (dependantNo, date) => {
  // 1) dependant로 담당자, 센터 점심시간 조회
  const rows = await mysql.rquery(selectCenterLunch, [dependantNo]);
  if (rows.length === 0) {
    return {
      managerId: null,
      centerLunch: null,
      reservedTimes: [],
      blockedTimes: [],
    };
  }

  const { manager_id, center_lunch } = rows[0];

  // 2) 예약된 시간 목록
  const reserved = await mysql.rquery(selectReservedTimes, [manager_id, date]);

  // 3) 차단된 시간 목록
  const blocked = await mysql.rquery(selectBlockedTimes, [manager_id, date]);

  return {
    managerId: manager_id,
    centerLunch: center_lunch,
    reservedTimes: reserved.map((r) => r.reserved_time),
  };
};

//[7]-4 (보호자 예약) 드롭다운 지원자 선택하기
const findDependants = async (guardianId) => {
  return await mysql.rquery(selectDependant, [guardianId]);
};

module.exports = {
  findByDate,
  findTresvByManager,
  findPendingList,
  modifyRstatus,
  removeReservation,
  findByGreserv,
  addReservation,
  findAvailability,
  findDependants,
};
