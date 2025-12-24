const mysql = require("../database/applicationMapper.js");

// 전체 센터 목록
const findAllCenter = async (key, value) => {
  let result;
  if (key && value) {
    result = await mysql.centerQuery("searchAllCenter", [key, value]);
  } else {
    result = await mysql.centerQuery("selectAllCenter");
  }
  return result;
};

module.exports = {
  findAllCenter,
};
