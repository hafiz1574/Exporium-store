const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const config = require("../config/env");
const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const buildToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: user.created_at,
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const result = await db.query(
    "SELECT id, name, email, role, password_hash, created_at FROM users WHERE email = $1",
    [normalizedEmail]
  );

  if (!result.rowCount) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = result.rows[0];
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = buildToken(user);

  return res.json({ token, user: sanitizeUser(user) });
});

exports.me = asyncHandler(async (req, res) => {
  const result = await db.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
    [req.user.sub]
  );

  if (!result.rowCount) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user: result.rows[0] });
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const existing = await db.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
  if (existing.rowCount) {
    return res.status(409).json({ message: "Account already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = uuid();

  const result = await db.query(
    `INSERT INTO users (id, name, email, role, password_hash)
     VALUES ($1, $2, $3, 'admin', $4)
     RETURNING id, name, email, role, created_at` ,
    [id, normalizedName, normalizedEmail, passwordHash]
  );

  const user = result.rows[0];
  const token = buildToken(user);

  return res.status(201).json({ token, user });
});
