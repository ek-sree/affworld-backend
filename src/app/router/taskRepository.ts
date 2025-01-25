import { authCheck } from '../../middleware/authCheck.js';
import TaskController from '../controller/taskController.js';
import {Router} from 'express'

const taskRouter = Router();

const taskController = new TaskController()

taskRouter.post('/addTask/:userId',authCheck, taskController.createTask);
taskRouter.get('/fetchTasks/:userId',authCheck, taskController.getTasks);
taskRouter.put('/editTask/:taskId',authCheck, taskController.editTask)
taskRouter.delete('/deleteTask/:taskId',authCheck, taskController.deleteTask)


export default taskRouter