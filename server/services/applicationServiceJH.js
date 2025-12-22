const mysql = require("../database/mapper.js");

// 대기단계 선택: 상담완료 상태이면서 지원신청서 단계가 대기 중인 사람
const findById = async(no) => {
  let post await mysql.bquery("selectByNo", no);
  return post;
}

module.exports =  {
  findById
}