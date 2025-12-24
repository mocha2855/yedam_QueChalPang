// 접속자 권한 파악
const authoritySelectById = `select * from member where member_id = ?`;

// 대기 단계 상태 건색
const selectById = `select * 
from (select * from application where application_no = ?) a 
join (select * from reservation ) r on a.application_no = r.application_no`;

// 결재자 선택
const rejectorSelectById = `select member_name 
from member
where member_authority = 'a3'`;

// 대기단계 승인요청
const applicationUpdateInfo = `update application 
set status = ?, status_status
where application_no = ?`;

// 대기단계 반려사유
const statusRejectUpdateInfo = `update application set status_reject =?, status_status=? where application_no=?`;

// 대기단계 승인
const applicationSuccessUpdateInfo = `update application 
set status_status = ?
where application_no = ?`;

module.exports = {
  authoritySelectById,
  selectById,
  rejectorSelectById,
  applicationUpdateInfo,
  statusRejectUpdateInfo,
  applicationSuccessUpdateInfo,
};
