const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const rawCors = process.env.CORS_ORIGINS || "*";
const corsOrigins =
  rawCors === "*"
    ? "*"
    : rawCors
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 4000,
  corsOrigins,
  jwtSecret: process.env.JWT_SECRET || "change-me-in-prod",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  uploadDir:
    process.env.UPLOAD_DIR ||
    path.join(__dirname, "../../uploads"),
  databaseUrl: process.env.DATABASE_URL || "",
};

if (!config.databaseUrl) {
  // eslint-disable-next-line no-console
  console.warn(
    "[config] DATABASE_URL is not set. API routes that hit the DB will fail until you provide it."
  );
}

module.exports = config;
