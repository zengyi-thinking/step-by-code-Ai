
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Header from '@/components/Header';
import AIAgent from '@/components/AIAgent';
import UserProfile from '@/components/UserProfile';
import LearningHistory from '@/components/LearningHistory';
import { getUserData, updateUserData, UserData } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

// Create an adapter interface to match LearningHistory component's expected HistoryItem type
interface HistoryItem {
  id: string;
  title: string;
  date: Date;
  progress: number;
  lastStep?: string;
}

const AILearningPage = () => {
  const [activeTab, setActiveTab] = useState('ai-assistant');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // 加载用户数据
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const data = await getUserData('12345'); // 假设用户ID为12345
        setUserData(data);
      } catch (error) {
        console.error('加载用户数据失败', error);
        toast({
          title: "加载失败",
          description: "无法加载用户数据，请稍后重试",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [toast]);

  const handleThemeChange = async (theme: 'light' | 'dark') => {
    if (!userData) return;
    
    try {
      const updatedData = await updateUserData(userData.id, {
        preferences: {
          ...userData.preferences,
          theme
        }
      });
      
      setUserData(updatedData);
      toast({
        title: "主题已更新",
        description: `已切换到${theme === 'light' ? '浅色' : '深色'}主题`,
        variant: "default",
      });
    } catch (error) {
      console.error('更新主题失败', error);
      toast({
        title: "更新失败",
        description: "无法更新主题设置，请稍后重试",
        variant: "destructive",
      });
    }
  };

  const handleHistoryItemClick = (id: string) => {
    // 处理历史记录项点击事件
    console.log(`点击了历史记录项: ${id}`);
    toast({
      title: "加载历史记录",
      description: "正在加载历史学习内容...",
      variant: "default",
    });
    // 这里可以添加导航到相应学习内容的逻辑
  };

  // 将学习历史数据转换为LearningHistory组件期望的格式
  const convertLearningHistory = (learningHistory: UserData['learningHistory']): HistoryItem[] => {
    return learningHistory.map(item => ({
      id: item.id,
      title: item.lessonTitle,
      date: item.lastAccessDate,
      progress: item.progress,
      lastStep: `步骤 ${item.currentStep}/${item.completedSteps.length + 1}`
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 mt-4">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800">AI 智能学习助手</h2>
            <p className="text-gray-600">个性化学习体验，随时获取AI辅导</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="ai-assistant">AI 助手</TabsTrigger>
              <TabsTrigger value="user-profile">个人信息</TabsTrigger>
              <TabsTrigger value="learning-history">学习历史</TabsTrigger>
            </TabsList>
            
            <Card>
              <CardContent className="p-4">
                <TabsContent value="ai-assistant" className="mt-0">
                  <AIAgent userId={userData?.id} initialTopic="编程学习" />
                </TabsContent>
                
                <TabsContent value="user-profile" className="mt-0">
                  {userData ? (
                    <UserProfile 
                      username={userData.username}
                      email={userData.email}
                      avatarUrl={userData.avatarUrl}
                    />
                  ) : (
                    <div className="text-center py-8">
                      {isLoading ? '加载中...' : '无法加载用户信息'}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="learning-history" className="mt-0">
                  {userData ? (
                    <LearningHistory 
                      history={convertLearningHistory(userData.learningHistory)}
                      onHistoryItemClick={handleHistoryItemClick}
                    />
                  ) : (
                    <div className="text-center py-8">
                      {isLoading ? '加载中...' : '无法加载学习历史'}
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
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

export default AILearningPage;
