#!/usr/bin/env node
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const db = require("../src/config/db");
const config = require("../src/config/env");

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "Ops Admin";

if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD env vars are required for seeding");
  process.exit(1);
}

(async () => {
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const id = uuid();

    await db.query(
      `INSERT INTO users (id, name, email, role, password_hash)
       VALUES ($1, $2, $3, 'admin', $4)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, updated_at = NOW()`,
      [id, name, email, passwordHash]
    );

    console.log(`Seeded admin user ${email}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin user", error);
    process.exit(1);
  }
})();
