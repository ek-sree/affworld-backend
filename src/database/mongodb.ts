import mongoose from "mongoose"
import config from "../config/index.js"

export const connectToDatabase= async ()=>{
    try {
        await mongoose.connect(config.mongoUrl)
        console.log("Database connected successfully")
    }catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Can't connect to database", { message: error.message, stack: error.stack });
        } else {
          console.log("Can't connect to database", { message: "Unknown error", stack: String(error) });
        }
    }
}