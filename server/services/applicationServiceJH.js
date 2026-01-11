const mysql = require("../database/mapper");

// 지원자 정보
const dependantFindById = async no => {
  let post = mysql.bquery("dependantSelectById", no);
  return post;
};

//해당 지원자와 똑같은 센터의 담당자 조회
const findManagerByDependant = async deptNo => {
  const result = await mysql.bquery("selectManagerByDependant", deptNo);
  return result;
};

//담당자 배정하기 (관리자)
const assignManagerInfo = async (applicationNo, data) => {
  const { manager_id } = data;
  const result = await mysql.bquery("assignManager", [
    manager_id,
    applicationNo,
  ]);
  return result;
};

// 대기단계 선택시 상태확인
const findById = async no => {
  let post = await mysql.bquery("selectById", no);
  return post;
};

// 대기단계 승인요청 (담당자)
// status 받지 말고(받아도 무시), applicationUpdateInfo는 [no]만 넘김
//담당자가 승인요청 넣으면 status_status가 null에서 i1(검토중)으로 바뀜
const applicationModifyInfo = async (no, data) => {
  const { status } = data;
  const post = await mysql.bquery("applicationUpdateInfo", [status, no]);
  return post;
};

// 대기단계 승인 (관리자)
const applicationApproveInfo = async (no, data) => {
  const { approverId } = data; // 결재자 member_id
  const post = await mysql.bquery("approveStatus", [approverId, no]);
  return post;
};

// 대기단계 반려 (관리자)
const applicationRejectInfo = async (no, data) => {
  const { status_reject, approverId } = data;

  const post = await mysql.bquery("rejectStatus", [
    status_reject,
    approverId,
    no,
  ]);

  return post;
};

// 지원계획서 갯수 조회(계획서 추가시 숫자 파악 위해)
const findPlanningById = async no => {
  let post = await mysql.bquery("selectPlanningById", no);
  return post;
};

// 검토 중, 반려, 승인 지원계획서 불러오기
const findplanningReviewById = async no => {
  let post = await mysql.bquery("selectPlanningReviewById", no);
  return post;
};

// 지원계획서 승인요청
const addPlanningInfo = async (application_no, data) => {
  let param = { application_no, ...data };
  let post = await mysql.bquery("insertPlannginInfo", param);
  return post;
};

// 지원계획서 임시저장 0111
const addPlanSaveInfo = async (application_no, data) => {
  let param = { application_no, ...data };
  let post = await mysql.bquery("insertPlanSaveInfo", param);
  return post;
};

// 지원계획서 임시저장(이미 한 번 했을 경우) 0111
const modifyFirstSaveInfo = async (application_no, data) => {
  let post = await mysql.bquery("updateFirstSaveInfo", [data, application_no]);
  return post;
};

// 지원계획서 임시저장 삭제 0111
const removeFirstSaveInfo = async application_no => {
  let post = await mysql.bquery("deleteFirstSaveInfo", application_no);
  return post;
};

// 지원계획서 승인(관리자)
const updatePlanningInfo = async (planning_no, data) => {
  let post = await mysql.bquery("sucessPlanningUpdateInfo", [
    data,
    planning_no,
  ]);
  return post;
};

// 지원계획서 반려(관리자)
// const updateRejectPlanningInfo = async (planning_no, data) => {
//   let post = await mysql.bquery("rejectPlanningUpdateInfo", [
//     data,
//     planning_no,
//   ]);
//   return post;
// };
const updateRejectPlanningInfo = async (planning_no, data) => {
  const { planning_status, planning_reject } = data;

  const post = await mysql.bquery("rejectPlanningUpdateInfo", [
    planning_status,
    planning_reject,
    planning_no,
  ]);
  return post;
};

// 지원계획서 반려 후 승인요청(담당자)
// 이거 반려(i3)로 status가 되어 있을 텐데 담당자가 승인요청을 다시 올리면서 i1으로 다시 바꿀 필요는 없을지 생각.
const updateChangingPlanningInfo = async (no, data) => {
  let post = await mysql.bquery("changingPlanningUpdateInfo", [
    data.planning_title,
    data.planning_content,
    no,
  ]);
  return post;
};

