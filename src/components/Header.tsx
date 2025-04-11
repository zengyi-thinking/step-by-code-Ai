
import React from 'react';
import { Book, Code, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Code className="h-6 w-6 text-learning-primary mr-2" />
        <h1 className="font-bold text-xl">StepByCode.AI</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="text-gray-600 flex items-center">
          <Book className="h-4 w-4 mr-1" />
          <span>历史教程</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-600 flex items-center">
          <Settings className="h-4 w-4 mr-1" />
          <span>设置</span>
        </Button>
        <Button className="bg-learning-primary hover:bg-learning-secondary text-white">
          开始学习
        </Button>
      </div>
    </header>
  );
};

export default Header;
