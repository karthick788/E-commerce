// In src/lib/email.ts
import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, token: string, userId: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}&userId=${userId}`;

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify your email',
    html: `
      <div>
        <h2>Welcome to Our App!</h2>
        <p>Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; padding: 10px 20px; background: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  });
}