//services/surveyService.js
const mysql = require("../database/mapper.js");

//survey 전체 조회
const findAll = async () => {
  let list = await mysql.squery("selectAll");
  return list;
};
//survey 단건 조회
const findByNo = async (no) => {
  let titleResult = await mysql.squery("selectTitle", [no]);
  let title = titleResult[0];
  let qitem = await mysql.squery("selectQitem", [no]);
  let detail = await mysql.squery("selectDetail", [no]);

  // 세부항목에 questionList 만들기
  detail.map((d) => {
    d.questionList = [];
  });
  qitem.forEach((q) => {
    detail
      .find((d) => d.survey_subtitle_no == q.survey_subtitle_no)
      .questionList.push(q);
  });
  //항목에 세부항목 담기
  title.subtitles = detail;

  return title;
};
// survey 단건 등록(새로운 버전 업그레이드)
//질문추가 &  항목 추가시 기존 버전 비활성 -> 새버전 활성화
const addSurvey = async (data) => {
  const survey_start = new Date(); //날짜 자동화
  const survey_end = new Date("9999-12-31"); // 끝나는 시간은 무기한 연장(새버전 등장 시 자동 마무리 시간 계산)

  //insert 시 버전 자동 증가
  let versionResult = await mysql.squery("selectMaxVersionAll");
  let survey_version = versionResult[0]?.max_version
    ? (parseFloat(versionResult[0].max_version) + 0.1).toFixed(1)
    : "1.0";

  await mysql.squery("updateSurvey");

  //새 버전 insert
  let insertResult = await mysql.squery("insertSurvey", [
    survey_version,
    survey_start,
    survey_end,
  ]);
  let survey_no = insertResult.insertId;

  let titleResult = await mysql.squery("insertSurveyTitle", [
    survey_no,
    data.title,
  ]);
  let survey_title_no = titleResult.insertId;

  for (const subtitleData of data.subtitles) {
    // 세부항목 저장
    let subtitleResult = await mysql.squery("insertSurveySubtitle", [
      survey_title_no,
      subtitleData.subtitle,
      subtitleData.subtitleDetail,
    ]);
    let survey_subtitle_no = subtitleResult.insertId;

    //질문 저장
    for (const question of subtitleData.questions) {
      await mysql.squery("insertSurveyQitem", [
        survey_subtitle_no,
        question.text,
        question.type,
        question.need_detail || false,
      ]);
    }
  }
  return survey_no;
};

//survey 수정
const modifySurvey = async (no, data) => {
  const {
    survey_title_no,
    survey_title,
    survey_no,
    person,
    reason,
    subtitles,
  } = data;

  //수정이력 저장
  let result = await mysql.squery("insertSurveyHistory", [
    null,
    survey_no,
    person,
    reason,
  ]);

  // 실제 데이터 수정
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

      if (subtitle.questionList) {
        for (const question of subtitle.questionList) {
          await mysql.squery("updateQitem", [
            question.survey_qitem_question,
            question.survey_qitem_type,
            question.need_detail || false,
            question.survey_qitem_no,
          ]);
        }
      }
    }
  }

  return result;
};
// 지원신청서 등록용 전체 조사지 조회(활성화상태)
const findAllSurveys = async () => {
  let result = await mysql.squery("selectAllSurveys");
  // console.log(result);
  return result;
};

module.exports = {
  findAll,
  findByNo,
  addSurvey,
  modifySurvey,
  findAllSurveys,
};
