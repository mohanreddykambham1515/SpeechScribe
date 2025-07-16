import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ArrowRight, ExternalLink } from "lucide-react";

interface AutomationStep {
  type: 'navigate' | 'search' | 'click' | 'wait' | 'type';
  target?: string;
  value?: string;
  selector?: string;
  description: string;
}

interface AutomationInstructionsProps {
  steps: AutomationStep[];
  isVisible: boolean;
  onClose: () => void;
}

export function AutomationInstructions({ steps, isVisible, onClose }: AutomationInstructionsProps) {
  if (!isVisible || !steps.length) return null;

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'navigate':
        return <ExternalLink className="w-4 h-4 text-blue-500" />;
      case 'search':
      case 'type':
        return <ArrowRight className="w-4 h-4 text-green-500" />;
      case 'click':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      case 'wait':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <ArrowRight className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStepBadge = (type: string) => {
    switch (type) {
      case 'navigate':
        return <Badge variant="outline" className="text-blue-600">Navigate</Badge>;
      case 'search':
        return <Badge variant="outline" className="text-green-600">Search</Badge>;
      case 'type':
        return <Badge variant="outline" className="text-green-600">Type</Badge>;
      case 'click':
        return <Badge variant="outline" className="text-purple-600">Click</Badge>;
      case 'wait':
        return <Badge variant="outline" className="text-yellow-600">Wait</Badge>;
      default:
        return <Badge variant="outline">Action</Badge>;
    }
  };

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <ArrowRight className="w-5 h-5 text-blue-500" />
            <span>Automation Steps</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Follow these steps to complete your voice command:
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <div className="flex-shrink-0 mt-1">
              {getStepIcon(step.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Step {index + 1}
                </span>
                {getStepBadge(step.type)}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {step.description}
              </p>
              {step.value && (
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                  {step.value}
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-200">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            The website has been opened in a new tab. Follow the steps above to complete your command.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}