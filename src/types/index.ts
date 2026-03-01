// 用户信息类型
export interface UserInfo {
  id: string
  openid: string
  nickname: string
  avatar: string
  createdAt: string
  streakDays: number
  totalPoints: number
  treeStage: number
}

// 好事记录类型
export interface GoodThing {
  id: string
  userId: string
  content: string
  category: GoodThingCategory
  aiFeedback?: string
  warmthScore?: number
  growthPoints: number
  imageUrl?: string
  voiceUrl?: string
  createdAt: string
  isPublic: boolean
}

// 好事分类
export enum GoodThingCategory {
  INTERPERSONAL = 'interpersonal', // 人际
  ACHIEVEMENT = 'achievement',     // 成就
  SENSORY = 'sensory',            // 感官
  FLOW = 'flow',                  // 心流
  GRATITUDE = 'gratitude',        // 感恩
  OTHER = 'other'                 // 其他
}

// 每日记录
export interface DailyRecord {
  date: string
  userId: string
  things: GoodThing[]
  completed: boolean
  moodScore?: number
  treePointsToday: number
}

// 树木信息
export interface Tree {
  id: string
  userId: string
  stage: TreeStage
  totalPoints: number
  skin?: string
  specialEvents: string[]
  createdAt: string
  milestoneDates: string[]
}

// 树木阶段
export enum TreeStage {
  SEED = 0,      // 种子
  SPROUT = 1,    // 嫩芽
  SEEDLING = 2,  // 幼苗
  SMALL_TREE = 3,// 小树
  BIG_TREE = 4,  // 大树
  ANCIENT = 5    // 参天古树
}

// 成就徽章
export interface Achievement {
  id: string
  badgeId: string
  userId: string
  unlockedAt: string
  notified: boolean
}

// 徽章定义
export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  condition: string
}
