import { StatusCode } from "../../interface/StatusCode.js";
import PostUseCase from "../use-case/postUseCase.js";
export default class PostController {
    postUseCase;
    constructor() {
        this.postUseCase = new PostUseCase();
    }
    createPost = async (req, res) => {
        try {
            const { userId } = req.params;
            const { title } = req.body;
            const imageBuffer = req.file?.buffer;
            if (!imageBuffer) {
                res.status(StatusCode.NotFound).json({ message: 'No images uploaded.' });
                return;
            }
            const response = await this.postUseCase.addPost(title, imageBuffer, userId);
            res.status(response.status).json({ message: response.message, data: response.data });
        }
        catch (error) {
            console.log("Create post error on controller", error);
            res.status(StatusCode.InternalServerError).json({
                message: "Internal server error"
            });
        }
    };
    getPost = async (req, res) => {
        try {
            const response = await this.postUseCase.fetchPosts();
            res.status(response.status).json({ message: response.message, data: response.data });
        }
        catch (error) {
            console.log("Fetching post error on controller", error);
            res.status(StatusCode.InternalServerError).json({
                message: "Internal server error"
            });
        }
    };
}
