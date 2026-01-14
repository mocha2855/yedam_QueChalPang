const mysql = require("../database/mapper.js");
require("dotenv").config();
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
  let retInfo = { isCorrect: false, msg: "", member: {} };
  let isExist = await mysql.memberQuery("countByMemberId", input.id);
  if (isExist[0].count > 0) {
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
    input.pw,
    input.name,
    input.email,
    input.phone,
    input.address,
    input.center_no,
    input.authority,
  ];
  console.log(value);
  let result = await mysql.memberQuery("insertMemberInfo", value);
  return result;
};

// /관리자 등록
const addManager = async (input) => {
  let value = [
    input.member_id,
    input.member_password,
    input.member_name,
    input.member_email,
    input.member_tel,
    input.member_address,
    input.center_no,
    input.member_authority,
    // inpu담당자t.member_confirm,
  ];

  let result = await mysql.memberQuery("insertManagerDirect", value);
  return result;
};

//인증을 위한 랜덤번호 6자리 생성
const phoneAuth = async (input) => {
  console.log(input.phone);
  let randval = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  const message = {
    // 문자 내용 (최대 2,000Bytes / 90Bytes 이상 장문문자)
    text: `인증번호는 ${randval} 입니다.`,
    // 수신번호 (문자 받는 이)
    to: input.phone.replaceAll("-", ""),
    // 발신번호 (문자 보내는 이)
    from: "01055938876",
  };
  try {
    console.log(message);
    const response = await messageService.send(message);
    console.log("발송 성공 결과:", response);
    let result = await mysql.memberQuery("insertSmsInfo", randval);
    return result;
  } catch (error) {
    throw error;
  }
};
// 입력한 인증번호 맞는지 체크.
const getAuth = async (id, num) => {
  await mysql.memberQuery("deleteOver3m");
  let result = await mysql.memberQuery("selectBySmsId", [id, num]);
  console.log(result);
  return result;
};

const searchId = async (name, phone, way) => {
  if (way == 1) {
    let result = await mysql.memberQuery("countByMemberNameAndPhone", [
      name,
      phone,
    ]);
    return result;
  } else if (way == 2) {
    let result = await mysql.memberQuery("selectByMemberNameAndPhone", [
      name,
      phone,
    ]);
    console.log(result);
    return result;
  } else if (way == 3) {
    let result = await mysql.memberQuery("countByMemberIdAndPhone", [
      name,
      phone,
    ]);
    console.log(result);
    return result;
  }
};

const updatePassword = async (id, password) => {
  let result = await mysql.memberQuery("updatePassword", [password, id]);
  console.log(result);
  return result;
};
//승인 관련 서비스 추가
// 1. 승인 관리 목록
const getApprovalList = async () => {
  let list = await mysql.memberQuery("selectMemberApproval");
  return list;
};

// 2. 승인 처리 (l2 -> l1)
const approveMember = async (id) => {
  let result = await mysql.memberQuery("updateMemberConfirm", ["l1", id]);
  return result;
};

// 3. 대기 건수
const getPendingCount = async () => {
  let result = await mysql.memberQuery("countPendingMembers");
  return result[0].count;
};

// 지원자 관련

// 지원자 조회
const findDependants = async (id, authority) => {
  let result;
  if (authority == "a1") {
    result = await mysql.memberQuery("selectDependants", id);
  } else if (authority == "a2") {
    result = await mysql.memberQuery("selectDependants2", id);
  }
  console.log(result);
  return result;
};
// 4. 승인 거절 처리 (l2 -> l3)
const rejectMember = async (id) => {
  let result = await mysql.memberQuery("updateMemberConfirm", ["l3", id]);
  return result;
};

// 3. 거절 건수
const getRejectedCount = async () => {
  let result = await mysql.memberQuery("countRejectedMembers");
  return result[0].count;
};

// 회원 정보 수정
const modifyByMemberId = async (value, hasPassword) => {
  let result;

  if (hasPassword) {
    // 비밀번호 포함
    result = await mysql.memberQuery("updateMemberInfo", value);
  } else {
    // 비밀번호 제외
    result = await mysql.memberQuery("updateMemberInfoPassword", value);
  }

  console.log("result : ", result);
  return result[0];
};
//회원삭제
const removeMemberById = async (id) => {
  let result = await mysql.memberQuery("deleteMemberById", id);
  console.log("result : ", result);
  return result[0];
};
module.exports = {
  findAllMember,
  findByMemberId,
  memberLogIn,
  isExist,
  addMemberInfo,
  phoneAuth,
  getAuth,
  searchId,
  updatePassword,
  getApprovalList,
  approveMember,
  getPendingCount,
  findDependants,
  rejectMember,
  getRejectedCount,
  removeMemberById,
  modifyByMemberId,
  addManager,
};
