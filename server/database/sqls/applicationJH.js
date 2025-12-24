// 대기 단계 상태 건색
const selectById = `select * 
from (select * from application where application_no = ?) a 
join (select * from reservation where resv_status = 'f3') r on a.application_no = r.application_no`;

// 결재자 선택
const rejectorSelectById = `select member_name 
from member
where member_authority = 'a3'`;

const applicationUpdateInfo = `update application 
set status = ?
where application_no = ?`;

module.exports = {
  selectById,
  rejectorSelectById,
  applicationUpdateInfo,
};
