const nodemailer = require("nodemailer");

/**
 * Sends transactional email (OTP / Password Reset)
 * Supports Gmail SMTP, custom SMTP, or console output fallback for local dev.
 */
async function sendEmail({ to, subject, html, text }) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
  const emailPort = process.env.EMAIL_PORT || 587;

  if (emailUser && emailPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: emailHost,
        port: Number(emailPort),
        secure: emailPort == 465,
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });

      const info = await transporter.sendMail({
        from: `"EduMind AI Portal" <${emailUser}>`,
        to,
        subject,
        text,
        html
      });

      console.log("✉️ Email sent successfully:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error("❌ Email sending failed via SMTP:", err.message);
    }
  }

  // Console Fallback for local testing when SMTP credentials are not yet configured in .env
  console.log("\n==========================================");
  console.log(`✉️ [DEMO EMAIL & OTP SENDER]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content:\n${text || html}`);
  console.log("==========================================\n");

  return { success: true, isDemo: true };
}

module.exports = sendEmail;
