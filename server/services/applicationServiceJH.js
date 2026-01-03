const mysql = require("../database/mapper");

// 접속자 권한 확인
const authorityFindById = async (no) => {
  let post = await mysql.bquery("authoritySelectById", no);
  return post;
};

// 대기단계 선택시 상태확인
const findById = async (no) => {
  let post = await mysql.bquery("selectById", no);
  return post;
};

// 결재자 선택화면 목록
const rejectorFindById = async () => {
  let post = await mysql.bquery("rejectorSelectById");
  return post;
};

// 대기단계 승인요청
const applicationModifyInfo = async (no, data) => {
  let { status } = data;
  let post = await mysql.bquery("applicationUpdateInfo", [status, no]);
  return post;
};

// 대기단계 반려사유
const rejectModifyInfo = async (no, data) => {
  let { status_reject } = data;
  let post = await mysql.bquery("statusRejectUpdateInfo", [status_reject, no]);
  return post;
};

// 대기단계 승인 , 재승인
const applicationSuccessModifyInfo = async (no, data) => {
  let { status_status, status_reject } = data;
  let post = await mysql.bquery("applicationSuccessUpdateInfo", [
    status_status,
    status_reject,
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

module.exports = {
  authorityFindById,
  findById,
  rejectorFindById,
  applicationModifyInfo,
  rejectModifyInfo,
  applicationSuccessModifyInfo,
  findPlanningById,
  findplanningReviewById,
  addPlanningInfo,
  updatePlanningInfo,
  updateRejectPlanningInfo,
  updateChangingPlanningInfo,
};
