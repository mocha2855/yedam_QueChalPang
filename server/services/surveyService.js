//services/surveyService.js
const mysql = require("../database/mapper.js");

const findAll = async () => {
  let list = await mysql.squery("selectAll");
  return list;
};
const findByNo = async (no) => {
  let post = await mysql.squery("selectByNo", [no]);
  return post;
};

module.exports = {
  findAll,
  findByNo,
};
