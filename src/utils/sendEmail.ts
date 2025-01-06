import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `http://localhost:3000/auth/verify_email/${token}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Email Verification",
    html: `  
	  <h1>Email Verification</h1>
	  <p>Please click the link below to verify your email:</p>
	  <a href="${verificationUrl}">${verificationUrl}</a>
	`,
  };

  return transporter.sendMail(mailOptions);
};
