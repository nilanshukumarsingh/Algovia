
const sendEmail = async ({ email, subject, html }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    throw new Error("Email configuration missing in .env");
  }

  const url = "https://api.brevo.com/v3/smtp/email";

  const payload = {
    sender: {
      name: "Algovia",
      email: senderEmail,
    },
    to: [{ email }],
    subject,
    htmlContent: html,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("🔴 BREVO ERROR:", errorData);
      if (
        (errorData.code === "unauthorized" || errorData.message === "Key not found") &&
        apiKey &&
        apiKey.startsWith("xsmtpsib-")
      ) {
        console.log("💡 TIP: Your BREVO_API_KEY starts with 'xsmtpsib-' which is an SMTP key.");
        console.log("   Brevo's Web API requires a transaction API key starting with 'xkeysib-'.");
        console.log("   Please generate an API Key in Brevo under SMTP & API > API Keys (not SMTP keys).");
      }
      throw new Error("Failed to send email");
    }

    console.log("✅ Email sent successfully");
    return true;

  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;