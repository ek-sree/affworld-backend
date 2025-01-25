import { IResponse } from "../../interface/IResponse.js";
import { handleError } from "../../middleware/errorMiddleware.js";
import { validateDescription, validateTitle, validateUserId } from "../../utils/validation.js";
import { IPost } from "../../interface/IPost.js";
import PostRepository from "../repository/postRepository.js";
import { uploadImageToCloudinary } from "../../services/cloudinary.js";
import { StatusCode } from "../../interface/StatusCode.js";

const postRepo = new PostRepository()

export default class PostUseCase{
    addPost =async(title: string, image: Buffer, userId: string): Promise<IResponse & {data?:IPost}>=>{
        try {
            const imageUrl = await uploadImageToCloudinary(image);
            if(!imageUrl){
                return{status:StatusCode.NotAcceptable, message:"Cant store image right now error occured"}
            }
            const data = await postRepo.createPost(title,imageUrl.secure_url,userId)
            if(!data){
                return{status:StatusCode.InternalServerError, message:"Post not added"}
            }
            return{status:StatusCode.Created, message:"Post added successfully",data}
        } catch (error) {
            console.log("Error occured adding posts post-case");
            return handleError(error, "An error occurred while adding posts");
        }
    }

    fetchPosts=async(): Promise<IResponse &{data?:IPost[]}>=>{
        try {
            const data = await postRepo.findPost()
            if(!data){
                return{status:StatusCode.NotFound, message:"No data found"}
            }
            return{status:StatusCode.OK, message:"Data fetched", data}
        } catch (error) {
            console.log("Error occured fetching posts post-case");
            return handleError(error, "An error occurred while fetching posts");
        }
    }
}