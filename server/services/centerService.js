const mysql = require("../database/mapper.js");

// 전체 센터 목록
const findAllCenter = async (key, value, badge) => {
  // badge가 빈 문자열이면 전체 조회
  // if (!badge || badge === "") {
  //   let result = await mysql.centerQuery("selectAllCenterWithoutBadge", [
  //     key || "center_name",
  //     value || "",
  //   ]);
  //   return result;
  // }

  const badgeArray = badge.replaceAll("'", "").split(",");
  let result = await mysql.centerQuery("searchAllCenter", [
    key,
    value,
    badgeArray,
  ]);
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
const modifyByCenterNo = async (value) => {
  let result = await mysql.centerQuery("updateCenterInfo", value);
  console.log("result : ", result);
  return result[0];
};
const endCenterByCenterNo = async (no) => {
  let result = await mysql.centerQuery("endCenter", no);
  console.log("result : ", result);
  return result[0];
};
module.exports = {
  findAllCenter,
  addCenterInfo,
  findByCenterNo,
  findByCenterName,
  modifyByCenterNo,
  endCenterByCenterNo,
};
