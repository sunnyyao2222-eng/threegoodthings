<template>
  <view class="home-container">
    <!-- 顶部状态栏 -->
    <view class="header">
      <view class="streak-badge">
        <text class="streak-text">连续 {{ streakDays }} 天</text>
      </view>
      <view class="progress-badge">
        <text class="progress-text">{{ todayRecords.length }}/3</text>
      </view>
    </view>

    <!-- 树木展示区 -->
    <view class="tree-display" @click="goToTree">
      <view class="tree-icon-wrapper">
        <text class="tree-icon">{{ treeIcon }}</text>
      </view>
      <text class="tree-stage">{{ currentStage.name }}</text>
      <text class="tree-points">{{ treeInfo?.totalPoints || 0 }} 积分</text>
    </view>

    <!-- 录入区域 -->
    <view class="record-section">
      <view
        v-for="(record, index) in displayRecords"
        :key="index"
        class="record-item"
      >
        <view v-if="record" class="recorded">
          <view class="record-number">第 {{ index + 1 }} 件好事</view>
          <text class="content-text">{{ record.content }}</text>
        </view>

        <view v-else class="input-area">
          <view class="record-number">记录第 {{ index + 1 }} 件好事</view>
          <textarea
            v-model="inputs[index]"
            class="input-box"
            :placeholder="placeholders[index]"
            @focus="activeIndex = index"
            maxlength="200"
            :auto-height="true"
          />

          <button
            v-if="inputs[index] && inputs[index].trim()"
            class="submit-btn"
            @click="handleSubmit(index)"
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

const recordStore = useRecordStore()
const treeStore = useTreeStore()
const userStore = useUserStore()

const inputs = ref(['', '', ''])
const activeIndex = ref(0)
const submitting = ref(false)

const todayRecords = computed(() => recordStore.todayRecords)
const streakDays = computed(() => recordStore.streakDays)
const currentStage = computed(() => treeStore.currentStage)
const treeInfo = computed(() => treeStore.treeInfo)

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
  '今天有什么让你感到开心的小事？',
  '还有什么让你感到温暖的瞬间？',
  '再想想，还有什么美好的事情？'
]

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    uni.redirectTo({ url: '/pages/login/login' })
    return
  }
  recordStore.init()
  treeStore.init()
})

const handleSubmit = async (index: number) => {
  const content = inputs.value[index]?.trim()
  if (!content) return

  try {
    submitting.value = true
    const result = await recordStore.submitGoodThing(content)
    treeStore.addPoints(result.points)

    if (result.aiFeedback) {
      uni.showToast({ title: result.aiFeedback, icon: 'none', duration: 2000 })
    }

    inputs.value[index] = ''
  } catch (error: any) {
    uni.showToast({ title: error.message || '提交失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

const goToTree = () => {
  uni.navigateTo({ url: '/pages/mytree/mytree' })
}
</script>

<style scoped lang="scss">
.home-container {
  min-height: 100vh;
  background: #F5EFE6;
  padding: 40rpx 30rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60rpx;

  .streak-badge,
  .progress-badge {
    padding: 12rpx 24rpx;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 40rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  }

  .streak-text,
  .progress-text {
    font-size: 26rpx;
    color: #666;
    font-weight: 500;
  }
}

.tree-display {
  text-align: center;
  margin-bottom: 80rpx;

  .tree-icon-wrapper {
    width: 240rpx;
    height: 240rpx;
    margin: 0 auto 30rpx;
    background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 24rpx rgba(255, 152, 0, 0.15);
  }

  .tree-icon {
    font-size: 140rpx;
  }

  .tree-stage {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 12rpx;
  }

  .tree-points {
    display: block;
    font-size: 28rpx;
    color: #FF9800;
    font-weight: 500;
  }
}

.record-section {
  .record-item {
    margin-bottom: 30rpx;
    padding: 30rpx;
    background: #FFFFFF;
    border-radius: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

    .record-number {
      font-size: 26rpx;
      color: #999;
      margin-bottom: 16rpx;
    }

    .recorded {
      .content-text {
        font-size: 30rpx;
        color: #333;
        line-height: 1.6;
      }
    }

    .input-area {
      .input-box {
        width: 100%;
        min-height: 100rpx;
        font-size: 30rpx;
        color: #333;
        line-height: 1.6;
        margin-bottom: 20rpx;
      }

      .submit-btn {
        width: 100%;
        height: 80rpx;
        background: linear-gradient(135deg, #FF9800 0%, #FF6F00 100%);
        border-radius: 40rpx;
        color: #FFFFFF;
        font-size: 30rpx;
        font-weight: 500;
        border: none;
      }
    }
  }
}
</style>
