<template>
  <view class="login-container">
    <view class="login-content">
      <!-- Logo和标题 -->
      <view class="logo-section">
        <image class="logo" src="/static/logo.png" mode="aspectFit" />
        <text class="app-name">三件好事</text>
        <text class="app-slogan">让更多人养成感知美好的能力</text>
      </view>

      <!-- 插画 -->
      <view class="illustration">
        <text class="tree-emoji">🌱</text>
      </view>

      <!-- 登录按钮 -->
      <view class="login-actions">
        <!-- #ifdef MP-WEIXIN -->
        <button
          class="wx-login-btn"
          @click="handleWxLogin"
          :loading="loading"
        >
          <text class="btn-icon">📱</text>
          <text class="btn-text">微信一键登录</text>
        </button>
        <button class="mock-login-btn" @click="handleMockLogin">
          <text class="btn-icon">🔧</text>
          <text class="btn-text">测试登录（开发用）</text>
        </button>
        <!-- #endif -->

        <!-- #ifdef H5 -->
        <view class="qr-login-section">
          <view v-if="!showQrCode" class="qr-trigger">
            <button class="wx-qr-btn" @click="showWxQrCode">
              <text class="btn-icon">📱</text>
              <text class="btn-text">微信扫码登录</text>
            </button>
            <button class="mock-login-btn" @click="handleMockLogin">
              <text class="btn-icon">🔧</text>
              <text class="btn-text">测试登录（开发用）</text>
            </button>
          </view>

          <view v-else class="qr-code-box">
            <text class="qr-title">请使用微信扫码登录</text>
            <view class="qr-placeholder">
              <text class="qr-icon">📱</text>
              <text class="qr-tip">二维码加载中...</text>
              <text class="qr-note">实际使用需要接入微信开放平台</text>
            </view>
            <button class="back-btn" @click="showQrCode = false">返回</button>
          </view>
        </view>
        <!-- #endif -->

        <text class="privacy-tip">
          登录即表示同意
          <text class="link" @click="showPrivacy">《隐私政策》</text>
          和
          <text class="link" @click="showTerms">《用户协议》</text>
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const loading = ref(false)
const showQrCode = ref(false)

// 微信小程序登录
const handleWxLogin = async () => {
  try {
    loading.value = true

    await userStore.wxLogin()

    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    setTimeout(() => {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }, 1500)
  } catch (error: any) {
    console.error('登录失败:', error)
    uni.showToast({
      title: error.message || '登录失败，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 显示微信扫码登录
const showWxQrCode = () => {
  showQrCode.value = true
  // TODO: 实际使用时需要：
  // 1. 调用后端接口获取微信登录二维码
  // 2. 轮询检查扫码状态
  // 3. 扫码成功后调用 userStore.wxQrLogin(code)
}

// 模拟登录（开发测试用）
const handleMockLogin = () => {
  try {
    loading.value = true

    const result = userStore.mockLogin()

    uni.showToast({
      title: '测试登录成功',
      icon: 'success'
    })

    setTimeout(() => {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }, 1000)
  } catch (error: any) {
    uni.showToast({
      title: '登录失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const showPrivacy = () => {
  uni.showModal({
    title: '隐私政策',
    content: '我们重视您的隐私，您的数据将被安全加密存储...',
    showCancel: false
  })
}

const showTerms = () => {
  uni.showModal({
    title: '用户协议',
    content: '欢迎使用三件好事...',
    showCancel: false
  })
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.login-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-section {
  text-align: center;
  margin-bottom: 80rpx;

  .logo {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 30rpx;
  }

  .app-name {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #FFFFFF;
    margin-bottom: 20rpx;
  }

  .app-slogan {
    display: block;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.illustration {
  margin-bottom: 100rpx;

  .tree-emoji {
    font-size: 200rpx;
    animation: float 3s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20rpx);
  }
}

.login-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .qr-login-section {
    width: 100%;
    margin-bottom: 40rpx;

    .qr-trigger {
      display: flex;
      flex-direction: column;
      gap: 20rpx;
    }

    .wx-qr-btn,
    .mock-login-btn {
      width: 600rpx;
      height: 96rpx;
      background: #FFFFFF;
      border-radius: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);

      .btn-icon {
        font-size: 40rpx;
        margin-right: 16rpx;
      }

      .btn-text {
        font-size: 32rpx;
        font-weight: 500;
        color: #333333;
      }
    }

    .mock-login-btn {
      background: rgba(255, 255, 255, 0.9);
    }

    .qr-code-box {
      width: 600rpx;
      padding: 60rpx 40rpx;
      background: #FFFFFF;
      border-radius: 24rpx;
      text-align: center;

      .qr-title {
        display: block;
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 40rpx;
      }

      .qr-placeholder {
        width: 400rpx;
        height: 400rpx;
        margin: 0 auto 40rpx;
        background: #F5F5F5;
        border-radius: 16rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .qr-icon {
          font-size: 100rpx;
          margin-bottom: 20rpx;
        }

        .qr-tip {
          font-size: 28rpx;
          color: #666;
          margin-bottom: 10rpx;
        }

        .qr-note {
          font-size: 22rpx;
          color: #999;
        }
      }

      .back-btn {
        width: 100%;
        height: 80rpx;
        background: #4ECDC4;
        border-radius: 40rpx;
        color: #FFFFFF;
        font-size: 30rpx;
      }
    }
  }

  .wx-login-btn,
  .mock-login-btn {
    width: 600rpx;
    height: 96rpx;
    background: #FFFFFF;
    border-radius: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
    margin-bottom: 20rpx;

    .btn-icon {
      font-size: 40rpx;
      margin-right: 16rpx;
    }

    .btn-text {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }
  }

  .mock-login-btn {
    background: rgba(255, 255, 255, 0.9);
    margin-bottom: 40rpx;
  }

  .privacy-tip {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    line-height: 1.6;

    .link {
      color: #FFFFFF;
      text-decoration: underline;
    }
  }
}
</style>
