// utils/otpStore.js
// Simple in-memory OTP store for demonstration. In production, use a database or Redis for persistence and scalability.

const otpMap = new Map();

/**
 * Save OTP and expiry for a user (by email or phone)
 * @param {string} key - email or phone
 * @param {string} otp - generated OTP
 * @param {Date} expiresAt - expiry time
 */
export function saveOTP(key, otp, expiresAt) {
  otpMap.set(key, { otp, expiresAt });
}

/**
 * Verify OTP for a user (by email or phone)
 * @param {string} key - email or phone
 * @param {string} otp - OTP to verify
 * @returns {boolean} - true if valid, false otherwise
 */
export function verifyOTP(key, otp) {
  const record = otpMap.get(key);
  if (!record) return false;
  if (record.otp !== otp) return false;
  if (record.expiresAt < new Date()) return false;
  otpMap.delete(key); // Remove OTP after successful verification
  return true;
}

/**
 * Remove expired OTPs (optional, for cleanup)
 */
export function cleanupExpiredOTPs() {
  const now = new Date();
  for (const [key, { expiresAt }] of otpMap.entries()) {
    if (expiresAt < now) {
      otpMap.delete(key);
    }
  }
}
