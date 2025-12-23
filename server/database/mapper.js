// mapper.js
require("dotenv").config();

const mysql = require("mysql2/promise");
const boardSql = require("./sqls/boards");
const resvSql = require("./sqls/reservation");
const surveySql = require("./sqls/survey");

console.log(process.env.MARIADB_HOST);

const pool = mysql.createPool({
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USERNAME,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DB, //scheme 지정.
  connectionLimit: process.env.MARIADB_LIMIT,
});

//reservation
const rquery = async (sql, params = []) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query(sql, params);
    return rows;
  } finally {
    if (conn) conn.release(); // pool로 반환.
  }
};

//-----------------------------------------------
const bquery = async (selected, values) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let executeSql = sqlList[selected];
    console.info(selected, executeSql);
    let result = (await conn.query(executeSql, values))[0];
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.release(); //release: 반환
  }
};

//survey 쿼리
const squery = async (selected, values) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let executeSql = surveySql[selected];
    let result = (await conn.query(executeSql, values))[0];
    return result;
  } finally {
    if (conn) conn.release(); // pool로 반환.
  }
};

module.exports = { bquery, rquery, squery };
