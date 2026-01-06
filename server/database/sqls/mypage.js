// 담당자
// 담당자 정보
const selectMnagerById = `select * from member m
join center c on m.center_no = c.center_no
where member_id = ?`;

// 지원자 리스트
const selectDependantById = `select d.*, m.member_name manager_name, m2.member_name guardian_name, d2.disability_name from dependant d 
join member m on d.manager_main = m.member_id
join member m2 on d.member_id = m2.member_id
join disability d2 on d.disability_no = d2.disability_no 
where m.member_id =?`;

// 본인 정보변경
const updateManagerInfo = `update member set ? where member_id = ?`;

// 지원자 정보변경
const updateDependantInfo = `update (select * from dependant d1 join disability d2 on d1.disability_no = d2.disability_no where dependant_no = ?) set ? `;

module.exports = {
  selectMnagerById,
  selectDependantById,
  updateManagerInfo,
  updateDependantInfo,
};
