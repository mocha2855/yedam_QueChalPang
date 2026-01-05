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
  st.survey_title
 FROM survey s
 LEFT JOIN survey_title st ON s.survey_no = st.survey_no
 WHERE s.survey_version_status = 'active'`;

//항목 리스트 조회
const selectTitle = `
SELECT 
  s.survey_no,
  s.survey_version,
  s.survey_start,
  s.survey_end,
  s.survey_version_status,
  st.survey_title_no, 
  st.survey_title
FROM survey s
LEFT JOIN survey_title st ON s.survey_no = st.survey_no
WHERE s.survey_no = ? AND s.survey_version_status = 'active'
 `;

//active(활동)인 것 중에서 질문 리스트 조회
const selectQitem = `
  SELECT 
  ss.survey_subtitle_no, 
  sq.survey_qitem_no,
  sq.survey_qitem_question,
  sq.survey_qitem_type
 
  FROM survey s
  LEFT JOIN survey_title st ON s.survey_no = st.survey_no
  LEFT JOIN survey_subtitle ss ON st.survey_title_no = ss.survey_title_no
  LEFT JOIN survey_qitem sq ON ss.survey_subtitle_no = sq.survey_subtitle_no
  WHERE s.survey_no = ? AND s.survey_version_status = 'active'
`;
//세부항목 리스트 가져오기
const selectDetail = `
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
       ss.survey_subtitle_detail
  FROM survey s
  LEFT JOIN survey_title st ON s.survey_no = st.survey_no
  LEFT JOIN survey_subtitle ss ON st.survey_title_no = ss.survey_title_no
  WHERE s.survey_no = ? AND s.survey_version_status = 'active'
`;
//조사지 버전 업 자동 저장
const selectMaxVersionAll = `
  SELECT MAX(CAST(survey_version AS DECIMAL(10,2))) as max_version 
  FROM survey
`;
const selectMaxSurveyNo = `
  SELECT MAX(survey_no) as max_no 
  FROM survey
`;

//조사지 새로 등록시 추가
const insertSurvey = `INSERT INTO 
survey (
        survey_version, 
        survey_start, 
        survey_end, 
        survey_version_status) 
VALUES (?, ?, ?, 'active')`;

//조사지 타이틀(항목) 새로 등록시 추가
const insertSurveyTitle = `
INSERT INTO survey_title (survey_no, survey_title) VALUES(?,?)`;

//조사지 서브타이틀(세부항목) 새로 등록시 추가
const insertSurveySubtitle = `
INSERT INTO survey_subtitle (
  survey_title_no, 
  survey_subtitle, 
  survey_subtitle_detail)
VALUES (?,?,?)`;

//조사지 질문 새로 등록시 추가
const insertSurveyQitem = `
INSERT INTO survey_qitem (
 survey_subtitle_no, 
  survey_qitem_question, 
  survey_qitem_type)
VALUES (?,?,?)`;

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
// 지원신청서 등록을 위한 활성상태의 조사지 전체 조회.
const selectAllSurveys = `SELECT s.survey_no,
        s.survey_version,
        s.survey_start,
        s.survey_end,
        t.survey_title_no,
        t.survey_title,
        ss.survey_subtitle_no,
        ss.survey_subtitle,
        ss.survey_subtitle_detail,
        q.survey_qitem_no,
        q.survey_qitem_question,
        q.survey_qitem_type 
FROM survey s JOIN survey_title t on s.survey_no = t.survey_no 
              JOIN survey_subtitle ss ON t.survey_title_no = ss.survey_title_no 
              JOIN survey_qitem q ON ss.survey_subtitle_no = q.survey_subtitle_no 
WHERE survey_version_status = 'active'`;
module.exports = {
  selectAll,
  selectTitle,
  selectQitem,
  selectDetail,
  selectMaxVersionAll,
  selectMaxSurveyNo,
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

  // 지원신청서 등록용
  selectAllSurveys,
};
