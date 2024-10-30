import { CircleCheckBig, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from './ui/scroll-area';

const TaskList = () => {
  return (
    <Card className="w-full shadow-lg max-h-[600px]">
      <h2 className="p-4 md:p-8 text-xl md:text-2xl font-bold">Your Tasks</h2>
      <ScrollArea className="h-[calc(100vh-16rem)] md:h-[calc(100vh-20rem)]">
        {/* Empty state - uncomment if needed
        <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
          <p className="text-lg">No tasks yet</p>
          <p className="text-sm">Create a new task to get started</p>
        </div> */}
        <div className="space-y-4 p-4">
          <Card className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3 md:gap-4 flex-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full shrink-0 hover:bg-gray-100 dark:hover:bg-gray-800 bg-black text-white"
                >
                  <CircleCheckBig className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-base md:text-lg mb-1 break-words">
                    sfasfsafafaf
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 break-words">fasfasfasfas</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-purple-500/10 text-purple-500 text-xs md:text-sm">
                      Personal
                    </Badge>
                    <Badge className="bg-red-500/10 text-red-500 text-xs md:text-sm">High</Badge>
                    <Badge variant="outline" className="text-xs md:text-sm">
                      Due:12/12/2024
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 sm:ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-slate-200"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900 bg-black text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TaskList;
