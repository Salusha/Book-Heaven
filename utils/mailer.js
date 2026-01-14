// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.SMTP_EMAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

// // Optional but very useful
// transporter.verify((err) => {
//   if (err) {
//     console.error("❌ SMTP CONFIG ERROR:", err);
//   } else {
//     console.log("✅ SMTP READY");
//   }
// });

// module.exports = transporter;

const { Resend } = require("resend");

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is missing");
}

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = resend;

