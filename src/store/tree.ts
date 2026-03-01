import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Tree } from '@/types'
import { TreeStage } from '@/types'
import { storage } from '@/utils'
import { STORAGE_KEYS, TREE_STAGES } from '@/config'
import { treeApi } from '@/api'

export const useTreeStore = defineStore('tree', () => {
  // 状态
  const treeInfo = ref<Tree | null>(null)

  // 计算属性
  const currentStage = computed(() => {
    if (!treeInfo.value) return TREE_STAGES[0]
    return TREE_STAGES[treeInfo.value.stage] || TREE_STAGES[0]
  })

  const nextStage = computed(() => {
    if (!treeInfo.value) return TREE_STAGES[1]
    const nextIndex = treeInfo.value.stage + 1
    return TREE_STAGES[nextIndex] || TREE_STAGES[TREE_STAGES.length - 1]
  })

  const progress = computed(() => {
    if (!treeInfo.value) return 0
    const current = currentStage.value
    const next = nextStage.value
    const points = treeInfo.value.totalPoints

    if (points >= next.points) return 100

    const range = next.points - current.points
    const earned = points - current.points
    return Math.floor((earned / range) * 100)
  })

  // 初始化
  const init = () => {
    const savedTree = storage.get(STORAGE_KEYS.TREE_INFO)
    if (savedTree) {
      treeInfo.value = savedTree
    } else {
      // 创建初始树木
      treeInfo.value = {
        id: '',
        userId: '',
        stage: TreeStage.SEED,
        totalPoints: 0,
        specialEvents: [],
        createdAt: new Date().toISOString(),
        milestoneDates: []
      }
      storage.set(STORAGE_KEYS.TREE_INFO, treeInfo.value)
    }
  }

  // 增加积分
  const addPoints = (points: number) => {
    if (!treeInfo.value) return

    treeInfo.value.totalPoints += points

    // 检查是否升级
    const newStage = TREE_STAGES.findIndex(s => treeInfo.value!.totalPoints < s.points) - 1
    if (newStage > treeInfo.value.stage && newStage >= 0) {
      treeInfo.value.stage = newStage
      treeInfo.value.milestoneDates.push(new Date().toISOString())

      // 触发升级动画
      uni.showToast({
        title: `🎉 ${TREE_STAGES[newStage].name}`,
        icon: 'none',
        duration: 2000
      })
    }

    storage.set(STORAGE_KEYS.TREE_INFO, treeInfo.value)
  }

  // 同步树木信息
  const syncTree = async () => {
    try {
      const res = await treeApi.getTreeInfo()
      treeInfo.value = res
      storage.set(STORAGE_KEYS.TREE_INFO, res)
    } catch (error) {
      console.error('同步树木信息失败:', error)
    }
  }

  return {
    treeInfo,
    currentStage,
    nextStage,
    progress,
    init,
    addPoints,
    syncTree
  }
})
