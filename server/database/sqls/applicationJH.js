// 지원자 정보
const dependantSelectById = `select d1.*,d2.*, m.*, m2.member_name "manager_name" 
from dependant d1
join disability d2 on d1.disability_no = d2.disability_no
join member m on d1.member_id = m.member_id
join member m2 on d1.manager_main = m2.member_id
where d1.dependant_no=?`;

//대기단계 선택시 상태확인
const selectById = `
  SELECT
    a.*,
    COALESCE(r.manager_id, d.manager_main) AS manager_id,
    r.resv_status,
    r.created_at
  FROM application a
  JOIN dependant d
    ON d.dependant_no = a.dependant_no
  LEFT JOIN reservation r
    ON r.application_no = a.application_no
  WHERE a.application_no = ?
  ORDER BY r.created_at DESC
  LIMIT 1
`;

//결재자 선택
const rejectorSelectById = `
SELECT member_name 
FROM member
WHERE member_authority = 'a3'`;

//담당자 대기단계 승인요청
const applicationUpdateInfo = `
UPDATE application
SET 
  status = ?, 
  status_status = 'i1'
WHERE application_no = ?
`;

//(관리자가) 대기단계 승인하기 
const approveStatus = ` 
  UPDATE application
  SET           
      status_status = 'i2',
      status_reject = NULL,
      application_rejector=?
  WHERE application_no = ?
`;

//(관리자가) 대기단계 반려하기 
const rejectStatus = `
  UPDATE application
  SET 
      status = 'e1', 
      status_reject = ?,
      status_status = 'i3',
      application_rejector=?
  WHERE application_no = ?;
`;

// 지원계획서 갯수 파악
const selectPlanningById = `select count(*) counts from planning where application_no=?`;

// 검토 중, 반려, 승인 지원계획서 불러오기
const selectPlanningReviewById = `select *, rank() over (order by planning_date) ranking from planning where application_no =?`;

// 지원계획서 승인요청(담당자)
const insertPlannginInfo = `insert into planning set ?`;

// 지원계획서 승인 및 재승인
const sucessPlanningUpdateInfo = `update planning 
set ?
where planning_no = ?`;

// 지원계획서 반려
const rejectPlanningUpdateInfo = `update planning 
set planning_reject_date = current_timestamp(), planning_approvedDate = current_timestamp(), ?
where planning_no = ?`;

// 지원계획서 반려 후 승인요청(담당자)
const changingPlanningUpdateInfo = `update planning 
set ?
where planning_no = ?`;

// 지원현황에서 목록 불러오기(일반사용자)
const selectApplicationsById = `select a.dependant_no,dependant_name,survey_no,a.member_id,application_date,status,(select member_name from member where member_id=application_rejector) as application_rejector,status_reject,status_status 
from application a 
join dependant d on d.dependant_no = a.dependant_no 
where ?? like concat('%',?,'%') and a.member_id = ?`;

// 지원현황에서 목록 불러오기(담당자)
const selectApplicationsById2 = `select a.dependant_no,dependant_name,survey_no,a.member_id,application_date,status,(select member_name from member where member_id=application_rejector) as application_rejector,status_reject,status_status 
from application a 
join dependant d on d.dependant_no = a.dependant_no 
where ?? like concat('%',?,'%') and d.manager_main = ?`;

// 지원신청서 등록
const insertApplication = `insert into application(dependant_no,survey_no,member_id,application_date,status) values (?,?,?,now(),'e1')`;

// 지원신청서 조사지 답변 등록
const insertAppAnswer = `insert into app_answer(survey_qitem_no,application_no,app_answer_type,app_date,app_reason) values ? `;

// 등록된 지원신청서 정보 가져오기
const selectAppByNo = `
SELECT s.survey_no,
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
        q.survey_qitem_type,
        a.app_answer_no,
        a.app_answer_type,
        a.app_date,
        a.app_reason,
        (select dependant_no from application aa where application_no = a.application_no)as dependant_no,
        (select status from application aa where application_no = a.application_no) as status

FROM survey s 
  JOIN survey_title t on s.survey_no = t.survey_no 
  JOIN survey_subtitle ss ON t.survey_title_no = ss.survey_title_no 
  JOIN survey_qitem q ON ss.survey_subtitle_no = q.survey_subtitle_no 
  JOIN app_answer a ON a.survey_qitem_no = q.survey_qitem_no
WHERE a.application_no=?
`;

