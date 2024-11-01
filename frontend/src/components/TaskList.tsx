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
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Textarea } from './ui/textarea';
// Constants for types and priorities
const TASK_TYPES = ['personal', 'work', 'shopping', 'health'];
const TASK_PRIORITIES = ['low', 'medium', 'high'];

interface Task {
  _id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  dueDate: string;
  completed?: boolean;
}

interface TaskFormData {
  title?: string;
  description?: string;
  priority?: string;
  type?: string;
  dueDate?: Date | string;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({});

  // const [title, setTitle] = useState<string>('');
  // const [description, setDescription] = useState<string>('');
  // const [priority, setPriority] = useState<string>('');
  // const [type, setType] = useState<string>('');
  // const [dueDate, setDueDate] = useState<Date | undefined>();
  // const [refreshTasks, setRefreshTasks] = useState(false); // New state for refreshing tasks

  // Memoized API call handler
  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await axios.get('http://localhost:3000/api/v1/task/allTasks', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tasksData = Array.isArray(response.data) ? response.data : response.data.tasks || [];

      setTasks(tasksData);
      setError(null);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to fetch tasks'
        : 'An unexpected error occurred';

      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);
  // Consolidated API error handling
  const handleApiError = useCallback((error: unknown, errorMessage: string) => {
    console.error('API Error:', error);
    toast.error(errorMessage);
  }, []);

  // Memoized task action handlers
  const markAsDone = useCallback(
    async (taskId: string) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No authentication token found');
          return;
        }

        await axios.patch(
          `http://localhost:3000/api/v1/task/${taskId}`,
          { completed: true },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === taskId ? { ...task, completed: true } : task)),
        );

        toast.success('Task marked as completed');
      } catch (error) {
        handleApiError(error, 'Failed to mark task as completed');
      }
    },
    [handleApiError],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No authentication token found');
          return;
        }

        await axios.delete(`http://localhost:3000/api/v1/task/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success('Task deleted successfully');
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      } catch (error) {
        handleApiError(error, 'Failed to delete task');
      }
    },
    [handleApiError],
  );

  const updateTask = useCallback(
    async (taskId: string, updatedTask: TaskFormData) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No authentication token found');
          return;
        }

        if (Object.keys(updatedTask).length === 0) {
          toast.error('No fields to update');
          return;
        }

        await axios.put(`http://localhost:3000/api/v1/task/${taskId}`, updatedTask, {
          headers: { Authorization: `Bearer ${token}` },
        });

        fetchTasks(); // Refresh tasks after update
        toast.success('Task updated successfully');
      } catch (error) {
        handleApiError(error, 'Failed to update task');
      }
    },
    [handleApiError, fetchTasks],
  );

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Utility function for date formatting
  const formatDate = useCallback(
    (dateString: string) =>
      new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    [],
  );
  // Reset form data
  const resetFormData = () => setFormData({});
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
                <TaskItem
                  key={task._id}
                  task={task}
                  onMarkDone={markAsDone}
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </>
  );
};
// Extracted Task Item Component
const TaskItem: React.FC<{
  task: Task;
  onMarkDone: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: TaskFormData) => void;
  formatDate: (date: string) => string;
}> = ({ task, onMarkDone, onDelete, onUpdate, formatDate }) => {
  const [formData, setFormData] = useState<TaskFormData>({});

  const handleFormChange = (field: keyof TaskFormData, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onUpdate(task._id, formData);
    setFormData({}); // Reset form after submission
  };

  return (
    <>
      <ToastContainer />
      <Card className={`p-4 md:p-6 ${task.completed ? 'opacity-50' : ''}`}>
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
              onClick={() => onMarkDone(task._id)}
              disabled={task.completed}
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
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter title"
                        value={formData.title || ''}
                        onChange={(e) => handleFormChange('title', e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter description"
                        rows={4}
                        value={formData.description || ''}
                        className="resize-none"
                        onChange={(e) => handleFormChange('description', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-3">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={formData.priority || ''}
                          onValueChange={(value) => handleFormChange('priority', value)}
                        >
                          <SelectTrigger id="priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {TASK_PRIORITIES.map((priority) => (
                              <SelectItem key={priority} value={priority}>
                                {priority.charAt(0).toUpperCase() + priority.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col space-y-3">
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={formData.type || ''}
                          onValueChange={(value) => handleFormChange('type', value)}
                        >
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {TASK_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={
                          formData.dueDate
                            ? new Date(formData.dueDate).toISOString().split('T')[0]
                            : ''
                        }
                        onChange={(e) => handleFormChange('dueDate', new Date(e.target.value))}
                      />
                    </div>
                  </div>
                </form>
                <Button size="lg" className="text-lg" onClick={handleSubmit}>
                  Edit Task
                </Button>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task._id)}
              className="hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900 bg-black text-white"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default TaskList;
