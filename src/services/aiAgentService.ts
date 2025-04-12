
// AI智能体服务 - 提供AI智能体的核心功能

import { AIAssistanceResponse, GeneratedLesson } from './aiService';
import { generateStepByStepTutorial, convertToGeneratedLesson, TutorialRequest, StepByStepTutorial } from './tutorialService';

export interface AIAgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  contextWindow: number;
}

export interface AIAgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AIAgentSession {
  id: string;
  userId: string;
  topic: string;
  messages: AIAgentMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIAgentResponse extends AIAssistanceResponse {
  sessionId: string;
  suggestedNextQuestions?: string[];
  tutorial?: GeneratedLesson;
  stepByStepTutorial?: StepByStepTutorial;
}

// 默认AI智能体配置
const defaultConfig: AIAgentConfig = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 1000,
  contextWindow: 4000
};

// 获取AI智能体回复
export async function getAIAgentResponse(
  message: string,
  sessionId?: string,
  topic?: string,
  config: Partial<AIAgentConfig> = {}
): Promise<AIAgentResponse> {
  try {
    // 合并配置
    const mergedConfig = { ...defaultConfig, ...config };
    
    // 检测是否是编程教学请求
    const isProgrammingTutorialRequest = checkIfProgrammingTutorialRequest(message);
    let tutorialData: StepByStepTutorial | null = null;
    
    // 如果是编程教学请求，生成教程
    if (isProgrammingTutorialRequest) {
      const tutorialRequest: TutorialRequest = {
        topic: extractTutorialTopic(message, topic),
        userQuery: message,
        programmingLanguage: detectProgrammingLanguage(message)
      };
      
      tutorialData = await generateStepByStepTutorial(tutorialRequest);
    }
    
    // 真实API调用 - 使用AI获取对用户问题的回复
    const response = await fetch('/api/ai-agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        sessionId,
        topic,
        config: mergedConfig,
        isTutorialRequest: isProgrammingTutorialRequest
      }),
    });

    if (!response.ok) {
      throw new Error('API请求失败');
    }
    
    const responseData = await response.json();
    
    // 如果生成了教程，添加到响应中
    if (tutorialData) {
      responseData.stepByStepTutorial = tutorialData;
      responseData.tutorial = convertToGeneratedLesson(tutorialData);
    }
    
    return responseData;
  } catch (error) {
    console.error('获取AI智能体回复失败:', error);
    
    // 检测是否是编程教学请求
    const isProgrammingTutorialRequest = checkIfProgrammingTutorialRequest(message);
    let mockResponse: AIAgentResponse = {
      sessionId: sessionId || 'mock-session-id',
      message: generateMockAgentResponse(message, topic),
      relatedLinks: [
        '官方文档',
        '相关教程',
        '常见问题'
      ],
      codeSnippets: [
        '```javascript\nconsole.log("Hello from AI Agent");\n```'
      ],
      suggestedNextQuestions: [
        '如何进一步优化这段代码？',
        '这个概念有哪些实际应用场景？',
        '有没有相关的最佳实践？'
      ]
    };
    
    // 如果是编程教学请求，生成模拟教程
    if (isProgrammingTutorialRequest) {
      const tutorialRequest: TutorialRequest = {
        topic: extractTutorialTopic(message, topic),
        userQuery: message,
        programmingLanguage: detectProgrammingLanguage(message)
      };
      
      const tutorialData = await generateStepByStepTutorial(tutorialRequest);
      mockResponse.stepByStepTutorial = tutorialData;
      mockResponse.tutorial = convertToGeneratedLesson(tutorialData);
    }
    
    return mockResponse;
  }
}

