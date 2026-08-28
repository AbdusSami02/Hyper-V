import { Router } from "express";
import { ContactMessage } from "../db/models/ContactMessage.js";

export const contactRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact
// body: { name, email, message }
contactRouter.post("/", async (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "name is required" });
  }
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "A valid email is required" });
  }
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "message is required" });
  }

  await ContactMessage.create({
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  });

  // NOTE: this only stores the message. Wire up an email provider (Resend,
  // Postmark, nodemailer + SMTP, etc.) here if you want a real notification
  // sent when someone submits the form.

  res.status(201).json({ success: true });
});
