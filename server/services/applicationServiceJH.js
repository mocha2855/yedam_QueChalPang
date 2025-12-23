const mysql = require("../database/mapper");

// 대기단계 선택: 상담완료 상태이면서 지원신청서 단계가 대기 중인 사람
const findById = async no => {
  let post = await mysql.bquery("selectById", no);
  return post;
};

const rejectorFindById = async () => {
  let post = await mysql.bquery("rejectorSelectById");
  return post;
};

const applicationModifyInfo = async (no, data) => {
  let { status } = data;
  let post = await mysql.bquery("applicationUpdateInfo", [status, no]);
  return post;
};

module.exports = {
  findById,
  rejectorFindById,
  applicationModifyInfo,
};
