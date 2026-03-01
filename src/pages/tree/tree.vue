<template>
  <view class="forest-page">
    <!-- 标题 -->
    <view class="header">
      <text class="title">RESONANCE FOREST</text>
      <text class="subtitle">共鸣之森，感受他人的美好</text>
    </view>

    <!-- 森林画布 -->
    <view class="forest-canvas">
      <view
        v-for="(light, index) in lights"
        :key="index"
        class="light-dot"
        :class="'light-' + light.color"
        :style="{
          left: light.x + '%',
          top: light.y + '%',
          animationDelay: light.delay + 's'
        }"
        @click="showLightDetail(light)"
      >
        <view class="light-glow"></view>
      </view>
    </view>

    <!-- 底部提示 -->
    <view class="footer-tip">
      <text class="tip-icon">✨</text>
      <text class="tip-text">点击光点，查看他人的美好时刻</text>
    </view>

    <!-- 光点详情弹窗 -->
    <view v-if="selectedLight" class="light-modal" @click="closeLightDetail">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ selectedLight.userName }}的美好时刻</text>
          <text class="modal-close" @click="closeLightDetail">×</text>
        </view>

        <view class="modal-body">
          <text class="light-content">{{ selectedLight.content }}</text>
          <view class="light-meta">
            <text class="light-time">{{ selectedLight.timeAgo }}</text>
            <text class="light-category">{{ selectedLight.category }}</text>
          </view>
        </view>

        <view class="modal-actions">
          <button class="action-btn copy-btn" @click="copyToMyRecord">
            <text class="btn-icon">📋</text>
            <text class="btn-text">复制到我的好事</text>
          </button>
          <button class="action-btn inspire-btn" @click="getInspired">
            <text class="btn-icon">💡</text>
            <text class="btn-text">获得启发</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRecordStore } from '@/store'

interface Light {
  id: string
  x: number
  y: number
  color: string
  delay: number
  userName: string
  content: string
  timeAgo: string
  category: string
}

const recordStore = useRecordStore()
const selectedLight = ref<Light | null>(null)
const lights = ref<Light[]>([])

// 模拟其他用户的好事数据
const mockLights: Light[] = [
  {
    id: '1',
    x: 20,
    y: 25,
    color: 'cyan',
    delay: 0,
    userName: '小明',
    content: '今天早上看到窗外的阳光特别温暖，让我想起了小时候的夏天',
    timeAgo: '2小时前',
    category: '感官'
  },
  {
    id: '2',
    x: 65,
    y: 35,
    color: 'pink',
    delay: 0.5,
    userName: '小红',
    content: '同事主动帮我分担了工作，感觉被理解和支持的感觉真好',
    timeAgo: '5小时前',
    category: '人际'
  },
  {
    id: '3',
    x: 45,
    y: 55,
    color: 'yellow',
    delay: 1,
    userName: '小李',
    content: '完成了一个困扰我很久的项目，那种成就感无法言喻',
    timeAgo: '1天前',
    category: '成就'
  },
  {
    id: '4',
    x: 80,
    y: 60,
    color: 'orange',
    delay: 1.5,
    userName: '小张',
    content: '路过咖啡店闻到了熟悉的香味，突然觉得生活很美好',
    timeAgo: '3小时前',
    category: '感官'
  },
  {
    id: '5',
    x: 30,
    y: 70,
    color: 'purple',
    delay: 2,
    userName: '小王',
    content: '妈妈打电话来关心我，虽然唠叨但心里暖暖的',
    timeAgo: '6小时前',
    category: '感恩'
  },
  {
    id: '6',
    x: 55,
    y: 80,
    color: 'cyan',
    delay: 2.5,
    userName: '小陈',
    content: '写代码的时候进入了心流状态，时间过得特别快',
    timeAgo: '4小时前',
    category: '心流'
  },
  {
    id: '7',
    x: 15,
    y: 45,
    color: 'pink',
    delay: 3,
    userName: '小刘',
    content: '今天遇到一个陌生人对我微笑，让我一整天心情都很好',
    timeAgo: '7小时前',
    category: '人际'
  },
  {
    id: '8',
    x: 75,
    y: 20,
    color: 'yellow',
    delay: 3.5,
    userName: '小周',
    content: '看到路边的小花开了，春天真的来了',
    timeAgo: '2天前',
    category: '感官'
  }
]

