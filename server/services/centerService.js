const mysql = require("../database/mapper.js");

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

const addCenterInfo = async (value) => {
  let result = await mysql.centerQuery("insertCenterInfo", value);
  return result;
};
module.exports = {
  findAllCenter,
  addCenterInfo,
};
