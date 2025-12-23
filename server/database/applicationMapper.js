// mapper.js
require("dotenv").config();

const mysql = require("mysql2/promise");
const applicationSql = require("./sqls/applicationJH");
const boardSql = require("./sqls/boards");
const memberSql = require("./sqls/member.js");
const centerSql = require("./sqls/center.js");
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

//reservation - managerID, Date 두개 값 받아와야 함
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

const bquery = async (selected, values) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let executeSql = applicationSql[selected];
    console.log(executeSql);
    let result = (await conn.query(executeSql, values))[0];
    return result;
  } finally {
    if (conn) conn.release(); // pool로 반환.
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
const centerQuery = async (selected, values) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let executeSql = centerSql[selected];
    console.log("sql:", executeSql);
    console.log("value:", values);
    let result = (await conn.query(executeSql, values))[0];
    return result;
  } finally {
    if (conn) conn.release(); // pool로 반환.
  }
};
const memberQuery = async (selected, values) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let executeSql = memberSql[selected];
    let result = (await conn.query(executeSql, values))[0];
    return result;
  } finally {
    if (conn) conn.release(); // pool로 반환.
  }
};


module.exports = { bquery, rquery, squery, memberQuery, centerQuery };
