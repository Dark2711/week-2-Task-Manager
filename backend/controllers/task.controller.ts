import z from 'zod';
import { Request, Response } from 'express';
import { Task } from '../models/task.model';

interface CreateTaskRequest extends Request {
  body: {
    title: string;
    description: string;
    priority: string;
    type: string;
    dueDate: Date;
  };
  userId?: string;
}

const createTaskBody = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.string(),
  type: z.string(),
  dueDate: z.string(),
});

const createTask = async (req: CreateTaskRequest, res: Response) => {
  const body = req.body;
  const { success } = createTaskBody.safeParse(body);
  if (!success) {
    res.status(411).json({
      message: 'Invalid Inputs',
    });
    return;
  }

  try {
    const task = await Task.create({
      title: body.title,
      description: body.description,
      priority: body.priority,
      type: body.type,
      dueDate: body.dueDate,
      userId: req.userId,
    });
    res.status(211).json({
      message: 'Task Created',
      task,
    });
    return;
  } catch (error) {
    console.log(error);
    res.send(411).json({
      Error: 'Error creating task',
    });
    return;
  }
};

interface UpdateTaskRequest extends Request {
  body: {
    title: string;
    description: string;
    priority: string;
    type: string;
    dueDate: Date;
  };
  userId?: string;
}
const updateTaskBody = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  priority: z.string().optional(),
  type: z.string().optional(),
  dueDate: z.string().optional(),
});
const updateTask = async (req: UpdateTaskRequest, res: Response) => {
  const { id } = req.params;
  const body = req.body;
  const { success } = updateTaskBody.safeParse(body);
  if (!success) {
    res.status(411).json({
      message: 'Invalid Inputs',
    });
    return;
  }
  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.userId },
      {
        title: body.title,
        description: body.description,
        priority: body.priority,
        type: body.type,
        dueDate: body.dueDate,
      },
      {
        new: true,
      },
    );
    if (!task) {
      res.status(404).json({
        msg: 'Task not found',
      });
      return;
    }
    res.status(200).json({
      msg: 'Task updated successfully',
      book: task,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

interface DeleteTaskRequest extends Request {
  params: {
    id: string;
  };
  userId?: string;
}

const deleteTask = async (req: DeleteTaskRequest, res: Response) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });
    if (!task) {
      res.status(404).json({
        msg: 'Task not found',
      });
      return;
    }
    res.status(200).json({
      msg: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

interface MarkAsDoneRequest extends Request {
  params: {
    id: string;
  };
  userId?: string;
}

const markAsDone = async (req: MarkAsDoneRequest, res: Response) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { completed: true },
      { new: true },
    );
    if (!task) {
      res.status(404).json({
        msg: 'Task not found',
      });
      return;
    }
    res.status(200).json({
      msg: 'Task marked as done successfully',
      task,
    });
  } catch (error) {
    console.error('Error marking task as done:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

interface GetAllTasksRequest extends Request {
  userId?: string;
}

const getAllTasks = async (req: GetAllTasksRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
export { createTask, updateTask, deleteTask, getAllTasks, markAsDone };
