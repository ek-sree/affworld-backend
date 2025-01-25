import { refreshTokenHandler } from '../../middleware/tokenHandler.js';
import AuthController from '../controller/authController.js';
import {Router} from 'express'

const authRouter = Router();

const authController = new AuthController()

authRouter.post('/register', authController.createUser);
authRouter.post('/otpVerify', authController.verifyOtp);
authRouter.post('/resendOtp', authController.resendOtp);
authRouter.post('/logout', authController.logout);
authRouter.post('/login', authController.login);
authRouter.post('/google-login', authController.loginGoogle)
authRouter.post('/forgotPass', authController.forGotPass)
authRouter.post('/reset-password', authController.changePassword)

authRouter.post('/refresh-token', refreshTokenHandler)


export default authRouter