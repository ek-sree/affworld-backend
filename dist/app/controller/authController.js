import AuthUseCase from "../use-case/authUseCase.js";
import { StatusCode } from "../../interface/StatusCode.js";
export default class AuthController {
    authUseCase;
    constructor() {
        this.authUseCase = new AuthUseCase();
    }
    createUser = async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const response = await this.authUseCase.register(name, email, password);
            res.status(response.status).json({ message: response.message, email });
        }
        catch (error) {
            console.log("Register error on controller", error);
            res.status(StatusCode.InternalServerError).json({
                message: "Internal server error"
            });
        }
    };
    resendOtp = async (req, res) => {
        try {
            const email = req.body.email;
            const response = await this.authUseCase.resendOtp(email);
            res.status(response.status).json({ message: response.message, data: response.email });
        }
        catch (error) {
            console.log("Resend otp error on controller", error);
            res.status(StatusCode.InternalServerError).json({
                message: "Internal server error"
            });
        }
    };
    verifyOtp = async (req, res) => {
        try {
            const { otp, email } = req.body;
            const response = await this.authUseCase.otpVerify(otp, email);
            if (response.status == 201) {
                res.cookie("refreshToken", response.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
            }
            res.status(response.status).json({ message: response.message, data: response.data, accessToken: response.accessToken });
        }
        catch (error) {
            console.log("Verifyotp error on controller", error);
            res.status(StatusCode.InternalServerError).json({
                message: "Internal server error"
            });
        }
    };
    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const response = await this.authUseCase.login(email, password);
            if (response.status == 200) {
                res.cookie("refreshToken", response.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
            }
            res.status(response.status).json({ message: response.message, data: response.data, accessToken: response.accessToken });
        }
        catch (error) {
            console.log("Login error on controller", error);
            res.status(StatusCode.InternalServerError).json({
                message: "Internal server error"
            });
        }
    };
    loginGoogle = async (req, res) => {
        try {
            const { token } = req.body;
            const response = await this.authUseCase.loginGoogle(token);
            if (response.status == 201 || response.status == 200) {
                res.cookie("refreshToken", response.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
            }
            console.log(response, "...>>>");
            res.status(response.status).json({ message: response.message, data: response.data, accessToken: response.accessToken });
        }
        catch (error) {
            console.log("Login-Google error on controller", error);
            res.status(StatusCode.InternalServerError).json({
                message: "Internal server error"
            });
        }
    };
    logout = async (req, res) => {
        try {
            res.clearCookie('refreshToken');
            res.status(200).json({ message: "Cleared token" });
        }
        catch (error) {
            console.log("Logout error on controller", error);
            res.status(StatusCode.InternalServerError).json({
                message: "Internal server error"
            });
        }
    };
    forGotPass = async (req, res) => {
        try {
            const { email, verifyType } = req.body;
            const response = await this.authUseCase.forotPassword(email, verifyType);
            res.status(response.status).json({ message: response.message, email: response.email });
        }
        catch (error) {
            console.log("Forgotpass error on controller", error);
            res.status(StatusCode.InternalServerError).json({
                message: "Internal server error"
            });
        }
    };
    changePassword = async (req, res) => {
        try {
            const { password, email } = req.body;
            const response = await this.authUseCase.changePassword(password, email);
            res.status(response.status).json({ message: response.message });
        }
        catch (error) {
            console.log("Update password error on controller", error);
            res.status(StatusCode.InternalServerError).json({
                message: "Internal server error"
            });
        }
    };
}
