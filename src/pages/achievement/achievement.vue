<template>
  <view class="achievement-page">
    <text class="page-title">我的成就</text>

    <view class="badge-list">
      <view
        v-for="badge in badges"
        :key="badge.id"
        class="badge-item"
        :class="{ unlocked: badge.unlocked }"
      >
        <text class="badge-icon">{{ badge.icon }}</text>
        <text class="badge-name">{{ badge.name }}</text>
        <text class="badge-desc">{{ badge.description }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BADGES } from '@/config'

const badges = ref(
  BADGES.map(badge => ({
    ...badge,
    unlocked: false
  }))
)
</script>

<style scoped>
.achievement-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding: 40rpx 30rpx;
}

.page-title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 40rpx;
}

.badge-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.badge-item {
  padding: 40rpx 30rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  text-align: center;
  opacity: 0.5;
}

.badge-item.unlocked {
  opacity: 1;
  box-shadow: 0 4rpx 20rpx rgba(78, 205, 196, 0.2);
}

.badge-icon {
  display: block;
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.badge-name {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.badge-desc {
  display: block;
  font-size: 22rpx;
  color: #999;
  line-height: 1.4;
}
</style>
