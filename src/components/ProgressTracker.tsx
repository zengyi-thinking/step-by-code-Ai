
import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface ProgressTrackerProps {
  steps: number;
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  steps, 
  currentStep,
  onStepClick 
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {Array.from({ length: steps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              {index > 0 && (
                <div 
                  className={`h-1 flex-1 ${isCompleted ? 'bg-learning-primary' : 'bg-gray-200'}`}
                />
              )}
              <div 
                className={`
                  relative flex items-center justify-center rounded-full
                  cursor-pointer transition-all duration-200
                  ${isCompleted ? 'bg-learning-primary text-white' : 
                    isCurrent ? 'bg-white border-2 border-learning-primary text-learning-primary' : 
                    'bg-white border-2 border-gray-200 text-gray-400'}
                  h-8 w-8
                `}
                onClick={() => onStepClick && onStepClick(stepNumber)}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
                
                <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span 
                    className={`text-xs ${isCurrent ? 'font-medium text-learning-primary' : 'text-gray-500'}`}
                  >
                    {isCurrent ? '当前' : `步骤 ${stepNumber}`}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
