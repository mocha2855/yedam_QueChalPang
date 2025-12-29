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
  console.log("value : ", value);
  let result = await mysql.centerQuery("insertCenterInfo", value);
  return result;
};

const findByCenterNo = async (no) => {
  let result = await mysql.centerQuery("selectByCenterNo", no);
  console.log("result :", result);
  return result[0];
};
const findByCenterName = async (name) => {
  let result = await mysql.centerQuery("searchCenterName", name);
  console.log("result :", result);
  return result[0];
};
module.exports = {
  findAllCenter,
  addCenterInfo,
  findByCenterNo,
  findByCenterName,
};
