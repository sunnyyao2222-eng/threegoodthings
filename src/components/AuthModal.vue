<template>
  <view v-if="visible" class="auth-modal" @click="handleBackdropClick">
    <view class="modal-content" @click.stop>
      <view class="modal-header">
        <text class="modal-title">{{ isLogin ? $t('profile.login') : 'Sign Up' }}</text>
        <view class="close-btn" @click="close">✕</view>
      </view>

      <view class="modal-body">
        <!-- 游客提示 -->
        <view v-if="showGuestTip" class="guest-tip">
          <text class="tip-icon">👋</text>
          <text class="tip-text">{{ $t('messages.unauthorized') }}</text>
        </view>

        <!-- 登录/注册表单 -->
        <view class="form">
          <view v-if="!isLogin" class="form-item">
            <input
              v-model="formData.nickname"
              class="form-input"
              type="text"
              :placeholder="$t('common.nickname') || 'Nickname'"
            />
          </view>

          <view class="form-item">
            <input
              v-model="formData.email"
              class="form-input"
              type="email"
              placeholder="Email"
            />
          </view>

          <view class="form-item">
            <input
              v-model="formData.password"
              class="form-input"
              type="password"
              :placeholder="$t('common.password') || 'Password'"
            />
          </view>

          <button class="submit-btn" :disabled="isLoading" @click="handleSubmit">
            {{ isLoading ? $t('common.loading') : (isLogin ? $t('profile.login') : 'Sign Up') }}
          </button>
        </view>

        <!-- 分隔线 -->
        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">OR</text>
          <view class="divider-line"></view>
        </view>

        <!-- Google 登录 -->
        <button class="google-btn" @click="handleGoogleLogin">
          <text class="google-icon">G</text>
          <text>Continue with Google</text>
        </button>

        <!-- 切换登录/注册 -->
        <view class="switch-mode">
          <text v-if="isLogin">Don't have an account? </text>
          <text v-else>Already have an account? </text>
          <text class="switch-link" @click="toggleMode">
            {{ isLogin ? 'Sign Up' : $t('profile.login') }}
          </text>
        </view>

        <!-- 游客继续 -->
        <view v-if="!isGuest" class="guest-continue">
          <text class="guest-link" @click="continueAsGuest">Continue as Guest</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const authStore = useAuthStore()

const props = defineProps<{
  visible: boolean
  showGuestTip?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const isLogin = ref(true)
const formData = ref({
  email: '',
  password: '',
  nickname: '',
})

const isLoading = computed(() => authStore.isLoading)
const isGuest = computed(() => authStore.isGuest)

const toggleMode = () => {
  isLogin.value = !isLogin.value
  formData.value = {
    email: '',
    password: '',
    nickname: '',
  }
}

const handleSubmit = async () => {
  // 验证
  if (!formData.value.email || !formData.value.password) {
    uni.showToast({
      title: 'Please fill in all fields',
      icon: 'none',
    })
    return
  }

  if (!isLogin.value && !formData.value.nickname) {
    uni.showToast({
      title: 'Please enter your nickname',
      icon: 'none',
    })
    return
  }

  let result

  if (isLogin.value) {
    result = await authStore.login(formData.value.email, formData.value.password)
  } else {
    result = await authStore.register(
      formData.value.email,
      formData.value.password,
      formData.value.nickname
    )
  }

  if (result.success) {
    emit('success')
    close()
  }
}

const handleGoogleLogin = () => {
  authStore.googleLogin()
}

const continueAsGuest = () => {
  close()
}

const handleBackdropClick = () => {
  close()
}

const close = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
.auth-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 32rpx;
}

.modal-content {
  background: #ffffff;
  border-radius: 32rpx;
  width: 100%;
  max-width: 600rpx;
  max-height: 90vh;
  overflow-y: auto;
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

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48rpx 48rpx 32rpx;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: #999;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }
}

.modal-body {
  padding: 48rpx;
}

.guest-tip {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx;
  background: #fff7e6;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
}

.tip-icon {
  font-size: 32rpx;
}

.tip-text {
  flex: 1;
  font-size: 28rpx;
  color: #d48806;
}

.form {
  margin-bottom: 32rpx;
}

.form-item {
  margin-bottom: 24rpx;
}

.form-input {
  width: 100%;
  height: 88rpx;
  padding: 0 32rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #333;
  border: 2px solid transparent;
  transition: all 0.3s;

  &:focus {
    background: #ffffff;
    border-color: #4ECDC4;
  }
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #ffffff;
  border: none;
  margin-top: 16rpx;
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
  }
}

.divider {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin: 32rpx 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

.divider-text {
  font-size: 24rpx;
  color: #999;
}

.google-btn {
  width: 100%;
  height: 88rpx;
  background: #ffffff;
  border: 2px solid #e0e0e0;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  transition: all 0.3s;

  &:hover {
    border-color: #4285f4;
    background: #f8f9fa;
  }
}

.google-icon {
  width: 40rpx;
  height: 40rpx;
  background: linear-gradient(135deg, #4285f4, #ea4335, #fbbc05, #34a853);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: bold;
  font-size: 24rpx;
}

.switch-mode {
  text-align: center;
  margin-top: 32rpx;
  font-size: 28rpx;
  color: #666;
}

.switch-link {
  color: #4ECDC4;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.guest-continue {
  text-align: center;
  margin-top: 24rpx;
}

.guest-link {
  font-size: 28rpx;
  color: #999;
  cursor: pointer;

  &:hover {
    color: #4ECDC4;
    text-decoration: underline;
  }
}
</style>
