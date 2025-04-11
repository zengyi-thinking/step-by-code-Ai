
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

// 这是一个简单的模拟API调用
// 在实际应用中，您需要替换为真实的API调用
export async function generateTutorial(topic: string): Promise<GeneratedLesson> {
  console.log(`生成关于 ${topic} 的教程`);
  
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 这里只是一个示例返回，实际应用中应该通过API获取
  return {
    lessonTitle: `${topic} 教程`,
    lessonDescription: `学习 ${topic} 的基础知识和应用场景`,
    steps: [
      {
        title: `${topic} 基础`,
        description: `${topic} 是编程中的重要概念。本步骤将介绍它的基本用法和概念。`,
        examples: [
          "// 示例代码\nconsole.log('这是一个示例');",
          "// 另一个示例\nfunction example() {\n  return '这是示例函数';\n}"
        ],
        tips: [
          "理解基本概念是学习的第一步",
          "尝试修改示例代码来深入理解",
          "多多实践是掌握编程的关键"
        ],
        initialCode: "// 在这里编写您的代码\n\n// 尝试实现基本功能"
      },
      {
        title: `${topic} 进阶应用`,
        description: `在掌握了基础之后，让我们来看看 ${topic} 的一些进阶应用场景。`,
        examples: [
          "// 进阶示例\nfunction advancedExample() {\n  // 实现复杂功能\n  return '这是进阶示例';\n}"
        ],
        tips: [
          "尝试将基础知识应用到实际问题中",
          "理解原理比记忆代码更重要",
          "通过解决问题来提升技能"
        ],
        initialCode: "// 在这里实现进阶功能\n\n// 可以基于前面的代码继续编写"
      }
    ]
  };
}

// 在实际应用中，您需要实现真实的AI API调用
// 例如使用OpenAI API：
/*
export async function generateTutorial(topic: string): Promise<GeneratedLesson> {
  const apiKey = "您的API密钥";
  
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "你是一个编程教学助手。请为用户生成一个分步骤的编程教程，包括标题、描述、代码示例、提示和初始代码。"
        },
        {
          role: "user",
          content: `请生成一个关于 ${topic} 的编程教程，分为3-5个步骤，每个步骤包含标题、描述、代码示例、提示和初始代码。`
        }
      ]
    })
  });

  const data = await response.json();
  
  // 解析AI响应并转换为我们需要的格式
  // 这需要根据实际API响应格式进行调整
  
  return {
    // 格式化后的教程数据
  };
}
*/
