// 대기 단계 상태 건색
const selectById = `select * 
from (select * from application where application_no = ?) a 
join (select * from reservation) r on a.application_no = r.application_no`;

// 결재자 선택
const rejectorSelectById = `select member_name 
from member
where member_authority = 'a3'`;

module.exports = {
  selectById,
  rejectorSelectById,
};
