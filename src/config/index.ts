// API配置
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.threegoodthings.com'

// 微信小程序配置
export const WX_APPID = ''  // 需要填入实际的微信小程序AppID

// 树木成长阶段配置
export const TREE_STAGES = [
  { stage: 0, name: '种子', points: 0, days: 1, description: '开始埋下一颗期待' },
  { stage: 1, name: '嫩芽', points: 50, days: 7, description: '第一片嫩叶冒出，有了生命的痕迹' },
  { stage: 2, name: '幼苗', points: 200, days: 21, description: '根系开始延伸，习惯正在扎根' },
  { stage: 3, name: '小树', points: 500, days: 45, description: '枝叶渐茂，可以给自己一点荫凉了' },
  { stage: 4, name: '大树', points: 1200, days: 90, description: '四季轮换，见证了你许多个清晨' },
  { stage: 5, name: '参天古树', points: 3000, days: 180, description: '一棵属于你的，关于美好的纪念碑' }
]

// 积分计算规则
export const POINTS_RULES = {
  BASE_POINTS: 5,              // 记录一件好事基础分
  LONG_CONTENT_BONUS: 2,       // 超过20字加成
  DAILY_COMPLETE_BONUS: 15,    // 完成当日三件好事额外奖励
  RICH_CONTENT_BONUS: 5,       // 同日均超过30字额外奖励
  STREAK_MULTIPLIERS: {        // 连击加成
    7: 1.2,
    14: 1.5,
    21: 2.0,
    30: 2.5
  },
  DIVERSITY_BONUS: 20          // 一周内覆盖4种以上分类奖励
}

// 徽章定义
export const BADGES = [
  {
    id: 'beginner',
    name: '初心者',
    description: '首次完成三件好事记录',
    icon: '🌱',
    rarity: 'common',
    condition: 'first_complete'
  },
  {
    id: 'fire_habit',
    name: '火苗习惯',
    description: '连续记录7天',
    icon: '🔥',
    rarity: 'common',
    condition: 'streak_7'
  },
  {
    id: 'steady_flow',
    name: '细水流长',
    description: '连续记录21天',
    icon: '💧',
    rarity: 'rare',
    condition: 'streak_21'
  },
  {
    id: 'mountain_calm',
    name: '山的沉稳',
    description: '连续记录66天',
    icon: '🏔️',
    rarity: 'epic',
    condition: 'streak_66'
  }
]

// 好事分类配置
export const CATEGORIES = [
  { id: 'interpersonal', name: '人际', icon: '🤝', color: '#FF6B6B' },
  { id: 'achievement', name: '成就', icon: '🎯', color: '#4ECDC4' },
  { id: 'sensory', name: '感官', icon: '🌸', color: '#FFE66D' },
  { id: 'flow', name: '心流', icon: '🌊', color: '#95E1D3' },
  { id: 'gratitude', name: '感恩', icon: '🙏', color: '#F38181' },
  { id: 'other', name: '其他', icon: '✨', color: '#AA96DA' }
]

// 本地存储键名
export const STORAGE_KEYS = {
  USER_INFO: 'user_info',
  TOKEN: 'token',
  DAILY_RECORDS: 'daily_records',
  TREE_INFO: 'tree_info',
  ACHIEVEMENTS: 'achievements',
  OFFLINE_QUEUE: 'offline_queue'
}
