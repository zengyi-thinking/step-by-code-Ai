
import React from 'react';
import TopicInput from '@/components/TopicInput';

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

interface WelcomeSectionProps {
  onTopicSubmit: (topic: string) => void;
  isLoading: boolean;
  processingStage?: 'idle' | 'generating' | 'refining';
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ 
  onTopicSubmit, 
  isLoading, 
  processingStage = 'idle' 
}) => {
  return (
    <>
      <TopicInput 
        onSubmit={onTopicSubmit} 
        isLoading={isLoading}
        processingStage={processingStage}
      />
      
      <div className="mt-12 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">{initialMessage.title}</h3>
          <p className="text-gray-600 mb-4">{initialMessage.description}</p>
          
          {initialMessage.tips.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">建议尝试：</h4>
              <ul className="list-disc pl-5 space-y-1">
                {initialMessage.tips.map((tip, index) => (
                  <li key={index} className="text-gray-600">{tip}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
              {initialMessage.initialCode}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeSection;
