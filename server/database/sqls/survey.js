//survey sql

//active(활동)인 것만 전체조회
const selectAll = `
SELECT 
  s.survey_no,
  s.survey_version,
  s.survey_start,
  s.survey_end,
  s.survey_version_status,
  st.survey_title_no, 
  st.survey_title,
  ss.survey_subtitle_no, 
  ss.survey_subtitle,
  ss.survey_subtitle_detail,
  sq.survey_qitem_no,
  sq.survey_qitem_question,
  sq.survey_qitem_type

 FROM survey s
 LEFT JOIN survey_title st ON s.survey_no = st.survey_no
 LEFT JOIN survey_subtitle ss ON st.survey_title_no = ss.survey_title_no
 LEFT JOIN survey_qitem sq ON ss.survey_subtitle_no = sq.survey_subtitle_no

 WHERE s.survey_version_status = 'active'`;

//active(활동)인 것 중에서 단건 조회
const selectByNo = `
SELECT * 
  FROM survey WHERE survey_no = ?
  AND survey_version_status = 'active'`;

//조사지 새로 등록시 추가
const insertSurvey = `INSERT INTO 
survey (survey_no, 
        survey_version, 
        survey_start, 
        survey_end, 
        survey_version_status) 
VALUES (?, ?, ?, ?, 'active')`;

//조사지 타이틀(항목) 새로 등록시 추가
const insertSurveyTitle = `
INSERT INTO survey_title (survey_title_no, survey_no, survey_title) VALUES(?,?,?)`;

//조사지 서브타이틀(세부항목) 새로 등록시 추가
const insertSurveySubtitle = `
INSERT INTO survey_subtitle (
  survey_subtitle_no, 
  survey_title_no, 
  survey_subtitle, 
  survey_subtitle_detail)
VALUES (?,?,?,?)`;

//조사지 질문 새로 등록시 추가
const insertSurveyQitem = `
INSERT INTO survey_qitem (
  survey_qitem_no, 
  survey_subtitle_no, 
  survey_qitem_question, 
  survey_qitem_type)
VALUES (?,?,?,?)`;

//조사지  active 한 구버전은 inactive로 업데이트 =>수정 ?
const updateSurvey = `
UPDATE 
 survey SET survey_version_status = 'inactive'
 WHERE survey_version_status = 'active'`;

//조사지 항목 수정
const updateTitle = `
UPDATE survey_title 
SET survey_title = ? 
WHERE survey_title_no = ?
`;

//조사지 세부 항목 수정
const updateSubtitle = `
UPDATE survey_subtitle 
SET survey_subtitle = ?, 
    survey_subtitle_detail = ?
WHERE survey_subtitle_no = ?
`;
//조사지 질문 수정
const updateQitem = `
UPDATE survey_qitem 
SET survey_qitem_question = ?,
    survey_qitem_type = ?
WHERE survey_qitem_no = ?
`;

//수정이력 저장
const insertSurveyHistory = `
INSERT INTO survey_history (
  survey_history_no, 
  survey_no, 
  survey_history_person,
  survey_history_reason,
  survey_history_date ) 
 VALUES(?,?,?,?,NOW())`;

module.exports = {
  selectAll,
  selectByNo,
  //조사지 새로 등록(버전업)
  insertSurvey,
  insertSurveyTitle,
  insertSurveySubtitle,
  insertSurveyQitem,

  //조사지 수정(업데이트)
  updateSurvey,
  updateTitle,
  updateSubtitle,
  updateQitem,
  insertSurveyHistory,
};
