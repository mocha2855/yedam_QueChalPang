// 지원자 정보
const selectMnagerById = `select * from member m
join center c on m.center_no = c.center_no
join dependant d on m.member_id = d.manager_main or m.member_id = d.manager_sub
where m.member_id = ?`;

module.exports = {
  selectMnagerById,
};
