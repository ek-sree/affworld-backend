import nodemailer from 'nodemailer';
import config from '../config/index.js';
class EmailService {
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.EMAIL_NODEMAILER,
                pass: config.PASSWORD_NODEMAILER,
            },
        });
    }
    async sendOtpEmail(email, otp) {
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #0056b3; text-align: center;">Your OTP Code</h2>
        <p>Hi,</p>
        <p>We received a request to verify your email address. Use the OTP below to complete the verification process:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #0056b3;">${otp}</span>
        </div>
        <p>This OTP is valid for <strong>1 minutes</strong>. If you did not request this, please ignore this email.</p>
        <p>Thank you,</p>
        <p style="font-weight: bold;">The AFFWORLD Team</p>
      </div>
    `;
        const mailOptions = {
            from: "AFFWORLD",
            to: email,
            subject: 'Your OTP Code for Email Verification',
            html: htmlContent,
        };
        await this.transporter.sendMail(mailOptions);
    }
}
export default new EmailService();
