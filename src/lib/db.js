import mysql from "mysql2/promise";

const globalForDb = globalThis;

const pool =
  globalForDb.mysqlPool || mysql.createPool(process.env.DATABASE_URL);

if (process.env.NODE_ENV !== "production") {
  globalForDb.mysqlPool = pool;
}

export default pool;
