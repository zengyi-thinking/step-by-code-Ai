
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getAIAssistance } from '@/services/aiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  lessonTitle?: string;
  currentStepTitle?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  lessonTitle, 
  currentStepTitle 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Add a welcome message when the component mounts
    if (messages.length === 0) {
      const initialMessage: Message = {
        role: 'assistant',
        content: `你好！我是你的AI学习助手。我可以帮助你解决关于${lessonTitle || '当前主题'}的问题。有什么我能帮到你的吗？`,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }
  }, [lessonTitle]);
  
  useEffect(() => {
    // Scroll to the bottom when new messages are added
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message to the chat
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call AI service to get a response
      const response = await getAIAssistance(input, lessonTitle, currentStepTitle);
      
      // Add AI response to the chat
      const aiMessage: Message = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('获取AI助手回复失败:', error);
      toast({
        title: "获取回复失败",
        description: "无法连接到AI助手，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <Card className="border shadow-md">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-sm font-medium flex items-center">
          <Bot className="h-4 w-4 mr-2 text-learning-primary" />
          AI学习助手
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="messages-container h-[300px] overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-3 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-learning-primary text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="flex items-center mb-1">
                  {message.role === 'assistant' ? (
                    <Bot className="h-4 w-4 mr-1" />
                  ) : (
                    <User className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-xs font-medium">
                    {message.role === 'assistant' ? 'AI助手' : '你'}
                  </span>
                </div>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-1 text-right">
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="请输入你的问题..."
              className="flex-1 min-h-[40px] max-h-[120px] resize-y border rounded p-2 text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-learning-primary hover:bg-learning-secondary"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
