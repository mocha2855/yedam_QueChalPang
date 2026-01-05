// 지원자 정보
const dependantSelectById = `select d1.*,d2.*, m.*, m2.member_name "manager_name" 
from dependant d1
join disability d2 on d1.disability_no = d2.disability_no
join member m on d1.member_id = m.member_id
join member m2 on d1.manager_main = m2.member_id
where d1.dependant_no=?`;

// 대기 단계 상태 건색
const selectById = `select * 
from (select * from application where application_no = ?) a 
join reservation r on a.application_no = r.application_no order by r.created_at desc limit 1`;

// 결재자 선택
const rejectorSelectById = `select member_name 
from member
where member_authority = 'a3'`;

// 대기단계 승인요청
const applicationUpdateInfo = `update application set status = ?, status_status = 'i1' where application_no = ?`;

// 대기단계 반려사유
const statusRejectUpdateInfo = `update application set status_reject =?, status_status='i3' where application_no=?`;

// 대기단계 승인 및 재승인
const applicationSuccessUpdateInfo = `update application 
set status_status = ?, status_reject = ?
where application_no = ?`;

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

//지원현황 목록 불러오기 (담당자) DJ
// 지원현황 목록 불러오기 (담당자) - 계획서/결과서 상태 카운트 포함
const selectApplicationsByTeacher = `
SELECT
  a.application_no,
  a.dependant_no,
  d.dependant_name,
  g.member_name AS guardian_name,
  t.member_name AS manager_name,
  a.application_date,
  a.status,
  a.status_reject,
  a.status_status,

  COALESCE(p.p_i1, 0) AS p_i1,
  COALESCE(p.p_i2, 0) AS p_i2,
  COALESCE(p.p_i3, 0) AS p_i3,

  COALESCE(r.r_i1, 0) AS r_i1,
  COALESCE(r.r_i2, 0) AS r_i2,
  COALESCE(r.r_i3, 0) AS r_i3

FROM application a
JOIN dependant d
  ON d.dependant_no = a.dependant_no
JOIN member g
  ON g.member_id = a.member_id
LEFT JOIN member t
  ON t.member_id = d.manager_main

LEFT JOIN (
  SELECT
    application_no,
    SUM(CASE WHEN planning_status = 'i1' THEN 1 ELSE 0 END) AS p_i1,
    SUM(CASE WHEN planning_status = 'i2' THEN 1 ELSE 0 END) AS p_i2,
    SUM(CASE WHEN planning_status = 'i3' THEN 1 ELSE 0 END) AS p_i3
  FROM planning
  GROUP BY application_no
) p
  ON p.application_no = a.application_no

LEFT JOIN (
  SELECT
    p2.application_no,
    SUM(CASE WHEN r2.result_status = 'i1' THEN 1 ELSE 0 END) AS r_i1,
    SUM(CASE WHEN r2.result_status = 'i2' THEN 1 ELSE 0 END) AS r_i2,
    SUM(CASE WHEN r2.result_status = 'i3' THEN 1 ELSE 0 END) AS r_i3
  FROM result r2
  JOIN planning p2
    ON p2.planning_no = r2.planning_no
  GROUP BY p2.application_no
) r
  ON r.application_no = a.application_no

WHERE d.manager_main = ?
   OR d.manager_sub  = ?
ORDER BY a.application_date DESC
`;

//드롭다운용 - 지원자별 신청서 목록 DJ
const selectAppsByDependant = `
  SELECT application_no, application_date
  FROM application
  WHERE dependant_no = ?
  ORDER BY application_date DESC
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
  statusRejectUpdateInfo,
  applicationSuccessUpdateInfo,
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
  selectApplicationsByTeacher,
  selectAppsByDependant,
};
