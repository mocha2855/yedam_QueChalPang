//services/surveyService.js
const mysql = require("../database/applicationMapper.js");

//survey 전체 조회
const findAll = async () => {
  let list = await mysql.squery("selectAll");
  return list;
};
//survey 단건 조회(안써도 될거 같음)
const findByNo = async (no) => {
  let post = await mysql.squery("selectByNo", [no]);
  return post;
};
// survey 단건 등록(새로운 버전 업그레이드)
const addSurvey = async (data) => {
  const { survey_no, survey_version, survey_start, survey_end, titles } = data;

  let result = await mysql.squery("insertSurvey", [
    survey_no,
    survey_version,
    survey_start,
    survey_end,
  ]);

  for (let title of titles) {
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
  }
  return result.insertId;
};

//survey 수정

module.exports = {
  findAll,
  findByNo,
  addSurvey,
};
