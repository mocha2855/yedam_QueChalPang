// sqls/comments.js
const selectAllComment = `select * from comment_tbl where bno=?`;
const test = `show tables`;
module.exports = { selectAllComment, test };
