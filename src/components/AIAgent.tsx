import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, History, Plus, MessageSquare, BookOpen, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  getAIAgentResponse, 
  getUserAgentSessions, 
  getSessionMessages,
  createAgentSession,
  AIAgentMessage,
  AIAgentSession,
  AIAgentResponse
} from '@/services/aiAgentService';
import TutorialDisplay from './TutorialDisplay';
import { StepByStepTutorial } from '@/services/tutorialService';

interface AIAgentProps {
  userId?: string;
  initialTopic?: string;
}

const AIAgent: React.FC<AIAgentProps> = ({ 
  userId = '12345', // 默认用户ID
  initialTopic = '编程学习'
}) => {
  const [activeTab, setActiveTab] = useState('current');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AIAgentMessage[]>([]);
  const [sessions, setSessions] = useState<AIAgentSession[]>([]);
  const [currentSession, setCurrentSession] = useState<AIAgentSession | null>(null);
  const [newSessionTopic, setNewSessionTopic] = useState('');
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState<StepByStepTutorial | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // 加载用户会话历史
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const userSessions = await getUserAgentSessions(userId);
        setSessions(userSessions);
        
        // 如果有会话，默认选择最新的一个
        if (userSessions.length > 0) {
          const latestSession = userSessions[0];
          setCurrentSession(latestSession);
          loadSessionMessages(latestSession.id);
        } else {
          // 如果没有会话，创建一个新会话
          createNewSession(initialTopic);
        }
      } catch (error) {
        console.error('加载会话历史失败:', error);
        toast({
          title: "加载失败",
          description: "无法加载会话历史，请稍后重试",
          variant: "destructive",
        });
      }
    };
    
    loadSessions();
  }, [userId, initialTopic, toast]);
  
  // 加载特定会话的消息历史
  const loadSessionMessages = async (sessionId: string) => {
    try {
      const sessionMessages = await getSessionMessages(sessionId);
      setMessages(sessionMessages);
    } catch (error) {
      console.error('加载会话消息失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载会话消息，请稍后重试",
        variant: "destructive",
      });
    }
  };
  
  // 创建新会话
  const createNewSession = async (topic: string) => {
    try {
      const newSession = await createAgentSession(userId, topic);
      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      setMessages([]);
      setShowNewSessionForm(false);
      setNewSessionTopic('');
      
      // 添加系统欢迎消息
      const welcomeMessage: AIAgentMessage = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `你好！我是你的AI学习助手。我可以帮助你学习关于${topic}的知识。有什么我能帮到你的吗？`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      toast({
        title: "创建成功",
        description: `已创建"${topic}"的新会话`,
        variant: "default",
      });
    } catch (error) {
      console.error('创建新会话失败:', error);
      toast({
        title: "创建失败",
        description: "无法创建新会话，请稍后重试",
        variant: "destructive",
      });
    }
  };
  
  // 切换会话
  const switchSession = (session: AIAgentSession) => {
    setCurrentSession(session);
    loadSessionMessages(session.id);
  };
  
  // 发送消息
  const handleSend = async () => {
    if (!input.trim() || !currentSession) return;
    
    // 添加用户消息
    const userMessage: AIAgentMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // 调用AI服务获取回复
      const response = await getAIAgentResponse(
        input, 
        currentSession.id, 
        currentSession.topic
      ) as AIAgentResponse;
      
      // 添加AI回复
      const aiMessage: AIAgentMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // 检查是否有教程数据
      if (response.stepByStepTutorial) {
        setCurrentTutorial(response.stepByStepTutorial);
        setShowTutorial(true);
        setActiveTab('tutorial');
        
        toast({
          title: "教程已生成",
          description: `已为您生成"${response.stepByStepTutorial.title}"教程`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('获取AI回复失败:', error);
      toast({
        title: "获取回复失败",
        description: "无法连接到AI助手，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // 处理建议问题点击
  const handleSuggestedQuestionClick = (question: string) => {
    setInput(question);
  };
  
  // 自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // 格式化日期
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // 渲染消息
  const renderMessage = (message: AIAgentMessage) => {
    const isUser = message.role === 'user';
    
    return (
      <div 
        key={message.id} 
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div 
          className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'ml-2 bg-learning-primary text-white' : 'mr-2 bg-gray-200'}`}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </div>
          <div>
            <div className={`p-3 rounded-lg ${isUser ? 'bg-learning-primary text-white' : 'bg-gray-100'}`}>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
            <div className={`text-xs mt-1 text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
              {formatTime(new Date(message.timestamp))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染建议问题
  const suggestedQuestions = [
    '如何开始学习编程？',
    '有哪些编程语言适合初学者？',
    '学习编程需要什么基础知识？',
    '如何提高编程技能？'
  ];
  
  return (
    <div className="flex flex-col h-[600px]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">
              <MessageSquare className="w-4 h-4 mr-2" />
              当前会话
            </TabsTrigger>
            <TabsTrigger value="tutorial" disabled={!currentTutorial}>
              <BookOpen className="w-4 h-4 mr-2" />
              学习教程
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              历史会话
            </TabsTrigger>
          </TabsList>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowNewSessionForm(true)}
            disabled={showNewSessionForm}
          >
            <Plus className="h-4 w-4 mr-1" />
            新会话
          </Button>
        </div>
        
        <TabsContent value="current" className="flex-1 flex flex-col h-full mt-0">
          {currentSession && (
            <>
              <div className="mb-2 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-learning-primary" />
                <span className="font-medium text-sm">{currentSession.topic}</span>
              </div>
              
              <Card className="flex-1 flex flex-col">
                <CardContent className="flex-1 p-4 overflow-hidden">
                  <ScrollArea className="h-[400px] pr-4">
                    {messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        开始新的对话吧！
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map(renderMessage)}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  {suggestedQuestions.length > 0 && messages.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSuggestedQuestionClick(question)}
                        >
                          {question}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex w-full">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="输入你的问题..."
                      className="flex-1 resize-none"
                      rows={2}
                      disabled={isLoading}
                    />
                    <Button 
                      className="ml-2 self-end" 
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </>
          )}
          
          {showNewSessionForm && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">创建新会话</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex">
                  <Input
                    value={newSessionTopic}
                    onChange={(e) => setNewSessionTopic(e.target.value)}
                    placeholder="输入会话主题..."
                    className="flex-1"
                  />
                  <Button 
                    className="ml-2" 
                    onClick={() => createNewSession(newSessionTopic || '编程学习')}
                    disabled={isLoading}
                  >
                    创建
                  </Button>
                  <Button 
                    variant="outline" 
                    className="ml-2" 
                    onClick={() => {
                      setShowNewSessionForm(false);
                      setNewSessionTopic('');
                    }}
                  >
                    取消
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="tutorial" className="flex-1">
          {currentTutorial ? (
            <TutorialDisplay 
              tutorial={currentTutorial} 
              onComplete={() => {
                toast({
                  title: "教程完成",
                  description: "恭喜您完成了本次学习教程！",
                  variant: "default",
                });
                setActiveTab('current');
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">暂无教程</h3>
              <p className="text-sm text-gray-500 mb-4">
                向AI助手询问编程相关问题，系统会自动生成相应的学习教程
              </p>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('current')}
              >
                返回对话
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <Card>
            <CardContent className="p-4">
              {sessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无会话历史
                </div>
              ) : (
                <ScrollArea className="h-[450px]">
                  <div className="space-y-2">
                    {sessions.map(session => (
                      <div 
                        key={session.id} 
                        className={`p-3 border rounded-lg hover:border-learning-primary hover:bg-gray-50 cursor-pointer transition-all ${currentSession?.id === session.id ? 'border-learning-primary bg-gray-50' : ''}`}
                        onClick={() => switchSession(session)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <History className="h-4 w-4 mr-2 text-gray-500" />
                            <div className="font-medium text-sm">{session.topic}</div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(session.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {session.messages.length} 条消息
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAgent;