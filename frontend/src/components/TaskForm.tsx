// TaskForm.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from './ui/textarea';
import { useState, useCallback } from 'react';
import axios from 'axios';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const;

const TASK_TYPES = [
  { value: 'personal', label: 'Personal' },
  { value: 'work', label: 'Work' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
] as const;

type Priority = (typeof PRIORITY_OPTIONS)[number]['value'];
type TaskType = (typeof TASK_TYPES)[number]['value'];

interface TaskFormProps {
  titleHeading: string;
  btnText: string;
  onTaskCreated?: (task: Task) => void;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: Priority;
  dueDate: string;
  completed?: boolean;
}

interface FormData {
  title: string;
  description: string;
  priority: Priority;
  type: TaskType;
  dueDate: Date | undefined;
}

const INITIAL_FORM_STATE: FormData = {
  title: '',
  description: '',
  priority: 'low',
  type: 'personal',
  dueDate: undefined,
};

export function TaskForm({ titleHeading, btnText, onTaskCreated }: TaskFormProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string | Date | undefined) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateValue = e.target.value;
      handleInputChange('dueDate', dateValue ? new Date(dateValue) : undefined);
    },
    [handleInputChange],
  );

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.post<Task>(
        'https://week-2-task-manager.onrender.com/api/v1/task',
        {
          ...formData,
          dueDate: formData.dueDate.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success('Task created successfully');
      onTaskCreated?.(response.data);
      setFormData(INITIAL_FORM_STATE);
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex justify-center">
        <Card className="w-[500px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{titleHeading}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid w-full items-center gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter description"
                  rows={4}
                  className="resize-none"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-3">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange('priority', value as Priority)}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {PRIORITY_OPTIONS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-3">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value as TaskType)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {TASK_TYPES.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
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
                  required
                  onChange={handleDateChange}
                  value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button size="lg" className="text-lg" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : btnText}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
