export interface LessonStep {
  title: string;
  description: string;
  examples: string[];
  tips: string[];
  initialCode: string;
}

export interface GeneratedLesson {
  lessonTitle: string;
  lessonDescription: string;
  steps: LessonStep[];
}

export interface CodeFeedback {
  type: 'success' | 'warning' | 'error' | 'none';
  message: string;
  details: string;
  suggestions: string[];
}

export interface AIAssistanceResponse {
  message: string;
  relatedLinks?: string[];
  codeSnippets?: string[];
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  preferences: {
    theme: 'light' | 'dark';
    codeFont: string;
    fontSize: number;
  };
  learningHistory: LearningHistoryItem[];
}

export interface LearningHistoryItem {
  id: string;
  lessonId: string;
  lessonTitle: string;
  startDate: Date;
  lastAccessDate: Date;
  completedSteps: number[];
  currentStep: number;
  progress: number; // 0-100
}

// 生成完整教程
export async function generateTutorial(topic: string): Promise<GeneratedLesson> {
  console.log(`生成关于 ${topic} 的教程`);
  
  try {
    // 真实API调用 - 使用API生成完整教程
    const response = await fetch('/api/generate-tutorial', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      throw new Error('API请求失败');
    }

    const fullTutorial = await response.json();
    return await refineTutorialIntoSteps(fullTutorial, topic);
  } catch (error) {
    console.error('生成教程失败:', error);
    
    // 失败时返回模拟数据
    return mockGenerateTutorial(topic);
  }
}

// 模拟生成教程的后备方法
function mockGenerateTutorial(topic: string): GeneratedLesson {
  // 模拟AI生成的完整教程数据
  const fullTutorial = {
    lessonTitle: `${topic} 教程`,
    lessonDescription: `学习 ${topic} 的基础知识和应用场景`,
    content: `${topic}是编程中的重要概念。首先我们需要了解它的基本原理，然后学习常见用法，最后掌握进阶技巧。
    基本原理包括...（此处是完整教程内容）
    常见用法有...
    进阶技巧包括...`
  };
  
  // 调用细化步骤的函数，将完整教程转换为步骤化教学
  return {
    lessonTitle: `${topic} 教程`,
    lessonDescription: `学习 ${topic} 的基础知识和应用场景`,
    steps: [
      {
        title: `${topic} 基础概念`,
        description: `${topic} 是编程中的重要概念。本步骤将介绍它的基本用法和概念。`,
        examples: [
          "// 基础示例代码\nconsole.log('这是一个基础示例');",
          "// 另一个基础示例\nfunction basicExample() {\n  return '这是基础示例函数';\n}"
        ],
        tips: [
          "理解基本概念是学习的第一步",
          "尝试修改示例代码来深入理解",
          "记住这些基础术语的定义"
        ],
        initialCode: "// 在这里编写您的代码\n\n// 尝试实现基本功能"
      },
      {
        title: `${topic} 常见用法`,
        description: `在掌握了基础之后，让我们来学习 ${topic} 的一些常见应用场景。`,
        examples: [
          "// 常见用法示例\nfunction commonUsage() {\n  // 实现常见功能\n  return '这是常见用法示例';\n}"
        ],
        tips: [
          "尝试将基础知识应用到实际问题中",
          "这些模式在实际开发中经常使用",
          "理解这些用法的适用场景"
        ],
        initialCode: "// 在这里实现常见用法\n\n// 可以基于前面的代码继续编写"
      },
      {
        title: `${topic} 进阶技巧`,
        description: `现在我们来探索 ${topic} 的一些进阶应用技巧和优化方法。`,
        examples: [
          "// 进阶示例\nfunction advancedExample() {\n  // 实现复杂功能\n  return '这是进阶示例';\n}"
        ],
        tips: [
          "这些技巧可以提升代码质量和性能",
          "理解原理比记忆代码更重要",
          "通过解决问题来掌握进阶知识"
        ],
        initialCode: "// 在这里实现进阶功能\n\n// 可以基于前面的代码继续优化"
      }
    ]
  };
}

// 将完整教程细化为教学步骤
async function refineTutorialIntoSteps(fullTutorial: any, topic: string): Promise<GeneratedLesson> {
  try {
    // 真实API调用 - 使用AI将完整教程拆分为步骤
    const response = await fetch('/api/refine-tutorial', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        fullTutorial, 
        topic 
      }),
    });

    if (!response.ok) {
      throw new Error('API请求失败');
    }

    return await response.json();
  } catch (error) {
    console.error('细化教程失败:', error);
    
    // 如果API调用失败，返回基本的教程结构
    if (typeof fullTutorial === 'object' && fullTutorial.lessonTitle) {
      return fullTutorial as GeneratedLesson;
    } else {
      return mockGenerateTutorial(topic);
    }
  }
}

// 提交代码获取反馈
export async function getCodeFeedback(
  code: string, 
  step: LessonStep, 
  lessonTitle: string
): Promise<CodeFeedback> {
  try {
    // 真实API调用 - 使用AI评估代码
    const response = await fetch('/api/evaluate-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        code,
        step,
        lessonTitle 
      }),
    });

    if (!response.ok) {
      throw new Error('API请求失败');
    }

    return await response.json();
  } catch (error) {
    console.error('获取代码反馈失败:', error);
    
    // 模拟随机反馈结果
    const hasError = Math.random() > 0.7;
    
    if (hasError) {
      return {
        type: 'error',
        message: '你的代码有一些问题',
        details: '函数应该返回一个值，但目前没有返回任何东西。',
        suggestions: [
          '确保使用return语句',
          '检查函数的缩进是否正确',
          '确保所有变量已正确定义'
        ]
      };
    } else {
      return {
        type: 'success',
        message: '做得好！',
        details: '你的代码正确地实现了函数的功能。',
        suggestions: [
          '准备好后，继续下一步学习',
          '尝试修改代码以了解更多细节',
          '思考这个概念如何应用到实际项目中'
        ]
      };
    }
  }
}