//지원현황 목록 불러오기 (담당자) DJ - dependant 기준으로
const selectApplicationsByTeacher = `
  SELECT
    a.application_no,
    d.dependant_no,
    d.dependant_name,

    g.member_name AS guardian_name,
    t.member_name AS manager_name,

    a.application_date,
    a.status,
    a.status_status,

    COALESCE(p.p_i1, 0) AS p_i1,
    COALESCE(p.p_i2, 0) AS p_i2,
    COALESCE(p.p_i3, 0) AS p_i3,

    COALESCE(r2.r_i1, 0) AS r_i1,
    COALESCE(r2.r_i2, 0) AS r_i2,
    COALESCE(r2.r_i3, 0) AS r_i3,

    COALESCE(m.meetingCount, 0) AS meetingCount

  FROM application a
  JOIN dependant d
    ON d.dependant_no = a.dependant_no
  JOIN member g
    ON g.member_id = d.member_id
  LEFT JOIN member t
    ON t.member_id = d.manager_main

  LEFT JOIN (
    SELECT
      application_no,
      SUM(planning_status = 'i1') AS p_i1,
      SUM(planning_status = 'i2') AS p_i2,
      SUM(planning_status = 'i3') AS p_i3
    FROM planning
    GROUP BY application_no
  ) p ON p.application_no = a.application_no

  LEFT JOIN (
    SELECT
      pl.application_no,
      SUM(r.result_status = 'i1') AS r_i1,
      SUM(r.result_status = 'i2') AS r_i2,
      SUM(r.result_status = 'i3') AS r_i3
    FROM \`result\` r
    JOIN planning pl
      ON pl.planning_no = r.planning_no
    GROUP BY pl.application_no
  ) r2 ON r2.application_no = a.application_no

  LEFT JOIN (
    SELECT
      application_no,
      COUNT(*) AS meetingCount
    FROM reservation
    GROUP BY application_no
  ) m ON m.application_no = a.application_no

  WHERE d.manager_main = ?
     OR d.manager_sub  = ?
  ORDER BY a.application_date DESC
`;

//지원현황 목록 불러오기 (관리자) DJ
const selectApplicationsByAdmin = `
SELECT
    a.application_no,
    d.dependant_no,
    d.dependant_name,
    g.member_name AS guardian_name,
    t.member_name AS manager_name,
    a.application_date,
    a.status,
    a.status_status,

    (SELECT COUNT(*)
       FROM planning
      WHERE application_no = a.application_no
        AND planning_status = 'i1') AS p_i1,

    (SELECT COUNT(*)
       FROM planning
      WHERE application_no = a.application_no
        AND planning_status = 'i2') AS p_i2,

    (SELECT COUNT(*)
       FROM planning
      WHERE application_no = a.application_no
        AND planning_status = 'i3') AS p_i3,

    (SELECT COUNT(*)
       FROM result r
       JOIN planning p ON r.planning_no = p.planning_no
      WHERE p.application_no = a.application_no
        AND r.result_status = 'i1') AS r_i1,

    (SELECT COUNT(*)
       FROM result r
       JOIN planning p ON r.planning_no = p.planning_no
      WHERE p.application_no = a.application_no
        AND r.result_status = 'i2') AS r_i2,

    (SELECT COUNT(*)
       FROM result r
       JOIN planning p ON r.planning_no = p.planning_no
      WHERE p.application_no = a.application_no
        AND r.result_status = 'i3') AS r_i3,

    (SELECT COUNT(*)
       FROM reservation
      WHERE application_no = a.application_no) AS meetingCount

FROM application a

JOIN dependant d ON a.dependant_no = d.dependant_no
JOIN member g    ON d.member_id    = g.member_id     
JOIN member t    ON d.manager_main = t.member_id     

JOIN member admin
  ON admin.center_no = t.center_no
 AND admin.member_id = ?

ORDER BY a.application_date DESC
`;

// 검토 중, 반려, 승인 지원결과서 불러오기
const selectResultReviewById = `select r.*, p.ranking, m.member_name manager_name, m2.member_name rejecter_name
from (select *, rank() over (order by planning_date) ranking from planning where application_no = ?) p
join result r on p.planning_no = r.planning_no
join member m on r.planning_id = m.member_id
join member m2 on r.planning_rejecter = m2.member_id
`;

// 지원결과서 승인요청(담당자)
const insertResultInfo = `insert into result set ?`;

// 지원결과서 승인 및 재승인
const sucessResultUpdateInfo = `update result
set ?
where result_no = ?`;

// 지원결과서 반려
const rejectResultUpdateInfo = `update result 
set result_reject_date = current_timestamp(), result_approvedDate = current_timestamp(), ?
where result_no = ?`;

// 지원결과서 반려 후 승인요청(담당자)
const changingResultUpdateInfo = `update result 
set ?
where result_no = ?`;

module.exports = {
  dependantSelectById,
  selectById,
  rejectorSelectById,
  applicationUpdateInfo,
  selectPlanningById,
  selectPlanningReviewById,
  insertPlannginInfo,
  sucessPlanningUpdateInfo,
  rejectPlanningUpdateInfo,
  changingPlanningUpdateInfo,
  selectApplicationsById,
  selectResultReviewById,
  insertResultInfo,
  sucessResultUpdateInfo,
  rejectResultUpdateInfo,
  changingResultUpdateInfo,
  selectApplicationsById2,
  insertApplication,
  insertAppAnswer,
  selectApplicationsByTeacher,
  selectAppByNo,
  selectApplicationsByAdmin,
  approveStatus,
  rejectStatus,
};
