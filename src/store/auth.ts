import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, userApi } from '@/api/backend'
import { storage } from '@/utils/web-storage'

interface User {
  id: string
  email: string
  nickname: string
  avatar: string
  isGuest: boolean
  isVIP: boolean
  vipExpireAt?: string
  totalPoints: number
  treeStage: number
  streakDays: number
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isGuest = computed(() => user.value?.isGuest || false)
  const isVIP = computed(() => user.value?.isVIP || false)

  // 初始化 - 从本地存储恢复
  const init = async () => {
    try {
      const savedToken = storage.get<string>('auth-token')
      const savedUser = storage.get<User>('user-info')

      if (savedToken && savedUser) {
        token.value = savedToken
        user.value = savedUser

        // 验证 token 是否有效
        try {
          const response = await authApi.getCurrentUser()
          if (response.success) {
            user.value = response.data.user
            storage.set('user-info', user.value)
          }
        } catch (error) {
          // Token 无效，清除
          logout()
        }
      } else {
        // 自动游客登录
        await guestLogin()
      }
    } catch (error) {
      console.error('Auth init error:', error)
      await guestLogin()
    }
  }

  // 游客登录
  const guestLogin = async () => {
    try {
      isLoading.value = true

      // 生成或获取设备ID
      let deviceId = storage.get<string>('device-id')
      if (!deviceId) {
        deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        storage.set('device-id', deviceId)
      }

      const response = await authApi.guestLogin(deviceId)

      if (response.success) {
        token.value = response.data.token
        user.value = response.data.user

        storage.set('auth-token', token.value)
        storage.set('user-info', user.value)

        return { success: true }
      }

      throw new Error(response.message || 'Guest login failed')
    } catch (error: any) {
      console.error('Guest login error:', error)
      return { success: false, message: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // 邮箱注册
  const register = async (email: string, password: string, nickname: string) => {
    try {
      isLoading.value = true

      const response = await authApi.register({ email, password, nickname })

      if (response.success) {
        token.value = response.data.token
        user.value = response.data.user

        storage.set('auth-token', token.value)
        storage.set('user-info', user.value)

        uni.showToast({
          title: 'Registration successful',
          icon: 'success',
        })

        return { success: true }
      }

      throw new Error(response.message || 'Registration failed')
    } catch (error: any) {
      uni.showToast({
        title: error.message || 'Registration failed',
        icon: 'none',
      })
      return { success: false, message: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // 邮箱登录
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true

      const response = await authApi.login({ email, password })

      if (response.success) {
        token.value = response.data.token
        user.value = response.data.user

        storage.set('auth-token', token.value)
        storage.set('user-info', user.value)

        uni.showToast({
          title: 'Login successful',
          icon: 'success',
        })

        return { success: true }
      }

      throw new Error(response.message || 'Login failed')
    } catch (error: any) {
      uni.showToast({
        title: error.message || 'Login failed',
        icon: 'none',
      })
      return { success: false, message: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // Google 登录
  const googleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    window.location.href = `${apiUrl}/auth/google`
  }

  // 处理 Google 回调
  const handleGoogleCallback = (token: string) => {
    storage.set('auth-token', token)
    init()
  }

  // 升级游客账号
  const upgradeAccount = async (email: string, password: string, nickname?: string) => {
    try {
      isLoading.value = true

      const response = await authApi.upgradeAccount({ email, password, nickname })

      if (response.success) {
        user.value = response.data.user
        storage.set('user-info', user.value)

        uni.showToast({
          title: 'Account upgraded successfully',
          icon: 'success',
        })

        return { success: true }
      }

      throw new Error(response.message || 'Upgrade failed')
    } catch (error: any) {
      uni.showToast({
        title: error.message || 'Upgrade failed',
        icon: 'none',
      })
      return { success: false, message: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户信息
  const updateProfile = async (data: { nickname?: string; avatar?: string }) => {
    try {
      const response = await userApi.updateProfile(data)

      if (response.success) {
        user.value = { ...user.value, ...response.data.user }
        storage.set('user-info', user.value)

        uni.showToast({
          title: 'Profile updated',
          icon: 'success',
        })

        return { success: true }
      }

      throw new Error(response.message || 'Update failed')
    } catch (error: any) {
      uni.showToast({
        title: error.message || 'Update failed',
        icon: 'none',
      })
      return { success: false, message: error.message }
    }
  }

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      const response = await userApi.getProfile()

      if (response.success) {
        user.value = response.data.user
        storage.set('user-info', user.value)
      }
    } catch (error) {
      console.error('Refresh user error:', error)
    }
  }

  // 登出
  const logout = () => {
    token.value = null
    user.value = null

    storage.remove('auth-token')
    storage.remove('user-info')

    // 重新游客登录
    guestLogin()

    uni.showToast({
      title: 'Logged out',
      icon: 'success',
    })
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isGuest,
    isVIP,
    init,
    guestLogin,
    register,
    login,
    googleLogin,
    handleGoogleCallback,
    upgradeAccount,
    updateProfile,
    refreshUser,
    logout,
  }
})
