<template>
  <view class="home-page">
    <!-- 顶部导航栏 -->
    <view class="top-nav">
      <view class="nav-left">
        <image class="logo" src="/static/logo.png" mode="aspectFit" />
        <text class="app-name">{{ $t('nav.home') }}</text>
      </view>
      <view class="nav-right">
        <LanguageSwitcher />
        <view v-if="!authStore.isAuthenticated || authStore.isGuest" class="login-btn" @click="showAuthModal = true">
          <text>{{ $t('profile.login') }}</text>
        </view>
        <view v-else class="user-info" @click="goToProfile">
          <image class="avatar" :src="authStore.user?.avatar" mode="aspectFill" />
          <text class="nickname">{{ authStore.user?.nickname }}</text>
        </view>
      </view>
    </view>

    <!-- 顶部信息栏 -->
    <view class="header">
      <view class="info-badges">
        <view class="badge streak-badge">
          <text class="icon">🔥</text>
          <text class="text">{{ $t('calendar.streak') }} {{ authStore.user?.streakDays || 0 }} {{ $t('calendar.days') }}</text>
        </view>
        <view class="badge progress-badge">
          <text class="text">{{ completedCount }}/{{ maxThings }}</text>
        </view>
        <view v-if="authStore.isVIP" class="badge vip-badge">
          <text class="icon">👑</text>
          <text class="text">VIP</text>
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
      <text class="tree-stage">{{ treeStageText }}</text>
      <text class="tree-points">{{ authStore.user?.totalPoints || 0 }} {{ $t('tree.points') }}</text>
    </view>

    <!-- 当前输入框 -->
    <view v-if="!todayCompleted" class="current-input">
      <view class="input-card">
        <view class="input-header">
          <text class="input-number">{{ $t('home.title') }} - {{ currentIndex + 1 }}/{{ maxThings }}</text>
        </view>
        <textarea
          v-model="currentInput"
          class="input-box"
          :placeholder="$t('home.placeholder')"
          :maxlength="500"
          :auto-height="true"
        />
        <view v-if="currentInput.trim()" class="input-footer">
          <text class="char-count">{{ currentInput.length }}/500</text>
          <button
            class="submit-btn"
            :loading="submitting"
            :disabled="currentInput.trim().length < 10"
            @click="handleSubmit"
          >
            {{ $t('home.submitButton') }}
          </button>
        </view>
      </view>
    </view>

    <!-- VIP升级提示 -->
    <view v-if="showVIPTip" class="vip-tip">
      <view class="vip-card">
        <view class="vip-icon">👑</view>
        <view class="vip-content">
          <text class="vip-title">{{ $t('home.vipTip') }}</text>
        </view>
        <button class="vip-btn" @click="goToVIP">
          {{ $t('home.upgradeVip') }}
        </button>
      </view>
    </view>

    <!-- 完成庆祝 -->
    <view v-if="todayCompleted" class="celebration">
      <view class="celebration-card">
        <text class="celebration-icon">{{ $t('home.celebration') }}</text>
        <text class="celebration-title">{{ $t('home.allDone') }}</text>
        <text class="celebration-text">{{ $t('home.celebrationDesc') }}</text>
      </view>
    </view>

    <!-- 已完成记录 -->
    <view v-if="todayRecords.length > 0" class="completed-section">
      <view class="section-header" @click="showCompleted = !showCompleted">
        <text class="section-title">{{ $t('home.todayProgress') }} ({{ todayRecords.length }})</text>
        <text class="toggle-icon">{{ showCompleted ? '▲' : '▼' }}</text>
      </view>

      <view v-if="showCompleted" class="completed-list">
        <view
          v-for="(record, index) in todayRecords"
          :key="record.id"
          class="completed-item"
        >
          <view class="item-header">
            <text class="item-number">#{{ index + 1 }}</text>
            <text class="item-time">{{ formatTime(record.createdAt) }}</text>
          </view>
          <text class="item-content">{{ record.content }}</text>
          <view v-if="record.aiFeedback" class="ai-feedback">
            <text class="feedback-icon">✨</text>
            <text class="feedback-text">{{ record.aiFeedback }}</text>
          </view>
          <view class="item-footer">
            <text class="category-tag">{{ getCategoryText(record.category) }}</text>
            <text class="points">+{{ record.points }} {{ $t('tree.points') }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- AI 对话浮窗 -->
    <AIChat :visible="showAIChat" @close="showAIChat = false" />

    <!-- 认证弹窗 -->
    <AuthModal
      :visible="showAuthModal"
      :show-guest-tip="showGuestTip"
      @close="showAuthModal = false"
      @success="handleAuthSuccess"
    />

    <!-- AI 触发按钮（LOGO） -->
    <view class="ai-trigger" @click="showAIChat = true">
      <image class="trigger-logo" src="/static/logo.png" mode="aspectFit" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import { recordApi } from '@/api/backend'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import AIChat from '@/components/AIChat.vue'
import AuthModal from '@/components/AuthModal.vue'

const { t } = useI18n()
const authStore = useAuthStore()

const currentInput = ref('')
const submitting = ref(false)
const showCompleted = ref(false)
const bubbles = ref<any[]>([])
const todayRecords = ref<any[]>([])
const showAIChat = ref(false)
const showAuthModal = ref(false)
const showGuestTip = ref(false)

const maxThings = computed(() => authStore.isVIP ? 6 : 3)
const completedCount = computed(() => todayRecords.value.length)
const todayCompleted = computed(() => completedCount.value >= maxThings.value)
const currentIndex = computed(() => completedCount.value)
const showVIPTip = computed(() => !authStore.isVIP && completedCount.value >= 3)

const treeIcon = computed(() => {
  const icons = ['🌰', '🌱', '🌿', '🌳', '🌲', '🌴']
  const stage = authStore.user?.treeStage || 0
  return icons[Math.min(stage, icons.length - 1)]
})

const treeStageText = computed(() => {
  const stages = ['seed', 'sprout', 'seedling', 'sapling', 'tree', 'forest']
  const stage = authStore.user?.treeStage || 0
  return t(`tree.stage.${stages[Math.min(stage, stages.length - 1)]}`)
})

const bubbleColors = ['#FF7E95', '#FFD56B', '#FF9F43', '#A7F3D0', '#FFA6C9']

onMounted(async () => {
  try {
    await authStore.init()
    // 只有在认证成功后才加载记录
    if (authStore.isAuthenticated) {
      await loadTodayRecords()
    }
  } catch (error) {
    console.error('Mount error:', error)
  }
})

const loadTodayRecords = async () => {
  try {
    const response = await recordApi.getToday()
    if (response.success) {
      todayRecords.value = response.data.records
    }
  } catch (error) {
    console.error('Load today records error:', error)
  }
}

const handleSubmit = async () => {
  const content = currentInput.value.trim()
  if (content.length < 10) {
    uni.showToast({
      title: t('messages.recordTooShort'),
      icon: 'none',
    })
    return
  }

  if (!authStore.isAuthenticated) {
    showGuestTip.value = true
    showAuthModal.value = true
    return
  }

  try {
    submitting.value = true
    const response = await recordApi.create({ content })

    if (response.success) {
      // 更新用户信息
      await authStore.refreshUser()

      // 重新加载今日记录
      await loadTodayRecords()

      // 添加漂浮气泡
      addBubble()

      // 显示AI反馈
      if (response.data.record.aiFeedback) {
        uni.showToast({
          title: response.data.record.aiFeedback,
          icon: 'none',
          duration: 3000,
        })
      }

      // 清空输入
      currentInput.value = ''

      // 如果完成了所有记录，显示庆祝
      if (todayRecords.value.length >= maxThings.value) {
        uni.showToast({
          title: t('home.allDone'),
          icon: 'success',
        })
      }
    }
  } catch (error: any) {
    uni.showToast({
      title: error.message || t('messages.submitSuccess'),
      icon: 'none',
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
    color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
  }
  bubbles.value.push(bubble)

  setTimeout(() => {
    bubbles.value = bubbles.value.filter((b) => b.id !== bubble.id)
  }, 4000)
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

const getCategoryText = (category: string) => {
  return t(`forest.category.${category}`)
}

const handleAuthSuccess = () => {
  showAuthModal.value = false
  loadTodayRecords()
}

const goToProfile = () => {
  uni.navigateTo({ url: '/pages/profile/profile' })
}

const goToMyTree = () => {
  uni.navigateTo({ url: '/pages/mytree/mytree' })
}

const goToVIP = () => {
  uni.navigateTo({ url: '/pages/vip/vip' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/responsive.scss';

.home-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 50%, #FFF5F7 100%);
  padding-bottom: 120rpx;
}

.top-nav {
  @include flex-between;
  padding: 32rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.logo {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
}

.app-name {
  font-size: 34rpx;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: 0.5rpx;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.login-btn {
  padding: 18rpx 36rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50rpx;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.3);
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
  cursor: pointer;
  padding: 8rpx 16rpx 8rpx 8rpx;
  border-radius: 50rpx;
  transition: all 0.3s;

  &:active {
    background: rgba(0, 0, 0, 0.05);
  }
}

.avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(102, 126, 234, 0.2);
}

.nickname {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  max-width: 120rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header {
  padding: 32rpx;
}

.info-badges {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 18rpx 28rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s;

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
  }
}

.icon {
  font-size: 32rpx;
}

.text {
  font-size: 28rpx;
  font-weight: 500;
  color: #555;
}

.vip-badge {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  box-shadow: 0 4rpx 16rpx rgba(255, 165, 0, 0.3);

  .text {
    color: #ffffff;
    font-weight: 600;
  }
}

.tree-section {
  margin: 32rpx;
  padding: 56rpx 48rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32rpx;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);

  &:active {
    transform: translateY(4rpx);
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  }
}

.tree-container {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  margin: 0 auto 24rpx;
}

.tree-icon {
  font-size: 140rpx;
  line-height: 200rpx;
  filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.1));
}

.bubble {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  opacity: 0.7;
  animation: float 4s ease-in-out infinite;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-40rpx) scale(1.3);
    opacity: 0.9;
  }
}

.tree-stage {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12rpx;
  letter-spacing: 1rpx;
}

.tree-points {
  display: block;
  font-size: 26rpx;
  font-weight: 500;
  color: #888;
}

.current-input {
  margin: 32rpx;
}

.input-card {
  @include card;
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.input-header {
  margin-bottom: 24rpx;
}

.input-number {
  font-size: 30rpx;
  font-weight: 600;
  color: #555;
  letter-spacing: 0.5rpx;
}

.input-box {
  width: 100%;
  min-height: 220rpx;
  padding: 28rpx;
  background: #f8f9fa;
  border-radius: 20rpx;
  font-size: 30rpx;
  line-height: 1.8;
  color: #333;
  border: 2rpx solid transparent;
  transition: all 0.3s;

  &:focus {
    background: #ffffff;
    border-color: rgba(102, 126, 234, 0.3);
    box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
  }
}

.input-footer {
  @include flex-between;
  margin-top: 24rpx;
}

.char-count {
  font-size: 24rpx;
  font-weight: 500;
  color: #999;
}

.submit-btn {
  @include button;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  font-weight: 600;
  font-size: 30rpx;
  padding: 20rpx 48rpx;
  box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.vip-tip {
  margin: 32rpx;
}

.vip-card {
  @include card;
  background: linear-gradient(135deg, #FFF9E6 0%, #FFE7BA 100%);
  text-align: center;
  box-shadow: 0 8rpx 24rpx rgba(255, 165, 0, 0.15);
}

.vip-icon {
  font-size: 88rpx;
  margin-bottom: 20rpx;
  filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.1));
}

.vip-content {
  margin-bottom: 28rpx;
}

.vip-title {
  display: block;
  font-size: 34rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8rpx;
  letter-spacing: 0.5rpx;
}

.vip-btn {
  @include button;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #ffffff;
  border: none;
  font-weight: 600;
  font-size: 30rpx;
  box-shadow: 0 6rpx 20rpx rgba(255, 165, 0, 0.4);

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 16rpx rgba(255, 165, 0, 0.4);
  }
}

.celebration {
  margin: 32rpx;
}

.celebration-card {
  @include card;
  text-align: center;
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  box-shadow: 0 8rpx 24rpx rgba(76, 175, 80, 0.15);
}

.celebration-icon {
  font-size: 100rpx;
  display: block;
  margin-bottom: 20rpx;
  filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.1));
}

