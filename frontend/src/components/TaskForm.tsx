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
import { useState } from 'react';
import axios from 'axios';

interface TaskFormProps {
  titleHeading: string;
  btnText: string;
}
interface Task {
  _id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  dueDate: string;
  completed?: boolean;
}

export function TaskForm({ titleHeading, btnText }: TaskFormProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  // const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<string>('low');
  const [type, setType] = useState<string>('personal');
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setDueDate(dateValue ? new Date(dateValue) : undefined); // Convert to Date or set as undefined if empty
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
      const token = window.localStorage.getItem('token');

      const response = await axios.post(
        `http://localhost:3000/api/v1/task`,
        {
          title,
          description,
          priority,
          type,
          dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTasks([...tasks, response.data]);
      toast.success('Task Created successfully');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <ToastContainer />

      <div className=" flex justify-center">
        <Card className="w-[500px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{titleHeading}</CardTitle>
          </CardHeader>
          <CardContent>
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
                    className="resize-none"
                    value={description}
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
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button size="lg" className="text-lg" onClick={handleSubmit}>
              {btnText}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
