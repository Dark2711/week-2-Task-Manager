import { CircleCheckBig, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Textarea } from './ui/textarea';

interface Task {
  _id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  dueDate: string;
  completed?: boolean;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [refreshTasks, setRefreshTasks] = useState(false); // New state for refreshing tasks

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setDueDate(dateValue ? new Date(dateValue) : undefined); // Convert to Date or set as undefined if empty
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = window.localStorage.getItem('token');

        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/v1/task/allTasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else if (response.data.tasks && Array.isArray(response.data.tasks)) {
          setTasks(response.data.tasks);
        } else {
          console.error('Unexpected response structure:', response.data);
          setError('Unexpected response structure');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios Error:', error.response);
          setError(error.response?.data?.message || 'Failed to fetch tasks');
        } else {
          console.error('Unexpected Error:', error);
          setError('An unexpected error occurred');
        }
      }
    };

    fetchTasks();
  }, [refreshTasks]);

  const markAsDone = async (taskId: string) => {
    try {
      const token = window.localStorage.getItem('token');

      if (!token) {
        toast.error('No authentication token found');
        return;
      }

      await axios.patch(
        `http://localhost:3000/api/v1/task/${taskId}`,
        { completed: true }, // Sending the updated status to the backend
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update the local state to mark the task as completed
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? { ...task, completed: true } : task)),
      );
      setRefreshTasks((prev) => !prev);

      toast.success('Task marked as completed');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response);
        toast.error(error.response?.data?.message || 'Failed to mark task as completed');
      } else {
        console.error('Unexpected Error:', error);
        toast.error('An unexpected error occurred');
      }
    }
  };
  const handleDelete = async (taskId: string) => {
    try {
      const token = window.localStorage.getItem('token');

      if (!token) {
        toast.error('No authentication token found');
        return;
      }

      await axios.delete(
        `http://localhost:3000/api/v1/task/${taskId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setRefreshTasks((prev) => !prev);

      toast.success('Task deleted Succcesfully');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response);
        toast.error(error.response?.data?.message || 'Failed to mark task as completed');
      } else {
        console.error('Unexpected Error:', error);
        toast.error('An unexpected error occurred');
      }
    }
  };

  const handleEditSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    taskId: string,
  ): Promise<void> => {
    e.preventDefault();

    try {
      const token = window.localStorage.getItem('token');

      if (!token) {
        toast.error('No authentication token found');
        return;
      }

      // Create an object to hold only the fields that have values
      const updatedTask = {
        ...(title && { title }), // Include title only if it's not empty
        ...(description && { description }), // Include description only if it's not empty
        ...(priority && { priority }), // Include priority only if it's not empty
        ...(type && { type }), // Include type only if it's not empty
        ...(dueDate && { dueDate }), // Include dueDate only if it's not undefined
      };

      // Ensure at least one field is included
      if (Object.keys(updatedTask).length === 0) {
        toast.error('No fields to update');
        return;
      }

      const response = await axios.put(`http://localhost:3000/api/v1/task/${taskId}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRefreshTasks((prev) => !prev);
      console.log(response);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task', error);
      toast.error('Failed to update task');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (error) {
    return (
      <Card className="w-full shadow-lg p-4">
        <div className="text-red-500">Error: {error}</div>
      </Card>
    );
  }

  return (
    <>
      <ToastContainer />
      <Card className="w-full shadow-lg max-h-[600px]">
        <h2 className="p-4 md:p-8 text-xl md:text-2xl font-bold">Your Tasks</h2>
        <ScrollArea className="h-[calc(100vh-16rem)] md:h-[calc(100vh-20rem)]">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
              <p className="text-lg">No tasks yet</p>
              <p className="text-sm">Create a new task to get started</p>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {tasks.map((task) => (
                <Card key={task._id} className={`p-4 md:p-6 ${task.completed ? 'opacity-50' : ''}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3 md:gap-4 flex-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`
                          rounded-full shrink-0 
                          ${
                            task.completed
                              ? 'bg-green-500 text-white cursor-not-allowed'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 bg-black text-white'
                          }
                        `}
                        onClick={() => markAsDone(task._id)}
                      >
                        <CircleCheckBig className="w-4 h-4 md:w-5 md:h-5" />
                      </Button>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`
                          font-medium text-base md:text-lg mb-1 break-words
                          ${task.completed ? 'line-through text-gray-500' : ''}
                        `}
                        >
                          {task.title}
                        </h3>
                        <p
                          className={`
                          text-sm text-gray-500 mb-3 break-words
                          ${task.completed ? 'line-through' : ''}
                        `}
                        >
                          {task.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-purple-500/10 text-purple-500 text-xs md:text-sm">
                            {task.type}
                          </Badge>
                          <Badge className="bg-red-500/10 text-red-500 text-xs md:text-sm">
                            {task.priority}
                          </Badge>

                          <Badge variant="outline" className="text-xs md:text-sm">
                            Due-Date: {formatDate(task.dueDate)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 sm:ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={task.completed}
                            className="hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-slate-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Edit Task</DialogTitle>
                          </DialogHeader>
                          <form>
                            <div className="grid w-full items-center gap-4">
                              <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Title</Label>
                                <Input
                                  id="name"
                                  placeholder="Enter title"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                />
                              </div>
                              <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Description</Label>
                                <Textarea
                                  id="description"
                                  placeholder="Enter description"
                                  rows={4}
                                  value={description}
                                  className="resize-none"
                                  onChange={(e) => setDescription(e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-3">
                                  <Label htmlFor="priority">Priority</Label>
                                  <Select value={priority} onValueChange={setPriority}>
                                    <SelectTrigger id="priority">
                                      <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex flex-col space-y-3">
                                  <Label htmlFor="type">Type</Label>
                                  <Select value={type} onValueChange={setType}>
                                    <SelectTrigger id="type">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                      <SelectItem value="personal">Personal</SelectItem>
                                      <SelectItem value="work">Work</SelectItem>
                                      <SelectItem value="shopping">Shopping</SelectItem>
                                      <SelectItem value="health">Health</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                  id="dueDate"
                                  type="date"
                                  required
                                  onChange={handleDateChange} // Use the custom handler for date conversion
                                  value={dueDate ? dueDate.toISOString().split('T')[0] : ''} // Convert Date to string for display
                                />
                              </div>
                            </div>
                          </form>
                          <Button
                            size="lg"
                            className="text-lg"
                            onClick={(e) => handleEditSubmit(e, task._id)}
                          >
                            Edit Task
                          </Button>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(task._id)}
                        className="hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900 bg-black text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </>
  );
};

export default TaskList;
