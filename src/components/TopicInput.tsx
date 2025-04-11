
import React, { useState } from 'react';
import { Search, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
  processingStage?: 'idle' | 'generating' | 'refining';
}

const TopicInput: React.FC<TopicInputProps> = ({ 
  onSubmit, 
  isLoading,
  processingStage = 'idle' 
}) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  const renderButtonContent = () => {
    if (isLoading) {
      if (processingStage === 'generating') {
        return (
          <span className="flex items-center">
            <Brain className="h-4 w-4 mr-2 animate-pulse" /> 生成教程中...
          </span>
        );
      } else if (processingStage === 'refining') {
        return (
          <span className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2 animate-pulse" /> 细化步骤中...
          </span>
        );
      } else {
        return (
          <span className="flex items-center">
            <span className="animate-spin mr-2">⏳</span> 处理中...
          </span>
        );
      }
    } else {
      return (
        <span className="flex items-center">
          <Search className="h-4 w-4 mr-2" /> 生成教程
        </span>
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl mx-auto mb-6">
      <div className="flex-1">
        <Input
          placeholder="输入您想学习的编程知识点 (例如: Python装饰器, JavaScript Promise)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        disabled={!topic.trim() || isLoading} 
        className="bg-learning-primary hover:bg-learning-secondary"
      >
        {renderButtonContent()}
      </Button>
    </form>
  );
};

export default TopicInput;
