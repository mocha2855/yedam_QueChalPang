// mapper.js
require("dotenv").config();

const mysql = require("mysql2/promise");
const boardSql = require("./sqls/boards");
const commentSql = require("./sqls/comments");
console.log(process.env.MARIADB_HOST);
const pool = mysql.createPool({
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USERNAME,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DB, //scheme 지정.
  connectionLimit: process.env.MARIADB_LIMIT,
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
