<template>
  <view class="home-page">
    <!-- 顶部信息栏 -->
    <view class="header">
      <view class="info-badges">
        <view class="badge streak-badge">
          <text class="icon">🔥</text>
          <text class="text">连续 {{ streakDays }} 天</text>
        </view>
        <view class="badge progress-badge">
          <text class="text">{{ completedCount }}/{{ maxThings }}</text>
        </view>
        <view v-if="isVIP" class="badge vip-badge">
          <text class="icon">👑</text>
          <text class="text">VIP</text>
        </view>
      </view>

      <view class="action-btns">
        <!-- AI助手按钮 -->
        <view class="ai-btn" @click="goToAIChat">
          <image class="ai-avatar" src="/static/ai-avatar.png" mode="aspectFill" />
        </view>
        <!-- 日历按钮 -->
        <view class="calendar-btn" @click="goToCalendar">
          <text class="icon">📅</text>
        </view>
      </view>
    </view>

    <!-- 树木展示区 -->
    <view class="tree-section" @click="goToMyTree">
      <view class="tree-container">
        <text class="tree-icon">{{ treeIcon }}</text>
        <!-- 漂浮气泡 -->
        <view
          v-for="bubble in bubbles"
          :key="bubble.id"
          class="bubble"
          :style="{
            left: bubble.x + '%',
            top: bubble.y + '%',
            background: bubble.color,
            animationDelay: bubble.delay + 's'
          }"
        ></view>
      </view>
      <text class="tree-stage">{{ currentStage.name }}</text>
      <text class="tree-points">{{ treeInfo?.totalPoints || 0 }} 积分</text>
    </view>

    <!-- 当前输入框 -->
    <view v-if="!todayCompleted" class="current-input">
      <view class="input-card">
        <view class="input-header">
          <text class="input-number">第 {{ currentIndex + 1 }} 件好事</text>
        </view>
        <textarea
          v-model="currentInput"
          class="input-box"
          :placeholder="currentPlaceholder"
          :maxlength="200"
          :auto-height="true"
          @focus="handleFocus"
        />
        <view v-if="currentInput.trim()" class="input-footer">
          <text class="char-count">{{ currentInput.length }}/200</text>
          <button
            class="submit-btn"
            :loading="submitting"
            @click="handleSubmit"
          >
            记录
          </button>
        </view>
      </view>
    </view>

    <!-- VIP升级提示 -->
    <view v-if="showVIPTip" class="vip-tip">
      <view class="vip-card">
        <view class="vip-icon">👑</view>
        <view class="vip-content">
          <text class="vip-title">想要记录更多美好？</text>
          <text class="vip-desc">升级 VIP 会员，每日最多记录 6 件好事</text>
          <text class="vip-desc">让小树获得更多成长能量</text>
        </view>
        <button class="vip-btn" @click="goToVIP">
          立即升级 VIP
        </button>
      </view>
    </view>

    <!-- 完成庆祝 -->
    <view v-if="todayCompleted" class="celebration">
      <view class="celebration-card">
        <text class="celebration-icon">🎉</text>
        <text class="celebration-title">太棒了！</text>
        <text class="celebration-text">今天的{{ maxThings }}件好事已记录完成</text>
        <text class="celebration-sub">你的小树获得了成长能量</text>
        <button class="share-btn">
          分享今天的好心情
        </button>
      </view>
    </view>

    <!-- 已完成记录 -->
    <view v-if="todayRecords.length > 0" class="completed-section">
      <view class="section-header" @click="showCompleted = !showCompleted">
        <text class="section-title">今日已记录 ({{ todayRecords.length }} 件)</text>
        <text class="toggle-icon">{{ showCompleted ? '▲' : '▼' }}</text>
      </view>

      <view v-if="showCompleted" class="completed-list">
        <view
          v-for="(record, index) in todayRecords"
          :key="record.id"
          class="completed-item"
        >
          <view class="item-header">
            <text class="item-number">第 {{ index + 1 }} 件好事</text>
            <text class="item-time">{{ formatTime(record.createdAt) }}</text>
          </view>
          <text class="item-content">{{ record.content }}</text>
          <view v-if="record.aiFeedback" class="ai-feedback">
            <text class="feedback-icon">✨</text>
            <text class="feedback-text">{{ record.aiFeedback }}</text>
          </view>
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

const currentInput = ref('')
const submitting = ref(false)
const showCompleted = ref(false)
const bubbles = ref<any[]>([])

const todayRecords = computed(() => recordStore.todayRecords)
const streakDays = computed(() => recordStore.streakDays)
const currentStage = computed(() => treeStore.currentStage)
const treeInfo = computed(() => treeStore.treeInfo)
const isVIP = computed(() => userStore.userInfo?.isVIP || false)

