// Supabase 客户端配置
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vebrsngzdlxyzjbklssf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlYnJzbmd6ZGx4eXpqYmtsc3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1Mzk5ODgsImV4cCI6MjA4ODExNTk4OH0.zhSii7Qv4FGLpUJm2ew_spP_JSkTYqPRMilWLVr77BA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库类型定义
export interface User {
  id: string
  email: string
  nickname: string
  avatar: string
  is_guest: boolean
  is_vip: boolean
  vip_expire_at?: string
  total_points: number
  tree_stage: number
  streak_days: number
  last_record_date?: string
  created_at: string
  updated_at: string
}

export interface Record {
  id: string
  user_id: string
  content: string
  category: string
  ai_feedback?: string
  points: number
  date: string
  is_public: boolean
  resonance_count: number
  image_url?: string
  voice_url?: string
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  user_id: string
  achievement_type: string
  unlocked_at: string
}
