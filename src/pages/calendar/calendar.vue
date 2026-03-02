<template>
  <view class="calendar-page">
    <!-- 顶部栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="icon">✕</text>
      </view>
      <text class="title">连胜日历</text>
      <view class="placeholder"></view>
    </view>

    <!-- 标签切换 -->
    <view class="tabs">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'personal' }"
        @click="activeTab = 'personal'"
      >
        个人连胜
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'friend' }"
        @click="activeTab = 'friend'"
      >
        友情连胜
      </view>
    </view>

    <!-- 提示卡片 -->
    <view class="tip-card">
      <view class="tip-icon">⏰</view>
      <view class="tip-content">
        <text class="tip-text">今天就来记录好事，延续连胜！</text>
        <text class="tip-action" @click="goToRecord">延续连胜</text>
      </view>
    </view>

    <!-- 统计数据 -->
    <view class="stats">
      <view class="stat-card">
        <view class="stat-value">
          <text class="icon">✓</text>
          <text class="number">{{ totalDays }}</text>
        </view>
        <text class="stat-label">打卡天数</text>
      </view>
      <view class="stat-card">
        <view class="stat-value">
          <text class="icon">💧</text>
          <text class="number streak">{{ streakDays }}</text>
        </view>
        <text class="stat-label">连续打卡天数</text>
        <view class="badge">优秀</view>
      </view>
    </view>

    <!-- 月份导航 -->
    <view class="month-nav">
      <text class="month-title">{{ currentMonthText }}</text>
      <view class="nav-btns">
        <view class="nav-btn" @click="prevMonth">
          <text class="icon">‹</text>
        </view>
        <view class="nav-btn" @click="nextMonth">
          <text class="icon">›</text>
        </view>
      </view>
    </view>

    <!-- 日历 -->
    <view class="calendar">
      <!-- 星期标题 -->
      <view class="weekdays">
        <text
          v-for="day in weekDays"
          :key="day"
          class="weekday"
        >
          {{ day }}
        </text>
      </view>

      <!-- 日期网格 -->
      <view class="days-grid">
        <view
          v-for="(day, index) in calendarDays"
          :key="index"
          class="day-cell"
          :class="{
            empty: !day,
            today: day === today,
            recorded: day && recordedDays.includes(day),
            streak: day && isInStreak(day)
          }"
        >
          <text v-if="day" class="day-number">{{ day }}</text>
        </view>
      </view>
    </view>

    <!-- 连胜目标 -->
    <view class="goals">
      <text class="goals-title">连胜目标</text>
      <view class="goal-list">
        <view
          v-for="goal in goals"
          :key="goal.days"
          class="goal-item"
          :class="{ achieved: goal.achieved }"
        >
          <view class="goal-icon">
            <text v-if="goal.achieved" class="icon">✓</text>
            <text v-else class="days">{{ goal.days }}</text>
          </view>
          <text class="goal-text">连续打卡{{ goal.days }}天</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRecordStore } from '@/store'

const recordStore = useRecordStore()

const activeTab = ref('personal')
const currentMonth = ref(new Date())

const totalDays = computed(() => recordStore.historyRecords.length)
const streakDays = computed(() => recordStore.streakDays)

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 模拟已记录的日期
const recordedDays = ref([1, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27])
const today = new Date().getDate()

const currentMonthText = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth() + 1
  return `${year}年${month}月`
})

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days: (number | null)[] = []

  // 填充空白
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // 填充日期
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return days
})

const isInStreak = (day: number) => {
  // 简化逻辑：8-21日为连续打卡区间
  return day >= 8 && day <= 21 && recordedDays.value.includes(day)
}

const goals = computed(() => [
  { days: 7, achieved: streakDays.value >= 7 },
  { days: 14, achieved: streakDays.value >= 14 },
  { days: 21, achieved: streakDays.value >= 21 },
  { days: 30, achieved: streakDays.value >= 30 }
])

const goBack = () => {
  uni.navigateBack()
}

const goToRecord = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

const prevMonth = () => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  currentMonth.value = new Date(year, month - 1)
}

const nextMonth = () => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  currentMonth.value = new Date(year, month + 1)
}
</script>

