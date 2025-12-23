const mysql = require("../database/mapper.js");

// 회원목록
const findAllMember = async () => {
  let list = await mysql.memberQuery("selectAllMember");
  return list;
};

// 회원 단건 조회
const findByMemberId = async (id) => {
  let info = await mysql.memberQuery("selectByMemberId", id);
  return info;
};

// 회원 로그인
const memberLogIn = async (input) => {
  let isExist = await mysql.memberQuery("selectByMemberId", input.id);
  let retInfo = { isCorrect: false, msg: "", member: {} };
  if (isExist) {
    let isCorrect = await mysql.memberQuery("countByMemberPass", [
      input.id,
      input.pass,
    ]);
    if (isCorrect[0].count > 0) {
      retInfo.member = await mysql.memberQuery("selectByMemberId", input.id);
      retInfo.isCorrect = true;
      retInfo.msg = "비밀번호가 일치합니다.";
    } else {
      retInfo.msg = "비밀번호가 일치하지 않습니다.";
    }
  } else {
    retInfo.msg = "해당하는 아이디가 없습니다.";
  }
  return retInfo;
};
// 중복확인
const isExist = async (key, value) => {
  let res;
  if (key == "id") {
    res = await mysql.memberQuery("countByMemberId", value);
  } else if (key == "email") {
    res = await mysql.memberQuery("countByMemberEmail", value);
  }
  return { key: key, result: res };
};
// 회원 가입
const addMemberInfo = async (input) => {
  let value = [
    input.id,
    input.pass,
    input.name,
    input.email,
    input.phone,
    input.address,
    input.center,
    input.authority,
  ];
  console.log(value);
  let result = await mysql.memberQuery("insertMemberInfo", value);
  return result;
};
module.exports = {
  findAllMember,
  findByMemberId,
  memberLogIn,
  isExist,
  addMemberInfo,
};
