import { Router } from "express";

const router = Router();

function buildMessage({ name, email, phone, event, message }) {
  return [
    "New website inquiry",
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

async function fetchWithTimeout(url, options = {}, ms = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function sendEmail(payload) {
  const accessKey = (
    process.env.WEB3FORMS_ACCESS_KEY ||
    process.env.VITE_WEB3FORMS_ACCESS_KEY ||
    ""
  ).trim();

  if (!accessKey) {
    throw new Error("WEB3FORMS_ACCESS_KEY is missing on the server.");
  }

  const res = await fetchWithTimeout("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `New website inquiry from ${payload.name}`,
      from_name: payload.name,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      event: payload.event,
      message: payload.message,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Email send failed.");
  }
}

async function sendWhatsApp(payload) {
  const phone = String(
    process.env.WHATSAPP_PHONE || "919823124595"
  ).replace(/\D/g, "");
  const apiKey = String(process.env.CALLMEBOT_API_KEY || "").trim();

  if (!apiKey) {
    throw new Error(
      "CALLMEBOT_API_KEY is missing. Activate CallMeBot once to enable WhatsApp alerts."
    );
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(
    buildMessage(payload)
  )}&apikey=${encodeURIComponent(apiKey)}`;

  const res = await fetchWithTimeout(url);
  const body = await res.text();
  if (!res.ok || /error|invalid|denied/i.test(body)) {
    throw new Error(body || "WhatsApp send failed.");
  }
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
      await sendEmail(payload);
      results.email = true;
    } catch (err) {
      console.error("Email failed:", err);
      results.errors.push(err.message || "Email failed");
    }

    try {
      await sendWhatsApp(payload);
      results.whatsapp = true;
    } catch (err) {
      console.error("WhatsApp failed:", err);
      results.errors.push(err.message || "WhatsApp failed");
    }

    if (!results.email && !results.whatsapp) {
      return res.status(502).json({
        message: "Could not send your message. Please try again later.",
        results,
      });
    }

    if (results.email && results.whatsapp) {
      return res.json({
        ok: true,
        message: "Sent to email and WhatsApp.",
        results,
      });
    }

    return res.json({
      ok: true,
      message: results.email
        ? "Sent to email. WhatsApp is not set up yet."
        : "Sent to WhatsApp. Email failed.",
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not send message." });
  }
});

export default router;
