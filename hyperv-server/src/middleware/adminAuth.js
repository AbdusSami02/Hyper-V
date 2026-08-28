import crypto from "node:crypto";

// Simple in-memory session store. Good enough for a single-admin, single
// -process internal tool — tokens are lost on restart (which just means
// you'll need to log back in), and there's no need for a sessions table
// in the database for this.
const validTokens = new Set();
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const tokenExpiry = new Map();

export function createSession() {
  const token = crypto.randomBytes(32).toString("hex");
  validTokens.add(token);
  tokenExpiry.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

export function destroySession(token) {
  validTokens.delete(token);
  tokenExpiry.delete(token);
}

function isValid(token) {
  if (!token || !validTokens.has(token)) return false;
  const expiresAt = tokenExpiry.get(token);
  if (Date.now() > expiresAt) {
    destroySession(token);
    return false;
  }
  return true;
}

export function checkPassword(candidate) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error(
      "ADMIN_PASSWORD is not set in the backend's .env file. Set it and restart the server."
    );
  }
  const a = Buffer.from(String(candidate ?? ""));
  const b = Buffer.from(expected);
  // Constant-time comparison, and matching lengths are required before
  // timingSafeEqual will even run (it throws on length mismatch).
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Express middleware: require a valid `Authorization: Bearer <token>` header.
export function requireAdmin(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !isValid(token)) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  next();
}
