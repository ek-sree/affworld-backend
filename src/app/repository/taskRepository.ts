import TaskModel from "../../models/taskModel.js";
import { ITask, TaskStatus } from "../../interface/ITask.js";


export default class TaskRepository{
    create= async(title:string,description:string, userId:string): Promise<ITask | null>=>{
        try {
            const task = new TaskModel({
                title,
                description,
                user:userId
            })
            const savedTask = await task.save()
            if(!savedTask){
                return null
            }
            return savedTask
        } catch (error) {
            console.log("Error in adding new task", error);
            return null
        }
    }

    findTask= async(userId:string):Promise<ITask[] | null>=>{
        try {
            const tasks = await TaskModel.find({user:userId});
            if(!tasks){
                return null
            }
            return tasks
        } catch (error) {
            console.log("Error in finding all task", error);
            return null
        }
    }

    updateTask = async(taskId:string, status:TaskStatus):Promise<ITask | null>=>{
        try {
            const task = await TaskModel.findOne({_id:taskId})
            if(!task){
                return null
            }
            task.status=status
            const updatedTask = await task.save()
            if(!updatedTask){
                return null
            } 
            return updatedTask
        } catch (error) {
            console.log("Error in updating task", error);
            return null
        }
    }

    deleteTask= async(taskId:string):Promise<boolean>=>{
        try {
            const deleteTask = await TaskModel.findByIdAndDelete(taskId)
            if(!deleteTask){
                return false
            }
            return true
        } catch (error) {
            console.log("Error in deleting task", error);
            return false
        }
    }

}