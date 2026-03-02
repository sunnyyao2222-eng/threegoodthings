<template>
  <view class="ai-chat-page">
    <!-- 顶部栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="icon">←</text>
      </view>
      <view class="ai-info">
        <image class="ai-avatar" src="/static/ai-avatar.png" mode="aspectFill" />
        <view class="ai-details">
          <text class="ai-name">AI助手 · 晴幂</text>
          <view class="online-status">
            <view class="status-dot"></view>
            <text class="status-text">在线</text>
          </view>
        </view>
      </view>
      <view class="placeholder"></view>
    </view>

    <!-- 消息列表 -->
    <scroll-view
      class="messages-container"
      scroll-y
      :scroll-into-view="scrollIntoView"
      scroll-with-animation
    >
      <view
        v-for="(msg, index) in messages"
        :key="msg.id"
        :id="'msg-' + msg.id"
        class="message-item"
        :class="msg.type"
      >
        <image
          v-if="msg.type === 'ai'"
          class="avatar"
          src="/static/ai-avatar.png"
          mode="aspectFill"
        />
        <view class="message-bubble" :class="msg.type">
          <text class="message-text">{{ msg.content }}</text>
        </view>
        <view v-if="msg.type === 'user'" class="avatar user-avatar">
          <text class="avatar-text">👤</text>
        </view>
      </view>

      <!-- AI 输入中 -->
      <view v-if="isTyping" class="message-item ai">
        <image class="avatar" src="/static/ai-avatar.png" mode="aspectFill" />
        <view class="message-bubble ai typing">
          <view class="typing-dots">
            <view class="dot"></view>
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 快捷问题 -->
    <view v-if="showQuickReplies" class="quick-replies">
      <view class="quick-title">
        <text class="icon">✨</text>
        <text class="text">快捷问题</text>
      </view>
      <scroll-view class="replies-scroll" scroll-x>
        <view
          v-for="(reply, index) in quickReplies"
          :key="index"
          class="reply-btn"
          @click="handleQuickReply(reply)"
        >
          {{ reply }}
        </view>
      </scroll-view>
    </view>

    <!-- 输入区 -->
    <view class="input-area">
      <view class="input-wrapper">
        <input
          v-model="inputText"
          class="input-box"
          placeholder="和晴幂聊聊..."
          confirm-type="send"
          @confirm="handleSend"
        />
        <view
          class="send-btn"
          :class="{ active: inputText.trim() }"
          @click="handleSend"
        >
          <text class="icon">➤</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

interface Message {
  id: number
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

const messages = ref<Message[]>([
  {
    id: 1,
    type: 'ai',
    content: '你好呀！我是晴幂，你的情绪健康小助手 ✨ 我可以帮你更好地记录和理解生活中的美好时刻，有什么想聊的吗？',
    timestamp: new Date()
  }
])

const inputText = ref('')
const isTyping = ref(false)
const scrollIntoView = ref('')

const showQuickReplies = computed(() => messages.value.length === 1)

const quickReplies = [
  '今天心情不太好',
  '帮我分析一下最近的记录',
  '怎样更好地记录好事？',
  '给我一些建议'
]

const aiResponses = [
  '这听起来真是一件美好的事情！能告诉我更多细节吗？',
  '我能感受到你的心情。这种感觉是怎样的呢？',
  '太棒了！这样的时刻值得被好好记录下来 🌟',
  '听起来你今天过得不错呢！还有什么想分享的吗？',
  '我理解你的感受。记录这些美好的瞬间对心理健康很有帮助哦。',
  '这个建议很好！你可以试试在三件好事中记录下来，让小树也感受到你的快乐~'
]

const goBack = () => {
  uni.navigateBack()
}

const handleQuickReply = (text: string) => {
  inputText.value = text
  handleSend()
}

const handleSend = async () => {
  const content = inputText.value.trim()
  if (!content) return

  // 添加用户消息
  const userMsg: Message = {
    id: Date.now(),
    type: 'user',
    content,
    timestamp: new Date()
  }
  messages.value.push(userMsg)
  inputText.value = ''

  // 滚动到底部
  await nextTick()
  scrollIntoView.value = 'msg-' + userMsg.id

  // 显示 AI 输入中
  isTyping.value = true

  // 模拟 AI 回复
  setTimeout(() => {
    const aiMsg: Message = {
      id: Date.now() + 1,
      type: 'ai',
      content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      timestamp: new Date()
    }
    messages.value.push(aiMsg)
    isTyping.value = false

    nextTick(() => {
      scrollIntoView.value = 'msg-' + aiMsg.id
    })
  }, 1500)
}
</script>

<style scoped lang="scss">
.ai-ce {
  min-height: 100vh;
  background: #FFF9F0;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20rpx);
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .back-btn {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    .icon {
      font-size: 40rpx;
      color: #475569;
    }
  }

  .ai-info {
    display: flex;
    align-items: center;
    gap: 24rpx;

    .ai-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #FF7E95, #FF9F43);
    }

    .ai-details {
      .ai-name {
        display: block;
        font-size: 32rpx;
        color: #475569;
        font-weight: 500;
        margin-bottom: 8rpx;
      }

      .online-status {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .status-dot {
          width: 16rpx;
          height: 16rpx;
          border-radius: 50%;
          background: #4ADE80;
        }

        .status-text {
          font-size: 24rpx;
          color: #94A3B8;
        }
      }
    }
  }

