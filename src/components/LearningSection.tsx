
import React, { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import LessonPanel from '@/components/LessonPanel';
import FeedbackPanel from '@/components/FeedbackPanel';
import ProgressTracker from '@/components/ProgressTracker';
import StepNavigation from '@/components/StepNavigation';
import TopicInput from '@/components/TopicInput';
import { GeneratedLesson, LessonStep, getCodeFeedback, CodeFeedback } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

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
  const [feedback, setFeedback] = useState<CodeFeedback>({ 
    type: 'none', 
    message: '', 
    details: '',
    suggestions: [] 
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const { toast } = useToast();
  
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
  
  const handleCodeRun = async (code: string) => {
    setIsEvaluating(true);
    
    try {
      toast({
        title: "代码评估中",
        description: "AI正在分析您的代码...",
        variant: "default",
      });
      
      // 调用API获取代码反馈
      const codeFeedback = await getCodeFeedback(code, currentLessonStep, lesson.lessonTitle);
      setFeedback(codeFeedback);
      
      // 显示成功或错误通知
      if (codeFeedback.type === 'success') {
        toast({
          title: "代码通过",
          description: codeFeedback.message,
          variant: "default",
        });
      } else if (codeFeedback.type === 'error') {
        toast({
          title: "需要修改",
          description: codeFeedback.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('评估代码失败', error);
      toast({
        title: "评估失败",
        description: "无法评估代码，请稍后重试",
        variant: "destructive",
      });
      setFeedback({
        type: 'error',
        message: '评估代码时出错',
        details: '无法连接到评估服务',
        suggestions: ['请检查您的网络连接', '稍后重试']
      });
    } finally {
      setIsEvaluating(false);
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
            isEvaluating={isEvaluating}
          />
        </div>
        
        <CodeEditor 
          initialCode={currentLessonStep.initialCode}
          onCodeRun={handleCodeRun}
          isRunning={isEvaluating}
        />
      </div>
      
      <StepNavigation 
        currentStep={currentStep} 
        totalSteps={lesson.steps.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        disableNext={feedback.type !== 'success' && currentStep < lesson.steps.length}
      />
    </>
  );
};

export default LearningSection;
