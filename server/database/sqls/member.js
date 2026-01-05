const selectAllMember = `select * from member`;
const selectByMemberId = `select member_id,member_name,member_confirm,member_authority,center_no from member where member_id = ?`;
const selectByMemberNameAndPhone = `select member_id from member where member_name=? and member_phone=?`;
const countByMemberNameAndPhone = `select count(*) as count from member where member_name=? and member_phone=?`;
const countByMemberPass = `select count(*) as count from member where member_id=? and member_pass=sha2(?,256)`;
const countByMemberId = `select count(*) as count from member where member_id=?`;
const countByMemberEmail = `select count(*) as count from member where member_email=?`;
const countByMemberPhone = `select count(*) as count from member where member_phone=?`;
const insertMemberInfo = `insert into member(member_id,member_pass,member_name,member_email,member_phone,member_address,center_no,member_authority) values(?,sha2(?,256),?,?,?,?,?,?)`;
const insertSmsInfo = `insert into sms(sms_no) values (?)`;
const selectBySmsId = `select count(*) as count from sms where sms_id = ? and sms_no = ? and sms_created_at >= now() - interval 3 minute`;
const deleteOver3m = `call delete_over_3m`;

//회원가입 시 승인/대기
// 승인 관리 목록 조회
const selectMemberApproval = `
  select * from member 
  where member_authority in ('u1','a3')
`;

// 회원 승인 처리 (l2 -> l1)
const updateMemberConfirm = `
  update member 
  set member_confirm = ?, member_updated_at = now()
  where member_id = ?
`;

// 승인 대기 건수
const countPendingMembers = `
  select count(*) as count from member 
  where member_confirm = 'l2' 
  and member_authority in ('u1','a3')
`;
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
  countByMemberNameAndPhone,
  selectByMemberNameAndPhone,
  selectMemberApproval,
  updateMemberConfirm,
  countPendingMembers,
};
