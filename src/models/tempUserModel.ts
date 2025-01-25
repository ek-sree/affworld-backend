import mongoose, { Document, Schema } from "mongoose";

interface ITempUserInterface extends Document {
  email: string;
  password?: string; 
  name?:string;
  otp: string;
  userId: string;
  verifyType: string;
  otpCreatedAt: Date;
  createdAt: Date;
}


const tempUserSchema: Schema<ITempUserInterface> = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: false,
  },
  name:{
    type: String,
    required: false,
    default:null
  },
  otp: { 
    type: String, 
    required: true,
    minlength: 4,
    maxlength: 4
  },
  verifyType:{
    type: String,
  },
  otpCreatedAt: {
    type: Date,
    default: Date.now,
    index: { expireAfterSeconds: 240 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});



const tempUserModel = mongoose.model<ITempUserInterface>("TempUser",tempUserSchema);

export default tempUserModel;