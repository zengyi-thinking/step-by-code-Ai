
import React, { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import LessonPanel from '@/components/LessonPanel';
import FeedbackPanel from '@/components/FeedbackPanel';
import ProgressTracker from '@/components/ProgressTracker';
import StepNavigation from '@/components/StepNavigation';
import TopicInput from '@/components/TopicInput';
import { GeneratedLesson, LessonStep } from '@/services/aiService';

interface LearningProps {
  lesson: GeneratedLesson;
  onNewTopicSubmit: (topic: string) => void;
  isLoading: boolean;
  processingStage?: 'idle' | 'generating' | 'refining';
}

const LearningSection: React.FC<LearningProps> = ({ 
  lesson, 
  onNewTopicSubmit, 
  isLoading,
  processingStage = 'idle'
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [feedback, setFeedback] = useState({ 
    type: 'none' as 'success' | 'warning' | 'error' | 'none', 
    message: '', 
    details: '',
    suggestions: [] 
  });
  
  const currentLessonStep: LessonStep = lesson.steps[currentStep - 1];
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setFeedback({ type: 'none', message: '', details: '', suggestions: [] });
    }
  };
  
  const handleNext = () => {
    if (currentStep < lesson.steps.length) {
      setCurrentStep(prev => prev + 1);
      setFeedback({ type: 'none', message: '', details: '', suggestions: [] });
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    setFeedback({ type: 'none', message: '', details: '', suggestions: [] });
  };
  
  const handleCodeRun = (code: string) => {
    // 模拟代码验证和反馈
    const hasError = Math.random() > 0.7;
    
    if (hasError) {
      setFeedback({
        type: 'error',
        message: '你的代码有一些问题',
        details: '函数应该返回一个值，但目前没有返回任何东西。',
        suggestions: [
          '确保使用return语句',
          '检查函数的缩进是否正确',
          '确保所有变量已正确定义'
        ]
      });
    } else {
      setFeedback({
        type: 'success',
        message: '做得好！',
        details: '你的代码正确地实现了函数的功能。',
        suggestions: currentStep < lesson.steps.length ? 
          ['准备好后，点击"下一步"继续学习'] : 
          ['恭喜完成本课程！']
      });
    }
  };

  return (
    <>
      <TopicInput 
        onSubmit={onNewTopicSubmit} 
        isLoading={isLoading}
        processingStage={processingStage}
      />
      
      <div className="py-6 px-4">
        <ProgressTracker 
          steps={lesson.steps.length} 
          currentStep={currentStep} 
          onStepClick={handleStepClick}
        />
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-6">
          <LessonPanel 
            title={currentLessonStep.title} 
            description={currentLessonStep.description}
            examples={currentLessonStep.examples}
            tips={currentLessonStep.tips}
            currentStep={currentStep}
            totalSteps={lesson.steps.length}
          />
          <FeedbackPanel 
            type={feedback.type} 
            message={feedback.message} 
            details={feedback.details}
            suggestions={feedback.suggestions}
          />
        </div>
        
        <CodeEditor 
          initialCode={currentLessonStep.initialCode}
          onCodeRun={handleCodeRun}
        />
      </div>
      
      <StepNavigation 
        currentStep={currentStep} 
        totalSteps={lesson.steps.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </>
  );
};

export default LearningSection;
