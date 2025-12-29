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

// 검토 중인 지원계획서 불러오기
const findplanningReviewById = async (no) => {
  let post = await mysql.bquery("selectPlanningReviewById", no);
  return post;
};

// 지원계획서 승인요청
const addPlanningInfo = async (no, data) => {
  let {
    planning_id,
    planning_rejecter,
    planning_start,
    planning_end,
    planning_title,
    planning_content,
  } = data;
  let post = await mysql.bquery("insertPlannginInfo", [
    no,
    planning_id,
    planning_rejecter,
    planning_start,
    planning_end,
    planning_title,
    planning_content,
  ]);
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
};
