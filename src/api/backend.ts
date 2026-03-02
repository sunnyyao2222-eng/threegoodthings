import axios, { AxiosInstance, AxiosError } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加 token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      // Token 过期，清除本地存储
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user-info')
      window.location.href = '/login'
    }

    const message = error.response?.data?.message || error.message || 'Network error'
    return Promise.reject(new Error(message))
  }
)

// 认证 API
export const authApi = {
  // 注册
  register: (data: { email: string; password: string; nickname: string }) => {
    return apiClient.post('/auth/register', data)
  },

  // 登录
  login: (data: { email: string; password: string }) => {
    return apiClient.post('/auth/login', data)
  },

  // 游客登录
  guestLogin: (deviceId: string) => {
    return apiClient.post('/auth/guest', { deviceId })
  },

  // 升级游客账号
  upgradeAccount: (data: { email: string; password: string; nickname?: string }) => {
    return apiClient.post('/auth/upgrade', data)
  },

  // 获取当前用户
  getCurrentUser: () => {
    return apiClient.get('/auth/me')
  },

  // 刷新 Token
  refreshToken: () => {
    return apiClient.post('/auth/refresh')
  },
}

// 用户 API
export const userApi = {
  // 获取用户信息
  getProfile: () => {
    return apiClient.get('/user/profile')
  },

  // 更新用户信息
  updateProfile: (data: { nickname?: string; avatar?: string }) => {
    return apiClient.put('/user/profile', data)
  },

  // 获取用户统计
  getStats: () => {
    return apiClient.get('/user/stats')
  },
}

// 记录 API
export const recordApi = {
  // 创建记录
  create: (data: {
    content: string
    imageUrl?: string
    voiceUrl?: string
    isPublic?: boolean
  }) => {
    return apiClient.post('/records', data)
  },

  // 获取记录列表
  getList: (params?: {
    page?: number
    limit?: number
    startDate?: string
    endDate?: string
  }) => {
    return apiClient.get('/records', { params })
  },

  // 获取今日记录
  getToday: () => {
    return apiClient.get('/records/today')
  },

  // 获取单条记录
  getById: (id: string) => {
    return apiClient.get(`/records/${id}`)
  },

  // 删除记录
  delete: (id: string) => {
    return apiClient.delete(`/records/${id}`)
  },

  // 获取公开记录（社区）
  getPublicFeed: (params?: { page?: number; limit?: number }) => {
    return apiClient.get('/records/public/feed', { params })
  },
}

// AI API
export const aiApi = {
  // AI 对话
  chat: (messages: Array<{ role: string; content: string }>) => {
    return apiClient.post('/ai/chat', { messages })
  },
}

export default apiClient
