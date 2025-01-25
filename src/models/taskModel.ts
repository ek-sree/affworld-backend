import mongoose, { Document, Schema, Types } from "mongoose";

interface ITaskInterface extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: "pending" | "progress" | "done"; 
  user: Types.ObjectId;
}

const taskSchema: Schema<ITaskInterface> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum:["pending","progress","done"],
      default: 'pending',
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
      },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model<ITaskInterface>("Task", taskSchema);

export default TaskModel;
