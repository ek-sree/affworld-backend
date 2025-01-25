// import { EmailVerify } from "../interface/EmailVerify.js";
/**
 * Validate email format
 * @param email - The email string to validate
 * @returns true if valid, false otherwise
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
/**
 * Validate password strength
 * @param password - The password string to validate
 * @returns true if valid, false otherwise
 */
export const validatePassword = (password) => {
    // Minimum 8 characters, at least one letter, one number, and one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
/**
 * Validate OTP format
 * @param otp - The OTP string to validate
 * @returns true if valid, false otherwise
 */
export const validateOtp = (otp) => {
    // Ensure the OTP is exactly 4 digits (adjust length if needed)
    const otpRegex = /^\d{4}$/;
    return otpRegex.test(otp);
};
/**
 * Validate userId format (e.g., MongoDB ObjectId)
 * @param userId - The userId string to validate
 * @returns true if valid, false otherwise
 */
export const validateUserId = (userId) => {
    // Match MongoDB ObjectId (24 hexadecimal characters)
    const objectIdRegex = /^[a-f\d]{24}$/i;
    return objectIdRegex.test(userId);
};
/**
 * Validate name
 * - Checks if the name is not empty after trimming
 * @param name - The name string to validate
 * @returns true if valid (non-empty), false otherwise
 */
export const validateName = (name) => {
    return name.trim().length > 0;
};
export const validateTitle = (title) => {
    const wordCount = title.trim().split(/\s+/).length; // Count words
    return title.trim().length > 0 && wordCount <= 50;
};
/**
 * Validate description
 * - Ensures the description is less than or equal to 200 words
 * @param description - The description string to validate
 * @returns true if valid, false otherwise
 */
export const validateDescription = (description) => {
    const wordCount = description.trim().split(/\s+/).length; // Count words
    return wordCount <= 200;
};
// /**
//  * Validate verifyType
//  * Ensures the input is one of the valid enum values
//  * @param verifyType - The verifyType string to validate
//  * @returns true if valid, false otherwise
//  */
// export const validateVerifyType = (verifyType: string): boolean => {
//     return Object.values(EmailVerify).includes(verifyType as EmailVerify);
// };
