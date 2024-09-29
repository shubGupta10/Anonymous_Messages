import { resend } from "@/libs/Resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{   
    try {
           await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Feedback message | Verification code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
        return {success: true, message: "Verification email send successfully"}
    } catch (emailError) {
        console.error("Error sending email", emailError);
        return {success: false, message: "Failed to send verification email"}
    }
}