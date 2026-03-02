<template>
  <view v-if="visible" class="ai-chat-float" :style="{ bottom: position.bottom + 'px', right: position.right + 'px' }">
    <!-- 最小化状态 - LOGO触发器 -->
    <view v-if="isMinimized" class="logo-trigger" @click="toggleMinimize">
      <image class="logo-image" src="/static/logo.png" mode="aspectFit" />
      <view v-if="hasUnread" class="unread-badge"></view>
    </view>

    <!-- 展开状态 - 对话窗口 -->
    <view v-else class="chat-window">
      <view class="chat-header">
        <view class="header-left">
          <image class="avatar" src="/static/logo.png" mode="aspectFit" />
          <view class="header-info">
            <text class="ai-name">{{ $t('ai.title') }}</text>
            <text class="ai-subtitle">{{ $t('ai.subtitle') }}</text>
          </view>
        </view>
        <view class="header-actions">
          <view class="action-btn" @click="toggleMinimize">−</view>
          <view class="action-btn" @click="close">✕</view>
        </view>
      </view>

      <scroll-view class="chat-messages" scroll-y :scroll-into-view="scrollIntoView" scroll-with-animation>
        <view v-for="(msg, index) in messages" :key="index" :id="`msg-${index}`" class="message-item" :class="msg.role">
          <view v-if="msg.role === 'assistant'" class="message-avatar">
            <image src="/static/logo.png" mode="aspectFit" />
          </view>
          <view class="message-bubble">
            <text class="message-text">{{ msg.content }}</text>
          </view>
        </view>

        <!-- 加载动画 -->
        <view v-if="isLoading" class="message-item assistant">
          <view class="message-avatar">
            <image src="/static/logo.png" mode="aspectFit" />
          </view>
          <view class="message-bubble">
            <view class="typing-indicator">
              <view class="dot"></view>
              <view class="dot"></view>
              <view class="dot"></view>
            </view>
          </view>
        </view>
      </scroll-view>

      <view class="chat-input">
        <input
          v-model="inputText"
          class="input-field"
          type="text"
          :placeholder="$t('ai.placeholder')"
          @confirm="sendMessage"
        />
        <view class="send-btn" :class="{ active: inputText.trim() }" @click="sendMessage">
          <text>{{ $t('ai.send') }}</text>
        </view>
      </view>

      <!-- 快捷回复 -->
      <view v-if="messages.length === 1" class="quick-replies">
        <view
          v-for="(reply, index) in quickReplies"
          :key="index"
          class="quick-reply-btn"
          @click="sendQuickReply(reply)"
        >
          {{ reply }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { aiApi } from '@/api/backend'

const { t } = useI18n()

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isMinimized = ref(false)
const hasUnread = ref(false)
const messages = ref<Array<{ role: string; content: string }>>([
  {
    role: 'assistant',
    content: t('ai.greeting'),
  },
])
const inputText = ref('')
const isLoading = ref(false)
const scrollIntoView = ref('')
const position = ref({ bottom: 32, right: 32 })

const quickReplies = computed(() => [
  t('ai.quickReplies.mood'),
  t('ai.quickReplies.stress'),
  t('ai.quickReplies.sleep'),
  t('ai.quickReplies.motivation'),
])

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
  if (!isMinimized.value) {
    hasUnread.value = false
    scrollToBottom()
  }
}

const close = () => {
  emit('close')
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: text,
  })

  inputText.value = ''
  scrollToBottom()

  // 调用 AI API
  isLoading.value = true

  try {
    const response = await aiApi.chat(messages.value)

    if (response.success) {
      messages.value.push({
        role: 'assistant',
        content: response.message,
      })

      if (isMinimized.value) {
        hasUnread.value = true
      }

      scrollToBottom()
    } else {
      throw new Error(response.message)
    }
  } catch (error: any) {
    uni.showToast({
      title: error.message || 'AI service error',
      icon: 'none',
    })

    // 添加错误消息
    messages.value.push({
      role: 'assistant',
      content: 'Sorry, I encountered an error. Please try again.',
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const sendQuickReply = (reply: string) => {
  inputText.value = reply
  sendMessage()
}

const scrollToBottom = () => {
  nextTick(() => {
    scrollIntoView.value = `msg-${messages.value.length - 1}`
  })
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      scrollToBottom()
    }
  }
)
</script>

<style lang="scss" scoped>
.ai-chat-float {
  position: fixed;
  z-index: 9998;
  transition: all 0.3s ease;
}

.logo-trigger {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(78, 205, 196, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12rpx 48rpx rgba(78, 205, 196, 0.6);
  }

  &:active {
    transform: scale(0.95);
  }
}

.logo-image {
  width: 80rpx;
  height: 80rpx;
}

.unread-badge {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 24rpx;
  height: 24rpx;
  background: #ff4d4f;
  border-radius: 50%;
  border: 3px solid #ffffff;
}

.chat-window {
  width: 680rpx;
  height: 900rpx;
  background: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: #ffffff;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  padding: 8rpx;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.ai-name {
  font-size: 32rpx;
  font-weight: bold;
}

.ai-subtitle {
  font-size: 24rpx;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.chat-messages {
  flex: 1;
  padding: 32rpx;
  overflow-y: auto;
}

.message-item {
  display: flex;
  margin-bottom: 32rpx;
  animation: fadeIn 0.3s ease;

  &.user {
    flex-direction: row-reverse;

    .message-bubble {
      background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
      color: #ffffff;
      border-radius: 32rpx 32rpx 8rpx 32rpx;
    }
  }

  &.assistant {
    .message-bubble {
      background: #f5f5f5;
      color: #333;
      border-radius: 32rpx 32rpx 32rpx 8rpx;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-avatar {
  width: 64rpx;
  height: 64rpx;
  margin-right: 16rpx;

  image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.message-bubble {
  max-width: 70%;
  padding: 24rpx 32rpx;
  word-wrap: break-word;
}

.message-text {
  font-size: 28rpx;
  line-height: 1.6;
}

.typing-indicator {
  display: flex;
  gap: 8rpx;
  padding: 8rpx 0;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10rpx);
    opacity: 1;
  }
}

.chat-input {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  border-top: 1px solid #f0f0f0;
  background: #ffffff;
}

.input-field {
  flex: 1;
  height: 72rpx;
  padding: 0 24rpx;
  background: #f5f5f5;
  border-radius: 36rpx;
  font-size: 28rpx;
  color: #333;
}

.send-btn {
  padding: 16rpx 32rpx;
  background: #e0e0e0;
  border-radius: 36rpx;
  font-size: 28rpx;
  color: #999;
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
    color: #ffffff;

    &:hover {
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

.quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 0 32rpx 32rpx;
}

.quick-reply-btn {
  padding: 16rpx 24rpx;
  background: #f5f5f5;
  border-radius: 24rpx;
  font-size: 24rpx;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4ECDC4;
    color: #ffffff;
  }
}
</style>