<style scoped lang="scss">
.calendar-page {
  min-height: 100vh;
  background: #FFF9F0;
  padding-bottom: 40rpx;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .back-btn {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      font-size: 40rpx;
      color: #475569;
    }
  }

  .title {
    font-size: 36rpx;
    color: #475569;
    font-weight: 500;
  }

  .placeholder {
    width: 80rpx;
  }
}

.tabs {
  display: flex;
  border-bottom: 1rpx solid rgba(148, 163, 184, 0.2);

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 30rpx 0;
    font-size: 28rpx;
    color: #94A3B8;
    position: relative;

    &.active {
      color: #4FC3F7;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60rpx;
        height: 4rpx;
        background: #4FC3F7;
        border-radius: 2rpx;
      }
    }
  }
}

.tip-card {
  margin: 30rpx;
  padding: 30rpx;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;

  .tip-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: rgba(255, 215, 107, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
  }

  .tip-content {
    flex: 1;

    .tip-text {
      display: block;
      font-size: 28rpx;
      color: #475569;
      margin-bottom: 8rpx;
    }

    .tip-action {
      font-size: 26rpx;
      color: #4FC3F7;
    }
  }
}

.stats {
  display: flex;
  gap: 30rpx;
  padding: 0 30rpx;
  margin-bottom: 40rpx;

  .stat-card {
    flex: 1;
    padding: 30rpx;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 40rpx;
    box-shadow: inset 2rpx 2rpx 5rpx rgba(255, 255, 255, 1),
                inset -3rpx -3rpx 7rpx rgba(0, 0, 0, 0.05);

    .stat-value {
      display: flex;
      align-items: center;
      gap: 16rpx;
      margin-bottom: 16rpx;

      .icon {
        font-size: 48rpx;
      }

      .number {
        font-size: 48rpx;
        color: #FF9F43;
        font-weight: bold;

        &.streak {
          color: #4FC3F7;
        }
      }
    }

    .stat-label {
      display: block;
      font-size: 24rpx;
      color: #94A3B8;
      margin-bottom: 16rpx;
    }

    .badge {
      display: inline-block;
      padding: 8rpx 20rpx;
      background: rgba(255, 215, 107, 0.2);
      border-radius: 20rpx;
      font-size: 22rpx;
      color: #FF9F43;
    }
  }
}

.month-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  margin-bottom: 30rpx;

  .month-title {
    font-size: 36rpx;
    color: #475569;
    font-weight: 500;
  }

  .nav-btns {
    display: flex;
    gap: 16rpx;

    .nav-btn {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.7);

      .icon {
        font-size: 36rpx;
        color: #94A3B8;
      }
    }
  }
}

.calendar {
  margin: 0 30rpx;
  padding: 40rpx;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 48rpx;
  box-shadow: inset 2rpx 2rpx 5rpx rgba(255, 255, 255, 1),
              inset -3rpx -3rpx 7rpx rgba(0, 0, 0, 0.05);

  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 16rpx;
    margin-bottom: 24rpx;

    .weekday {
      text-align: center;
      font-size: 26rpx;
      color: #94A3B8;
    }
  }

  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 16rpx;

    .day-cell {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 28rpx;
      color: #94A3B8;

      &.today {
        background: #4FC3F7;
        color: white;
      }

      &.recorded {
        background: rgba(255, 159, 67, 0.3);
        color: #FF9F43;
      }

      &.streak {
        background: #FF9F43;
        color: white;
      }

      &.empty {
        visibility: hidden;
      }
    }
  }
}

.goals {
  margin: 40rpx 30rpx 0;

  .goals-title {
    display: block;
    font-size: 28rpx;
    color: #475569;
    margin-bottom: 24rpx;
  }

  .goal-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;

    .goal-item {
      display: flex;
      align-items: center;
      gap: 24rpx;
      padding: 24rpx;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 32rpx;
      opacity: 0.5;

      &.achieved {
        opacity: 1;

        .goal-icon {
          background: #FF9F43;
          color: white;
        }

        .goal-text {
          color: #475569;
        }
      }

      .goal-icon {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        background: #94A3B8;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 32rpx;

        .days {
          font-size: 24rpx;
        }
      }

      .goal-text {
        font-size: 28rpx;
        color: #94A3B8;
      }
    }
  }
}
</style>