const maxThings = computed(() => isVIP.value ? 6 : 3)
const completedCount = computed(() => todayRecords.value.length)
const todayCompleted = computed(() => completedCount.value >= maxThings.value)
const currentIndex = computed(() => completedCount.value)
const showVIPTip = computed(() => !isVIP.value && completedCount.value >= 3)

const treeIcon = computed(() => {
  const icons = ['🌰', '🌱', '🌿', '🌳', '🌲', '🌴']
  return icons[treeStore.treeInfo?.stage || 0]
})

const placeholders = [
  '今天有什么让你感到开心的小事？',
  '还有什么让你感到温暖的瞬间？',
  '再想想，还有什么美好的事情？',
  '继续记录你的美好时刻...',
  '还有什么值得记住的事？',
  '最后一件，让今天更完美'
]

const currentPlaceholder = computed(() => {
  return placeholders[Math.min(currentIndex.value, placeholders.length - 1)]
})

const bubbleColors = ['#FF7E95', '#FFD56B', '#FF9F43', '#A7F3D0', '#FFA6C9']

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    // 自动游客登录
    await userStore.mockLogin()
  }
  recordStore.init()
  treeStore.init()
})

const handleFocus = () => {
  // 输入框获得焦点时的处理
}

const handleSubmit = async () => {
  const content = currentInput.value.trim()
  if (!content) return

  try {
    submitting.value = true
    const result = await recordStore.submitGoodThing(content)

    // 增加树木积分
    const points = content.length > 20 ? 7 : 5
    treeStore.addPoints(points)

    // 添加漂浮气泡
    addBubble()

    // 显示AI反馈
    if (result.aiFeedback) {
      uni.showToast({
        title: result.aiFeedback,
        icon: 'none',
        duration: 2000
      })
    }

    // 清空输入
    currentInput.value = ''
  } catch (error: any) {
    uni.showToast({
      title: error.message || '提交失败',
      icon: 'none'
    })
  } finally {
    submitting.value = false
  }
}

const addBubble = () => {
  const bubble = {
    id: Date.now(),
    x: 30 + Math.random() * 40,
    y: 40 + Math.random() * 20,
    delay: 0,
    color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)]
  }
  bubbles.value.push(bubble)

  // 4秒后移除气泡
  setTimeout(() => {
    bubbles.value = bubbles.value.filter(b => b.id !== bubble.id)
  }, 4000)
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

const goToAIChat = () => {
  uni.navigateTo({ url: '/pages/ai-chat/ai-chat' })
}

const goToCalendar = () => {
  uni.navigateTo({ url: '/pages/calendar/calendar' })
}

const goToMyTree = () => {
  uni.navigateTo({ url: '/pages/mytree/mytree' })
}

const goToVIP = () => {
  uni.navigateTo({ url: '/pages/vip/vip' })
}
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  background: #FFF9F0;
  padding: 40rpx 30rpx 120rpx;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60rpx;

  .info-badges {
    display: flex;
    gap: 16rpx;

    .badge {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 12rpx 24rpx;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20rpx);
      border-radius: 40rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

      .icon {
        font-size: 28rpx;
      }

      .text {
        font-size: 26rpx;
        color: #FF9F43;
        font-weight: 500;
      }
    }

    .progress-badge .text {
      color: #FF7E95;
    }

    .vip-badge {
      background: linear-gradient(135deg, #FFD56B, #FF9F43);

      .text {
        color: white;
        font-size: 24rpx;
      }
    }
  }

  .action-btns {
    display: flex;
    gap: 16rpx;

    .ai-btn,
    .calendar-btn {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20rpx);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
    }

    .ai-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(135deg, #FF7E95, #FF9F43);
    }

    .icon {
      font-size: 36rpx;
    }
  }
}

.tree-section {
  text-align: center;
  margin-bottom: 60rpx;

  .tree-container {
    width: 320rpx;
    height: 320rpx;
    margin: 0 auto 30rpx;
    background: linear-gradient(135deg, rgba(255, 248, 225, 0.8), rgba(255, 224, 178, 0.8));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 24rpx rgba(255, 152, 0, 0.15);
    position: relative;
    overflow: visible;

    .tree-icon {
      font-size: 160rpx;
      position: relative;
      z-index: 1;
    }

    .bubble {
      position: absolute;
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      opacity: 0;
      animation: bubble-float 4s ease-out forwards;
    }
  }

  .tree-stage {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #475569;
    margin-bottom: 12rpx;
  }

  .tree-points {
    display: block;
    font-size: 28rpx;
    color: #FF9F43;
    font-weight: 500;
  }
}

@keyframes bubble-float {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  20% {
    opacity: 1;
    transform: translateY(-20rpx) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-200rpx) scale(0.5);
  }
}

