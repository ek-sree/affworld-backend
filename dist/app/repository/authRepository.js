import tempUserModel from "../../models/tempUserModel.js";
import UserModel from "../../models/userModel.js";
import { hashedPassword } from "../../utils/hashedPassword.js";
export default class AuthRepository {
    findByEmail = async (email) => {
        try {
            const user = await UserModel.findOne({ email }).lean();
            if (!user) {
                return null;
            }
            return user;
        }
        catch (error) {
            console.log("Error in finding email", error);
            return null;
        }
    };
    saveOtp = async (email, otp, name, password, verifyType) => {
        try {
            const existUser = await tempUserModel.findOne({ email });
            if (existUser) {
                existUser.otp = otp;
                existUser.otpCreatedAt = new Date();
                if (verifyType === 'forgotPassword') {
                    existUser.name = undefined;
                }
                const savedExistData = await existUser.save();
                if (!savedExistData) {
                    return null;
                }
                return email;
            }
            const newTempUserData = {
                email,
                otp,
                otpCreatedAt: new Date()
            };
            if (name && verifyType !== 'forgotPassword') {
                newTempUserData.name = name;
            }
            if (verifyType) {
                newTempUserData.verifyType = verifyType;
            }
            if (password) {
                const hashPassword = await hashedPassword(password);
                newTempUserData.password = hashPassword;
            }
            const newTempUser = new tempUserModel(newTempUserData);
            const savedData = await newTempUser.save();
            if (!savedData) {
                return null;
            }
            return email;
        }
        catch (error) {
            console.log("Error in saving otp", error);
            return null;
        }
    };
    findOtp = async (email) => {
        try {
            const data = tempUserModel.findOne({ email });
            if (!data) {
                return null;
            }
            return data;
        }
        catch (error) {
            console.log("Error in saving otp", error);
            return null;
        }
    };
    createUser = async (data) => {
        try {
            const newUser = new UserModel({
                name: data.name,
                email: data.email,
                password: data.googleId ? null : data.password,
                googleId: data.googleId
            });
            const savedUser = await newUser.save();
            if (!savedUser) {
                return null;
            }
            return savedUser;
        }
        catch (error) {
            console.log("Error in saving otp", error);
            return null;
        }
    };
    updatePassowrd = async (password, email) => {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return null;
            }
            user.password = password;
            const savedPassword = await user.save();
            return savedPassword;
        }
        catch (error) {
            console.log("Error in changing password", error);
            return null;
        }
    };
    async deleteTempDataInBackground(email) {
        (async () => {
            try {
                await tempUserModel.deleteOne({ email });
                console.log(`Temporary data for ${email} deleted successfully.`);
            }
            catch (error) {
                console.log("Error while deleting temp data in background", error);
            }
        })();
    }
}
