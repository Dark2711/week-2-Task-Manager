// Header.jsx
import { LogOut, NotebookPen } from 'lucide-react';
import Heading from './Heading';
import { Button } from './ui/button';

const Header = () => {
  return (
    <div className="h-auto min-h-[4rem] p-4 shadow-lg flex flex-col md:flex-row justify-between items-center rounded-lg space-y-2 md:space-y-0">
      <div className="flex justify-center md:justify-center  ">
        <NotebookPen className="h-6 md:h-10 mx-2 md:mx-3" />
        <Heading label="Task Flow" />
      </div>
      <div className="flex items-center justify-center">
        <h2 className="text-sm md:text-base mx-2">Welcome, Prince</h2>
        <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10">
          <LogOut className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
