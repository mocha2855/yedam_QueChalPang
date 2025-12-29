const selectAllCenter = `select * from center`;
const selectByCenterNo = `select center_name,center_address,nvl(center_tel,'연락처 없음') as center_tel, center_email, center_status, center_start, center_end, center_lunch 
from center 
where center_no=?`;
const searchAllCenter = `select * from center where ?? like concat('%', ?, '%')`;
const searchCenterName = `select count(*) as count from center where center_name = ?`;
const insertCenterInfo = `insert into center(center_name,center_address,center_tel,center_email,center_start,center_lunch) values(?,?,?,?,now(),?)`;
module.exports = {
  selectAllCenter,
  searchAllCenter,
  insertCenterInfo,
  selectByCenterNo,
  searchCenterName,
};
