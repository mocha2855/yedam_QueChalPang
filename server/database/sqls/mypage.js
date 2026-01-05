// 담당자
// 담당자 정보
const selectMnagerById = `select * from member m
join center c on m.center_no = c.center_no
where member_id = ?`;

// 지원자 리스트
const selectDependantById = `select * from member m
join center c on m.center_no = c.center_no
join dependant d on m.member_id = d.manager_main or m.member_id = d.manager_sub
where m.member_id = ?`;

// 정보변경
const updateManagerInfo = `update member set ? where member_id = ?`;

module.exports = {
  selectMnagerById,
  selectDependantById,
  updateManagerInfo,
};
