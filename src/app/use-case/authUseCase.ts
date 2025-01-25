import { StatusCode } from "../../interface/StatusCode.js";
import { IResponse } from "../../interface/IResponse.js";
import { IAuthResponse, IUser } from "../../interface/IUser.js";
import AuthRepository from "../repository/authRepository.js";
import { generateOtp } from "../../utils/generateOtp.js";
import { validateEmail, validateName, validateOtp, validatePassword } from "../../utils/validation.js";
import emailService from "../../services/emailService.js";
import { handleError } from "../../middleware/errorMiddleware.js";
import { generateTokens } from "../../utils/generateTokens.js";
import { comparePassword, hashedPassword } from "../../utils/hashedPassword.js";
import { OAuth2Client } from "google-auth-library";
import config from "../../config/index.js";

const authRepo=new AuthRepository()

const client = new OAuth2Client(config.CLIENT_ID);

export default class AuthUseCase{
    register =async(name: string, email: string, password: string): Promise<IResponse & {email?:string}>=>{
        try {
            const emailValidate = validateEmail(email)
            const nameValidate = validateName(name)
            const passwordValidate = validatePassword(password)
            if(!emailValidate || !passwordValidate || !nameValidate){                
                return{status:StatusCode.BadRequest, message:"Entered credientials are invalid"}
            }

            const emailExist = await authRepo.findByEmail(email);
            if(emailExist){
                return{status: StatusCode.Conflict, message:"Email already exist"}
            }
            const otp = generateOtp()

            const data  = await authRepo.saveOtp(email,otp,name,password)
            if(!data){
                return{status:StatusCode.InternalServerError, message:"Internal server error, Try later"}
            }

            const sendMail = emailService.sendOtpEmail(email,otp)
            if(!sendMail){
                return{status:StatusCode.InternalServerError, message:"Otp send email failed"}
            }
           
            return{status:StatusCode.OK, message:"Otp send successfully",email}
        } catch (error) {
            console.log("Error occured register user use-case");
            return handleError(error, "An error occurred while register otp");
        }
    }


    resendOtp=async(email:string):Promise<IResponse & {email?:string}>=>{
        try {
            const emailValidate = validateEmail(email);
            if(!emailValidate){
                return{status:StatusCode.BadRequest, message:"Credientials are missing"}
            }
            const otp = generateOtp()
            const sendMail = emailService.sendOtpEmail(email,otp)
            if(!sendMail){
                return{status:StatusCode.InternalServerError, message:"Otp send email failed"}
            }
            const data  = await authRepo.saveOtp(email,otp)
            if(!data){
                return{status:StatusCode.InternalServerError, message:"Internal server error, Try later"}
            }
            return{status:StatusCode.OK, message:"Otp send successfully",email}
        } catch (error) {
            console.log("Error occured resend ot[] user use-case");
            return handleError(error, "An error occurred while resend otp");
        }
    }


    otpVerify= async(otp:string, email:string): Promise<IAuthResponse>=>{
        try {
            const otpValidate = validateOtp(otp)
            const emailValidate = validateEmail(email)
            
            if(!otpValidate || !emailValidate){
                return{status:StatusCode.BadRequest, message:"Credientials are missing"}
            }
            const otpData = await authRepo.findOtp(email)
            if(!otpData){
                return{status:StatusCode.BadRequest, message:"No data found"}
            }
            const currentTime = new Date
            const otpCreatedTime = new Date(otpData.otpCreatedAt)
            const timeDifference = (currentTime.getTime() - otpCreatedTime.getTime())/1000;
            const otpExpirtTime = 60;
            if(timeDifference > otpExpirtTime || otp!==otpData.otp){
                return {status:StatusCode.BadRequest, message:"Otp has invalid"}
            }            
            if(otpData && otpData.verifyType=='forgotPassword'){
                authRepo.deleteTempDataInBackground(email);
                return{status:StatusCode.OK, message:"Email verified for forgot password"}
            }

            if(!otpData.name || !otpData.password){
                return{status:StatusCode.InternalServerError, message:"Internal server error"}
            }
            const userData: IUser = {
                name: otpData.name,
                email: otpData.email,
                password: otpData.password,
              };
            const data = await authRepo.createUser(userData)
            if(!data || !data._id){
                return{status:StatusCode.BadRequest, message:"Internal server error, Data not saved"}
            }
            const {accessToken, refreshToken } = generateTokens(data._id.toString())
            authRepo.deleteTempDataInBackground(email)
            return{status:StatusCode.Created, message:"User created", data, accessToken,refreshToken}
        } catch (error) {
            console.log("Error occured verifyinh user use-case");
            return handleError(error, "An error occurred while verifying otp");
        }
    }

