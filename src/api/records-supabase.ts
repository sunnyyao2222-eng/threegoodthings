import { supabase } from '@/utils/supabase'
import type { Record } from '@/utils/supabase'

export const recordApi = {
  // 创建记录
  create: async (data: {
    content: string
    imageUrl?: string
    voiceUrl?: string
    isPublic?: boolean
  }) => {
    const { data: record, error } = await supabase
      .from('records')
      .insert({
        content: data.content,
        image_url: data.imageUrl,
        voice_url: data.voiceUrl,
        is_public: data.isPublic || false,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        category: 'other', // 可以后续添加 AI 分类
        ai_feedback: '继续发现生活中的美好吧 💝', // 可以后续添加 AI 反馈
        points: 5,
        date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single()

    if (error) throw error

    // 更新用户积分
    await updateUserPoints(5)

    return {
      success: true,
      data: {
        record,
        user: await getUserStats()
      }
    }
  },

  // 获取记录列表
  getList: async (params?: {
    page?: number
    limit?: number
    startDate?: string
    endDate?: string
  }) => {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('records')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (params?.startDate) {
      query = query.gte('date', params.startDate)
    }

    if (params?.endDate) {
      query = query.lte('date', params.endDate)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      success: true,
      data: {
        records: data,
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      }
    }
  },

  // 获取今日记录
  getToday: async () => {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('records')
      .select('*')
      .eq('date', today)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: {
        records: data
      }
    }
  },

  // 获取单条记录
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return {
      success: true,
      data: {
        record: data
      }
    }
  },

  // 删除记录
  delete: async (id: string) => {
    const { error } = await supabase
      .from('records')
      .delete()
      .eq('id', id)

    if (error) throw error

    return {
      success: true
    }
  },

  // 获取公开记录（社区）
  getPublicFeed: async (params?: { page?: number; limit?: number }) => {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('records')
      .select('*, users(nickname, avatar)', { count: 'exact' })
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    return {
      success: true,
      data: {
        records: data,
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      }
    }
  }
}

// 辅助函数：更新用户积分
async function updateUserPoints(points: number) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: userData } = await supabase
    .from('users')
    .select('total_points, streak_days, last_record_date')
    .eq('id', user.id)
    .single()

  if (!userData) return

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  let newStreakDays = userData.streak_days || 0

  // 更新连续打卡天数
  if (userData.last_record_date === yesterday) {
    newStreakDays += 1
  } else if (userData.last_record_date !== today) {
    newStreakDays = 1
  }

  // 计算树木阶段
  const newTotalPoints = (userData.total_points || 0) + points
  const treeStage = Math.min(Math.floor(newTotalPoints / 100), 5)

  await supabase
    .from('users')
    .update({
      total_points: newTotalPoints,
      tree_stage: treeStage,
      streak_days: newStreakDays,
      last_record_date: today
    })
    .eq('id', user.id)
}

// 辅助函数：获取用户统计
async function getUserStats() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('users')
    .select('total_points, tree_stage, streak_days')
    .eq('id', user.id)
    .single()

  return data
}

export default recordApi
