<template>
  <view class="home-container">
    <!-- 顶部状态栏 -->
    <view class="header">
      <view class="date-info">
        <text class="date">{{ currentDate }}</text>
        <text class="streak" v-if="streakDays > 0">🔥 连续{{ streakDays}}天</text>
      </view>
      <view class="tree-preview" @click="goToTree">
        <text class="tree-icon">{{ treeIcon }}</text>
        <text class="tree-stage">{{ currentStage.name }}</text>
      </view>
    </view>

    <!-- 进度指示 -->
    <view class="progress-section">
      <text class="progress-title">今日好事</text>
      <view class="progress-dots">
        <view
          v-for="i in 3"
          :key="i"
          class="dot"
          :class="{ active: todayRecords.length >= i }"
        >
          {{ todayRecords.length >= i ? '✓' : i }}
        </view>
      </view>
    </view>

    <!-- 录入区域 -->
    <view class="record-section">
      <view
        v-for="(record, index) in displayRecords"
        :key="index"
        class="record-item"
        :class="{ active: index === activeIndex }"
      >
        <view v-if="record" class="recorded">
          <text class="content-text">{{ record.content }}</text>
        </view>

        <view v-else class="input-area">
          <textarea
            v-model="currentInput"
            class="input-box"
            :placeholder="placeholders[index]"
            :focus="index === activeIndex"
            @focus="activeIndex = index"
            maxlength="200"
          />

          <button
            v-if="currentInput.trim()"
            class="submit-btn"
            @click="handleSubmit"
            :loading="submitting"
          >
            记录
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRecordStore, useTreeStore, useUserStore } from '@/store'
import { formatDate } from '@/utils'

const recordStore = useRecordStore()
const treeStore = useTreeStore()
const userStore = useUserStore()

const currentInput = ref('')
const activeIndex = ref(0)
const submitting = ref(false)

const currentDate = computed(() => formatDate(new Date(), 'MM月DD日'))
const todayRecords = computed(() => recordStore.todayRecords)
const streakDays = computed(() => recordStore.streakDays)
const currentStage = computed(() => treeStore.currentStage)

const treeIcon = computed(() => {
  const icons = ['🌰', '🌱', '🌿', '🌳', '🌲', '🌴']
  return icons[treeStore.treeInfo?.stage || 0]
})

const displayRecords = computed(() => {
  const records = [...todayRecords.value]
  while (records.length < 3) {
    records.push(null)
  }
  return records.slice(0, 3)
})

const placeholders = [
  '今天有什么值得记录的好事吗？',
  '还有什么让你感到开心的事？',
  '再想想，还有什么美好的瞬间？'
]

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    uni.redirectTo({ url: '/pages/login/login' })
    return
  }
  recordStore.init()
  treeStore.init()
  activeIndex.value = todayRecords.value.length
})

const handleSubmit = async () => {
  if (!currentInput.value.trim()) return

  try {
    submitting.value = true
    const result = await recordStore.submitGoodThing(currentInput.value.trim())
    treeStore.addPoints(result.points)

    if (result.aiFeedback) {
      uni.showToast({ title: result.aiFeedback, icon: 'none', duration: 2000 })
    }

    currentInput.value = ''
    if (activeIndex.value < 2) activeIndex.value++
  } catch (error: any) {
    uni.showToast({ title: error.message || '提交失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

const goToTree = () => {
  uni.switchTab({ url: '/pages/tree/tree' })
}
</script>

<style scoped lang="scss">
.home-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 50%);
  padding: 40rpx 30rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;

  .date-info .date {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }

  .date-info .streak {
    font-size: 24rpx;
    color: #FF6B6B;
  }

  .tree-preview {
    display: flex;
    align-items: center;
    padding: 12rpx 24rpx;
    background: rgba(78, 205, 196, 0.1);
    border-radius: 40rpx;
  }
}

.progress-section {
  text-align: center;
  margin-bottom: 60rpx;

  .progress-dots {
    display: flex;
    justify-content: center;
    gap: 24rpx;

    .dot {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      background: #E5E5E5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      color: #999;

      &.active {
        background: #4ECDC4;
        color: #FFF;
      }
    }
  }
}

.record-section .record-item {
  margin-bottom: 40rpx;
  padding: 30rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

  &.active {
    border: 2rpx solid #4ECDC4;
  }

  .input-box {
    width: 100%;
    min-height: 120rpx;
    font-size: 30rpx;
    margin-bottom: 20rpx;
  }

  .submit-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
    border-radius: 44rpx;
    color: #FFFFFF;
    font-size: 32rpx;
  }
}
</style>
