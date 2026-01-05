//slqs/qna.js
//보호자
//[1] 본인 질문 전체 조회
const selectQlistByMid = `
SELECT
  q.qna_title,
  q.qna_content,
  q.member_id AS author,
  am.member_name AS author_name,        
  a.member_id AS respondent,
  q.qna_date AS date,
  q.qna_category AS category,
  dm.manager_main AS manager_id,          
  mm.member_name AS manager_name,        
  mm.member_phone AS manager_phone,
  mm.member_email AS manager_email,
  q.qna_status AS status
FROM qna q
LEFT JOIN qna_answer a
  ON q.qna_no = a.qna_no
LEFT JOIN (
  SELECT member_id, MAX(manager_main) AS manager_main
  FROM dependant
  GROUP BY member_id
) dm
  ON q.member_id = dm.member_id
LEFT JOIN member am                     
  ON am.member_id = q.member_id
LEFT JOIN member mm                      
  ON mm.member_id = dm.manager_main
WHERE q.member_id = ?
ORDER BY q.qna_date DESC;
`

//[2] 질문 단건 등록
const insertQna = `
  INSERT INTO qna
    (member_id, qna_title, qna_content, qna_date, qna_category, attachment_no)
  VALUES 
    (?,?,?,now(),?,NULL)
`

//[3] 질문 단건 수정 (답변 달리기 전까지)


//[4] 질문 단건 삭제 (답변 달리기 전까지)


//담당자
//[1] 답변 단건 등록

module.exports = { selectQlistByMid, insertQna }