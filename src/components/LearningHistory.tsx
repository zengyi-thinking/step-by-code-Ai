
import React from 'react';
import { History, Calendar, ArrowRight, Book } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HistoryItem {
  id: string;
  title: string;
  date: Date;
  progress: number; // 0-100
  lastStep?: string;
}

interface LearningHistoryProps {
  history?: HistoryItem[];
  onHistoryItemClick?: (id: string) => void;
}

const LearningHistory: React.FC<LearningHistoryProps> = ({ 
  history = [],
  onHistoryItemClick 
}) => {
  // 如果没有提供历史记录，使用模拟数据
  const historyItems = history.length > 0 ? history : [
    {
      id: '1',
      title: 'Python 基础语法',
      date: new Date(Date.now() - 86400000 * 2),
      progress: 100,
      lastStep: '完成'
    },
    {
      id: '2',
      title: 'JavaScript Promise',
      date: new Date(Date.now() - 86400000),
      progress: 60,
      lastStep: '异步函数'
    },
    {
      id: '3',
      title: 'React Hooks',
      date: new Date(),
      progress: 30,
      lastStep: 'useEffect 钩子'
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleClick = (id: string) => {
    if (onHistoryItemClick) {
      onHistoryItemClick(id);
    }
  };

  return (
    <Card className="border shadow-md">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-sm font-medium flex items-center">
          <History className="h-4 w-4 mr-2 text-learning-primary" />
          学习历史
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {historyItems.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            暂无学习记录
          </div>
        ) : (
          <div className="space-y-3">
            {historyItems.map(item => (
              <div 
                key={item.id} 
                className="p-3 border rounded-lg hover:border-learning-primary hover:bg-gray-50 cursor-pointer transition-all"
                onClick={() => handleClick(item.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(item.date)}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="mt-2 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-learning-primary h-full rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">进度: {item.progress}%</span>
                  {item.lastStep && (
                    <span className="flex items-center text-learning-primary">
                      <Book className="h-3 w-3 mr-1" />
                      {item.lastStep}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningHistory;
