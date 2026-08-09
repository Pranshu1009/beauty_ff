import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

function buildMessage({ name, email, phone, event, message }) {
  return [
    "New inquiry from the website",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Event: ${event}`,
    "",
    "Message:",
    message,
  ].join("\n");
}

async function sendEmailNotification(payload) {
  const to = process.env.CONTACT_TO_EMAIL || "tiwariprabhakar1008@gmail.com";
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (user && pass) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Roshani Website" <${user}>`,
      to,
      replyTo: payload.email,
      subject: `New website inquiry from ${payload.name}`,
      text: buildMessage(payload),
    });
    return "smtp";
  }

  // Fallback: FormSubmit (confirm the inbox once via their activation email)
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      event: payload.event,
      message: payload.message,
      _subject: `New website inquiry from ${payload.name}`,
      _template: "table",
      _captcha: "false",
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Could not send email.");
  }
  return "formsubmit";
}

async function sendWhatsAppNotification(payload) {
  const phone = String(
    process.env.WHATSAPP_PHONE || "919823124595"
  ).replace(/\D/g, "");
  const apiKey = process.env.CALLMEBOT_API_KEY || process.env.WHATSAPP_API_KEY;

  if (!apiKey) {
    throw new Error(
      "WhatsApp not configured. Add CALLMEBOT_API_KEY on the server."
    );
  }

  const text = buildMessage(payload);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(
    text
  )}&apikey=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url);
  const body = await res.text();
  if (!res.ok || /error|invalid|denied/i.test(body)) {
    throw new Error(body || "Could not send WhatsApp message.");
  }
  return true;
}

router.post("/", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim();
    const phone = String(req.body.phone || "").trim();
    const event = String(req.body.event || "").trim();
    const message = String(req.body.message || "").trim();

    if (!name || !email || !phone || !event || !message) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const payload = { name, email, phone, event, message };
    const results = { email: false, whatsapp: false, errors: [] };

    try {
      await sendEmailNotification(payload);
      results.email = true;
    } catch (err) {
      console.error("Contact email failed:", err);
      results.errors.push(err.message || "Email failed");
    }

    try {
      await sendWhatsAppNotification(payload);
      results.whatsapp = true;
    } catch (err) {
      console.error("Contact WhatsApp failed:", err);
      results.errors.push(err.message || "WhatsApp failed");
    }

    if (!results.email && !results.whatsapp) {
      return res.status(502).json({
        message:
          "Could not send your message right now. Please try WhatsApp or call instead.",
        results,
      });
    }

    res.json({
      ok: true,
      message: "Message sent successfully.",
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not send message." });
  }
});

export default router;
