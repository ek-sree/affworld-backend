import { v2 as cloudinary } from "cloudinary";
import config from "../config/index.js";
cloudinary.config({
    api_key: config.CLOUD_API_KEY,
    cloud_name: config.CLOUD_NAME,
    api_secret: config.CLOUD_API_SECRET
});
export default cloudinary;
