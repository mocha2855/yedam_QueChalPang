// sqls/boards.js
const selectAll = `select a.no,a.title,a.writer,a.content,a.created_dt as created_date,(select count(*) from comment_tbl as b where bno=a.no) as comment_count from BOARD_TBL as a order by a.no`;
const selectByNo = `select no,title,writer,content,created_dt as created_date from board_tbl where no = ?`;
const insertBoard = `insert into board_tbl(TITLE,WRITER,CONTENT,created_dt)
                      values (?,?,?,current_timestamp);`;
const updateBoard = `update board_tbl set title=?,writer=?,content=?,updated_dt=current_timestamp where no=?; `;
const deleteBoard = `delete from board_tbl where no = ?`;
module.exports = {
  selectAll,
  selectByNo,
  insertBoard,
  updateBoard,
  deleteBoard,
};
