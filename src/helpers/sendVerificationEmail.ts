import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/apiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try{

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'mystery message | verification email',
            react: VerificationEmail({username, otp: verifyCode}),
        });

        return {
            success: true,
            message: 'Verification email sent successfully.',
            
        }

    }catch(emailError){
        console.error('Error sending verification email:', emailError);
        return {
            success: false,
            message: 'Failed to send verification email. Please try again later.',
        }
    }
}