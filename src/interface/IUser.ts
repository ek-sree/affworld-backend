import { Types } from "mongoose";
import { IResponse } from "./IResponse";

export interface IUser{
    _id?: string | Types.ObjectId;
    email: string;
    password?: string;
    name: string;
    googleId?: string;
}


export interface IOtp extends ITempUserData{
    otp:string;
    otpCreatedAt:Date;
}

export interface IAuthResponse extends IResponse{
    data?:IUser;
    accessToken?:string;
    refreshToken?:string;
}

export interface ITempUserData{
    _id?: string | Types.ObjectId;
    name?:string;
    email:string;
    password?:string;
    verifyType?:string;
    otp:string;
    otpCreatedAt:Date
}