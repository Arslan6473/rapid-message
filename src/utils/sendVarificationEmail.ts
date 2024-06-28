import { resend } from "@/lib/resendEmail";
import VerificationEmail from "@/emails/VarificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export const sendVarificationCode = async (
  email: string,
  userName: string,
  varifyCode: string
): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Rapid Message | Email Varification Code",
      react: VerificationEmail({ userName, otp: varifyCode }),
    });

    return { success: true, message: "varification message send successfully" };
  } catch (error) {
    console.log("varification email sending failed " + error);
    return { success: false, message: "varification message sending failed" };
  }
};
