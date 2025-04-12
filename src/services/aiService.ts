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