  .placeholder {
    width: 80rpx;
  }
}

.messages-container {
  flex: 1;
  padding: 30rpx;
}

.message-item {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;

  &.user {
    flex-direction: row-reverse;
  }

  .avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .user-avatar {
    background: linear-gradient(135deg, #FF7E95, #FF9F43);
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-text {
      font-size: 40rpx;
    }
  }

  .message-bue {
    max-width: 70%;
    padding: 24rpx 32rpx;
    border-radius: 40rpx;

    &.ai {
      background: rgba(255, 255, 255, 0.9);
      color: #475569;
      border-top-left-radius: 8rpx;
      box-shadow: inset 2rpx 2rpx 5rpx rgba(255, 255, 255, 1),
                  inset -3rpx -3rpx 7rpx rgba(0, 0, 0, 0.05);
    }

    &.user {
      background: linear-gradient(135deg, #FF7E95, #FF9F43);
      color: white;
      border-top-right-radius: 8rpx;
      box-shadow: 0 4rpx 12rpx rgba(255, 126, 149, 0.3);
    }

    &.typing {
      padding: 20rpx 32rpx;
    }

    .message-text {
      font-size: 28rpx;
      line-height: 1.6;
    }
  }
}

.typing-dots {
  display: flex;
  gap: 12rpx;

  .dot {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background: #FF7E95;
    animation: typing 1.4s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  30% {
    opacity: 1;
    transform: scale(1);
  }
}

.quick-replies {
  padding: 20rpx 30rpx;
  background: rgba(255, 255, 255, 0.9);
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);

  .quick-title {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 20rpx;

    .icon {
      font-size: 32rpx;
    }

    .text {
      font-size: 24rpx;
      color: #94A3B8;
    }
  }

  .replies-scroll {
    white-space: nowrap;

    .reply-btn {
      display: inline-block;
      padding: 16rpx 32rpx;
      margin-right: 16rpx;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 40rpx;
      font-size: 26rpx;
      color: #475569;
    }
  }
}

.input-area {
  padding: 20rpx 30rpx;
  paom: calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20rpx);
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 20rpx;
    padding: 16rpx 24rpx;
    background: white;
    border-radius: 48rpx;
    box-shadow: inset 2rpx 2rpx 5rpx rgba(255, 255, 255, 1),
                inset -3rpx -3rpx 7rpx rgba(0, 0, 0, 0.05);

    .input-box {
      flex: 1;
      font-size: 28rpx;
      color: #475569;
    }

    .send-btn {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #94A3B8;
      transition: all 0.3s;

      &.active {
        background: linear-gradient(135deg, #FF7E95, #FF9F43);
      }

      .icon {
        font-size: 32rpx;
        color: white;
      }
    }
  }
}
</style>
