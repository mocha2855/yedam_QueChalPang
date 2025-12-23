const selectAllMember = `select * from member`;
const selectByMemberId = `select member_id,member_name,member_confirm,member_authority from member where member_id = ?`;
const countByMemberPass = `select count(*) as count from member where member_id=? and member_pass=sha2(?,256)`;
const countByMemberId = `select count(*) as count from member where member_id=?`;
const countByMemberEmail = `select count(*) as count from member where member_email=?`;
const insertMemberInfo = `insert into member(member_id,member_pass,member_name,member_email,member_phone,member_address,center_no,member_authority) values(?,sha2(?,256),?,?,?,?,?,?)`;
module.exports = {
  selectAllMember,
  selectByMemberId,
  countByMemberPass,
  countByMemberId,
  countByMemberEmail,
  insertMemberInfo,
};
