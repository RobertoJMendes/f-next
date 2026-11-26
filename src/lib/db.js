import mysql from "mysql2/promise";

const globalForDb = globalThis;

export function getPool() {
  if (!globalForDb.mysqlPool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL não definida no ambiente.");
    }
    globalForDb.mysqlPool = mysql.createPool(process.env.DATABASE_URL);
  }
  return globalForDb.mysqlPool;
}

// Se o seu código importa `pool` diretamente (ex: `pool.query(...)`),
// este Proxy garante que o pool só seja criado na hora da query, e nunca durante o build:
const pool = new Proxy(
  {},
  {
    get(_, prop) {
      const instance = getPool();
      const value = instance[prop];
      return typeof value === "function" ? value.bind(instance) : value;
    },
  }
);

export default pool;