.current-input {
  margin-bottom: 40rpx;

  .input-card {
    padding: 30rpx;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 48rpx;
    box-shadow: inset 2rpx 2rpx 5rpx rgba(255, 255, 255, 1),
                inset -3rpx -3rpx 7rpx rgba(0, 0, 0, 0.05),
                0 10rpx 30rpx rgba(166, 180, 200, 0.15);

    .input-header {
      margin-bottom: 20rpx;

      .input-number {
        font-size: 26rpx;
        color: #94A3B8;
      }
    }

    .input-box {
      width: 100%;
      min-height: 120rpx;
      font-size: 30rpx;
      color: #475569;
      line-height: 1.6;
      margin-bottom: 20rpx;
    }

    .input-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .char-count {
        font-size: 24rpx;
        color: #94A3B8;
      }

      .submit-btn {
        padding: 16rpx 48rpx;
        background: linear-gradient(135deg, #FF7E95, #FF9F43);
        border-radius: 40rpx;
        color: white;
        font-size: 28rpx;
        font-weight: 500;
        border: none;
        box-shadow: 0 4rpx 12rpx rgba(255, 126, 149, 0.3);
      }
    }
  }
}

.vip-tip {
  margin-bottom: 40rpx;

  .vip-card {
    padding: 40rpx;
    background: linear-gradient(135deg, rgba(255, 215, 107, 0.3), rgba(255, 159, 67, 0.3));
    border-radius: 56rpx;
    text-align: center;
    box-shadow: inset 2rpx 2rpx 5rpx rgba(255, 255, 255, 1),
                inset -3rpx -3rpx 7rpx rgba(0, 0, 0, 0.05),
                0 10rpx 30rpx rgba(255, 159, 67, 0.2);

    .vip-icon {
      font-size: 96rpx;
      margin-bottom: 24rpx;
    }

    .vip-content {
      margin-bottom: 32rpx;

      .vip-title {
        display: block;
        font-size: 36rpx;
        color: #475569;
        font-weight: 500;
        margin-bottom: 16rpx;
      }

      .vip-desc {
        display: block;
        font-size: 28rpx;
        color: #94A3B8;
        line-height: 1.6;
      }
    }

    .vip-btn {
      padding: 24rpx 64rpx;
      background: linear-gradient(135deg, #FFD56B, #FF9F43);
      border-radius: 48rpx;
      color: white;
      font-size: 32rpx;
      font-weight: bold;
      border: none;
      box-shadow: 0 4rpx 12rpx rgba(255, 159, 67, 0.4);
    }
  }
}

.celebration {
  margin-bottom: 40rpx;

  .celebration-card {
    padding: 48rpx;
    background: rgba(255, 215, 107, 0.3);
    border-radius: 56rpx;
    text-align: center;
    box-shadow: inset 2rpx 2rpx 5rpx rgba(255, 255, 255, 1),
                inset -3rpx -3rpx 7rpx rgba(0, 0, 0, 0.05),
                0 10rpx 30rpx rgba(255, 215, 107, 0.3);

    .celebration-icon {
      display: block;
      font-size: 100rpx;
      margin-bottom: 24rpx;
    }

    .celebration-title {
      display: block;
      font-size: 40rpx;
      color: #475569;
      font-weight: bold;
      margin-bottom: 16rpx;
    }

    .celebration-text {
      display: block;
      font-size: 28rpx;
      color: #94A3B8;
      margin-bottom: 8rpx;
    }

    .celebration-sub {
      display: block;
      font-size: 26rpx;
      color: #94A3B8;
      margin-bottom: 32rpx;
    }

    .share-btn {
      padding: 20rpx 48rpx;
      background: linear-gradient(135deg, #FF7E95, #FF9F43);
      border-radius: 40rpx;
      color: white;
      font-size: 28rpx;
      border: none;
    }
  }
}

.completed-section {
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 48rpx;
    margin-bottom: 24rpx;

    .section-title {
      font-size: 28rpx;
      color: #475569;
    }

    .toggle-icon {
      font-size: 24rpx;
      color: #94A3B8;
    }
  }

  .completed-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;

    .completed-item {
      padding: 30rpx;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 40rpx;
      box-shadow: inset 2rpx 2rpx 5rpx rgba(255, 255, 255, 1),
                  inset -3rpx -3rpx 7rpx rgba(0, 0, 0, 0.05);

      .item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16rpx;

        .item-number {
          font-size: 26rpx;
          color: #94A3B8;
        }

        .item-time {
          font-size: 24rpx;
          color: #94A3B8;
        }
      }

      .item-content {
        display: block;
        font-size: 30rpx;
        color: #475569;
        line-height: 1.6;
        margin-bottom: 16rpx;
      }

      .ai-feedback {
        display: flex;
        align-items: flex-start;
        gap: 12rpx;
        padding: 20rpx;
        background: rgba(255, 126, 149, 0.1);
        border-radius: 24rpx;

        .feedback-icon {
          font-size: 28rpx;
          flex-shrink: 0;
        }

        .feedback-text {
          flex: 1;
          font-size: 26rpx;
          color: #FF7E95;
          line-height: 1.5;
        }
      }
    }
  }
}
</style>
