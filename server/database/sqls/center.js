const selectAllCenter = `select center_no,center_name,replace(center_address,'|','') as center_address,center_tel,center_email,center_status,center_end,center_lunch from center`;
const selectByCenterNo = `select center_name,center_address,nvl(center_tel,'연락처 없음') as center_tel, center_email, center_status, center_start, center_end, center_lunch 
from center 
where center_no=?`;
const searchAllCenter = `select center_no,center_name,replace(center_address,'|','') as center_address,center_tel,center_email,center_status,center_end,center_lunch from center where ?? like concat('%', ?, '%') AND center_status in (?)`;
const searchCenterName = `select count(*) as count from center where center_name = ?`;
const insertCenterInfo = `insert into center(center_name,center_address,center_tel,center_email,center_start,center_lunch) values(?,?,?,?,now(),?)`;
const updateCenterInfo = `update center set center_name= ?, center_email=?, center_address=?, center_tel=?, center_lunch=? where center_no = ? `;
const endCenter = `update center set center_status='b2', center_end=now() where center_no = ? `;
// 상태 필터 없는 전체 센터 조회
const selectAllCenterWithoutBadge = `
  SELECT center_no, center_name, 
         REPLACE(center_address,'|','') as center_address,
         center_tel, center_email, center_status, center_end, center_lunch 
  FROM center 
  WHERE ?? LIKE CONCAT('%', ?, '%')
`;
module.exports = {
  selectAllCenter,
  searchAllCenter,
  insertCenterInfo,
  selectByCenterNo,
  searchCenterName,
  updateCenterInfo,
  endCenter,
  selectAllCenterWithoutBadge,
};
