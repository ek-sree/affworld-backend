import { Types } from "mongoose";

export interface ITask{
    _id?:string | Types.ObjectId;
    title:string;
    description:string;
    status:string;
    user:Types.ObjectId;
}

export enum TaskStatus {
    Pending = "pending",
    Progress = "progress",
    Done = "done"
  }
