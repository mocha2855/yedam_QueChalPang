// 전체 조회
const selectAll = `select b.*, ifnull(c.comment,0) comments from (select bno, count(bno) comment from comment_tbl group by bno) c
right join board_tbl b on c.bno = b.no`;

// 단건 조회
const selectById = ` SELECT no
                        , title
                        , writer
                        , content
                        , created_dt
                        , updated_dt
                     FROM board_tbl
                     WHERE no = ?`;

// 댓글 조회
const searchComment = `SELECT no
                        , writer
                        , content
                        , created_dt
                        , updated_dt
                        , bno
                   FROM comment_tbl
                   WHERE bno = ? `;

// 등록
const insertInfo = `insert into board_tbl (title, writer, content)
                   values(?, ?, ?)`;

//수정
const updateInfo = `update board_tbl
   SET title = ?
      , content = ?
      , writer = ?
WHERE no = ?`;

// 단건 삭제
const delInfo = `DELETE FROM board_tbl
WHERE no = ?`;
module.exports = {
  selectAll,
  selectById,
  insertInfo,
  updateInfo,
  delInfo,
  searchComment,
};
