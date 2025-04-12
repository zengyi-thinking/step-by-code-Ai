// 教程生成服务 - 提供编程教程生成和代码示例功能

import { GeneratedLesson, LessonStep } from './aiService';

export interface TutorialRequest {
  topic: string;        // 教程主题
  userQuery: string;    // 用户原始问题
  programmingLanguage?: string; // 编程语言
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced'; // 难度级别
}

export interface CodeExample {
  code: string;         // 代码内容
  explanation: string;  // 代码解释
  language: string;     // 编程语言
  title: string;        // 示例标题
}

export interface StepByStepTutorial {
  title: string;        // 教程标题
  description: string;  // 教程描述
  language: string;     // 编程语言
  conceptExplanation: string; // 概念解释
  steps: TutorialStep[];  // 教程步骤
  additionalResources: string[]; // 额外学习资源
}

export interface TutorialStep {
  title: string;        // 步骤标题
  explanation: string;  // 步骤解释
  codeExample: CodeExample; // 代码示例
  exercise?: CodeExample;   // 练习（可选）
  tips: string[];       // 提示
}

// 生成分步编程教程
export async function generateStepByStepTutorial(
  request: TutorialRequest
): Promise<StepByStepTutorial> {
  try {
    // 真实API调用 - 使用外部AI API生成分步教程
    const response = await fetch('/api/tutorial/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('API请求失败');
    }

    return await response.json();
  } catch (error) {
    console.error('生成分步教程失败:', error);
    
    // 返回模拟教程数据
    return generateMockTutorial(request);
  }
}

// 将教程转换为GeneratedLesson格式
export function convertToGeneratedLesson(tutorial: StepByStepTutorial): GeneratedLesson {
  return {
    lessonTitle: tutorial.title,
    lessonDescription: tutorial.description,
    steps: tutorial.steps.map(step => ({
      title: step.title,
      description: step.explanation,
      examples: [step.codeExample.code],
      tips: step.tips,
      initialCode: step.exercise?.code || ''
    }))
  };
}

