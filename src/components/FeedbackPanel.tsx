
import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type FeedbackType = 'success' | 'warning' | 'error' | 'none';

interface FeedbackPanelProps {
  type: FeedbackType;
  message: string;
  details?: string;
  suggestions?: string[];
  isEvaluating?: boolean;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ 
  type, 
  message, 
  details,
  suggestions = [],
  isEvaluating = false
}) => {
  const getFeedbackIcon = () => {
    switch(type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-learning-success" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-learning-warning" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-learning-error" />;
      default:
        return null;
    }
  };

  const getFeedbackColor = () => {
    switch(type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (isEvaluating) {
    return (
      <Card className="border shadow-md bg-blue-50 border-blue-200">
        <CardHeader className="px-4 py-3 border-b">
          <CardTitle className="text-sm font-medium">AI 反馈</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-8 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-blue-500 mb-2 animate-spin" />
            <p className="text-blue-700">AI 正在分析您的代码...</p>
            <p className="text-sm text-blue-600 mt-2">请稍候，这可能需要几秒钟</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'none') {
    return (
      <Card className="border shadow-md bg-gray-50">
        <CardHeader className="px-4 py-3 border-b">
          <CardTitle className="text-sm font-medium">AI 反馈</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center text-gray-500 py-8">
            <p>运行你的代码以获取反馈</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border shadow-md ${getFeedbackColor()}`}>
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-sm font-medium">AI 反馈</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex">
            {getFeedbackIcon()}
            <span className="ml-2 font-medium">{message}</span>
          </div>
          
          {details && (
            <div className="text-sm text-gray-700 ml-7">
              {details}
            </div>
          )}
          
          {suggestions.length > 0 && (
            <div className="ml-7 mt-2 space-y-1">
              <p className="text-sm font-medium">建议:</p>
              <ul className="list-disc pl-5 text-sm">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackPanel;
