//services/surveyService.js
const mysql = require("../database/mapper.js");

//survey 전체 조회
const findAll = async () => {
  let list = await mysql.squery("selectAll");
  return list;
};
//survey 단건 조회
const findByNo = async (no) => {
  let post = await mysql.squery("selectByNo", [no]);
  return post;
};
// survey 단건 등록(새로운 버전 업그레이드)
//질문추가 &  항목 추가시 기존 버전 비활성 -> 새버전 활성화
const addSurvey = async (data) => {
  const { survey_no, title } = data;
  const survey_start = new Date(); //날짜 자동화
  const survey_end = new Date("9999-12-31"); // 끝나는 시간은 무기한 연장(새버전 등장 시 자동 마무리 시간 계산)

  await mysql.squery("updateSurvey");

  //새 버전 insert
  let result = await mysql.squery("insertSurvey", [
    survey_no,
    survey_version,
    survey_start,
    survey_end,
  ]);

  await mysql.squery("insertSurveyTitle", [
    title.survey_title_no,
    survey_no,
    title.survey_title,
  ]);

  for (let subtitle of title.subtitles) {
    await mysql.squery("insertSurveySubtitle", [
      subtitle.survey_subtitle_no,
      title.survey_title_no,
      subtitle.survey_subtitle,
      subtitle.survey_subtitle_detail,
    ]);

    for (let qitem of subtitle.qitems) {
      await mysql.squery("insertSurveyQitem", [
        qitem.survey_qitem_no,
        subtitle.survey_subtitle_no,
        qitem.survey_qitem_question,
        qitem.survey_qitem_type,
      ]);
    }
  }
  return result.insertId;
};

//survey 수정
const modifySurvey = async (no, data) => {
  //수정이력 먼저 저장
  const {
    survey_title_no,
    survey_title,
    survey_no,
    person,
    reason,
    subtitles,
    qitems,
  } = data;

  //수정이력 저장
  let result = await mysql.squery("insertSurveyHistory", [
    null,
    survey_no,
    person,
    reason,
  ]);
  // 2. 실제 데이터 수정
  if (survey_title) {
    await mysql.squery("updateTitle", [survey_title, survey_title_no]);
  }
  if (subtitles) {
    for (const subtitle of subtitles) {
      await mysql.squery("updateSubtitle", [
        subtitle.survey_subtitle,
        subtitle.survey_subtitle_detail,
        subtitle.survey_subtitle_no,
      ]);
    }
  }
  if (qitems) {
    for (const qitem of qitems) {
      await mysql.squery("updateQitem", [
        qitem.survey_qitem_question,
        qitem.survey_qitem_type,
        qitem.survey_qitem_no,
      ]);
    }
  }
  return result;
};

module.exports = {
  findAll,
  findByNo,
  addSurvey,
  modifySurvey,
};
