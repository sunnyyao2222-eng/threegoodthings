import { API_BASE_URL } from '@/config'
import { storage } from '@/utils'
import type { UserInfo, GoodThing, DailyRecord } from '@/types'

/**
 * HTTP请求封装
 */
const request = <T = any>(options: UniApp.RequestOptions): Promise<T> => {
  return new Promise((resolve, reject) => {
    const token = storage.get('token')

    uni.request({
      ...options,
      url: `${API_BASE_URL}${options.url}`,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data as T)
        } else {
          reject(res)
        }
      },
      fail: reject
    })
  })
}

/**
 * 用户相关API
 */
export const userApi = {
  // 微信登录
  wxLogin(code: string) {
    return request<{ token: string; userInfo: UserInfo }>({
      url: '/api/user/wx-login',
      method: 'POST',
      data: { code }
    })
  },

  // 获取用户信息
  getUserInfo() {
    return request<UserInfo>({
      url: '/api/user/info',
      method: 'GET'
    })
  },

  // 更新用户信息
  updateUserInfo(data: Partial<UserInfo>) {
    return request<UserInfo>({
      url: '/api/user/update',
      method: 'POST',
      data
    })
  }
}

/**
 * 好事记录相关API
 */
export const recordApi = {
  // 提交好事记录
  submitGoodThing(data: Partial<GoodThing>) {
    return request<{ goodThing: GoodThing; aiFeedback: string; points: number }>({
      url: '/api/record/submit',
      method: 'POST',
      data
    })
  },

  // 获取今日记录
  getTodayRecords() {
    return request<DailyRecord>({
      url: '/api/record/today',
      method: 'GET'
    })
  },

  // 获取历史记录
  getHistoryRecords(params: { startDate?: string; endDate?: string; page?: number; limit?: number }) {
    return request<{ records: DailyRecord[]; total: number }>({
      url: '/api/record/history',
      method: 'GET',
      data: params
    })
  },

  // 上传语音
  uploadVoice(filePath: string) {
    return new Promise<{ url: string; text: string }>((resolve, reject) => {
      const token = storage.get('token')
      uni.uploadFile({
        url: `${API_BASE_URL}/api/upload/voice`,
        filePath,
        name: 'file',
        header: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(res.data))
          } else {
            reject(res)
          }
        },
        fail: reject
      })
    })
  },

  // 上传图片
  uploadImage(filePath: string) {
    return new Promise<{ url: string }>((resolve, reject) => {
      const token = storage.get('token')
      uni.uploadFile({
        url: `${API_BASE_URL}/api/upload/image`,
        filePath,
        name: 'file',
        header: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(res.data))
          } else {
            reject(res)
          }
        },
        fail: reject
      })
    })
  }
}

/**
 * 树木相关API
 */
export const treeApi = {
  // 获取树木信息
  getTreeInfo() {
    return request({
      url: '/api/tree/info',
      method: 'GET'
    })
  },

  // 更新树木状态
  updateTree(data: any) {
    return request({
      url: '/api/tree/update',
      method: 'POST',
      data
    })
  }
}

/**
 * 成就相关API
 */
export const achievementApi = {
  // 获取成就列表
  getAchievements() {
    return request({
      url: '/api/achievement/list',
      method: 'GET'
    })
  },

  // 解锁成就
  unlockAchievement(badgeId: string) {
    return request({
      url: '/api/achievement/unlock',
      method: 'POST',
      data: { badgeId }
    })
  }
}
