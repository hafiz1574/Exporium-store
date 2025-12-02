const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const mapSettingsRows = (rows) =>
  rows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});

exports.getAll = asyncHandler(async (req, res) => {
  const result = await db.query("SELECT key, value FROM settings ORDER BY key ASC");
  res.json({ settings: mapSettingsRows(result.rows) });
});

exports.updateMany = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const entries = Object.entries(payload);

  if (!entries.length) {
    return res.status(400).json({ message: "No settings provided" });
  }

  await Promise.all(
    entries.map(([key, value]) =>
      db.query(
        `INSERT INTO settings (key, value)
         VALUES ($1, $2::jsonb)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, JSON.stringify(value)]
      )
    )
  );

  const updated = await db.query("SELECT key, value FROM settings ORDER BY key ASC");
  res.json({ settings: mapSettingsRows(updated.rows) });
});
