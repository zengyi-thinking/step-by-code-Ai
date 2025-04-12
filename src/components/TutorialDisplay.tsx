
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, ExternalLink } from 'lucide-react';
import { StepByStepTutorial, TutorialStep } from '@/services/tutorialService';
import CodeEditor from './CodeEditor';

interface TutorialDisplayProps {
  tutorial: StepByStepTutorial;
  onComplete?: () => void;
}

const TutorialDisplay: React.FC<TutorialDisplayProps> = ({ tutorial, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('explanation');
  const [userCode, setUserCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'warning' | 'error' | 'none'; message: string } | null>(null);

  const currentStep = tutorial.steps[currentStepIndex];
  const totalSteps = tutorial.steps.length;

  // 初始化用户代码（如果有练习）
  React.useEffect(() => {
    if (currentStep.exercise) {
      setUserCode(currentStep.exercise.code);
    } else {
      setUserCode(currentStep.codeExample.code);
    }
  }, [currentStepIndex, currentStep]);

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setActiveTab('explanation');
      setFeedback(null);
    } else {
      // 完成教程
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setActiveTab('explanation');
      setFeedback(null);
    }
  };

  const handleCodeChange = (code: string) => {
    setUserCode(code);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    // 这里可以添加代码运行逻辑
    // 模拟代码评估
    setTimeout(() => {
      if (userCode.trim().length > 0) {
        setFeedback({
          type: 'success',
          message: '代码运行成功！继续下一步学习吧。'
        });
      } else {
        setFeedback({
          type: 'warning',
          message: '请先编写一些代码再运行。'
        });
      }
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="tutorial-display">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{tutorial.title}</span>
            <span className="text-sm font-normal text-gray-500">
              步骤 {currentStepIndex + 1}/{totalSteps}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{currentStep.title}</h3>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="explanation">
                <BookOpen className="w-4 h-4 mr-2" />
                解释
              </TabsTrigger>
              <TabsTrigger value="code">
                <Code className="w-4 h-4 mr-2" />
                代码
              </TabsTrigger>
              <TabsTrigger value="tips">
                <Lightbulb className="w-4 h-4 mr-2" />
                提示
              </TabsTrigger>
            </TabsList>

            <TabsContent value="explanation" className="mt-0">
              <div className="prose max-w-none">
                <p>{currentStep.explanation}</p>
              </div>
            </TabsContent>

            <TabsContent value="code" className="mt-0">
              <div className="mb-4">
                <h4 className="text-md font-medium mb-2">
                  {currentStep.exercise ? '练习：' + currentStep.exercise.title : currentStep.codeExample.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {currentStep.exercise ? currentStep.exercise.explanation : currentStep.codeExample.explanation}
                </p>
                
                <div className="border rounded-md overflow-hidden">
                  <CodeEditor
                    initialCode={userCode}
                    language={tutorial.language}
                    onCodeRun={handleRunCode}
                    isRunning={isRunning}
                  />
                </div>
                
                {feedback && (
                  <div className={`mt-4 p-3 rounded-md ${
                    feedback.type === 'success' ? 'bg-green-50 text-green-700' :
                    feedback.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                    feedback.type === 'error' ? 'bg-red-50 text-red-700' : ''
                  }`}>
                    {feedback.message}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tips" className="mt-0">
              <div className="space-y-2">
                <h4 className="text-md font-medium">学习提示：</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {currentStep.tips.map((tip, index) => (
                    <li key={index} className="text-sm">{tip}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>
          <Button onClick={handleNextStep}>
            {currentStepIndex < totalSteps - 1 ? (
              <>
                下一步
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : '完成教程'}
          </Button>
        </CardFooter>
      </Card>

      {/* 额外资源部分 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">额外学习资源</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {tutorial.additionalResources.map((resource, index) => (
              <li key={index} className="flex items-center">
                <ExternalLink className="w-4 h-4 mr-2 text-blue-500" />
                <span>{resource}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialDisplay;
