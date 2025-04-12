
import React, { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import LessonPanel from '@/components/LessonPanel';
import FeedbackPanel from '@/components/FeedbackPanel';
import ProgressTracker from '@/components/ProgressTracker';
import StepNavigation from '@/components/StepNavigation';
import TopicInput from '@/components/TopicInput';
import AIAssistant from '@/components/AIAssistant';
import UserProfile from '@/components/UserProfile';
import LearningHistory from '@/components/LearningHistory';
import { GeneratedLesson, LessonStep, getCodeFeedback, CodeFeedback, getUserData } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState('learn');
  const { toast } = useToast();
  
  const currentLessonStep: LessonStep = lesson.steps[currentStep - 1];
  
  useEffect(() => {
    // 模拟获取用户数据
    const loadUserData = async () => {
      try {
        await getUserData('12345');
      } catch (error) {
        console.error('加载用户数据失败', error);
      }
    };
    
    loadUserData();
  }, []);
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setFeedback({ type: 'none', message: '', details: '', suggestions: [] });
    }
  };
  
  const handleNext = () => {
    if (currentStep < lesson.steps.length) {
      setCurrentStep(prev => prev - 0 + 1);
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="learn">学习内容</TabsTrigger>
          <TabsTrigger value="assistant">AI助手</TabsTrigger>
          <TabsTrigger value="profile">个人中心</TabsTrigger>
        </TabsList>
        
        <TabsContent value="learn" className="mt-0">
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
        </TabsContent>
        
        <TabsContent value="assistant" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <AIAssistant 
              lessonTitle={lesson.lessonTitle} 
              currentStepTitle={currentLessonStep.title} 
            />
            <div className="space-y-6">
              <LessonPanel 
                title={currentLessonStep.title} 
                description={currentLessonStep.description}
                currentStep={currentStep}
                totalSteps={lesson.steps.length}
              />
              <CodeEditor 
                initialCode={currentLessonStep.initialCode}
                onCodeRun={handleCodeRun}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <UserProfile />
            </div>
            <div>
              <LearningHistory />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
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
