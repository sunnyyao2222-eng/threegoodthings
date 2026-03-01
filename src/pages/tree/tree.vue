<template>
  <view class="tree-page">
    <view class="tree-container">
      <text class="tree-icon">{{ treeIcon }}</text>
      <text class="tree-name">{{ currentStage.name }}</text>
      <text class="tree-desc">{{ currentStage.description }}</text>

      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: progress + '%' }"></view>
      </view>

      <view class="points-info">
        <text>当前积分: {{ treeInfo?.totalPoints || 0 }}</text>
        <text>下一阶段: {{ nextStage.points }}积分</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTreeStore } from '@/store'

const treeStore = useTreeStore()

const treeInfo = computed(() => treeStore.treeInfo)
const currentStage = computed(() => treeStore.currentStage)
const nextStage = computed(() => treeStore.nextStage)
const progress = computed(() => treeStore.progress)

const treeIcon = computed(() => {
  const icons = ['🌰', '🌱', '🌿', '🌳', '🌲', '🌴']
  return icons[treeStore.treeInfo?.stage || 0]
})

onMounted(() => {
  treeStore.init()
})
</script>

<style scoped>
.tree-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 100%);
  padding: 40rpx;
}

.tree-container {
  text-align: center;
  padding: 60rpx 40rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.tree-icon {
  display: block;
  font-size: 200rpx;
  margin-bottom: 40rpx;
}

.tree-name {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.tree-desc {
  display: block;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 60rpx;
}

.progress-bar {
  width: 100%;
  height: 20rpx;
  background: #E5E5E5;
  border-radius: 10rpx;
  overflow: hidden;
  margin-bottom: 40rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ECDC4 0%, #44A08D 100%);
  transition: width 0.3s;
}

.points-info {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: #666;
}
</style>
