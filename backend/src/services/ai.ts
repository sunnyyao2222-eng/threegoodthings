// @ts-nocheck
import OpenAI from 'openai'
import { config } from '../config'

const openai = config.openai.apiKey
  ? new OpenAI({ apiKey: config.openai.apiKey })
  : null

// AI 分析分类
export const analyzeCategory = async (
  content: string
): Promise<'interpersonal' | 'achievement' | 'sensory' | 'flow' | 'gratitude' | 'other'> => {
  if (!openai) {
    // 如果没有配置 OpenAI，使用简单的关键词匹配
    return simpleCategorize(content)
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a classifier. Classify the following text into one of these categories:
- interpersonal: related to relationships, social interactions
- achievement: accomplishments, goals reached
- sensory: physical sensations, nature, beauty
- flow: being in the zone, focused activities
- gratitude: thankfulness, appreciation
- other: anything else

Respond with only the category name.`,
        },
        {
          role: 'user',
          content,
        },
      ],
      temperature: 0.3,
      max_tokens: 10,
    })

    const category = response.choices[0]?.message?.content?.trim().toLowerCase()

    if (
      category === 'interpersonal' ||
      category === 'achievement' ||
      category === 'sensory' ||
      category === 'flow' ||
      category === 'gratitude'
    ) {
      return category
    }

    return 'other'
  } catch (error) {
    console.error('AI category analysis error:', error)
    return simpleCategorize(content)
  }
}

// 简单的关键词分类
const simpleCategorize = (
  content: string
): 'interpersonal' | 'achievement' | 'sensory' | 'flow' | 'gratitude' | 'other' => {
  const lower = content.toLowerCase()

  if (
    lower.includes('朋友') ||
    lower.includes('家人') ||
    lower.includes('同事') ||
    lower.includes('聊天') ||
    lower.includes('friend') ||
    lower.includes('family')
  ) {
    return 'interpersonal'
  }

  if (
    lower.includes('完成') ||
    lower.includes('成功') ||
    lower.includes('达成') ||
    lower.includes('achieved') ||
    lower.includes('completed')
  ) {
    return 'achievement'
  }

  if (
    lower.includes('美味') ||
    lower.includes('阳光') ||
    lower.includes('音乐') ||
    lower.includes('风景') ||
    lower.includes('beautiful') ||
    lower.includes('delicious')
  ) {
    return 'sensory'
  }

  if (
    lower.includes('专注') ||
    lower.includes('投入') ||
    lower.includes('沉浸') ||
    lower.includes('focused') ||
    lower.includes('immersed')
  ) {
    return 'flow'
  }

  if (
    lower.includes('感谢') ||
    lower.includes('感恩') ||
    lower.includes('幸运') ||
    lower.includes('grateful') ||
    lower.includes('thankful')
  ) {
    return 'gratitude'
  }

  return 'other'
}

// AI 生成反馈
export const generateAIFeedback = async (content: string, category: string): Promise<string> => {
  if (!openai) {
    // 如果没有配置 OpenAI，使用预设反馈
    return getRandomFeedback(category)
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a warm and supportive mental wellness companion.
Respond to the user's good thing with a short, encouraging message (1-2 sentences, max 50 words).
Be genuine, positive, and empathetic. Use emojis sparingly.`,
        },
        {
          role: 'user',
          content: `Category: ${category}\nGood thing: ${content}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 100,
    })

    return response.choices[0]?.message?.content?.trim() || getRandomFeedback(category)
  } catch (error) {
    console.error('AI feedback generation error:', error)
    return getRandomFeedback(category)
  }
}

// 预设反馈
const feedbackTemplates: Record<string, string[]> = {
  interpersonal: [
    '真好啊，这样的时刻值得被记住 ✨',
    '人与人之间的连接是最珍贵的 💝',
    '这份温暖会一直陪伴着你 🌟',
  ],
  achievement: [
    '为你的努力感到骄傲！继续加油 💪',
    '每一步前进都值得庆祝 🎉',
    '你做得很棒，继续保持 ⭐',
  ],
  sensory: [
    '生活中的小确幸最动人 🌸',
    '用心感受，世界如此美好 🌈',
    '这份美好会留在心底 💫',
  ],
  flow: [
    '沉浸其中的感觉真好 🎯',
    '专注的时光最宝贵 ⏰',
    '享受这份心流体验 🌊',
  ],
  gratitude: [
    '感恩的心让生活更美好 🙏',
    '珍惜当下，感恩拥有 💖',
    '这份感激会带来更多美好 ✨',
  ],
  other: [
    '真好啊，这样的小确幸值得被记住 ✨',
    '生活就是由这些美好瞬间组成的 🌟',
    '继续发现生活中的美好吧 💝',
  ],
}

const getRandomFeedback = (category: string): string => {
  const templates = feedbackTemplates[category] || feedbackTemplates.other
  return templates[Math.floor(Math.random() * templates.length)]
}

// AI 对话
export const chatWithAI = async (messages: Array<{ role: string; content: string }>) => {
  if (!openai) {
    return {
      success: false,
      message: 'AI service not configured',
    }
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are Sunny, a warm and supportive mental wellness companion for the "Three Good Things" app.
Your role is to:
- Help users reflect on their positive experiences
- Provide gentle encouragement and support
- Offer insights about gratitude and positive psychology
- Be empathetic, warm, and non-judgmental
- Keep responses concise and conversational (2-4 sentences)

Remember: You're here to support, not to diagnose or provide medical advice.`,
        },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 200,
    })

    return {
      success: true,
      message: response.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
    }
  } catch (error) {
    console.error('AI chat error:', error)
    return {
      success: false,
      message: 'Sorry, I encountered an error. Please try again.',
    }
  }
}
