// const transporter = require("../utils/mailer");

// exports.sendVerificationEmail = async (email, verificationToken) => {
//   try {
//     const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

//     const mailOptions = {
//       from: `"Book-Heaven 📚" <${process.env.SMTP_EMAIL}>`,
//       to: email,
//       subject: "Verify Your Book Heaven Email Address",
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px;">
//           <h2>Welcome to Book Heaven!</h2>
//           <p>Please verify your email to complete registration.</p>
//           <a href="${verificationLink}"
//              style="display:inline-block;padding:12px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
//             Verify Email
//           </a>
//           <p style="margin-top:20px;">This link expires in 24 hours.</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Verification email sent to ${email}`);
//     return true;
//   } catch (error) {
//     console.error("❌ Verification email failed:", error.message);
//     return false;
//   }
// };

// exports.sendResetPasswordEmail = async (email, resetToken) => {
//   try {
//     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

//     const mailOptions = {
//       from: `"Book-Heaven 📚" <${process.env.SMTP_EMAIL}>`,
//       to: email,
//       subject: "Reset Your Book Heaven Password",
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px;">
//           <h2>Password Reset Request</h2>
//           <p>We received a request to reset your password. Click the button below to set a new password.</p>
//           <a href="${resetLink}"
//              style="display:inline-block;padding:12px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;margin:20px 0;">
//             Reset Password
//           </a>
//           <p style="color:#666;font-size:12px;">This link expires in 1 hour.</p>
//           <p style="color:#666;font-size:12px;">If you didn't request this, please ignore this email.</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Password reset email sent to ${email}`);
//     return true;
//   } catch (error) {
//     console.error("❌ Password reset email failed:", error.message);
//     return false;
//   }
// };

// exports.sendContactEmail = async (req, res) => {
//   const { name, email, message } = req.body;

//   try {
//     await transporter.sendMail({
//       from: `"Book-Heaven 📚" <${process.env.SMTP_EMAIL}>`,
//       replyTo: email,
//       to: "email@gmail.com",
//       subject: `Contact Message from ${name}`,
//       html: `
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p>${message}</p>
//       `,
//     });

//     res.status(200).json({ success: true, message: "Message sent successfully!" });
//   } catch (error) {
//     console.error("❌ Contact email error:", error.message);
//     res.status(500).json({ success: false, message: "Email sending failed" });
//   }
// };
const resend = require("../utils/mailer");

exports.sendVerificationEmail = async (email, verificationToken) => {
  try {
    const verificationLink =
      `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await resend.emails.send({
      from: "Book Heaven <no-reply@bookheaven.dev>",
      to: email,
      subject: "Verify Your Book Heaven Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Book Heaven 📚</h2>
          <p>Please verify your email to complete registration.</p>
          <a href="${verificationLink}"
             style="display:inline-block;padding:12px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
            Verify Email
          </a>
          <p style="margin-top:20px;">This link expires in 24 hours.</p>
        </div>
      `,
    });

    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Verification email failed:", error);
    return false;
  }
};

exports.sendResetPasswordEmail = async (email, resetToken) => {
  try {
    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await resend.emails.send({
      from: "Book Heaven <no-reply@bookheaven.dev>",
      to: email,
      subject: "Reset Your Book Heaven Password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Click the button below to reset your password.</p>
          <a href="${resetLink}"
             style="display:inline-block;padding:12px 20px;background:#dc3545;color:#fff;text-decoration:none;border-radius:5px;margin:20px 0;">
            Reset Password
          </a>
          <p style="font-size:12px;color:#666;">This link expires in 1 hour.</p>
        </div>
      `,
    });

    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Password reset email failed:", error);
    return false;
  }
};

exports.sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await resend.emails.send({
      from: "Book Heaven <no-reply@bookheaven.dev>",
      to: "email@gmail.com",
      replyTo: email,
      subject: `Contact Message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("❌ Contact email error:", error);
    res.status(500).json({
      success: false,
      message: "Email sending failed",
    });
  }
};
