export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const isOTPExpired = (timestamp: Date): boolean => {
  const now = new Date();
  const otpTime = new Date(timestamp);
  const diffInMinutes = (now.getTime() - otpTime.getTime()) / (1000 * 60);
  return diffInMinutes > 10; // OTP expires after 10 minutes
};
