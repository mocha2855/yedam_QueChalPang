const mysql = require("../database/mapper.js");

// 전체 조회
const findAll = async () => {
  let list = await mysql.query("selectAll");
  return list;
};

// 단건 조회
const findByBoardId = async (boardId) => {
  let info = (await mysql.query("selectById", boardId))[0];
  return info;
};

// 댓글 조회
const findComment = async (boardId) => {
  let info = await mysql.query("searchComment", boardId);
  return info;
};

// 등록
const addInfo = async (boardInfo) => {
  let { title, writer, content } = boardInfo;
  if (title == null) {
    return { status: "error", message: "title not found" };
  }
  let result = await mysql.query("insertInfo", [title, writer, content]);

  if (result.affectedRows > 0) {
    // insertId : autoIncreasement 일때
    return result.insertId;
  } else {
    return fail;
  }
};

// 수정
const modifyInfo = async (boardId, boardInfo) => {
  let { title, content, writer } = boardInfo;
  let result = await mysql.query("updateInfo", [
    title,
    content,
    writer,
    boardId,
  ]);
  let resObj = {};
  if (result.affectedRows > 0) {
    resObj = { status: "success", boardId: boardId };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};
// 게시글 단건 삭제 : delInfo, 필요값(boardId)
const removeInfo = async (boardId) => {
  let result = await mysql.query("delInfo", boardId);
  let resObj = {};
  if (result.affectedRows > 0) {
    resObj = { status: "success", boardId: boardId };
  } else {
    resObj = { status: "fail" };
  }
  return resObj;
};
module.exports = {
  findAll,
  findByBoardId,
  addInfo,
  modifyInfo,
  removeInfo,
  findComment,
};
