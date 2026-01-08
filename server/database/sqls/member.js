const selectAllMember = `select * from member`;
const selectByMemberId = `
SELECT m.member_id, m.member_email, m.member_phone,m.member_address,m.member_name,m.member_confirm,m.member_authority,m.center_no,c.center_name
FROM member m 
LEFT JOIN center c ON m.center_no = c.center_no
WHERE member_id = ?`;
const selectByMemberNameAndPhone = `
select member_id 
from member 
where member_name=? 
and member_phone=?`;
const countByMemberIdAndPhone = `
select count(*) as count 
from member 
where member_id=? 
and member_phone=?`;
const countByMemberNameAndPhone = `
select count(*) as count 
from member 
where member_name=? 
and member_phone=?`;
const countByMemberPass = `
select count(*) as count 
from member 
where member_id=? 
and member_pass=sha2(?,256)`;
const countByMemberId = `
select count(*) as count 
from member 
where member_id=?`;
const countByMemberEmail = `
select count(*) as count 
from member 
where member_email=?`;
const countByMemberPhone = `
select count(*) as count 
from member 
where member_phone=?`;
const insertMemberInfo = `
insert into 
member(member_id,member_pass,member_name,member_email,member_phone,member_address,center_no,member_authority,member_confirm) 
values(?,sha2(?,256),?,?,?,?,?,?,'l2')`;
const insertSmsInfo = `insert into sms(sms_no) values (?)`;
const selectBySmsId = `select count(*) as count from sms where sms_id = ? and sms_no = ? and sms_created_at >= now() - interval 3 minute`;
const deleteOver3m = `call delete_over_3m`;
const updatePassword = `update member set member_pass=sha2(?,256) where member_id=?`;
const selectDependants = `
select dependant_address,
dependant_birth,
dependant_date,
dependant_name,
dependant_no,
dependant_gender,
(select disability_name from disability where disability_no = d.disability_no) as disability_name,
manager_main,
manager_sub,
(select member_name from member where member_id=d.member_id) as member_name,
(select min(status) from application where dependant_no=d.dependant_no) as status
from dependant d where d.member_id=?`;
const selectDependants2 = `select dependant_address,
dependant_birth,
dependant_date,
dependant_name,
dependant_no,
dependant_gender,
(select disability_name from disability where disability_no = d.disability_no) as disability_name,
manager_main,
manager_sub,
(select member_name from member where member_id=d.member_id) as member_name,
(select min(status) from application where dependant_no=d.dependant_no) as status
from dependant d where d.manager_main=?
`;
//회원가입 시 승인/대기
// 승인 관리 목록 조회
const selectMemberApproval = `
  SELECT m.*, c.center_name
  FROM member m 
  LEFT JOIN center c on m.center_no = c.center_no
  WHERE m.member_authority in ('a1','a2','a3')
  AND m.member_confirm != 'l4'
  ORDER BY m.member_date DESC
`;

// 회원 승인 처리 (l2 -> l1 or l3)
const updateMemberConfirm = `
  UPDATE member 
  SET member_confirm = ?
  WHERE member_id = ?
`;

// 승인 대기 건수
const countPendingMembers = `
  SELECT count(*) as count from member 
  WHERE member_confirm = 'l2' 
  AND member_authority in ('a1','a2','a3')
  AND member_confirm != 'l4'
`;
//승인 거절 건수
const countRejectedMembers = `
  SELECT count(*) as count from member 
  WHERE member_confirm = 'l3' 
  AND member_authority in ('a1','a2','a3')
  AND member_confirm != 'l4'

`;

// 회원 정보 수정 (비밀번호 포함)
const updateMemberInfo = `
  UPDATE member 
  SET 
    member_name = ?,
    member_email = ?,
    member_phone = ?,
    member_address = ?,
    center_no = ?,
    member_authority = ?,
    member_pass = SHA2(?, 256)
  WHERE member_id = ?
`;

// 회원 정보 수정 (비밀번호 제외)
const updateMemberInfoPassword = `
  UPDATE member 
  SET 
    member_name = ?,
    member_email = ?,
    member_phone = ?,
    member_address = ?,
    center_no = ?,
    member_authority = ?
  WHERE member_id = ?
`;

// 삭제 (상태 변경)
const deleteMemberById = `
  UPDATE member 
  SET member_confirm = 'l4'
  WHERE member_id = ?
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
  countByMemberIdAndPhone,
  updatePassword,
  selectMemberApproval,
  updateMemberConfirm,
  countPendingMembers,
  selectDependants,
  countRejectedMembers,
  updateMemberInfo,
  updateMemberInfoPassword,
  deleteMemberById,
  selectDependants2,
};
