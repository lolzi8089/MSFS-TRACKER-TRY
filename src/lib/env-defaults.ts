/**
 * Ensures local dev works without a `.env` file: SQLite file DB + cwd-relative path.
 * Prisma resolves `file:` URLs relative to the process cwd (project root when using `next dev`).
 */
if (process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./prisma/dev.db";
}