// 生成模拟教程数据
function generateMockTutorial(request: TutorialRequest): StepByStepTutorial {
  const { topic, userQuery, programmingLanguage = 'javascript' } = request;
  
  // 根据主题生成不同的模拟教程
  if (topic.toLowerCase().includes('指针') || userQuery.toLowerCase().includes('指针')) {
    return {
      title: 'C语言指针完全指南',
      description: 'C语言指针是C语言的核心特性之一，本教程将帮助你从零开始掌握指针的概念和使用方法。',
      language: 'c',
      conceptExplanation: '指针是一个变量，其值为另一个变量的内存地址。通过指针，我们可以间接访问和修改内存中的数据。',
      steps: [
        {
          title: '1. 指针的基本概念',
          explanation: '指针是存储内存地址的变量。在C语言中，每个变量都有一个内存地址，指针通过存储这个地址来引用变量。',
          codeExample: {
            title: '指针声明与初始化',
            code: '#include <stdio.h>\n\nint main() {\n    int num = 10;      // 声明整型变量\n    int *ptr;          // 声明指针变量\n    \n    ptr = &num;        // 将num的地址赋给指针\n    \n    printf("num的值: %d\\n", num);\n    printf("num的地址: %p\\n", &num);\n    printf("ptr存储的地址: %p\\n", ptr);\n    printf("ptr指向的值: %d\\n", *ptr);\n    \n    return 0;\n}',
            explanation: '这个例子展示了如何声明和初始化指针。&num获取num的内存地址，*ptr获取ptr指向的值。',
            language: 'c'
          },
          tips: [
            '指针变量的声明格式为：数据类型 *变量名',
            '&运算符用于获取变量的内存地址',
            '*运算符用于获取指针指向的值（解引用）'
          ]
        },
        {
          title: '2. 指针的操作',
          explanation: '通过指针，我们可以间接修改变量的值，这是指针的强大之处。',
          codeExample: {
            title: '通过指针修改变量值',
            code: '#include <stdio.h>\n\nint main() {\n    int num = 10;\n    int *ptr = &num;\n    \n    printf("修改前num的值: %d\\n", num);\n    \n    *ptr = 20;  // 通过指针修改num的值\n    \n    printf("修改后num的值: %d\\n", num);\n    \n    return 0;\n}',
            explanation: '通过*ptr = 20，我们间接修改了num的值，因为ptr指向num的内存地址。',
            language: 'c'
          },
          exercise: {
            title: '练习：交换两个数的值',
            code: '#include <stdio.h>\n\n// 完成这个函数，使用指针交换两个整数的值\nvoid swap(int *a, int *b) {\n    // 在这里编写代码\n    \n}\n\nint main() {\n    int x = 5, y = 10;\n    printf("交换前: x = %d, y = %d\\n", x, y);\n    \n    swap(&x, &y);\n    \n    printf("交换后: x = %d, y = %d\\n", x, y);\n    return 0;\n}',
            explanation: '尝试完成swap函数，使用指针交换两个整数的值。',
            language: 'c'
          },
          tips: [
            '通过解引用操作符*可以修改指针指向的内存中的值',
            '在函数间传递指针可以实现对原始数据的修改',
            '注意指针操作时的内存安全问题'
          ]
        },
        {
          title: '3. 指针与数组',
          explanation: '在C语言中，数组名本质上是指向数组第一个元素的指针，理解这一点对掌握指针和数组的关系至关重要。',
          codeExample: {
            title: '指针与数组的关系',
            code: '#include <stdio.h>\n\nint main() {\n    int arr[5] = {10, 20, 30, 40, 50};\n    int *ptr = arr;  // 数组名是指向第一个元素的指针\n    \n    printf("使用数组下标访问:\\n");\n    for(int i = 0; i < 5; i++) {\n        printf("arr[%d] = %d\\n", i, arr[i]);\n    }\n    \n    printf("\\n使用指针访问:\\n");\n    for(int i = 0; i < 5; i++) {\n        printf("*(ptr + %d) = %d\\n", i, *(ptr + i));\n    }\n    \n    return 0;\n}',
            explanation: '这个例子展示了如何使用指针访问数组元素。ptr + i表示指针向后移动i个元素，*(ptr + i)获取该位置的值。',
            language: 'c'
          },
          tips: [
            '数组名是指向数组第一个元素的常量指针',
            '指针算术运算考虑了数据类型的大小',
            'ptr + 1实际上是增加sizeof(数据类型)个字节'
          ]
        }
      ],
      additionalResources: [
        'C语言程序设计（第2版）- 谭浩强',
        'C Primer Plus（第6版）',
        'https://www.cprogramming.com/tutorial/c/lesson6.html'
      ]
    };
  } else {
    // 默认返回一个基于请求主题的通用教程模板
    return {
      title: `${topic} 编程指南`,
      description: `全面学习${topic}的核心概念和实践应用`,
      language: programmingLanguage,
      conceptExplanation: `${topic}是编程中的重要概念，掌握它将帮助你更有效地解决问题。`,
      steps: [
        {
          title: `1. ${topic}基础`,
          explanation: `${topic}的基本概念和原理介绍。`,
          codeExample: {
            title: '基础示例',
            code: `// ${topic}基础示例代码\nconsole.log("Hello, ${topic}!");`,
            explanation: '这是一个简单的示例，展示了基本用法。',
            language: programmingLanguage
          },
          tips: [
            '从基础概念开始学习',
            '多动手实践',
            '理解原理比记忆代码更重要'
          ]
        },
        {
          title: `2. ${topic}进阶应用`,
          explanation: `如何在实际项目中应用${topic}。`,
          codeExample: {
            title: '进阶示例',
            code: `// ${topic}进阶示例\nfunction advancedExample() {\n  // 实现进阶功能\n  return "Advanced ${topic}";\n}`,
            explanation: '这个示例展示了更复杂的应用场景。',
            language: programmingLanguage
          },
          exercise: {
            title: '练习',
            code: `// 完成以下练习\n// 实现一个使用${topic}的函数\n\nfunction practice() {\n  // 在这里编写代码\n}`,
            explanation: '尝试完成这个练习来巩固所学知识。',
            language: programmingLanguage
          },
          tips: [
            '尝试解决实际问题',
            '查阅官方文档深入学习',
            '参考优秀开源项目的实现'
          ]
        }
      ],
      additionalResources: [
        '官方文档',
        '相关在线教程',
        '推荐书籍'
      ]
    };
  }
}