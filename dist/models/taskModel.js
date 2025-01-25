import mongoose, { Schema } from "mongoose";
const taskSchema = new Schema({
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
        enum: ["pending", "progress", "done"],
        default: 'pending',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
const TaskModel = mongoose.model("Task", taskSchema);
export default TaskModel;
