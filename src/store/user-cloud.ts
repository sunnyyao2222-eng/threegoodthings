import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types'
import { storage } from '@/utils'
import { STORAGE_KEYS } from '@/config'
import { cloudUserApi } from '@/api/cloud'

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

  // 微信登录（小程序云开发）
  const wxLogin = async () => {
    try {
      // 1. 获取用户信息授权
      const userProfile = await new Promise<any>((resolve, reject) => {
        uni.getUserProfile({
          desc: '用于完善用户资料',
          success: resolve,
          fail: reject
        })
      })

      // 2. 调用云函数登录
      const res = await cloudUserApi.wxLogin({
        nickname: userProfile.userInfo.nickName,
        avatar: userProfile.userInfo.avatarUrl
      })

      if (res.success) {
        // 保存 token 和用户信息
        token.value = res.data.token
        userInfo.value = res.data.userInfo

        storage.set(STORAGE_KEYS.TOKEN, res.data.token)
        storage.set(STORAGE_KEYS.USER_INFO, res.data.userInfo)

        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })

        return res.data
      } else {
        throw new Error(res.message || '登录失败')
      }
    } catch (error: any) {
      console.error('微信登录失败:', error)
      uni.showToast({
        title: error.message || '登录失败',
        icon: 'none'
      })
      throw error
    }
  }

  // 游客登录（本地模式）
  const guestLogin = () => {
    const guestUser: UserInfo = {
      id: 'guest_' + Date.now(),
      openid: 'guest_' + Date.now(),
      nickname: '游客' + Math.floor(Math.random() * 10000),
      avatar: '',
      createdAt: new Date().toISOString(),
      streakDays: 0,
      totalPoints: 0,
      treeStage: 0,
      isVIP: false
    }

    token.value = 'guest_token'
    userInfo.value = guestUser

    storage.set(STORAGE_KEYS.TOKEN, token.value)
    storage.set(STORAGE_KEYS.USER_INFO, guestUser)

    return { token: token.value, userInfo: guestUser }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const res = await cloudUserApi.getUserInfo()

      if (res.success) {
        userInfo.value = res.data
        storage.set(STORAGE_KEYS.USER_INFO, res.data)
        return res.data
      } else {
        throw new Error(res.message || '获取用户信息失败')
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  // 更新用户信息
  const updateUser = async (data: Partial<UserInfo>) => {
    try {
      const res = await cloudUserApi.updateUserInfo(data)

      if (res.success) {
        // 重新获取用户信息
        await fetchUserInfo()
        return userInfo.value
      } else {
        throw new Error(res.message || '更新失败')
      }
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

    uni.showToast({
      title: '已退出登录',
      icon: 'success'
    })
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    init,
    wxLogin,
    guestLogin,
    fetchUserInfo,
    updateUser,
    logout
  }
})
