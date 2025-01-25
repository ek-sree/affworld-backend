import { Types } from "mongoose";

export interface IPost{
     _id?:string | Types.ObjectId;
    title:string;
    image:string;
    user:Types.ObjectId;
    username?:string;
}