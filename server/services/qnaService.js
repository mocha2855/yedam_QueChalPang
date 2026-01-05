//services/qnaService.js
const mysql = require("../database/mapper.js");
const { selectQlistByMid
} = require("../database/sqls/qna.js");

//보호자
//[1] 본인 질문 전체 조회
const findQlistByMid = async (memberId) => {
  return await mysql.rquery(selectQlistByMid, [memberId]);
}

//[2] 질문 단건 등록
const addQna = async (data) => {
  const { member_id, qna_title, qna_content, qna_date, qna_category, attachment_no } = data;

  let result = await mysql.rquery(insertQna, [member_id, qna_title, qna_content, qna_date, qna_category, attachment_no]);
  return result.insertQna;
}

//[3] 질문 단건 수정 (답변 달리기 전까지)


//[4] 질문 단건 삭제 (답변 달리기 전까지)


//담당자
//[1] 답변 단건 등록

module.exports = { findQlistByMid, addQna }