// 获取AI助手的回复
export async function getAIAssistance(
  userQuestion: string,
  lessonTitle?: string,
  currentStepTitle?: string
): Promise<AIAssistanceResponse> {
  try {
    // 真实API调用 - 使用AI获取对用户问题的回复
    const response = await fetch('/api/ai-assistance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userQuestion,
        lessonTitle,
        currentStepTitle
      }),
    });

    if (!response.ok) {
      throw new Error('API请求失败');
    }

    return await response.json();
  } catch (error) {
    console.error('获取AI助手回复失败:', error);
    
    // 返回模拟回复
    return {
      message: generateMockResponse(userQuestion, lessonTitle, currentStepTitle),
      relatedLinks: [
        '官方文档',
        '相关教程',
        '常见问题'
      ],
      codeSnippets: [
        '```python\nprint("Example code")\n```'
      ]
    };
  }
}

// 生成模拟回复
function generateMockResponse(
  question: string,
  lessonTitle?: string,
  currentStepTitle?: string
): string {
  if (question.toLowerCase().includes('怎么') || question.toLowerCase().includes('如何')) {
    return `根据我对${lessonTitle || '编程'}的理解，您可以通过以下步骤解决这个问题：\n\n1. 首先，确保您理解了${currentStepTitle || '当前概念'}的基础知识\n2. 尝试将问题拆分为更小的部分\n3. 逐步实现每个部分的功能\n\n如果您遇到特定的错误，请告诉我具体的错误信息，我可以帮您更精确地解决问题。`;
  } else if (question.toLowerCase().includes('错误') || question.toLowerCase().includes('bug')) {
    return `遇到错误是编程过程中的常态。根据您描述的问题，可能的原因有：\n\n1. 语法错误 - 检查您的代码是否有拼写错误或缺少标点符号\n2. 逻辑错误 - 检查您的算法逻辑是否正确\n3. 运行时错误 - 可能是由于不正确的输入或边界条件导致的\n\n如果您能提供具体的错误信息或代码片段，我可以提供更具体的帮助。`;
  } else if (question.toLowerCase().includes('概念') || question.toLowerCase().includes('什么是')) {
    return `在${lessonTitle || '编程'}中，这个概念指的是一种重要的编程范式或技术。它的主要特点包括：\n\n1. 提高代码的可重用性\n2. 增强程序的模块化\n3. 简化复杂系统的开发和维护\n\n学习这个概念对提升您的编程技能非常有帮助。如果您对某个具体方面有疑问，请告诉我，我可以深入解释。`;
  } else {
    return `感谢您的问题！作为您的AI学习助手，我很乐意帮助您解决关于${lessonTitle || '编程'}的问题。\n\n${question}是一个很好的问题。在${currentStepTitle || '当前学习阶段'}中，理解这一点确实很重要。\n\n您可以通过实践和多做练习来加深对这个概念的理解。如果您有更具体的问题，请随时提出，我会尽力提供更详细的解答。`;
  }
}

// 获取用户数据
export async function getUserData(userId: string): Promise<UserData> {
  try {
    // 真实API调用 - 获取用户数据
    const response = await fetch(`/api/user/${userId}`);
    if (!response.ok) {
      throw new Error('获取用户数据失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取用户数据失败:', error);
    
    // 返回模拟用户数据
    return {
      id: '12345',
      username: '示例用户',
      email: 'user@example.com',
      avatarUrl: '',
      preferences: {
        theme: 'light',
        codeFont: 'Fira Code',
        fontSize: 14
      },
      learningHistory: [
        {
          id: '1',
          lessonId: 'python-basics',
          lessonTitle: 'Python 基础语法',
          startDate: new Date(Date.now() - 86400000 * 7),
          lastAccessDate: new Date(Date.now() - 86400000 * 2),
          completedSteps: [1, 2, 3],
          currentStep: 3,
          progress: 100
        },
        {
          id: '2',
          lessonId: 'js-promise',
          lessonTitle: 'JavaScript Promise',
          startDate: new Date(Date.now() - 86400000 * 3),
          lastAccessDate: new Date(Date.now() - 86400000),
          completedSteps: [1, 2],
          currentStep: 3,
          progress: 60
        },
        {
          id: '3',
          lessonId: 'react-hooks',
          lessonTitle: 'React Hooks',
          startDate: new Date(Date.now() - 86400000),
          lastAccessDate: new Date(),
          completedSteps: [1],
          currentStep: 2,
          progress: 30
        }
      ]
    };
  }
}

// 更新用户数据
export async function updateUserData(userId: string, data: Partial<UserData>): Promise<UserData> {
  try {
    // 真实API调用 - 更新用户数据
    const response = await fetch(`/api/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('更新用户数据失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('更新用户数据失败:', error);
    
    // 返回模拟的更新后用户数据
    return {
      ...await getUserData(userId),
      ...data
    };
  }
}
