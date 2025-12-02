const { Pool } = require("pg");
const config = require("./env");

const connectionOptions = {};

if (config.databaseUrl) {
  connectionOptions.connectionString = config.databaseUrl;
  if (config.databaseUrl.includes("render.com") || process.env.PGSSLMODE === "require") {
    connectionOptions.ssl = {
      rejectUnauthorized: false,
    };
  }
}

const pool = new Pool(connectionOptions);

pool.on("error", (error) => {
  // eslint-disable-next-line no-console
  console.error("[db] Unexpected error on idle client", error);
  process.exit(1);
});

const query = async (text, params) => pool.query(text, params);

module.exports = {
  pool,
  query,
};
