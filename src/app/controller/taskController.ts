import { Request, Response } from "express";
import { StatusCode } from "../../interface/StatusCode.js";
import TaskUseCase from "../use-case/taskUseCase.js";

export default class TaskController{
    private taskUseCase: TaskUseCase;

    constructor() {
        this.taskUseCase = new TaskUseCase();
    }

    createTask=async(req:Request, res:Response): Promise<void>=>{
        try {
            const {title,description} = req.body;
            const {userId} = req.params;
            
            const response = await this.taskUseCase.addTask(title,description,userId)
            res.status(response.status).json({message:response.message, data:response.data})
        } catch (error) {
            console.log("Create task error on controller", error);
            res.status(StatusCode.InternalServerError).json({ 
                message: "Internal server error" 
            });
        }
    }
    getTasks=async(req:Request, res:Response): Promise<void>=>{
        try {
            const {userId} = req.params            
            const response =  await this.taskUseCase.getTasks(userId)
            res.status(response.status).json({message:response.message, data:response.data})
        } catch (error) {
            console.log("fetch task error on controller", error);
            res.status(StatusCode.InternalServerError).json({ 
                message: "Internal server error" 
            });
        }
    }
    
    editTask=async(req:Request,res:Response):Promise<void>=>{
        try {            
            const {taskId} = req.params
            const status = req.body.status
            const response = await this.taskUseCase.editTask(taskId,status)
            res.status(response.status).json({message:response.message, data:response.data})
        } catch (error) {
            console.log("edit task error on controller", error);
            res.status(StatusCode.InternalServerError).json({ 
                message: "Internal server error" 
            });
        }
    }

    deleteTask= async(req:Request, res:Response):Promise<void>=>{
        try {
            
            const {taskId} = req.params            
            const response = await this.taskUseCase.deleteTask(taskId)
            res.status(response.status).json({message:response.message})
        } catch (error) {
            console.log("delete task error on controller", error);
            res.status(StatusCode.InternalServerError).json({ 
                message: "Internal server error" 
            });
        }
    }

}