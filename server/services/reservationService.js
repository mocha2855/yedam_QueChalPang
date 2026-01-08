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
  selectManagerbyDeptno,
  selectApplicationByDependant,
  selectCenterAddress,
  selectCenterLunchByManager,
  updateScheduleBlock,
  deleteScheduleBlock,
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
    blockedTimes: blocked.map((b) => b.block_time),
  };
};

//[7]-1 (보호자 예약) dependant_no로 담당자조회
const findManagerbyDeptno = async (dependantNo) => {
  return await mysql.rquery(selectManagerbyDeptno, [dependantNo]);
};

//[7]-4 (보호자 예약) 드롭다운 지원자 선택하기
const findDependants = async (guardianId) => {
  return await mysql.rquery(selectDependant, [guardianId]);
};

//[7]-5 (보호자 예약) 드롭다운 지원자 선택 후 지원자의 지원신청서 선택하기
const findApplication = async (dependantNo) => {
  return await mysql.rquery(selectApplicationByDependant, [dependantNo]);
};

//[8] (보호자 예약) 완료 후 센터주소 조회해서 지도에 표시하기
const findCenterAddrByResvId = async (resvId) => {
  return await mysql.rquery(selectCenterAddress, [resvId]);
};

//담당자 상담차단 관련
//[9]매니저id로 센터점심 조회
const findCenterLunchByManager = async (managerId) => {
  return await mysql.rquery("selectCenterLunchByManager", [managerId]);
};

//[9]-1
const findManagerAvailability = async (managerId, date) => {
  // 1) 센터점심시간 가져오기
  let centerLunch = null;
  const lunchRows = await mysql.rquery(selectCenterLunchByManager, [managerId]);

  if (lunchRows.length > 0) {
    centerLunch = lunchRows[0].center_lunch;
  }

  // 2) 예약된 시간 목록
  const reserved = await mysql.rquery(selectReservedTimes, [managerId, date]);

  // 3) 차단된 시간 목록
  const blocked = await mysql.rquery(selectBlockedTimes, [managerId, date]);

  return {
    managerId,
    centerLunch,
    reservedTimes: reserved.map((r) => r.reserved_time),
    blockedTimes: blocked.map((b) => b.block_time),
  };
};

//[10]상담시간 차단하기
const modifyScheduleBlock = async (managerId, date, time) => {
  return await mysql.rquery(updateScheduleBlock, [managerId, date, time]);
};

//[11]상담시간 차단해제하기
const removeScheduleBlock = async (managerId, date, time) => {
  return await mysql.rquery(deleteScheduleBlock, [managerId, date, time]);
};

// 상담일지 작성시 상담확정으로 변경(260108_JH)
const modifyreserveStatus = async (id) => {
  return await mysql.rquery("updatereserveStatus", id);
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
  findManagerbyDeptno,
  findDependants,
  findApplication,
  findCenterAddrByResvId,
  findCenterLunchByManager,
  findManagerAvailability,
  modifyScheduleBlock,
  removeScheduleBlock,
  modifyreserveStatus,
};
