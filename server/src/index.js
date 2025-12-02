const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config/env");
const authRoutes = require("./routes/auth");
const postsRoutes = require("./routes/posts");
const settingsRoutes = require("./routes/settings");
const uploadsRoutes = require("./routes/uploads");
const publicRoutes = require("./routes/public");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const corsOptions = {
  origin: config.corsOrigins,
  credentials: config.corsOrigins !== "*",
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/public", publicRoutes);
app.use("/uploads", express.static(path.resolve(config.uploadDir)));

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${config.port}`);
});