// 获取用户的AI智能体会话历史
export async function getUserAgentSessions(userId: string): Promise<AIAgentSession[]> {
  try {
    // 真实API调用 - 获取用户的AI智能体会话历史
    const response = await fetch(`/api/ai-agent/sessions?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('API请求失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('获取用户AI智能体会话历史失败:', error);
    
    // 返回模拟数据
    return [
      {
        id: 'session-1',
        userId,
        topic: 'JavaScript Promise',
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Promise的基本用法是什么？',
            timestamp: new Date(Date.now() - 86400000)
          },
          {
            id: 'msg-2',
            role: 'assistant',
            content: 'Promise是JavaScript中处理异步操作的一种方式...',
            timestamp: new Date(Date.now() - 86400000)
          }
        ],
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        id: 'session-2',
        userId,
        topic: 'React Hooks',
        messages: [
          {
            id: 'msg-3',
            role: 'user',
            content: 'useState和useEffect有什么区别？',
            timestamp: new Date(Date.now() - 43200000)
          },
          {
            id: 'msg-4',
            role: 'assistant',
            content: 'useState和useEffect是React中两个最常用的Hook...',
            timestamp: new Date(Date.now() - 43200000)
          }
        ],
        createdAt: new Date(Date.now() - 43200000),
        updatedAt: new Date(Date.now() - 43200000)
      }
    ];
  }
}

// 获取特定会话的消息历史
export async function getSessionMessages(sessionId: string): Promise<AIAgentMessage[]> {
  try {
    // 真实API调用 - 获取特定会话的消息历史
    const response = await fetch(`/api/ai-agent/sessions/${sessionId}/messages`);
    
    if (!response.ok) {
      throw new Error('API请求失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('获取会话消息历史失败:', error);
    
    // 返回模拟数据
    return [
      {
        id: 'msg-1',
        role: 'user',
        content: '这个概念的基本原理是什么？',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: '这个概念的基本原理包括以下几点...',
        timestamp: new Date(Date.now() - 3600000 + 30000)
      },
      {
        id: 'msg-3',
        role: 'user',
        content: '有没有具体的例子？',
        timestamp: new Date(Date.now() - 1800000)
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: '以下是一些具体的例子...',
        timestamp: new Date(Date.now() - 1800000 + 30000)
      }
    ];
  }
}

// 创建新的AI智能体会话
export async function createAgentSession(userId: string, topic: string): Promise<AIAgentSession> {
  try {
    // 真实API调用 - 创建新的AI智能体会话
    const response = await fetch('/api/ai-agent/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId,
        topic
      }),
    });
    
    if (!response.ok) {
      throw new Error('API请求失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('创建AI智能体会话失败:', error);
    
    // 返回模拟数据
    return {
      id: `session-${Date.now()}`,
      userId,
      topic,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

// 检测是否是编程教学请求
function checkIfProgrammingTutorialRequest(message: string): boolean {
  const tutorialKeywords = [
    '教', '学习', '指导', '教程', '怎么写', '如何实现', 
    '教我', '学会', '入门', '基础', '指针', '语法', 
    '编程', '代码', '开发', '实现', '函数', '变量', '类', '对象'
  ];
  
  const lowercaseMessage = message.toLowerCase();
  return tutorialKeywords.some(keyword => lowercaseMessage.includes(keyword));
}

// 从用户消息中提取教程主题
function extractTutorialTopic(message: string, defaultTopic?: string): string {
  // 常见的编程主题关键词
  const programmingTopics = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust',
    'HTML', 'CSS', 'React', 'Vue', 'Angular', 'Node.js', 'Express',
    '数据结构', '算法', '设计模式', '函数式编程', '面向对象', '异步编程',
    '指针', '内存管理', '并发', '多线程', '网络编程', '数据库', 'SQL',
    'API', 'REST', 'GraphQL', '微服务', '容器化', 'Docker', 'Kubernetes'
  ];
  
  // 尝试从消息中提取主题
  for (const topic of programmingTopics) {
    if (message.includes(topic)) {
      return topic;
    }
  }
  
  // 如果没有找到明确的主题，尝试从消息中提取可能的主题
  const match = message.match(/[教学习](.{1,10})[的怎如何]/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return defaultTopic || '编程';
}

// 检测编程语言
function detectProgrammingLanguage(message: string): string {
  const languageKeywords: {[key: string]: string[]} = {
    'javascript': ['javascript', 'js', 'node', 'nodejs', 'react', 'vue', 'angular'],
    'python': ['python', 'py', 'django', 'flask', '爬虫'],
    'java': ['java', 'spring', 'android'],
    'c': ['c语言', '指针', 'c程序'],
    'c++': ['c++', 'cpp'],
    'c#': ['c#', 'csharp', '.net', 'dotnet'],
    'go': ['go', 'golang'],
    'rust': ['rust'],
    'php': ['php'],
    'ruby': ['ruby'],
    'swift': ['swift', 'ios'],
    'kotlin': ['kotlin'],
    'typescript': ['typescript', 'ts'],
    'html': ['html', 'css'],
    'sql': ['sql', '数据库', 'mysql', 'postgresql', 'oracle']
  };
  
  const lowercaseMessage = message.toLowerCase();
  
  for (const [language, keywords] of Object.entries(languageKeywords)) {
    if (keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return language;
    }
  }
  
  return 'javascript'; // 默认返回JavaScript
}

// 生成模拟AI智能体回复
function generateMockAgentResponse(message: string, topic?: string): string {
  if (message.toLowerCase().includes('怎么') || message.toLowerCase().includes('如何')) {
    return `作为AI学习助手，我建议您可以按照以下步骤学习${topic || '这个主题'}：

1. 首先理解基本概念和原理
2. 通过简单的例子实践
3. 逐步尝试更复杂的应用
4. 查阅官方文档深入学习

您想从哪一方面开始深入了解呢？`;
  } else if (message.toLowerCase().includes('例子') || message.toLowerCase().includes('示例')) {
    return `以下是${topic || '这个主题'}的一个简单示例：

\`\`\`javascript
// 示例代码
function example() {
  console.log("这是一个示例");
  return "示例结果";
}

// 调用示例
const result = example();
console.log(result);
\`\`\`

这个例子展示了基本用法，您可以根据需要修改和扩展。您对这个例子有什么疑问吗？`;
  } else if (message.toLowerCase().includes('区别') || message.toLowerCase().includes('比较')) {
    return `在${topic || '编程'}中，这些概念的主要区别在于：

1. **用途不同**：第一个主要用于A场景，而第二个适用于B场景
2. **实现方式不同**：第一个使用X技术实现，第二个基于Y技术
3. **性能特点不同**：第一个在C情况下性能更好，第二个在D情况下更有优势

理解这些区别对选择合适的技术方案非常重要。您想了解更多关于哪一方面的信息？`;
  } else {
    return `感谢您的问题！关于${topic || '这个主题'}，这是一个很好的学习点。

学习编程最重要的是理解核心概念并通过实践来巩固知识。我建议您可以：

1. 尝试编写一些小型项目来应用所学知识
2. 参考优质的开源代码来学习最佳实践
3. 加入相关的技术社区讨论和分享

您对${topic || '这个主题'}有什么具体的学习目标吗？`;
  }
}
