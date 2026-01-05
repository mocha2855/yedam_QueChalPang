// 지원자 정보
const dependantSelectById = `select * 
from dependant d1
join disability d2 on d1.disability_no = d2.disability_no
join member m on d1.member_id = m.member_id
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
};
