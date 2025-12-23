//survey sql

//active(활동)인 것만 전체조회
const selectAll = `SELECT * FROM survey
WHERE survey_version_status = 'active'`;
//active(활동)인 것 중에서 단건 조회
const selectByNo = `SELECT * FROM survey WHERE survey_no = ?
AND survey_version_status = 'active'`;
//조사지 새로 등록시 추가
const insertSurvey = `INSERT INTO survey (survey_no, survey_version, survey_start, survey_end, survey_version_status) 
VALUES 
(?, ?, ?, ?, 'active')`;
//조사지  active 한 구버전은 inactive로 업데이트
const updateSurvey = `UPDATE survey SET survey_version_status = 'inactive'
WHERE survey_no = ?
AND survey_version_status = 'active' `;

module.exports = {
  selectAll,
  selectByNo,
  insertSurvey,
  updateSurvey,
};
