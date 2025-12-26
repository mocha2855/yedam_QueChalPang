const selectAllMember = `select * from member`;
const selectByMemberId = `select member_id,member_name,member_confirm,member_authority from member where member_id = ?`;
const countByMemberPass = `select count(*) as count from member where member_id=? and member_pass=sha2(?,256)`;
const countByMemberId = `select count(*) as count from member where member_id=?`;
const countByMemberEmail = `select count(*) as count from member where member_email=?`;
const countByMemberPhone = `select count(*) as count from member where member_phone=?`;
const insertMemberInfo = `insert into member(member_id,member_pass,member_name,member_email,member_phone,member_address,center_no,member_authority) values(?,sha2(?,256),?,?,?,?,?,?)`;
const insertSmsInfo = `insert into sms(sms_no) values (?)`;
const selectBySmsId = `select count(*) as count from sms where sms_id = ? and sms_no = ? and sms_created_at >= now() - interval 3 minute`;
const deleteOver3m = `call delete_over_3m`;
module.exports = {
  selectAllMember,
  selectByMemberId,
  countByMemberPass,
  countByMemberId,
  countByMemberEmail,
  insertMemberInfo,
  countByMemberPhone,
  insertSmsInfo,
  selectBySmsId,
  deleteOver3m,
};
