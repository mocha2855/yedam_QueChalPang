const mysql = require("../database/mapper");
// 담당자
// 담당자 정보
const findManagerById = async (id) => {
  let post = await mysql.myPageQuery("selectMnagerById", id);
  return post;
};

// 지원자 정보
const findDependantById = async (id) => {
  console.log("2======", id);
  let post = await mysql.myPageQuery("selectDependantById", id);
  return post;
};

// 본인 정보 변경
const updateManagerInfo = async (member_id, data) => {
  let post = await mysql.myPageQuery("updateManagerInfo", [data, member_id]);
  return post;
};

// 담당 지원자 정보 변경
const updateDependantInfo = async (id, data) => {
  let post = await mysql.myPageQuery("updateDependantInfo", [data, id]);
  return post;
};

// 담당 지원자 정보 등록
const addDependantInfo = async (data) => {
  let post = await mysql.myPageQuery("insertDependantInfo", data);
  return post;
};

// 담당 지원자 삭제
const removeDependantInfo = async (id) => {
  let post = await mysql.myPageQuery("deleteDependantInfo", id);
  return post;
};

// 보호자
// 보호자 정보
const findGuardianById = async (id) => {
  let post = await mysql.myPageQuery("selectguardianById", id);
  return post;
};

// 보호자 지원자 정보
const findGuardianDependantById = async (id) => {
  let post = await mysql.myPageQuery("selectGuardianDependantById", id);
  return post;
};

// 관리자
// 센터정보
const findCenterInfoById = async () => {
  let post = await mysql.myPageQuery("selectCenterInfoById");
  return post;
};

// 센터 정보 변경
const updateCenterInfo = async (id, data) => {
  let post = await mysql.myPageQuery("updateCenterInfo", [data, id]);
  return post;
};

module.exports = {
  findManagerById,
  findDependantById,
  updateManagerInfo,
  updateDependantInfo,
  addDependantInfo,
  removeDependantInfo,
  findGuardianById,
  findGuardianDependantById,
  findCenterInfoById,
  updateCenterInfo,
};