.celebration-title {
  display: block;
  font-size: 42rpx;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12rpx;
  letter-spacing: 1rpx;
}

.celebration-text {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  color: #555;
  line-height: 1.6;
}

.completed-section {
  margin: 32rpx;
}

.section-header {
  @include flex-between;
  padding: 28rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  cursor: pointer;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s;

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
  }
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: 0.5rpx;
}

.toggle-icon {
  font-size: 28rpx;
  color: #888;
  transition: transform 0.3s;
}

.completed-list {
  margin-top: 20rpx;
}

.completed-item {
  @include card;
  margin-bottom: 20rpx;
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s;

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.item-header {
  @include flex-between;
  margin-bottom: 20rpx;
}

.item-number {
  font-size: 26rpx;
  font-weight: 600;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.item-time {
  font-size: 24rpx;
  font-weight: 500;
  color: #999;
}

.item-content {
  font-size: 30rpx;
  line-height: 1.8;
  color: #333;
  margin-bottom: 20rpx;
  word-break: break-word;
}

.ai-feedback {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 20rpx;
  background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  border-left: 4rpx solid #667eea;
}

.feedback-icon {
  font-size: 32rpx;
  line-height: 1;
}

.feedback-text {
  flex: 1;
  font-size: 26rpx;
  line-height: 1.6;
  color: #555;
  font-weight: 500;
}

.item-footer {
  @include flex-between;
}

.category-tag {
  padding: 8rpx 16rpx;
  background: #E8F5E9;
  border-radius: 8rpx;
  font-size: 22rpx;
  color: #4CAF50;
}

.points {
  font-size: 24rpx;
  font-weight: 500;
  color: #FF9F43;
}

.ai-trigger {
  position: fixed;
  bottom: 120rpx;
  right: 32rpx;
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(78, 205, 196, 0.4);
  cursor: pointer;
  z-index: 999;
  transition: all 0.3s;

  &:active {
    transform: scale(0.9);
  }
}

.trigger-logo {
  width: 80rpx;
  height: 80rpx;
}
</style>
