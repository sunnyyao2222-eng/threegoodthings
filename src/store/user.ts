import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types'
import { storage } from '@/utils'
import { STORAGE_KEYS } from '@/config'
import { userApi } from '@/api'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string>('')
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  // 初始化：从本地存储加载
  const init = () => {
    const savedToken = storage.get(STORAGE_KEYS.TOKEN)
    const savedUserInfo = storage.get(STORAGE_KEYS.USER_INFO)

    if (savedToken) token.value = savedToken
    if (savedUserInfo) userInfo.value = savedUserInfo
  }

  // 微信登录（小程序）
  const wxLogin = async () => {
    try {
      // 获取微信登录code
      return new Promise((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          success: async (loginRes) => {
            try {
              if (!loginRes.code) {
                throw new Error('获取微信登录code失败')
              }

              // 调用后端接口
              const res = await userApi.wxLogin(loginRes.code)

              // 保存token和用户信息
              token.value = res.token
              userInfo.value = res.userInfo

              storage.set(STORAGE_KEYS.TOKEN, res.token)
              storage.set(STORAGE_KEYS.USER_INFO, res.userInfo)

              resolve(res)
            } catch (error) {
              reject(error)
            }
          },
          fail: (error) => {
            reject(new Error('微信登录失败'))
          }
        })
      })
    } catch (error) {
      console.error('微信登录失败:', error)
      throw error
    }
  }

  // 微信扫码登录（H5网页版）
  const wxQrLogin = async (code: string) => {
    try {
      // 调用后端接口
      const res = await userApi.wxLogin(code)

      // 保存token和用户信息
      token.value = res.token
      userInfo.value = res.userInfo

      storage.set(STORAGE_KEYS.TOKEN, res.token)
      storage.set(STORAGE_KEYS.USER_INFO, res.userInfo)

      return res
    } catch (error) {
      console.error('微信扫码登录失败:', error)
      throw error
    }
  }

  // 模拟登录（开发测试用）
  const mockLogin = () => {
    const mockUser: UserInfo = {
      id: 'mock_user_001',
      openid: 'mock_openid',
      nickname: '测试用户',
      avatar: '/static/logo.png',
      createdAt: new Date().toISOString(),
      streakDays: 0,
      totalPoints: 0,
      treeStage: 0
    }

    token.value = 'mock_token_' + Date.now()
    userInfo.value = mockUser

    storage.set(STORAGE_KEYS.TOKEN, token.value)
    storage.set(STORAGE_KEYS.USER_INFO, mockUser)

    return { token: token.value, userInfo: mockUser }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const res = await userApi.getUserInfo()
      userInfo.value = res
      storage.set(STORAGE_KEYS.USER_INFO, res)
      return res
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  // 更新用户信息
  const updateUser = async (data: Partial<UserInfo>) => {
    try {
      const res = await userApi.updateUserInfo(data)
      userInfo.value = res
      storage.set(STORAGE_KEYS.USER_INFO, res)
      return res
    } catch (error) {
      console.error('更新用户信息失败:', error)
      throw error
    }
  }

  // 登出
  const logout = () => {
    token.value = ''
    userInfo.value = null
    storage.remove(STORAGE_KEYS.TOKEN)
    storage.remove(STORAGE_KEYS.USER_INFO)
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    init,
    wxLogin,
    wxQrLogin,
    mockLogin,
    fetchUserInfo,
    updateUser,
    logout
  }
})
