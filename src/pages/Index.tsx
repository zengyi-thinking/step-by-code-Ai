
import React, { useState } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import LessonPanel from '@/components/LessonPanel';
import FeedbackPanel from '@/components/FeedbackPanel';
import ProgressTracker from '@/components/ProgressTracker';
import StepNavigation from '@/components/StepNavigation';
import TopicInput from '@/components/TopicInput';
import { generateTutorial, GeneratedLesson, LessonStep } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

// 默认的引导消息
const initialMessage = {
  title: "欢迎使用 StepByCode.AI",
  description: "请在上方输入您想学习的编程知识点，AI将为您生成个性化的学习教程。",
  examples: [],
  tips: [
    "例如：Python装饰器、JavaScript Promise",
    "React Hooks使用方法",
    "SQL基础查询",
    "数据结构与算法"
  ],
  initialCode: "// 准备好开始学习了吗？\n// 在上方输入您感兴趣的编程知识点！"
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [lesson, setLesson] = useState<GeneratedLesson | null>(null);
  const [feedback, setFeedback] = useState({ 
    type: 'none' as 'success' | 'warning' | 'error' | 'none', 
    message: '', 
    details: '',
    suggestions: [] 
  });
  
  const { toast } = useToast();
  
  const currentLessonStep: LessonStep = lesson?.steps[currentStep - 1] || initialMessage as LessonStep;
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setFeedback({ type: 'none', message: '', details: '', suggestions: [] });
    }
  };
  
  const handleNext = () => {
    if (lesson && currentStep < lesson.steps.length) {
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
        suggestions: lesson && currentStep < lesson.steps.length ? 
          ['准备好后，点击"下一步"继续学习'] : 
          ['恭喜完成本课程！']
      });
    }
  };

  const handleTopicSubmit = async (topic: string) => {
    setIsLoading(true);
    try {
      const generatedLesson = await generateTutorial(topic);
      setLesson(generatedLesson);
      setCurrentStep(1); // 重置到第一步
      setFeedback({ type: 'none', message: '', details: '', suggestions: [] });
      toast({
        title: "教程生成成功",
        description: `已为您生成关于"${topic}"的学习教程`,
        variant: "default",
      });
    } catch (error) {
      console.error("生成教程失败", error);
      toast({
        title: "生成失败",
        description: "无法生成教程，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 mt-4">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800">AI 自适应编程学习平台</h2>
            <p className="text-gray-600">根据您的需求，智能生成个性化学习路径</p>
          </div>
          
          <TopicInput 
            onSubmit={handleTopicSubmit} 
            isLoading={isLoading}
          />
          
          {lesson && (
            <div className="py-6 px-4">
              <ProgressTracker 
                steps={lesson.steps.length} 
                currentStep={currentStep} 
                onStepClick={handleStepClick}
              />
            </div>
          )}
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <LessonPanel 
              title={currentLessonStep.title} 
              description={currentLessonStep.description}
              examples={currentLessonStep.examples}
              tips={currentLessonStep.tips}
              currentStep={currentStep}
              totalSteps={lesson?.steps.length || 1}
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
        
        {lesson && (
          <StepNavigation 
            currentStep={currentStep} 
            totalSteps={lesson.steps.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} StepByCode.AI - 交互式AI编程学习平台
        </div>
      </footer>
    </div>
  );
};

export default Index;
