import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GoodThing, DailyRecord } from '@/types'
import { storage, getToday, generateId, calculateStreak } from '@/utils'
import { STORAGE_KEYS, POINTS_RULES } from '@/config'
import { cloudRecordApi } from '@/api/cloud'

export const useRecordStore = defineStore('record', () => {
  // 状态
  const todayRecords = ref<GoodThing[]>([])
  const historyRecords = ref<DailyRecord[]>([])
  const offlineQueue = ref<GoodThing[]>([])

  // 计算属性
  const todayCompleted = computed(() => todayRecords.value.length >= 3)
  const streakDays = computed(() => calculateStreak(historyRecords.value))

  // 初始化
  const init = async () => {
    // 尝试从云端加载今日记录
    try {
      await loadTodayRecords()
    } catch (error) {
      console.error('加载云端记录失败，使用本地缓存:', error)
      // 降级到本地存储
      const savedRecords = storage.get(STORAGE_KEYS.DAILY_RECORDS)
      if (savedRecords) historyRecords.value = savedRecords
      loadTodayRecordsFromLocal()
    }

    // 加载离线队列
    const savedQueue = storage.get(STORAGE_KEYS.OFFLINE_QUEUE)
    if (savedQueue) offlineQueue.value = savedQueue

    // 同步离线队列
    if (offlineQueue.value.length > 0) {
      syncOfflineQueue()
    }
  }

  // 从云端加载今日记录
  const loadTodayRecords = async () => {
    try {
      const res = await cloudRecordApi.getTodayRecords()

      if (res.success) {
        todayRecords.value = res.data.map((item: any) => ({
          id: item._id,
          userId: item.userId,
          content: item.content,
          category: item.category,
          imageUrl: item.imageUrl,
          voiceUrl: item.voiceUrl,
          aiFeedback: item.aiFeedback,
          growthPoints: item.points,
          createdAt: item.createdAt,
          isPublic: item.isPublic
        }))

        // 同步到本地存储
        saveToLocalStorage()
      }
    } catch (error) {
      console.error('加载今日记录失败:', error)
      throw error
    }
  }

  // 从本地存储加载今日记录
  const loadTodayRecordsFromLocal = () => {
    const today = getToday()
    const todayRecord = historyRecords.value.find(r => r.date === today)
    todayRecords.value = todayRecord?.things || []
  }

  // 提交好事记录
  const submitGoodThing = async (content: string, imageUrl?: string, voiceUrl?: string) => {
    try {
      // 尝试在线提交
      const res = await cloudRecordApi.submitGoodThing({
        content,
        imageUrl,
        voiceUrl
      })

      if (res.success) {
        // 创建本地记录对象
        const goodThing: GoodThing = {
          id: res.data.recordId,
          userId: '',
          content,
          category: res.data.category,
          imageUrl: imageUrl || '',
          voiceUrl: voiceUrl || '',
          aiFeedback: res.data.aiFeedback,
          growthPoints: res.data.points,
          createdAt: new Date().toISOString(),
          isPublic: false
        }

        // 添加到今日记录
        todayRecords.value.push(goodThing)

        // 保存到本地存储
        saveToLocalStorage()

        return {
          success: true,
          data: goodThing,
          aiFeedback: res.data.aiFeedback,
          points: res.data.points,
          newStage: res.data.newStage
        }
      } else {
        throw new Error(res.message || '提交失败')
      }
    } catch (error: any) {
      console.error('在线提交失败，保存到离线队列:', error)

      // 离线模式：保存到离线队列
      const offlineThing: GoodThing = {
        id: generateId(),
        userId: '',
        content,
        category: 'other' as any,
        imageUrl: imageUrl || '',
        voiceUrl: voiceUrl || '',
        growthPoints: POINTS_RULES.BASE_POINTS,
        createdAt: new Date().toISOString(),
        isPublic: false
      }

      todayRecords.value.push(offlineThing)
      offlineQueue.value.push(offlineThing)

      storage.set(STORAGE_KEYS.OFFLINE_QUEUE, offlineQueue.value)
      saveToLocalStorage()

      return {
        success: true,
        data: offlineThing,
        aiFeedback: '已保存，稍后上传',
        points: POINTS_RULES.BASE_POINTS,
        offline: true
      }
    }
  }

  // 保存到本地存储
  const saveToLocalStorage = () => {
    const today = getToday()
    const existingIndex = historyRecords.value.findIndex(r => r.date === today)

    const dailyRecord: DailyRecord = {
      date: today,
      userId: '',
      things: todayRecords.value,
      completed: todayRecords.value.length >= 3,
      treePointsToday: todayRecords.value.reduce((sum, t) => sum + t.growthPoints, 0)
    }

    if (existingIndex >= 0) {
      historyRecords.value[existingIndex] = dailyRecord
    } else {
      historyRecords.value.unshift(dailyRecord)
    }

    storage.set(STORAGE_KEYS.DAILY_RECORDS, historyRecords.value)
  }

  // 同步离线队列
  const syncOfflineQueue = async () => {
    if (offlineQueue.value.length === 0) return

    console.log(`开始同步 ${offlineQueue.value.length} 条离线记录`)

    const queue = [...offlineQueue.value]
    offlineQueue.value = []

    for (const thing of queue) {
      try {
        await cloudRecordApi.submitGoodThing({
          content: thing.content,
          imageUrl: thing.imageUrl,
          voiceUrl: thing.voiceUrl
        })
        console.log('离线记录同步成功:', thing.content.substring(0, 20))
      } catch (error) {
        console.error('离线记录同步失败:', error)
        // 同步失败，重新加入队列
        offlineQueue.value.push(thing)
      }
    }

    storage.set(STORAGE_KEYS.OFFLINE_QUEUE, offlineQueue.value)

    if (offlineQueue.value.length === 0) {
      uni.showToast({
        title: '离线记录已同步',
        icon: 'success'
      })
    }
  }

  // 获取历史记录
  const getHistoryRecords = async (params?: { startDate?: string; endDate?: string; page?: number; limit?: number }) => {
    try {
      const res = await cloudRecordApi.getHistoryRecords(params || {})

      if (res.success) {
        return res.data
      } else {
        throw new Error(res.message || '获取历史记录失败')
      }
    } catch (error) {
      console.error('获取历史记录失败:', error)
      // 降级到本地存储
      return {
        records: historyRecords.value,
        total: historyRecords.value.length,
        page: 1,
        limit: 30
      }
    }
  }

  // 删除记录
  const deleteRecord = async (recordId: string) => {
    try {
      const res = await cloudRecordApi.deleteRecord(recordId)

      if (res.success) {
        // 从本地记录中移除
        todayRecords.value = todayRecords.value.filter(r => r.id !== recordId)
        saveToLocalStorage()

        uni.showToast({
          title: '删除成功',
          icon: 'success'
        })
      } else {
        throw new Error(res.message || '删除失败')
      }
    } catch (error: any) {
      console.error('删除记录失败:', error)
      uni.showToast({
        title: error.message || '删除失败',
        icon: 'none'
      })
    }
  }

  return {
    todayRecords,
    historyRecords,
    offlineQueue,
    todayCompleted,
    streakDays,
    init,
    loadTodayRecords,
    submitGoodThing,
    syncOfflineQueue,
    getHistoryRecords,
    deleteRecord
  }
})
