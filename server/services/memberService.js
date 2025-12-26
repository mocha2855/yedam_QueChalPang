const mysql = require("../database/mapper.js");

// 문자발송 api 가져오기
const { SolapiMessageService: msgModule } = require("solapi");
const messageService = new msgModule(
  process.env.SOLAPI_API_KEY,
  process.env.SOLAPI_API_SECRET
);
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
  } else if (key == "phone") {
    res = await mysql.memberQuery("countByMemberPhone", value);
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
//인증을 위한 랜덤번호 6자리 생성
const phoneAuth = async (input) => {
  let randval = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  const message = {
    // 문자 내용 (최대 2,000Bytes / 90Bytes 이상 장문문자)
    text: `[인증문자] 인증번호는 ${randval} 입니다.`,
    // 수신번호 (문자 받는 이)
    to: input.phone,
    // 발신번호 (문자 보내는 이)
    from: "01055938876",
  };
  messageService.send(message).then(console.log).catch(console.error);
  let result = await mysql.memberQuery("insertSmsInfo", randval);
  return result;
};
// 입력한 인증번호 맞는지 체크.
const getAuth = async (id, num) => {
  await mysql.memberQuery("deleteOver3m");
  let result = await mysql.memberQuery("selectBySmsId", [id, num]);
  console.log(result);
  return result;
};

module.exports = {
  findAllMember,
  findByMemberId,
  memberLogIn,
  isExist,
  addMemberInfo,
  phoneAuth,
  getAuth,
};
