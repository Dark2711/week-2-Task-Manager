import Header from '@/components/Header';
import { TaskForm } from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

const Task = () => {
  return (
    <div className="mx-auto min-h-screen bg-background p-4 md:p-6 space-y-4 md:space-y-6 flex justify-center flex-col w-[90%] md:w-[80%]">
      <Header />
      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-6">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <TaskForm btnText="Create Task" titleHeading="Create Your Task" />
        </div>
        <div className="w-full md:w-2/3 lg:w-3/4 mt-4 md:mt-0">
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Task;
