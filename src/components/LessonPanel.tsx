
import React from 'react';
import { Lightbulb, Book, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LessonPanelProps {
  title: string;
  description: string;
  examples?: string[];
  tips?: string[];
  currentStep: number;
  totalSteps: number;
}

const LessonPanel: React.FC<LessonPanelProps> = ({ 
  title, 
  description, 
  examples = [], 
  tips = [],
  currentStep,
  totalSteps
}) => {
  return (
    <Card className="border shadow-md lesson-panel">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <span className="text-sm text-gray-500">步骤 {currentStep}/{totalSteps}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="text-sm text-gray-700">
            {description}
          </div>
          
          {examples.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <Book className="h-4 w-4 mr-1 text-learning-primary" />
                <span>示例</span>
              </div>
              <div className="pl-5 space-y-1">
                {examples.map((example, index) => (
                  <div key={index} className="text-sm bg-white p-2 rounded border border-gray-200">
                    <code>{example}</code>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {tips.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <Lightbulb className="h-4 w-4 mr-1 text-learning-warning" />
                <span>提示</span>
              </div>
              <div className="pl-5 space-y-1">
                {tips.map((tip, index) => (
                  <div key={index} className="text-sm text-gray-600 flex items-start">
                    <ArrowRight className="h-3 w-3 mr-1 mt-1 text-learning-warning" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonPanel;
