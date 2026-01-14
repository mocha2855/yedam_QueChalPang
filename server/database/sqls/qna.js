//slqs/qna.js
//보호자
//[1] 보호자 - 본인 질문 전체 조회
const selectQlistByMid = `
SELECT
  q.qna_no,
  q.qna_title,
  q.qna_content,
  q.member_id AS author,
  am.member_name AS author_name,
  a.member_id AS respondent,
  q.qna_date AS date,
  q.qna_category AS category,

  q.dependant_no,
  d.dependant_name,

  d.manager_main AS manager_id,
  mm.member_name AS manager_name,
  mm.member_phone AS manager_phone,
  mm.member_email AS manager_email,
  ma.member_name AS respondent_name,

  q.qna_status AS status
FROM qna q

JOIN dependant d
  ON d.dependant_no = q.dependant_no

LEFT JOIN qna_answer a
  ON q.qna_no = a.qna_no

LEFT JOIN member am
  ON am.member_id = q.member_id

LEFT JOIN member mm
  ON mm.member_id = d.manager_main

LEFT JOIN member ma
  ON ma.member_id = a.member_id

WHERE q.member_id = ?
ORDER BY q.qna_date DESC
`;

//[2] 보호자 - 질문 단건 등록
const insertQna = `
INSERT INTO qna
  (member_id, dependant_no, qna_title, qna_content, qna_date, qna_category, qna_status, attachment_no)
VALUES
  (?, ?, ?, ?, NOW(), ?, 'k2', NULL)
`;

//[2-1] 보호자 - 본인의 지원자목록 조회
const selectDependantsByMember = `
SELECT dependant_no, dependant_name
FROM dependant
WHERE member_id = ?
ORDER BY dependant_no DESC
`;

//[3] 보호자 - 질문 단건 상세조회 (답변 포함)
const selectQnaDetail = `
SELECT 
  q.qna_no,
  q.member_id       AS writer_id,
  mw.member_name    AS writer_name,

  q.qna_title, 
  q.qna_content,
  q.qna_date,
  q.qna_category,
  q.qna_status,

  d.manager_main    AS manager_id,
  mm.member_name    AS manager_name,

  a.qanswer_no,
  a.member_id       AS answerer_id,
  ma.member_name    AS answerer_name,
  a.qanswer_content,
  a.qanswer_date
FROM qna q
JOIN member mw
  ON mw.member_id = q.member_id

JOIN dependant d
  ON d.dependant_no = q.dependant_no

LEFT JOIN member mm
  ON mm.member_id = d.manager_main

LEFT JOIN qna_answer a
  ON a.qna_no = q.qna_no

LEFT JOIN member ma
  ON ma.member_id = a.member_id

WHERE q.qna_no = ?
`;

//[4] 담당자 - 본인이 담당하는 사람들의 질문 전체조회
const selectQlistByManager = `
SELECT
  q.qna_no,
  q.qna_title,
  q.qna_content,
  q.qna_date AS date,
  q.qna_category AS category,
  q.qna_status AS status,

  q.member_id AS author,
  am.member_name AS author_name,

  q.dependant_no,
  d.dependant_name,

  d.manager_main AS manager_id,
  mm.member_name AS manager_name,

  a.qanswer_no,
  a.member_id AS respondent,
  ma.member_name AS respondent_name
FROM qna q

JOIN dependant d
  ON d.dependant_no = q.dependant_no

JOIN member am
  ON am.member_id = q.member_id

LEFT JOIN member mm
  ON mm.member_id = d.manager_main

LEFT JOIN qna_answer a
  ON a.qna_no = q.qna_no

LEFT JOIN member ma
  ON ma.member_id = a.member_id

WHERE d.manager_main = ?
     OR d.manager_main IS NULL

ORDER BY q.qna_date DESC
`;

//[5] 담당자 - 질문 한건 자세히 조회
const selectQnaDetailByManager = `
  SELECT 
    q.qna_no,
    q.member_id       AS writer_id,
    mw.member_name    AS writer_name,

    q.qna_title, 
    q.qna_content,
    q.qna_date,
    q.qna_category,
    q.qna_status,
    q.qna_manager_id,
    mm.member_name    AS manager_name,

    a.qanswer_no,
    a.member_id       AS answerer_id,
    ma.member_name    AS answerer_name,
    a.qanswer_content,
    a.qanswer_date
  FROM qna q
  JOIN member mw
    ON mw.member_id = q.member_id

  LEFT JOIN member mm
    ON mm.member_id = q.qna_manager_id

  LEFT JOIN qna_answer a
    ON a.qna_no = q.qna_no

  LEFT JOIN member ma
    ON ma.member_id = a.member_id

  WHERE q.qna_no = ?
`;

//[6] 담당자 - 답변등록
const insertQnaAnswer = `
INSERT INTO qna_answer
  (qna_no, member_id, qanswer_content, qanswer_date)
VALUES
  (?, ?, ?, NOW())
`;

// [7] 답변 등록 후 qna 상태 업데이트
const updateQnaStatusAnswered = `
UPDATE qna
SET qna_status = 'k1'
WHERE qna_no = ?
`;

module.exports = {
  selectQlistByMid,
  insertQna,
  selectDependantsByMember,
  selectQnaDetail,
  selectQlistByManager,
  selectQnaDetailByManager,
  insertQnaAnswer,
  updateQnaStatusAnswered,
};
