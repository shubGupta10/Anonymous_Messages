import nodemailer from 'nodemailer';
import createEmailTemplate from '../../emails/VerificationEmail';

interface ApiResponse {
  success: boolean;
  message: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailHTML = createEmailTemplate(username, verifyCode);
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verification Code',
      html: emailHTML,
    });
    
    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error sending email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}