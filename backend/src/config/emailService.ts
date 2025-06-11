import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "molunoprogress@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"Messaging app " <molunoprogress@gmail.com>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("error sending email", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error while sending email."
    );
  }
};

const verifyEmail = async (email: string, token: string) => {
  return await sendEmail({
    to: email,
    subject: "Verify your email",
    text: "Click the link to verify your email.",
    html: `
  <div style="font-family: sans-serif; line-height: 1.5;">
    <p>Hi there,</p>
    <p>Please click the link below to verify your email address:</p>
    <p>
      <a 
        href="http://localhost:5173/auth/verify-email?token=${token}" 
        style="display: inline-block; padding: 10px 20px; background-color: #00712D; color: white; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
    </p>

    <p>This link expires in 45 minutes.</p>
    <p>If you didn’t request this, please ignore this email.</p>
  </div>
`,
  });
};

const resetPasswordEmail = async (email: string, token: string) => {
  await sendEmail({
    to: email,
    subject: "Reset your password",
    text: "Click the link to reset your password.",
    html: `
  <div style="font-family: sans-serif; line-height: 1.5;">
    <p>Hi there,</p>
    <p>Please click the link below to reset your password:</p>
    <p>
      <a 
        href="http://localhost:5173/auth/reset-password?token=${token}" 
        style="display: inline-block; padding: 10px 20px; background-color: #00712D; color: white; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
    </p>

    <p>This link expires in 15 minutes.</p>
    <p>If you didn’t request this, please ignore this email.</p>
  </div>
`,
  });
};

export { verifyEmail, resetPasswordEmail };
