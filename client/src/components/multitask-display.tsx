import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, Clock, X, List, ExternalLink } from "lucide-react";

interface TaskResult {
  taskNumber: number;
  command: string;
  result: {
    success: boolean;
    message: string;
    action?: string;
    url?: string;
    steps?: any[];
    information?: string;
  };
  status: 'completed' | 'failed' | 'pending';
}

interface MultitaskDisplayProps {
  tasks: TaskResult[];
  isVisible: boolean;
  onClose: () => void;
  onExecuteTask?: (taskResult: TaskResult) => void;
}

export function MultitaskDisplay({ 
  tasks, 
  isVisible, 
  onClose, 
  onExecuteTask 
}: MultitaskDisplayProps) {
  if (!isVisible || !tasks || tasks.length === 0) return null;

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const failedTasks = tasks.filter(t => t.status === 'failed').length;
  const totalTasks = tasks.length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="text-green-700 border-green-300">Completed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="text-red-700 border-red-300">Failed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-700 border-yellow-300">Pending</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-700 border-gray-300">Unknown</Badge>;
    }
  };

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <List className="w-5 h-5 text-blue-600" />
            <span>Multitask Execution</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            {completedTasks}/{totalTasks} Completed
          </Badge>
          {failedTasks > 0 && (
            <Badge variant="outline" className="text-red-700 border-red-300">
              {failedTasks} Failed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 w-full">
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.taskNumber} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-bold text-blue-600">
                        {task.taskNumber}.
                      </span>
                      <span className="text-sm font-medium">{task.command}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(task.status)}
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Result:</strong> {task.result.message}
                  </div>
                  
                  {task.result.information && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <strong>Information:</strong>
                      <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                        {task.result.information.substring(0, 200)}...
                      </div>
                    </div>
                  )}
                  
                  {task.result.url && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onExecuteTask && onExecuteTask(task)}
                        className="flex items-center space-x-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Execute</span>
                      </Button>
                      <span className="text-xs text-gray-500">{task.result.url}</span>
                    </div>
                  )}
                  
                  {task.result.steps && task.result.steps.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500">
                        {task.result.steps.length} automation steps available
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        
        {/* Summary */}
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Execution Summary: {completedTasks} of {totalTasks} tasks completed successfully
          </div>
          {failedTasks > 0 && (
            <div className="text-sm text-red-600 dark:text-red-400 mt-1">
              {failedTasks} tasks failed to execute
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}