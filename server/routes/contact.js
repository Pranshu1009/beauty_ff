import { Router } from "express";

const router = Router();

async function fetchWithTimeout(url, options = {}, ms = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
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

    const accessKey = (
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.VITE_WEB3FORMS_ACCESS_KEY ||
      ""
    ).trim();

    if (!accessKey) {
      return res.status(500).json({
        message: "Contact form is not configured. Add WEB3FORMS_ACCESS_KEY on Render.",
      });
    }

    const notifyEmail = (
      process.env.CONTACT_NOTIFY_EMAIL ||
      "akk99094@gmail.com"
    ).trim();

    const payload = {
      access_key: accessKey,
      subject: `New website inquiry from ${name}`,
      from_name: "Roshani Makeup Website",
      name,
      email,
      phone,
      event,
      message,
      replyto: email,
      botcheck: false,
    };

    // Ensure the client inbox also receives a copy (in case the access key
    // was created under a different Gmail account).
    if (notifyEmail) {
      payload.ccemail = notifyEmail;
    }

    const response = await fetchWithTimeout("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      console.error("Web3Forms error:", data);
      return res.status(502).json({
        message: data.message || "Could not send your message. Please try again.",
      });
    }

    res.json({ ok: true, message: "Message sent successfully." });
  } catch (err) {
    console.error("Contact email failed:", err);
    res.status(500).json({ message: "Could not send message." });
  }
});

export default router;
