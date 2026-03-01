<template>
  <view class="profile-page">
    <view class="header">
      <image class="avatar" :src="userInfo?.avatar || '/static/logo.png'" />
      <text class="nickname">{{ userInfo?.nickname || '未登录' }}</text>
    </view>

    <view class="stats">
      <view class="stat-item">
        <text class="stat-value">{{ userInfo?.streakDays || 0 }}</text>
        <text class="stat-label">连续天数</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ userInfo?.totalPoints || 0 }}</text>
        <text class="stat-label">总积分</text>
      </view>
    </view>

    <view class="menu-list">
      <view class="menu-item" @click="goToAchievement">
        <text class="menu-icon">🏆</text>
        <text class="menu-text">我的成就</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)

onMounted(() => {
  userStore.init()
})

const goToAchievement = () => {
  uni.navigateTo({ url: '/pages/achievement/achievement' })
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #F5F5F5;
}

.header {
  padding: 80rpx 40rpx 60rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  border: 4rpx solid #FFFFFF;
  margin-bottom: 30rpx;
}

.nickname {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.stats {
  display: flex;
  padding: 40rpx;
  background: #FFFFFF;
  margin: -40rpx 30rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #4ECDC4;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.menu-list {
  margin: 0 30rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.menu-arrow {
  font-size: 40rpx;
  color: #CCC;
}
</style>
