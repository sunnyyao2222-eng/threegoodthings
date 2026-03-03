import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import type { User } from '@/utils/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<any>(null)
  const isLoading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!session.value && !!user.value)
  const isGuest = computed(() => user.value?.is_guest || false)
  const isVIP = computed(() => user.value?.is_vip || false)

  // 初始化 - 检查当前会话
  const init = async () => {
    try {
      // 获取当前会话
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      if (currentSession) {
        session.value = currentSession
        // 获取用户信息
        await loadUserProfile()
      } else {
        // 自动游客登录
        await guestLogin()
      }

      // 监听认证状态变化
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        session.value = newSession
        if (newSession) {
          await loadUserProfile()
        } else {
          user.value = null
        }
      })
    } catch (error) {
      console.error('Auth init error:', error)
    }
  }

  // 加载用户资料
  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.value?.user?.id)
        .single()

      if (error) throw error
      user.value = data
    } catch (error) {
      console.error('Load user profile error:', error)
    }
  }

  // 游客登录
  const guestLogin = async () => {
    try {
      isLoading.value = true

      // Supabase 匿名登录
      const { data, error } = await supabase.auth.signInAnonymously()

      if (error) throw error

      session.value = data.session

      // 创建游客用户记录
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: data.user?.id,
          email: `guest_${data.user?.id}@guest.local`,
          nickname: `Guest_${data.user?.id?.slice(0, 8)}`,
          is_guest: true
        })
        .select()
        .single()

      if (userError && userError.code !== '23505') { // 忽略重复键错误
        throw userError
      }

      if (userData) {
        user.value = userData
      } else {
        await loadUserProfile()
      }

      return { success: true }
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

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname
          }
        }
      })

      if (error) throw error

      session.value = data.session

      // 用户记录会通过触发器自动创建
      await loadUserProfile()

      uni.showToast({
        title: '注册成功',
        icon: 'success',
      })

      return { success: true }
    } catch (error: any) {
      uni.showToast({
        title: error.message || '注册失败',
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

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      session.value = data.session
      await loadUserProfile()

      uni.showToast({
        title: '登录成功',
        icon: 'success',
      })

      return { success: true }
    } catch (error: any) {
      uni.showToast({
        title: error.message || '登录失败',
        icon: 'none',
      })
      return { success: false, message: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // Google 登录
  const googleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Google login error:', error)
      uni.showToast({
        title: error.message || 'Google 登录失败',
        icon: 'none',
      })
    }
  }

  // 升级游客账号
  const upgradeAccount = async (email: string, password: string, nickname?: string) => {
    try {
      isLoading.value = true

      // 更新认证信息
      const { error: authError } = await supabase.auth.updateUser({
        email,
        password,
        data: {
          nickname: nickname || user.value?.nickname
        }
      })

      if (authError) throw authError

      // 更新用户记录
      const { error: updateError } = await supabase
        .from('users')
        .update({
          email,
          nickname: nickname || user.value?.nickname,
          is_guest: false
        })
        .eq('id', session.value?.user?.id)

      if (updateError) throw updateError

      await loadUserProfile()

      uni.showToast({
        title: '账号升级成功',
        icon: 'success',
      })

      return { success: true }
    } catch (error: any) {
      uni.showToast({
        title: error.message || '升级失败',
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
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', session.value?.user?.id)

      if (error) throw error

      await loadUserProfile()

      uni.showToast({
        title: '更新成功',
        icon: 'success',
      })

      return { success: true }
    } catch (error: any) {
      uni.showToast({
        title: error.message || '更新失败',
        icon: 'none',
      })
      return { success: false, message: error.message }
    }
  }

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      await loadUserProfile()
    } catch (error) {
      console.error('Refresh user error:', error)
    }
  }

  // 登出
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      session.value = null
      user.value = null

      uni.showToast({
        title: '已退出登录',
        icon: 'success',
      })
    } catch (error: any) {
      console.error('Logout error:', error)
    }
  }

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    isGuest,
    isVIP,
    init,
    guestLogin,
    register,
    login,
    googleLogin,
    upgradeAccount,
    updateProfile,
    refreshUser,
    logout,
  }
})
