const mysql = require("../database/mapper");
// 담당자
// 담당자 정보
const findManagerById = async (id) => {
  let post = await mysql.myPageQuery("selectMnagerById", id);
  return post;
};

// 결재자 선택화면 목록
const findDependantById = async (id) => {
  let post = await mysql.myPageQuery("selectDependantById", id);
  return post;
};

// 정보 변경
const updateManagerInfo = async (member_id, data) => {
  let post = await mysql.myPageQuery("updateManagerInfo", [data, member_id]);
};

module.exports = {
  findManagerById,
  findDependantById,
  updateManagerInfo,
};
