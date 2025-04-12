
import React, { useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onCodeRun?: (code: string) => void;
  isRunning?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialCode = '# 在这里编写你的代码\n\ndef say_hello():\n    print("Hello, World!")\n\n# 调用函数\nsay_hello()', 
  language = 'python',
  onCodeRun,
  isRunning = false
}) => {
  const [code, setCode] = useState(initialCode);
  const { toast } = useToast();

  const handleRunCode = () => {
    if (onCodeRun) {
      onCodeRun(code);
    } else {
      // 如果没有提供onCodeRun回调，则显示默认的反馈
      setTimeout(() => {
        toast({
          title: "代码执行成功",
          description: "输出: Hello, World!",
          variant: "default",
        });
      }, 800);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    toast({
      title: "代码已重置",
      description: "编辑器已恢复到初始状态",
      variant: "default",
    });
  };

  return (
    <Card className="border shadow-md">
      <CardHeader className="bg-gray-50 px-4 py-2 border-b flex flex-row justify-between items-center">
        <CardTitle className="text-sm font-medium">代码编辑器 ({language.toUpperCase()})</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            disabled={isRunning}
            className="h-7 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            重置
          </Button>
          <Button 
            size="sm" 
            onClick={handleRunCode}
            disabled={isRunning}
            className="h-7 text-xs bg-learning-primary hover:bg-learning-secondary"
          >
            {isRunning ? (
              <>
                <span className="animate-spin text-xs mr-1">⏳</span>
                运行中...
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1" />
                运行
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="code-editor p-4 min-h-[300px] w-full font-mono text-sm">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-transparent outline-none resize-none w-full h-[280px] text-codeEditor-text"
            spellCheck="false"
            disabled={isRunning}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeEditor;
