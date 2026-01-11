const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Optional but very useful
transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP CONFIG ERROR:", err);
  } else {
    console.log("✅ SMTP READY");
  }
});

module.exports = transporter;
