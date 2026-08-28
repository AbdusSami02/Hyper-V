import { Router } from "express";
import { createSession, destroySession, checkPassword } from "../middleware/adminAuth.js";

export const adminAuthRouter = Router();

// POST /api/admin/login
// body: { password }
adminAuthRouter.post("/login", (req, res) => {
  const { password } = req.body ?? {};

  let ok;
  try {
    ok = checkPassword(password);
  } catch (err) {
    // ADMIN_PASSWORD not configured on the server
    return res.status(500).json({ error: err.message });
  }

  if (!ok) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  const token = createSession();
  res.json({ token });
});

// POST /api/admin/logout
adminAuthRouter.post("/logout", (req, res) => {
  const header = req.headers.authorization ?? "";
  const [, token] = header.split(" ");
  if (token) destroySession(token);
  res.json({ success: true });
});
