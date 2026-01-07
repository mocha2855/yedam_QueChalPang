const mysql = require("../database/mapper");

// 지원자 정보
const dependantFindById = async (no) => {
  let post = mysql.bquery("dependantSelectById", no);
  return post;
};

// 대기단계 선택시 상태확인
const findById = async (no) => {
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
//---------------------------------------------------------------------

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
const findPlanningById = async (no) => {
  let post = await mysql.bquery("selectPlanningById", no);
  return post;
};

// 검토 중, 반려, 승인 지원계획서 불러오기
const findplanningReviewById = async (no) => {
  let post = await mysql.bquery("selectPlanningReviewById", no);
  return post;
};

// 지원계획서 승인요청
const addPlanningInfo = async (application_no, data) => {
  let param = { application_no, ...data };
  let post = await mysql.bquery("insertPlannginInfo", param);
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
const updateRejectPlanningInfo = async (planning_no, data) => {
  let post = await mysql.bquery("rejectPlanningUpdateInfo", [
    data,
    planning_no,
  ]);
  return post;
};

// 지원계획서 반려 후 승인요청(담당자)
const updateChangingPlanningInfo = async (planning_no, data) => {
  let post = await mysql.bquery("changingPlanningUpdateInfo", [
    data,
    planning_no,
  ]);
  return post;
};

// 지원신청현황 가져오기(일반사용자 / 담당자 / 관리자)
const findAppById = async (id, search, value, authority) => {
  let result;

  if (authority === "a1") {
    if (search === undefined) {
      search = "a.member_id";
    }
    if (value === undefined) {
      value = "";
    }
    result = await mysql.bquery("selectApplicationsById", [search, value, id]);
  } else if (authority === "a2") {
    result = await mysql.bquery("selectApplicationsByTeacher", [
      id,
      id,
      id,
      id,
    ]);
  } else if (authority == "a3") {
    result = await mysql.bquery("selectApplicationsByAdmin", [id]);
  } else if (authority == "a4") {
    // 시스템 관리자 - 센터별 조회
    result = await mysql.bquery("selectApplicationsByCenter", [id]);
  }
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
  const bulkData = answerList.map((item) => {
    return [
      item.survey_qitem_no,
      appNo,
      item.question_type,
      item.app_date,
      item.app_reason,
    ];
  });
  console.log(bulkData);
  let result = await mysql.bquery("insertAppAnswer", [bulkData]);
  return result;
};

// 지원신청서 조회
const findAppByNo = async (no) => {
  let result = await mysql.bquery("selectAppByNo", no);
  return result;
};
// 검토 중, 반려, 승인 지원계획서 불러오기
const findResultReviewById = async (no) => {
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

module.exports = {
  dependantFindById,
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
};
