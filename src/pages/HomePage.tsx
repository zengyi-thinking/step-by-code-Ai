
import React, { useState } from 'react';
import Header from '@/components/Header';
import WelcomeSection from '@/components/WelcomeSection';
import LearningSection from '@/components/LearningSection';
import { generateTutorial, GeneratedLesson } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lesson, setLesson] = useState<GeneratedLesson | null>(null);
  const { toast } = useToast();
  
  const handleTopicSubmit = async (topic: string) => {
    setIsLoading(true);
    try {
      const generatedLesson = await generateTutorial(topic);
      setLesson(generatedLesson);
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
          
          {!lesson ? (
            <WelcomeSection 
              onTopicSubmit={handleTopicSubmit}
              isLoading={isLoading}
            />
          ) : (
            <LearningSection 
              lesson={lesson}
              onNewTopicSubmit={handleTopicSubmit}
              isLoading={isLoading}
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
