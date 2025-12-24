const selectAllCenter = `select * from center`;
const searchAllCenter = `select * from center where ?? like concat('%', ?, '%')`;
const insertCenterInfo = `insert into center(center_name,center_address,center_tel,center_email,center_start,center_lunch) values(?,?,?,?,now(),?)`;
module.exports = { selectAllCenter, searchAllCenter, insertCenterInfo };
