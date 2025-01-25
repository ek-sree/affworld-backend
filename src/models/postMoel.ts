import mongoose, { Document, Schema, Types } from "mongoose";

interface IPostInterface extends Document {
  _id: Types.ObjectId;
  title: string;
  image: string;
  user: Types.ObjectId;
}

const postSchema: Schema<IPostInterface> = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model<IPostInterface>("Post", postSchema);

export default PostModel;
