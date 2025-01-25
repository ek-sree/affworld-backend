import { IResponse } from "../../interface/IResponse.js";
import { handleError } from "../../middleware/errorMiddleware.js";
import { ITask, TaskStatus } from "../../interface/ITask.js";
import TaskRepository from "../repository/taskRepository.js";
import { validateDescription, validateTitle, validateUserId } from "../../utils/validation.js";
import { StatusCode } from "../../interface/StatusCode.js";

const taskRepo=new TaskRepository()


export default class TaskUseCase{
    addTask =async(title: string, description: string, userId: string): Promise<IResponse & {data?:ITask}>=>{
        try {
          const titleValidate = validateTitle(title)
          const userIdValidate = validateUserId(userId)
          const descriptionValidate = validateDescription(description)
          if(!titleValidate || !userIdValidate || !descriptionValidate){
            return{status:StatusCode.BadRequest, message:"Invalid credientials"}
          }
          const data = await taskRepo.create(title,description,userId)
          if(!data){
            return{status:StatusCode.InternalServerError, message:"Cant add the task, Something happende"}
          }
          return{status:StatusCode.Created, message:"Task added", data}
        } catch (error) {
            console.log("Error occured adding taks task-case");
            return handleError(error, "An error occurred while adding task");
        }
    }


    getTasks = async(userId:string):Promise<IResponse &{data?:ITask[]}>=>{
      try {
        const userIdValid = validateUserId(userId)
        if(!userIdValid){
          return{status:StatusCode.BadRequest, message:"Credientials are missing"}
        }
        const data = await taskRepo.findTask(userId)
        if(!data){
          return{status:StatusCode.NotFound, message:"No tasks found"}
        }
        return{status:StatusCode.OK, message:"Task fetched", data}
      } catch (error) {
        console.log("Error occured adding taks task-case");
        return handleError(error, "An error occurred while adding task");
    }
    }

    editTask=async(taskId:string, status:TaskStatus):Promise<IResponse & {data?:ITask}>=>{
      try {
        const taskIdValidate = validateUserId(taskId)
        if(!taskIdValidate){
          return{status:StatusCode.BadRequest, message:"Credientials are invalid"}
        }
        const data = await taskRepo.updateTask(taskId,status)
        if(!data){
          return{status:StatusCode.BadRequest, message:"Cant edit data, Or not found"}
        }
        return{status:StatusCode.OK, message:"Task updated",data}
      } catch (error) {
        console.log("Error occured adding taks task-case");
        return handleError(error, "An error occurred while adding task");
    }
    }

    deleteTask=async(taskId:string):Promise<IResponse>=>{
      try {
        const taskIdValidate = validateUserId(taskId)
        if(!taskIdValidate){
          return{status:StatusCode.BadRequest, message:"Credientials are invalid"}
        }
        const data = await taskRepo.deleteTask(taskId)
        if(!data){
          return{status:StatusCode.BadRequest, message:"Cant edit task,try later"}
        }
        return{status:StatusCode.OK, message:"Task deleted"}
      } catch (error) {
        console.log("Error occured adding taks task-case");
        return handleError(error, "An error occurred while adding task");
    }
    }
}