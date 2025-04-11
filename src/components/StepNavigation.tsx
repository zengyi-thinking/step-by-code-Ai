
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ 
  currentStep, 
  totalSteps,
  onPrevious,
  onNext
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className={`${isFirstStep ? 'opacity-50' : ''}`}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        上一步
      </Button>
      
      <span className="text-sm text-gray-500">
        {currentStep} / {totalSteps}
      </span>
      
      <Button
        onClick={onNext}
        disabled={isLastStep}
        className={`bg-learning-primary hover:bg-learning-secondary ${isLastStep ? 'opacity-50' : ''}`}
      >
        {isLastStep ? '完成' : '下一步'}
        {!isLastStep && <ArrowRight className="h-4 w-4 ml-1" />}
      </Button>
    </div>
  );
};

export default StepNavigation;
