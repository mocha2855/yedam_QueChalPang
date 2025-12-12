const mysql = require("mysql2/promise");
const sqlList = require("./sqls/boards.js");

const pool = mysql.createPool({
  host: "localhost",
  user: "dev01",
  password: "dev01",
  database: "dev",
  connectionLimit: 10,
});

const query = async (selected, values) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let exeuteSql = sqlList[selected];
    let result = (await conn.query(exeuteSql, values))[0];

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.release;
  }
};

module.exports = { query };