    login=async(email:string, password:string):Promise<IAuthResponse>=>{
        try {
            const emailValidate = validateEmail(email)
            const passwordValidate = validatePassword(password)
            if(!emailValidate || !passwordValidate){
                return{status:StatusCode.BadRequest, message:"Invalid email or password"}
            }
            const user = await authRepo.findByEmail(email)
            if(!user || !user.password || !user._id){
                return{status:StatusCode.NotFound, message:"Email or password entered is wrong"}
            }
            const isPassword = await comparePassword(password, user.password)
            if(!isPassword){
                return{status:StatusCode.NotFound, message:"Email or password enteredd is wrong"}
            }
            const {accessToken, refreshToken} = generateTokens(user._id.toString())
            return{status:StatusCode.OK, message:"Logged in", data:user, accessToken,refreshToken}
        } catch (error) {
            console.log("Error occured verifyinh user use-case");
            return handleError(error, "An error occurred while verifying otp");
        }
    }

    loginGoogle=async(token:string):Promise<IAuthResponse>=>{
        try {
            const ticket = await client.verifyIdToken({idToken:token,audience:config.CLIENT_ID})
            const payload = ticket.getPayload()
            const email=payload?.email
            const name=payload?.name
            const googleId=payload?.sub
            
            if(!email || !name || !googleId){
                return{status:StatusCode.InternalServerError,  message:"Internal server error, Credientials not found"}
            }
            const existingUser = await authRepo.findByEmail(email)
            if(existingUser && existingUser._id){
                
            const { accessToken, refreshToken } = generateTokens(existingUser._id.toString());
            return {status: StatusCode.OK,message: "Logged in successfully",data: existingUser,accessToken,refreshToken}
            }

            const data:IUser = {name,email,googleId}
            const user = await authRepo.createUser(data)
            if(!user || !user._id){
                return{status:StatusCode.BadRequest, message:"Internal server error, Data not saved"}
            }
            const {accessToken, refreshToken } = generateTokens(user._id.toString())
            return{status:StatusCode.Created, message:"User created", data:user, accessToken,refreshToken}
        } catch (error) {
            console.log("Error occured login-google user use-case");
            return handleError(error, "An error occurred while login google otp");
        }
    }

    forotPassword= async(email:string,verifyType:string): Promise<IResponse & {email?:string}>=>{
        try {
            const emailValidate = validateEmail(email)
            if(!emailValidate){
                return {status:StatusCode.BadRequest, message:"Email is invalid"}
            }
            if(!verifyType || verifyType!=='forgotPassword'){
                return{status:StatusCode.BadRequest, message:"Credientials are missing"}
            }
            const otp = generateOtp()
            const sendMail = emailService.sendOtpEmail(email,otp)
            if(!sendMail){
                return{status:StatusCode.InternalServerError, message:"Otp send email failed"}
            }
            const data  = await authRepo.saveOtp(email,otp,undefined,undefined,verifyType)
            if(!data){
                return{status:StatusCode.InternalServerError, message:"Internal server error, Try later"}
            }
            return{status:StatusCode.OK, message:"Otp send successfully",email}
        } catch (error) {
            console.log("Error occured forgotPass user use-case");
            return handleError(error, "An error occurred while forgot password");
        }
    }

    changePassword=async(password:string, email:string):Promise<IResponse>=>{
        try {
            const passwordValidate = validatePassword(password)
            const emailValidate = validateEmail(email)
            if(!passwordValidate || !emailValidate){
                return{status:StatusCode.BadRequest, message:"Invalid credientials"}
            }
            const hashPassword = await hashedPassword(password)
            const data = await authRepo.updatePassowrd(hashPassword,email)
            if(!data){
                return{status:StatusCode.InternalServerError, message:"Password not updated error occured"}
            }
            return{status:StatusCode.OK, message:"password Updated"}
        } catch (error) {
            console.log("Error occured change password use-case");
            return handleError(error, "An error occurred while change password");
        }
    }
}