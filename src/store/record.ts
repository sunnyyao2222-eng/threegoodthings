import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GoodThing, DailyRecord } from '@/types'
import { storage, getToday, generateId, calculateStreak } from '@/utils'
import { STORAGE_KEYS, POINTS_RULES } from '@/config'
import { recordApi } from '@/api'

export const useRecordStore = defineStore('record', () => {
  // 状态
  const todayRecords = ref<GoodThing[]>([])
  const historyRecords = ref<DailyRecord[]>([])
  const offlineQueue = ref<GoodThing[]>([])

  // 计算属性
  const todayCompleted = computed(() => todayRecords.value.length >= 3)
  const streakDays = computed(() => calculateStreak(historyRecords.value))

  // 初始化
  const init = () => {
    const savedRecords = storage.get(STORAGE_KEYS.DAILY_RECORDS)
    const savedQueue = storage.get(STORAGE_KEYS.OFFLINE_QUEUE)

    if (savedRecords) historyRecords.value = savedRecords
    if (savedQueue) offlineQueue.value = savedQueue

    // 加载今日记录
    loadTodayRecords()
  }

  // 加载今日记录
  const loadTodayRecords = () => {
    const today = getToday()
    const todayRecord = historyRecords.value.find(r => r.date === today)
    todayRecords.value = todayRecord?.things || []
  }

  // 提交好事记录
  const submitGoodThing = async (content: string, imageUrl?: string, voiceUrl?: string) => {
    try {
      const goodThing: Partial<GoodThing> = {
        id: generateId(),
        content,
        imageUrl,
        voiceUrl,
        createdAt: new Date().toISOString(),
        isPublic: false
      }

      // 尝试在线提交
      try {
        const res = await recordApi.submitGoodThing(goodThing)

        // 更新本地记录
        const completeThing: GoodThing = {
          ...goodThing as GoodThing,
          ...res.goodThing,
          aiFeedback: res.aiFeedback,
          growthPoints: res.points
        }

        todayRecords.value.push(completeThing)
        saveToHistory()

        return { success: true, data: completeThing, aiFeedback: res.aiFeedback, points: res.points }
      } catch (error) {
        // 离线模式：保存到离线队列
        console.log('网络错误，保存到离线队列')

        const offlineThing: GoodThing = {
          ...goodThing as GoodThing,
          userId: '',
          category: 'other' as any,
          growthPoints: POINTS_RULES.BASE_POINTS
        }

        todayRecords.value.push(offlineThing)
        offlineQueue.value.push(offlineThing)

        storage.set(STORAGE_KEYS.OFFLINE_QUEUE, offlineQueue.value)
        saveToHistory()

        return {
          success: true,
          data: offlineThing,
          aiFeedback: '已保存，稍后上传',
          points: POINTS_RULES.BASE_POINTS,
          offline: true
        }
      }
    } catch (error) {
      console.error('提交好事失败:', error)
      throw error
    }
  }

  // 保存到历史记录
  const saveToHistory = () => {
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

    const queue = [...offlineQueue.value]
    offlineQueue.value = []

    for (const thing of queue) {
      try {
        await recordApi.submitGoodThing(thing)
      } catch (error) {
        // 同步失败，重新加入队列
        offlineQueue.value.push(thing)
      }
    }

    storage.set(STORAGE_KEYS.OFFLINE_QUEUE, offlineQueue.value)
  }

  // 语音录入
  const recordVoice = async () => {
    return new Promise<string>((resolve, reject) => {
      const recorderManager = uni.getRecorderManager()

      recorderManager.onStop((res) => {
        resolve(res.tempFilePath)
      })

      recorderManager.onError((err) => {
        reject(err)
      })

      recorderManager.start({
        format: 'mp3',
        sampleRate: 16000
      })

      // 最多录制60秒
      setTimeout(() => {
        recorderManager.stop()
      }, 60000)
    })
  }

  // 上传语音并转文字
  const uploadVoice = async (filePath: string) => {
    try {
      const res = await recordApi.uploadVoice(filePath)
      return res
    } catch (error) {
      console.error('上传语音失败:', error)
      throw error
    }
  }

  // 上传图片
  const uploadImage = async (filePath: string) => {
    try {
      const res = await recordApi.uploadImage(filePath)
      return res
    } catch (error) {
      console.error('上传图片失败:', error)
      throw error
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
    recordVoice,
    uploadVoice,
    uploadImage
  }
})
