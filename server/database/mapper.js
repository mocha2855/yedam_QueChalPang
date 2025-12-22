// mapper.js
const mysql = require("mysql2/promise");
const boardSql = require("./sqls/boards");
const commentSql = require("./sqls/comments");

const pool = mysql.createPool({
  host: `49.50.139.38`,
  user: `yedam01`,
  password: `yedam01`,
  database: `project`, //scheme 지정.
  connectionLimit: 5,
});

const bquery = async (selected, values) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let executeSql = boardSql[selected];
    console.log(executeSql);
    let result = (await conn.query(executeSql, values))[0];
    return result;
  } finally {
    if (conn) conn.release(); // pool로 반환.
  }
};
const cquery = async (selected, values) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let executeSql = commentSql[selected];
    let result = (await conn.query(executeSql, values))[0];
    return result;
  } finally {
    if (conn) conn.release(); // pool로 반환.
  }
};

module.exports = { bquery, cquery };
