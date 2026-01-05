const mysql = require("../database/mapper");

// 결재자 선택화면 목록
const findManagerById = async (id) => {
  let post = await mysql.myPageQuery("selectMnagerById", id);
  return post;
};

module.exports = {
  findManagerById,
};
