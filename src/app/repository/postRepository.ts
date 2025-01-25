import PostModel from "../../models/postMoel.js";
import { IPost } from "../../interface/IPost.js"
import { IUserInterface } from "../../models/userModel.js";
import { Types } from "mongoose";



export default class PostRepository{
    createPost= async(title:string,imageUrls:string, userId:string): Promise<IPost | null>=>{
        try {
           const newPost = new PostModel({
            title,
            image:imageUrls,
            user:userId
           })
           const savedPost = await newPost.save()
           if(!savedPost){
            return null
           }
           const populatedPost = await PostModel.findById(savedPost._id)
      .populate<{ user: { name: string; _id: Types.ObjectId } }>("user", "name")
      .exec();

    if (!populatedPost || !populatedPost.user) {
      return null;
    }

    return {
      _id: populatedPost._id.toString(),
      title: populatedPost.title,
      image: populatedPost.image,
      user: populatedPost.user._id,
      username: populatedPost.user.name,
    };
        } catch (error) {
            console.log("Error in adding new post", error);
            return null
        }
    }

    findPost = async (): Promise<IPost[] | null> => {
        try {
          const posts = await PostModel.find()
            .populate<{ user: Pick<IUserInterface, "name" | "_id"> }>("user", "name _id")
            .lean();
    
          if (!posts) {
            return null;
          }
    
          return posts.map((post) => ({
            _id: post._id.toString(),
            title: post.title,
            image: post.image,
            user: post.user._id, 
            username: post.user.name, 
          }));
        } catch (error) {
          console.log("Error in fetching post", error);
          return null;
        }
      };

}