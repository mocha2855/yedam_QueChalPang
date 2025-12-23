// services/commentService.js
const mysql = require("../database/mapper.js");

const findComments = async (bno) => {
  let list = await mysql.cquery("selectAllComment", bno);
  return list;
};
const test = async () => {
  let result = await mysql.cquery("test");
  return result;
};

module.exports = { findComments, test };
