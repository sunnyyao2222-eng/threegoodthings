<template>
  <view class="vip-page">
    <!-- 顶部装饰 -->
    <view class="header-decoration">
      <view class="crown-icon">👑</view>
      <view class="close-btn" @click="goBack">
        <text class="icon">✕</text>
      </view>
    </view>

    <!-- 内容区 -->
    <view class="content">
      <view class="title-section">
        <text class="title">升级 VIP 会员</text>
        <text class="subtitle">解锁更多功能，让成长更加精彩</text>
      </view>

      <!-- 权益列表 -->
      <view class="benefits">
        <view
          v-for="(benefit, index) in benefits"
          :key="index"
          class="benefit-item"
        >
          <view class="check-icon">✓</view>
          <text class="benefit-text">{{ benefit }}</text>
        </view>
      </view>

      <!-- 套餐选择 -->
      <view class="plans">
        <view
          v-for="(plan, index) in plans"
          :key="index"
          class="plan-card"
          :class="{ popular: plan.popular, selected: selectedPlan === index }"
          @click="selectedPlan = index"
        >
          <!-- 推荐标签 -->
          <view v-if="plan.popular" class="popular-badge">
            <text class="icon">✨</text>
            <text class="text">最受欢迎</text>
          </view>

          <view class="plan-info">
            <view class="plan-left">
              <text class="plan-title">{{ plan.title }}</text>
              <text v-if="plan.save" class="plan-save">{{ plan.save }}</text>
            </view>
            <view class="plan-right">
              <text class="plan-price">{{ plan.price }}</text>
              <text class="plan-period">{{ plan.period }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 购买按钮 -->
      <button class="purchase-btn" @click="handlePurchase">
        立即开通 VIP
      </button>

      <!-- 说明文字 -->
      <text class="agreement">订阅即表示同意《VIP服务协议》</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedPlan = ref(1) // 默认选中年度会员

const benefits = [
  '每日记录上限提升至 6 件好事',
  '解锁高级 AI 分析报告',
  '专属 VIP 徽章和树木装饰',
  '优先获得新功能体验',
  '更多成长值加成',
  '云端数据无限存储'
]

const plans = [
  {
    title: '月度会员',
    price: '¥19',
    period: '/月',
    popular: false
  },
  {
    title: '年度会员',
    price: '¥168',
    period: '/年',
    popular: true,
    save: '省 ¥60'
  },
  {
    title: '终身会员',
    price: '¥398',
    period: '一次性',
    popular: false
  }
]

const goBack = () => {
  uni.navigateBack()
}

const handlePurchase = () => {
  const plan = plans[selectedPlan.value]

  uni.showModal({
    title: '确认购买',
    content: `确认购买${plan.title}（${plan.price}${plan.period}）？`,
    success: (res) => {
      if (res.confirm) {
        // 调用支付接口
        uni.showToast({
          title: '支付功能开发中',
          icon: 'none'
        })
      }
    }
  })
}
</script>

<style scoped lang="scss">
.vip-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF9F0 0%, #FFE8CC 100%);
}

.header-decoration {
  height: 320rpx;
  background: linear-gradient(135deg, #FF7E95, #FFD56B, #FF9F43);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .crown-icon {
    font-size: 120rpx;
  }

  .close-btn {
    position: absolute;
    top: 40rpx;
    right: 40rpx;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      font-size: 40rpx;
      color: white;
    }
  }
}

.content {
  padding: 40rpx 30rpx;
}

.title-section {
  text-align: center;
  margin-bottom: 40rpx;

  .title {
    display: block;
    font-size: 48rpx;
    color: #475569;
    font-weight: bold;
    margin-bottom: 16rpx;
  }

  .subtitle {
    display: block;
    font-size: 28rpx;
    color: #94A3B8;
  }
}

.benefits {
  margin-bottom: 40rpx;

  .benefit-item {
    display: flex;
    align-items: center;
    gap: 24rpx;
    margin-bottom: 24rpx;

    .check-icon {
      width: 48rpx;
      height: 48rpx;
      border-radius: 50%;
      background: rgba(255, 126, 149, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FF7E95;
      font-size: 28rpx;
      flex-shrink: 0;
    }

    .benefit-text {
      font-size: 28rpx;
      color: #475569;
    }
  }
}

.plans {
  margin-bottom: 40rpx;

  .plan-card {
    padding: 32rpx;
    margin-bottom: 24rpx;
    background: rgba(255, 255, 255, 0.7);
    border: 2rpx solid rgba(148, 163, 184, 0.2);
    border-radius: 48rpx;
    position: relative;
    transition: all 0.3s;

    &.popular {
      background: linear-gradient(135deg, rgba(255, 126, 149, 0.2), rgba(255, 215, 107, 0.2));
      border-color: #FF7E95;
    }

    &.selected {
      transform: scale(1.02);
      box-shadow: 0 8rpx 24rpx rgba(255, 126, 149, 0.3);
    }

    .popular-badge {
      position: absolute;
      top: 0;
      right: 32rpx;
      padding: 12rpx 24rpx;
      background: linear-gradient(135deg, #FF7E95, #FF9F43);
      border-radius: 0 0 24rpx 24rpx;
      display: flex;
      align-items: center;
      gap: 8rpx;

      .icon {
        font-size: 24rpx;
        color: white;
      }

      .text {
        font-size: 22rpx;
        color: white;
      }
    }

    .plan-info {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .plan-left {
        .plan-title {
          display: block;
          font-size: 32rpx;
          color: #475569;
          font-weight: 500;
          margin-bottom: 8rpx;
        }

        .plan-save {
          display: block;
          font-size: 24rpx;
          color: #FF7E95;
        }
      }

      .plan-right {
        text-align: right;

        .plan-price {
          display: block;
          font-size: 48rpx;
          color: #FF7E95;
          font-weight: bold;
        }

        .plan-period {
          display: block;
          font-size: 24rpx;
          color: #94A3B8;
        }
      }
    }
  }
}

.purchase-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #FFD56B, #FF9F43);
  border-radius: 48rpx;
  color: white;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  box-shadow: 0 8rpxx rgba(255, 159, 67, 0.4);
  margin-bottom: 24rpx;
}

.agreement {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #94A3B8;
}
</style>