// 지원신청현황 가져오기(일반사용자 / 담당자 / 관리자)
const findAppById = async (id, search, value, badge, authority) => {
  let result;
  console.log(badge.replaceAll("'", "").split(","));
  console.log(id, search, value, authority);
  if (authority == "a1") {
    if (search == undefined) {
      search = "t.member_name";
    }
    if (value === undefined) {
      value = "";
    }
    result = await mysql.bquery("selectApplicationsById", [
      id,
      search,
      value,
      badge.replaceAll("'", "").split(","),
    ]);
  } else if (authority == "a2") {
    if (search == undefined) {
      search = "dependant_name";
    }
    if (value == undefined) {
      value = "";
    }
    console.log(search, value, id);
    result = await mysql.bquery("selectApplicationsByTeacher", [
      id,
      id,
      search,
      value,
      badge.replaceAll("'", "").split(","),
    ]);
  } else if (authority == "a3") {
    result = await mysql.bquery("selectApplicationsByAdmin", [
      id,
      search,
      value,
      badge.replaceAll("'", "").split(","),
    ]);
  } else if (authority == "a4") {
    if (search == undefined) {
      search = "d.dependant_name";
    }
    if (value === undefined) {
      value = "";
    }

    result = await mysql.bquery("selectApplicationsByCenter", [
      id,
      search,
      value,
      badge.replaceAll("'", "").split(","),
    ]);
  }
  console.log(result);
  return result;
};

// 지원신청서 등록
const insertAppById = async (input, id, authority) => {
  console.log(input);
  const { answerList, dependant_no, survey_no } = input;
  let appResult = await mysql.bquery("insertApplication", [
    dependant_no,
    survey_no,
    id,
  ]);
  let appNo = appResult.insertId;
  const bulkData = answerList.map(item => {
    return [
      item.survey_qitem_no,
      appNo,
      item.app_answer_type || null,
      item.app_date,
      item.app_reason,
    ];
  });
  console.log(bulkData);
  let result = await mysql.bquery("insertAppAnswer", [bulkData]);
  return result;
};

// 지원신청서 조회
const findAppByNo = async no => {
  let result = await mysql.bquery("selectAppByNo", no);
  return result;
};
// 지원신청서 수정
const updateApp = async updateList => {
  const bulkData = updateList.map(item => [
    item.app_answer_no, // 1
    item.survey_qitem_no, // 2 (필수값)
    item.application_no, // 3 (필수값)
    item.app_answer_type,
    item.app_reason, // 4
    item.app_date, // 5
  ]);
  let result = await mysql.bquery("modifyApp", [bulkData]);
  return result;
};
// 검토 중, 반려, 승인 지원계획서 불러오기
const findResultReviewById = async no => {
  let post = await mysql.bquery("selectResultReviewById", no);
  return post;
};

// 지원결과서 승인요청
const addResultInfo = async (planning_no, data) => {
  let param = { planning_no, ...data };
  let post = await mysql.bquery("insertResultInfo", param);
  return post;
};

// 지원결과서 승인(관리자)
const updateResultInfo = async (result_no, data) => {
  let post = await mysql.bquery("sucessResultUpdateInfo", [data, result_no]);
  return post;
};

// 지원결과서 반려(관리자)
const updateRejectResultInfo = async (result_no, data) => {
  let post = await mysql.bquery("rejectResultUpdateInfo", [data, result_no]);
  return post;
};

// 지원결과서 반려 후 승인요청(담당자)
const updateChangingResultInfo = async (result_no, data) => {
  let post = await mysql.bquery("changingResultUpdateInfo", [data, result_no]);
  return post;
};

// 수정사유 등록
const addAppHistory = async input => {
  let { appNo, id, reason } = input;
  let result = await mysql.bquery("insertAppHistory", [appNo, id, reason]);
};

// 지원결과서 임시저장 0111
const addFirstResultInfo = async data => {
  let post = await mysql.bquery("insertFirstResultInfo", data);
  return post;
};

// 지원결과서 임시저장(이미 한 번 했을 경우) 0111
const modifyResultFirstSaveInfo = async (planning_no, data) => {
  let post = await mysql.bquery("updateResultFirstSaveInfo", [
    data,
    planning_no,
  ]);
  return post;
};

// 지원결과서 임시저장 삭제 0111
const removeResultFirstSaveInfo = async planning_no => {
  let post = await mysql.bquery("deleteResultFirstSaveInfo", planning_no);
  return post;
};

module.exports = {
  dependantFindById,
  findManagerByDependant,
  assignManagerInfo,
  findById,
  applicationModifyInfo,
  applicationRejectInfo,
  findPlanningById,
  findplanningReviewById,
  addPlanningInfo,
  updatePlanningInfo,
  updateRejectPlanningInfo,
  updateChangingPlanningInfo,
  findAppById,
  findResultReviewById,
  addResultInfo,
  updateResultInfo,
  updateRejectResultInfo,
  updateChangingResultInfo,
  insertAppById,
  findAppByNo,
  applicationApproveInfo,
  updateApp,
  addAppHistory,
  addPlanSaveInfo, // 0111 임시저장
  modifyFirstSaveInfo, // 0111 임시저장(이미 한번 했을 경우)
  removeFirstSaveInfo, // 0111 임시저장 삭제
  addFirstResultInfo, // 0111 결과서 임시저장
  modifyResultFirstSaveInfo, // 0111 결과서 임시저장(이미 한번 했을 경우)
  removeResultFirstSaveInfo, // 0111 결과서 임시저장 삭제
};
