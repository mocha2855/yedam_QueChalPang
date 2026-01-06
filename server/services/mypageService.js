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
module.exports = {
  findManagerById,
  findDependantById,
  updateManagerInfo,
  updateDependantInfo,
};
