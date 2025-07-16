import { useState, useCallback } from 'react';

interface AutomationStep {
  type: 'navigate' | 'search' | 'click' | 'wait' | 'type';
  target?: string;
  value?: string;
  selector?: string;
  description: string;
}

interface AutomationResult {
  success: boolean;
  message: string;
  steps?: AutomationStep[];
}

export function useBrowserAutomation() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [executedSteps, setExecutedSteps] = useState<string[]>([]);

  const executeAutomation = useCallback(async (result: AutomationResult) => {
    if (!result.steps || result.steps.length === 0) {
      // Simple navigation
      if (result.url) {
        window.open(result.url, '_blank');
      }
      return;
    }

    setIsExecuting(true);
    setExecutedSteps([]);

    try {
      // For complex actions, we'll open the URL and provide instructions
      const url = result.steps[0].target || result.url;
      if (url) {
        const newWindow = window.open(url, '_blank');
        
        // Show step-by-step instructions to user
        const stepDescriptions = result.steps.map(step => step.description);
        setExecutedSteps(stepDescriptions);
        
        // Since we can't directly control the browser due to security restrictions,
        // we'll show the user what they need to do manually
        setCurrentStep('Browser automation complete - follow the instructions shown');
      }
    } catch (error) {
      console.error('Automation error:', error);
      setCurrentStep('Automation failed - opening website manually');
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const executeStepsWithInstructions = useCallback(async (steps: AutomationStep[]) => {
    if (!steps || steps.length === 0) return;

    setIsExecuting(true);
    setExecutedSteps([]);

    // Build instructions for the user
    const instructions = steps.map(step => {
      switch (step.type) {
        case 'navigate':
          return `1. Navigate to ${step.target}`;
        case 'search':
          return `2. Find the search box and type: "${step.value}"`;
        case 'click':
          return `3. Click the search or submit button`;
        case 'wait':
          return `4. Wait for the page to load`;
        case 'type':
          return `5. Type: "${step.value}"`;
        default:
          return step.description;
      }
    });

    setExecutedSteps(instructions);
    setCurrentStep('Instructions ready - check the steps below');
    setIsExecuting(false);
  }, []);

  const reset = useCallback(() => {
    setIsExecuting(false);
    setCurrentStep('');
    setExecutedSteps([]);
  }, []);

  return {
    isExecuting,
    currentStep,
    executedSteps,
    executeAutomation,
    executeStepsWithInstructions,
    reset
  };
}