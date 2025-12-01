// six digit OTP generator and expiry time can be handled where this function is called
export function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
}