// 일반사용자 - 확정된 상담예약 개수 (24시간 이내만DATE_SUB(NOW(), INTERVAL 1 DAY))
const getConfirmedReservationsCount = `
  SELECT COUNT(*) as cnt 
  FROM reservation 
  WHERE guardian_id = ? 
    AND resv_status = 'f2'
    AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)
`;

// 일반사용자 - 승인된 신청서 개수 (24시간 이내만)
const getApprovedApplicationsCount = `
  SELECT COUNT(*) as cnt 
  FROM application 
  WHERE member_id = ? 
    AND status_status = 'i2'
    AND application_date > DATE_SUB(NOW(), INTERVAL 1 DAY)
`;

// 담당자 - 담당 지원계획서 중 검토중인 것 (24시간 이내만)
const getManagerPendingPlansCount = `
  SELECT COUNT(*) as cnt 
  FROM planning p
  JOIN application a ON p.application_no = a.application_no
  JOIN dependant d ON a.dependant_no = d.dependant_no
  WHERE (d.manager_main = ? OR d.manager_sub = ?) 
    AND p.planning_status = 'i1'
    AND p.planning_date > DATE_SUB(NOW(), INTERVAL 1 DAY)
`;

// 담당자 - 담당 상담예약 중 확인 대기중인 것 (24시간 이내만)
const getManagerPendingReservationsCount = `
  SELECT COUNT(*) as cnt 
  FROM reservation 
  WHERE manager_id = ? 
    AND resv_status = 'f1'
    AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)
`;

// 관리자/시스템관리자 - 전체 승인 대기 신청서 (24시간 이내만)
const getAllPendingApplicationsCount = `
  SELECT COUNT(*) as cnt 
  FROM application 
  WHERE status_status = 'i1'
    AND application_date > DATE_SUB(NOW(), INTERVAL 1 DAY)
`;

//알림목록
// 일반사용자 - 확정된 상담예약 목록 (24시간 이내만)
const getConfirmedReservationsList = `
  SELECT 
    r.resv_id,
    d.dependant_name,
    r.start_at,
    r.created_at,
    'reservation' as type,
    '상담예약이 확정되었습니다' as message
  FROM reservation r
  JOIN dependant d ON r.dependant_no = d.dependant_no
  WHERE r.guardian_id = ? 
    AND r.resv_status = 'f2'
    AND r.created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)
  ORDER BY r.created_at DESC
`;

// 일반사용자 - 승인된 신청서 목록 (24시간 이내만)
const getApprovedApplicationsList = `
  SELECT 
    a.application_no,
    d.dependant_name,
    a.application_date,
    'application' as type,
    '지원신청서가 승인되었습니다' as message
  FROM application a
  JOIN dependant d ON a.dependant_no = d.dependant_no
  WHERE a.member_id = ? 
    AND a.status_status = 'i2'
    AND a.application_date > DATE_SUB(NOW(), INTERVAL 1 DAY)
  ORDER BY a.application_date DESC
`;

// 담당자 - 검토중인 지원계획서 목록 (24시간 이내만)
const getManagerPendingPlansList = `
  SELECT 
    p.planning_no,
    d.dependant_name,
    p.planning_date,
    'planning' as type,
    '지원계획서 검토 요청이 있습니다' as message
  FROM planning p
  JOIN application a ON p.application_no = a.application_no
  JOIN dependant d ON a.dependant_no = d.dependant_no
  WHERE (d.manager_main = ? OR d.manager_sub = ?) 
    AND p.planning_status = 'i1'
    AND p.planning_date > DATE_SUB(NOW(), INTERVAL 1 DAY)
  ORDER BY p.planning_date DESC
`;

// 담당자 - 확인 대기중인 상담예약 목록 (24시간 이내만)
const getManagerPendingReservationsList = `
  SELECT 
    r.resv_id,
    d.dependant_name,
    r.start_at,
    r.created_at,
    'reservation_pending' as type,
    '새로운 상담예약 신청이 있습니다' as message
  FROM reservation r
  JOIN dependant d ON r.dependant_no = d.dependant_no
  WHERE r.manager_id = ? 
    AND r.resv_status = 'f1'
    AND r.created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)
  ORDER BY r.created_at DESC
`;

// 관리자 - 승인 대기중인 신청서 목록 (24시간 이내만)
const getAllPendingApplicationsList = `
  SELECT 
    a.application_no,
    d.dependant_name,
    a.application_date,
    'application_pending' as type,
    '지원신청서 승인 요청이 있습니다' as message
  FROM application a
  JOIN dependant d ON a.dependant_no = d.dependant_no
  WHERE a.status_status = 'i1'
    AND a.application_date > DATE_SUB(NOW(), INTERVAL 1 DAY)
  ORDER BY a.application_date DESC
`;

// 시스템관리자 - 승인 대기중인 회원 개수 (24시간 이내만)
const getPendingMembersCount = `
  SELECT COUNT(*) as cnt 
  FROM member 
  WHERE member_confirm = 'l2'
    AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)
`;

// 시스템관리자 - 승인 대기중인 회원 목록 (24시간 이내만)
const getPendingMembersList = `
  SELECT 
    member_id,
    member_name,
    member_authority,
    created_at,
    'member_pending' as type,
    '새로운 회원가입 승인 요청이 있습니다' as message
  FROM member
  WHERE member_confirm = 'l2'
    AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)
  ORDER BY created_at DESC
`;

module.exports = {
  getConfirmedReservationsCount,
  getApprovedApplicationsCount,
  getManagerPendingPlansCount,
  getManagerPendingReservationsCount,
  getAllPendingApplicationsCount,
  // 목록 조회용 추가
  getConfirmedReservationsList,
  getApprovedApplicationsList,
  getManagerPendingPlansList,
  getManagerPendingReservationsList,
  getAllPendingApplicationsList,
  getPendingMembersCount,
  getPendingMembersList,
};
