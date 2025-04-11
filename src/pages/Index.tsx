
import React, { useState } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import LessonPanel from '@/components/LessonPanel';
import FeedbackPanel from '@/components/FeedbackPanel';
import ProgressTracker from '@/components/ProgressTracker';
import StepNavigation from '@/components/StepNavigation';

// Sample lesson data
const lessonSteps = [
  {
    title: "Python 函数基础",
    description: "函数是组织代码的基本单位。在Python中，我们使用def关键字来定义函数。本步骤将介绍如何创建一个简单的函数。",
    examples: [
      "def greet(name):\n    return f\"Hello, {name}!\"",
      "# 调用函数\nresult = greet(\"Alice\")\nprint(result)  # 输出: Hello, Alice!"
    ],
    tips: [
      "函数名应该使用小写字母和下划线",
      "每个函数应该只做一件事情",
      "添加适当的文档字符串来解释函数的用途"
    ],
    initialCode: "# 定义一个函数\ndef say_hello():\n    # 在这里添加代码\n    pass\n\n# 调用函数\nsay_hello()"
  },
  {
    title: "函数参数",
    description: "函数可以接受参数，这使得它们更加灵活和可重用。本步骤将学习如何在函数中使用参数。",
    examples: [
      "def greet(name):\n    return f\"Hello, {name}!\"",
      "# 使用默认参数\ndef greet(name=\"World\"):\n    return f\"Hello, {name}!\""
    ],
    tips: [
      "参数可以有默认值",
      "Python支持位置参数和关键字参数",
      "使用*args和**kwargs可以接受任意数量的参数"
    ],
    initialCode: "# 定义一个带参数的函数\ndef greet(name):\n    # 在这里添加代码\n    pass\n\n# 调用函数\ngreet(\"Alice\")"
  },
  {
    title: "返回值",
    description: "函数可以返回值，让我们能够使用函数的计算结果。本步骤将学习如何从函数返回值。",
    examples: [
      "def add(a, b):\n    return a + b\n\nsum = add(5, 3)  # sum = 8",
      "# 返回多个值\ndef get_coordinates():\n    return (10, 20)\n\nx, y = get_coordinates()"
    ],
    tips: [
      "如果没有return语句，函数默认返回None",
      "可以使用return语句提前结束函数执行",
      "Python允许返回多个值（实际上是一个元组）"
    ],
    initialCode: "# 定义一个返回值的函数\ndef multiply(a, b):\n    # 在这里添加代码\n    pass\n\n# 调用函数并打印结果\nresult = multiply(4, 5)\nprint(result)"
  },
  {
    title: "作用域和变量",
    description: "函数有自己的作用域，这影响变量的可见性和生命周期。本步骤将学习函数作用域的规则。",
    examples: [
      "# 局部变量\ndef my_function():\n    x = 10  # 局部变量\n    print(x)\n\nmy_function()\nprint(x)  # 错误: x未定义",
      "# 使用global关键字\nx = 10\ndef modify_global():\n    global x\n    x = 20\n\nmodify_global()\nprint(x)  # 输出: 20"
    ],
    tips: [
      "局部变量只在函数内部可见",
      "全局变量可以在函数内部读取，但不能直接修改",
      "使用global关键字可以在函数内修改全局变量"
    ],
    initialCode: "# 全局变量\ncounter = 0\n\n# 定义一个修改全局变量的函数\ndef increment():\n    # 在这里添加代码\n    pass\n\n# 调用函数三次\nincrement()\nincrement()\nincrement()\nprint(counter)  # 应该输出 3"
  },
  {
    title: "综合练习",
    description: "现在让我们结合前面学到的内容，创建一个更复杂的函数。这个练习将测试您对Python函数的理解。",
    examples: [
      "def calculate_discount(price, discount_rate=0.1):\n    discount = price * discount_rate\n    final_price = price - discount\n    return final_price, discount"
    ],
    tips: [
      "分解问题为更小的步骤",
      "测试函数时使用不同的输入值",
      "确保函数能够处理各种边界情况"
    ],
    initialCode: "# 创建一个计算平均值的函数\ndef calculate_average(numbers):\n    # 在这里添加代码\n    pass\n\n# 测试函数\nnums = [10, 15, 20, 25, 30]\navg = calculate_average(nums)\nprint(f\"平均值: {avg}\")"
  }
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [feedback, setFeedback] = useState({ 
    type: 'none' as 'success' | 'warning' | 'error' | 'none', 
    message: '', 
    details: '',
    suggestions: [] 
  });
  
  const currentLesson = lessonSteps[currentStep - 1];
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setFeedback({ type: 'none', message: '', details: '', suggestions: [] });
    }
  };
  
  const handleNext = () => {
    if (currentStep < lessonSteps.length) {
      setCurrentStep(prev => prev + 1);
      setFeedback({ type: 'none', message: '', details: '', suggestions: [] });
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    setFeedback({ type: 'none', message: '', details: '', suggestions: [] });
  };
  
  const handleCodeRun = (code: string) => {
    // Simulate code validation and feedback
    const hasError = Math.random() > 0.7;
    
    if (hasError) {
      setFeedback({
        type: 'error',
        message: '你的代码有一些问题',
        details: '函数应该返回一个值，但目前没有返回任何东西。',
        suggestions: [
          '确保使用return语句',
          '检查函数的缩进是否正确',
          '确保所有变量已正确定义'
        ]
      });
    } else {
      setFeedback({
        type: 'success',
        message: '做得好！',
        details: '你的代码正确地实现了函数的功能。',
        suggestions: currentStep < lessonSteps.length ? 
          ['准备好后，点击"下一步"继续学习'] : 
          ['恭喜完成本课程！']
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-10 mt-4">
          <div className="mb-2 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Python 函数教程</h2>
            <p className="text-gray-600">掌握Python函数的基础知识</p>
          </div>
          
          <div className="py-8 px-4">
            <ProgressTracker 
              steps={lessonSteps.length} 
              currentStep={currentStep} 
              onStepClick={handleStepClick}
            />
          </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <LessonPanel 
              title={currentLesson.title} 
              description={currentLesson.description}
              examples={currentLesson.examples}
              tips={currentLesson.tips}
              currentStep={currentStep}
              totalSteps={lessonSteps.length}
            />
            <FeedbackPanel 
              type={feedback.type} 
              message={feedback.message} 
              details={feedback.details}
              suggestions={feedback.suggestions}
            />
          </div>
          
          <CodeEditor 
            initialCode={currentLesson.initialCode}
            onCodeRun={handleCodeRun}
          />
        </div>
        
        <StepNavigation 
          currentStep={currentStep} 
          totalSteps={lessonSteps.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} StepByCode.AI - 交互式AI编程学习平台
        </div>
      </footer>
    </div>
  );
};

export default Index;
