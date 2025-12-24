const selectAllCenter = `select * from center`;
const searchAllCenter = `select * from center where ?? like concat('%', ?, '%')`;
module.exports = { selectAllCenter, searchAllCenter };
