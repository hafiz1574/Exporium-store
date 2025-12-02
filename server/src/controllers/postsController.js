const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const slugify = require("../utils/slugify");

const mapPost = (row) => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  body: row.body,
  status: row.status,
  heroImageUrl: row.hero_image_url,
  audience: row.audience,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  author: row.author_name || null,
});

exports.list = asyncHandler(async (req, res) => {
  const result = await db.query(
    `SELECT p.*, u.name AS author_name
     FROM posts p
     LEFT JOIN users u ON u.id = p.author_id
     ORDER BY p.created_at DESC`
  );

  res.json({ posts: result.rows.map(mapPost) });
});

exports.listPublic = asyncHandler(async (req, res) => {
  const result = await db.query(
    `SELECT p.*, u.name AS author_name
     FROM posts p
     LEFT JOIN users u ON u.id = p.author_id
     WHERE p.status = 'published'
     ORDER BY p.created_at DESC
     LIMIT 12`
  );

  res.json({ posts: result.rows.map(mapPost) });
});

exports.get = asyncHandler(async (req, res) => {
  const result = await db.query(
    `SELECT p.*, u.name AS author_name
     FROM posts p
     LEFT JOIN users u ON u.id = p.author_id
     WHERE p.id = $1`,
    [req.params.id]
  );

  if (!result.rowCount) {
    return res.status(404).json({ message: "Post not found" });
  }

  return res.json({ post: mapPost(result.rows[0]) });
});

exports.create = asyncHandler(async (req, res) => {
  const { title, body, status = "draft", heroImageUrl, audience = "general" } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required" });
  }

  const slug = `${slugify(title)}-${Date.now()}`;
  const result = await db.query(
    `INSERT INTO posts (title, slug, body, status, hero_image_url, author_id, audience)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [title, slug, body, status, heroImageUrl || null, req.user.sub, audience]
  );

  return res.status(201).json({ post: mapPost(result.rows[0]) });
});

exports.update = asyncHandler(async (req, res) => {
  const { title, body, status, heroImageUrl, audience } = req.body;
  const fields = [];
  const values = [];
  let idx = 1;

  const addField = (column, value) => {
    fields.push(`${column} = $${idx}`);
    values.push(value);
    idx += 1;
  };

  if (title) addField("title", title);
  if (body) addField("body", body);
  if (status) addField("status", status);
  if (heroImageUrl !== undefined) addField("hero_image_url", heroImageUrl);
  if (audience) addField("audience", audience);

  if (!fields.length) {
    return res.status(400).json({ message: "No updates provided" });
  }

  values.push(req.params.id);

  const result = await db.query(
    `UPDATE posts SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${idx}
     RETURNING *`,
    values
  );

  if (!result.rowCount) {
    return res.status(404).json({ message: "Post not found" });
  }

  return res.json({ post: mapPost(result.rows[0]) });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await db.query("DELETE FROM posts WHERE id = $1", [req.params.id]);

  if (!result.rowCount) {
    return res.status(404).json({ message: "Post not found" });
  }

  return res.status(204).send();
});