onMounted(() => {
  lights.value = mockLights
})

const showLightDetail = (light: Light) => {
  selectedLight.value = light
}

const closeLightDetail = () => {
  selectedLight.value = null
}

const copyToMyRecord = () => {
  if (!selectedLight.value) return

  uni.showModal({
    title: '复制到我的好事',
    content: `是否将"${selectedLight.value.content}"复制到你的好事记录中？`,
    success: (res) => {
      if (res.confirm) {
        // 跳转到首页并填充内容
        uni.switchTab({
          url: '/pages/index/index',
          success: () => {
            // 通过事件或全局状态传递内容
            uni.$emit('fillContent', selectedLight.value!.content)
            uni.showToast({
              title: '已复制，请前往首页记录',
              icon: 'success'
            })
          }
        })
        closeLightDetail()
      }
    }
  })
}

const getInspired = () => {
  if (!selectedLight.value) return

  uni.showToast({
    title: '💡 获得启发！',
    icon: 'none',
    duration: 2000
  })

  closeLightDetail()
}
</script>

<style scoped lang="scss">
.forest-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #2D1B69 0%, #1A0F3E 100%);
  position: relative;
  overflow: hidden;
}

.header {
  text-align: center;
  padding: 80rpx 40rpx 60rpx;

  .title {
    display: block;
    font-size: 32rpx;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 4rpx;
    margin-bottom: 16rpx;
    font-weight: 300;
  }

  .subtitle {
    display: block;
    font-size: 36rpx;
    color: #FFFFFF;
    font-weight: 500;
  }
}

.forest-canvas {
  position: relative;
  width: 100%;
  height: 800rpx;
  margin-bottom: 60rpx;

  .light-dot {
    position: absolute;
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    cursor: pointer;
    animation: pulse 2s ease-in-out infinite;
    transform: translate(-50%, -50%);

    .light-glow {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      opacity: 0.8;
    }

    &.light-cyan .light-glow {
      background: radial-gradient(circle, #00E5FF 0%, transparent 70%);
      box-shadow: 0 0 30rpx #00E5FF;
    }

    &.light-pink .light-glow {
      background: radial-gradient(circle, #FF4081 0%, transparent 70%);
      box-shadow: 0 0 30rpx #FF4081;
    }

    &.light-yellow .light-glow {
      background: radial-gradient(circle, #FFD600 0%, transparent 70%);
      box-shadow: 0 0 30rpx #FFD600;
    }

    &.light-orange .light-glow {
      background: radial-gradient(circle, #FF6E40 0%, transparent 70%);
      box-shadow: 0 0 30rpx #FF6E40;
    }

    &.light-purple .light-glow {
      background: radial-gradient(circle, #E040FB 0%, transparent 70%);
      box-shadow: 0 0 30rpx #E040FB;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
}

.footer-tip {
  text-align: center;
  padding: 0 40rpx 60rpx;

  .tip-icon {
    display: block;
    font-size: 48rpx;
    margin-bottom: 20rpx;
  }

  .tip-text {
    display: block;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.7);
  }
}

.light-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40rpx;

  .modal-content {
    width: 100%;
    max-width: 600rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #F0F0F0;

    .modal-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .modal-close {
      font-size: 48rpx;
      color: #999;
      line-height: 1;
      padding: 0 10rpx;
    }
  }

  .modal-body {
    padding: 40rpx 30rpx;

    .light-content {
      display: block;
      font-size: 30rpx;
      color: #333;
      line-height: 1.8;
      margin-bottom: 30rpx;
    }

    .light-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .light-time,
      .light-category {
        font-size: 24rpx;
        color: #999;
      }

      .light-category {
        padding: 8rpx 16rpx;
        background: #F5F5F5;
        border-radius: 20rpx;
      }
    }
  }

  .modal-actions {
    display: flex;
    gap: 20rpx;
    padding: 30rpx;
    border-top: 1rpx solid #F0F0F0;

    .action-btn {
      flex: 1;
      height: 80rpx;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12rpx;
      font-size: 28rpx;
      border: none;

      .btn-icon {
        font-size: 32rpx;
      }

      &.copy-btn {
        background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
        color: #FFFFFF;
      }

      &.inspire-btn {
        background: #F5F5F5;
        color: #666;
      }
    }
  }
}
</style>
