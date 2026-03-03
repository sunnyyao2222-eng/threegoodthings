<template>
  <view class="profile-page">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-header">
        <image class="avatar" :src="authStore.user?.avatar || '/static/logo.png'" mode="aspectFill" />
        <view class="user-info">
          <view class="name-row">
            <text class="nickname">{{ authStore.user?.nickname || $t('profile.guest') }}</text>
            <view v-if="authStore.isVIP" class="vip-badge">
              <text class="vip-icon">👑</text>
              <text class="vip-text">VIP</text>
            </view>
          </view>
          <text class="email">{{ authStore.user?.email }}</text>
          <view v-if="authStore.isGuest" class="guest-tip">
            <text>{{ $t('messages.unauthorized') }}</text>
            <text class="upgrade-link" @click="showAuthModal = true">{{ $t('profile.login') }}</text>
          </view>
        </view>
      </view>

      <!-- 语言切换 -->
      <view class="language-section">
        <text class="section-label">{{ $t('profile.settings.language') }}</text>
        <LanguageSwitcher />
      </view>
    </view>

    <!-- 数据统计 -->
    <view class="stats-section">
      <text class="section-title">{{ $t('profile.stats.title') }}</text>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ authStore.user?.streak_days || 0 }}</text>
          <text class="stat-label">{{ $t('profile.stats.streakDays') }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ authStore.user?.total_points || 0 }}</text>
          <text class="stat-label">{{ $t('tree.points') }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ treeStageText }}</text>
          <text class="stat-label">{{ $t('profile.stats.treeStage') }}</text>
        </view>
      </view>
    </view>

    <!-- VIP 会员 -->
    <view v-if="!authStore.isVIP" class="vip-section" @click="goToVIP">
      <view class="vip-card">
        <view class="vip-icon">👑</view>
        <view class="vip-content">
          <text class="vip-title">{{ $t('vip.title') }}</text>
          <text class="vip-desc">{{ $t('vip.subtitle') }}</text>
        </view>
        <text class="arrow">→</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="goToCalendar">
        <view class="menu-left">
          <text class="menu-icon">📅</text>
          <text class="menu-text">{{ $t('nav.calendar') }}</text>
        </view>
        <text class="arrow">→</text>
      </view>

      <view class="menu-item" @click="goToMyTree">
        <view class="menu-left">
          <text class="menu-icon">🌳</text>
          <text class="menu-text">{{ $t('tree.title') }}</text>
        </view>
        <text class="arrow">→</text>
      </view>

      <view class="menu-item" @click="goToAchievements">
        <view class="menu-left">
          <text class="menu-icon">🏆</text>
          <text class="menu-text">{{ $t('achievements.title') }}</text>
        </view>
        <text class="arrow">→</text>
      </view>
    </view>

    <!-- 设置菜单 -->
    <view class="menu-section">
      <text class="section-title">{{ $t('profile.settings.title') }}</text>

      <view class="menu-item" @click="showAbout">
        <view class="menu-left">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">{{ $t('profile.settings.about') }}</text>
        </view>
        <text class="arrow">→</text>
      </view>
    </view>

    <!-- 登出按钮 -->
    <view v-if="!authStore.isGuest" class="logout-section">
      <button class="logout-btn" @click="handleLogout">
        {{ $t('profile.logout') }}
      </button>
    </view>

    <!-- 认证弹窗 -->
    <AuthModal
      :visible="showAuthModal"
      @close="showAuthModal = false"
      @success="handleAuthSuccess"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth-supabase'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import AuthModal from '@/components/AuthModal.vue'

const { t } = useI18n()
const authStore = useAuthStore()

const showAuthModal = ref(false)

const treeStageText = computed(() => {
  const stages = ['seed', 'sprout', 'seedling', 'sapling', 'tree', 'forest']
  const stage = authStore.user?.tree_stage || 0
  return t(`tree.stage.${stages[Math.min(stage, stages.length - 1)]}`)
})

const handleAuthSuccess = () => {
  showAuthModal.value = false
  uni.showToast({
    title: t('messages.loginSuccess'),
    icon: 'success',
  })
}

const handleLogout = () => {
  uni.showModal({
    title: t('profile.logout'),
    content: 'Are you sure you want to logout?',
    success: (res) => {
      if (res.confirm) {
        authStore.logout()
        uni.showToast({
          title: t('messages.logoutSuccess'),
          icon: 'success',
        })
      }
    },
  })
}

const goToVIP = () => {
  uni.navigateTo({ url: '/pages/vip/vip' })
}

const goToCalendar = () => {
  uni.navigateTo({ url: '/pages/calendar/calendar' })
}

const goToMyTree = () => {
  uni.navigateTo({ url: '/pages/mytree/mytree' })
}

const goToAchievements = () => {
  uni.navigateTo({ url: '/pages/achievement/achievement' })
}

const showAbout = () => {
  uni.showModal({
    title: t('profile.settings.about'),
    content: 'Three Good Things v2.0\n\nA positive psychology app to help you cultivate gratitude and happiness.',
    showCancel: false,
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/responsive.scss';

.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 32rpx;
  padding-bottom: 120rpx;
}

.user-card {
  @include card;
  margin-bottom: 32rpx;
}

.user-header {
  display: flex;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #f0f0f0;
}

.user-info {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.vip-badge {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 4rpx 12rpx;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: 12rpx;
}

.vip-icon {
  font-size: 20rpx;
}

.vip-text {
  font-size: 20rpx;
  color: #ffffff;
  font-weight: bold;
}

.email {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.guest-tip {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #666;
}

.upgrade-link {
  color: #4ECDC4;
  text-decoration: underline;
}

.language-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24rpx;
  border-top: 1px solid #f0f0f0;
}

.section-label {
  font-size: 28rpx;
  color: #666;
}

.stats-section {
  @include card;
  margin-bottom: 32rpx;
}

.section-title {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 24rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #4ECDC4;
  margin-bottom: 8rpx;
}

.stat-label {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.vip-section {
  margin-bottom: 32rpx;
}

.vip-card {
  @include card;
  background: linear-gradient(135deg, #FFF7E6 0%, #FFE7BA 100%);
  display: flex;
  align-items: center;
  gap: 24rpx;
  cursor: pointer;
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
  }
}

.vip-icon {
  font-size: 64rpx;
}

.vip-content {
  flex: 1;
}

.vip-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}

.vip-desc {
  display: block;
  font-size: 24rpx;
  color: #666;
}

.menu-section {
  @include card;
  margin-bottom: 32rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  cursor: pointer;
  transition: all 0.2s;

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }

  &:active {
    opacity: 0.6;
  }
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.menu-icon {
  font-size: 40rpx;
}

.menu-text {
  font-size: 28rpx;
  color: #333;
}

.arrow {
  font-size: 28rpx;
  color: #999;
}

.logout-section {
  margin-top: 48rpx;
}

.logout-btn {
  width: 100%;
  height: 88rpx;
  background: #ffffff;
  border: 2px solid #ff4d4f;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #ff4d4f;
  transition: all 0.3s;

  &:active {
    background: #ff4d4f;
    color: #ffffff;
  }
}
</style>
