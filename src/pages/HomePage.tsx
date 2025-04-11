
import React, { useState } from 'react';
import Header from '@/components/Header';
import WelcomeSection from '@/components/WelcomeSection';
import LearningSection from '@/components/LearningSection';
import { generateTutorial, GeneratedLesson } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lesson, setLesson] = useState<GeneratedLesson | null>(null);
  const [processingStage, setProcessingStage] = useState<'idle' | 'generating' | 'refining'>('idle');
  const { toast } = useToast();
  
  const handleTopicSubmit = async (topic: string) => {
    setIsLoading(true);
    setProcessingStage('generating');
    
    try {
      // 显示生成中的状态
      toast({
        title: "AI正在工作中",
        description: "正在生成完整教程内容...",
        variant: "default",
      });
      
      // 调用AI服务生成教程
      const generatedLesson = await generateTutorial(topic);
      
      // 显示正在细化步骤的状态
      setProcessingStage('refining');
      toast({
        title: "教程内容已生成",
        description: "正在将内容细化为学习步骤...",
        variant: "default",
      });
      
      // 短暂延迟，模拟AI正在细化步骤
      // 在实际实现中，这部分已经包含在generateTutorial函数中
      setTimeout(() => {
        setLesson(generatedLesson);
        toast({
          title: "教程生成成功",
          description: `已为您生成关于"${topic}"的学习教程`,
          variant: "default",
        });
        setProcessingStage('idle');
      }, 1000);
      
    } catch (error) {
      console.error("生成教程失败", error);
      toast({
        title: "生成失败",
        description: "无法生成教程，请稍后重试",
        variant: "destructive",
      });
      setProcessingStage('idle');
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
          
          {!lesson ? (
            <WelcomeSection 
              onTopicSubmit={handleTopicSubmit}
              isLoading={isLoading}
              processingStage={processingStage}
            />
          ) : (
            <LearningSection 
              lesson={lesson}
              onNewTopicSubmit={handleTopicSubmit}
              isLoading={isLoading}
              processingStage={processingStage}
            />
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} StepByCode.AI - 交互式AI编程学习平台
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
