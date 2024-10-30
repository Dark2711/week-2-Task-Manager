import { Router, RequestHandler, Request } from 'express';
import authMiddleware from '../middlewares/auth';
import {
  createTask,
  deleteTask,
  getAllTasks,
  markAsDone,
  updateTask,
} from '../controllers/task.controller';

const taskRouter = Router();

taskRouter.use(authMiddleware as RequestHandler);

taskRouter.post('/', createTask);
taskRouter.put('/:id', updateTask);
taskRouter.patch('/:id', markAsDone);
taskRouter.delete('/:id', deleteTask);
taskRouter.get('/allTasks', getAllTasks);

export default taskRouter;
