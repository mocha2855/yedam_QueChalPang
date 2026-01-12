//services/qnaService.js
const mysql = require("../database/mapper.js");
const {
  selectQlistByMid,
  insertQna,
  selectDependantsByMember,
  selectQnaDetail,
  selectQlistByManager,
  selectQnaDetailByManager,
  insertQnaAnswer,
  updateQnaStatusAnswered,
} = require("../database/sqls/qna.js");

//보호자
//[1] 본인 질문 전체 조회
const findQlistByMid = async (memberId) => {
  return await mysql.rquery(selectQlistByMid, [memberId]);
};

//[2] 보호자 - 질문 단건 등록
const addQna = async (data) => {
  const { member_id, dependant_no, qna_title, qna_content, qna_category } =
    data;

  let result = await mysql.rquery(insertQna, [
    member_id,
    dependant_no,
    qna_title,
    qna_content,
    qna_category,
  ]);
  return result.insertId;
};

//[2-1] 보호자 - 본인의 지원자목록 조회
const findDependantsByMember = async (memberId) => {
  return await mysql.rquery(selectDependantsByMember, [memberId]);
};

//[3] 보호자 - 질문 단건 상세조회 (답변 포함)
const findQnaDetail = async (qna_no) => {
  const rows = await mysql.rquery(selectQnaDetail, [qna_no]);

  return rows[0] ?? null;
};

//[4] 담당자 - 본인이 담당하는 사람들의 질문 전체조회
const findQlistByManager = async (managerId) => {
  return await mysql.rquery(selectQlistByManager, [managerId]);
};

//[5] 담당자 - 질문 한건 자세히 조회
const findQnaDetailByManager = async (qnaNo) => {
  const rows = await mysql.rquery(selectQnaDetailByManager, [qnaNo]);
  return rows[0] ?? null;
};

//[6] 담당자 - 답변등록 & status 업뎃
const addAnswerByManager = async ({ qnaNo, answererId, qanswer_content }) => {
  // 1) 답변 insert
  await mysql.rquery(insertQnaAnswer, [qnaNo, answererId, qanswer_content]);

  // 2) qna 상태만 k1로 변경
  await mysql.rquery(updateQnaStatusAnswered, [qnaNo]);

  return true;
};

module.exports = {
  findQlistByMid,
  addQna,
  findDependantsByMember,
  findQnaDetail,
  findQlistByManager,
  findQnaDetailByManager,
  addAnswerByManager,
};
