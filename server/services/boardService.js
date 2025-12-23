// services/boardservice.js
const mysql = require("../database/mapper.js");

const findAll = async () => {
  let list = await mysql.bquery("selectAll");
  return list;
};
const findByNo = async (no) => {
  let post = await mysql.bquery("selectByNo", no);
  return post;
};

const postBoard = async (data) => {
  const { title, content, writer } = data;
  let result = await mysql.bquery("insertBoard", [title, writer, content]);
  return result.insertId;
};

const modifyBoard = async (no, data) => {
  const { title, writer, content } = data;
  let result = await mysql.bquery("updateBoard", [title, writer, content, no]);
  if (result.changedRows > 0) {
    return { msg: "게시글이 수정되었습니다.", status: "success" };
  } else {
    return { msg: "게시글이 수정되지않았습니다.", status: "fail" };
  }
};

const removeBoard = async (no) => {
  let result = await mysql.bquery("deleteBoard", no);
  console.log(result);
  if (result.affectedRows > 0) {
    return { msg: "게시글이 삭제되었습니다.", status: "success" };
  } else {
    return { msg: "게시글이 삭제되지 않았습니다.", status: "fail" };
  }
};

module.exports = {
  findAll,
  findByNo,
  postBoard,
  modifyBoard,
  removeBoard,
};
