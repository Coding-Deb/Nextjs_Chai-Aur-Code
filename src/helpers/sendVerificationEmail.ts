import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

export async function senderVerification(
  email: string,
  username: string,
  verifyCode: string
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: '--------Verification Code--------',
            react: VerificationEmail({username,otp:verifyCode}),
          });
        return {success: true , message:"Verification Sent"}
    } catch (error) {
        console.log(error);
        return {success: false , message:"failed to send"}
    }
}
