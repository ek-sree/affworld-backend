import mongoose, { Schema } from "mongoose";
const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
const PostModel = mongoose.model("Post", postSchema);
export default PostModel;
