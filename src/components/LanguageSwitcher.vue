<template>
  <view class="language-switcher">
    <view class="current-lang" @click="showPicker = !showPicker">
      <text class="lang-icon">🌐</text>
      <text class="lang-name">{{ currentLangName }}</text>
      <text class="arrow" :class="{ active: showPicker }">▼</text>
    </view>

    <view v-if="showPicker" class="lang-picker">
      <view
        v-for="lang in languages"
        :key="lang.code"
        class="lang-option"
        :class="{ active: currentLang === lang.code }"
        @click="selectLanguage(lang.code)"
      >
        <text class="lang-native">{{ lang.nativeName }}</text>
        <text v-if="currentLang === lang.code" class="check">✓</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { changeLanguage, supportedLanguages } from '@/i18n'

const { locale } = useI18n()
const showPicker = ref(false)

const languages = supportedLanguages

const currentLang = computed(() => locale.value)

const currentLangName = computed(() => {
  const lang = languages.find(l => l.code === currentLang.value)
  return lang?.nativeName || '简体中文'
})

const selectLanguage = (langCode: string) => {
  changeLanguage(langCode as 'zh-CN' | 'en-US')
  showPicker.value = false

  // 显示切换成功提示
  uni.showToast({
    title: langCode === 'zh-CN' ? '语言已切换' : 'Language changed',
    icon: 'success',
    duration: 1500
  })
}
</script>

<style lang="scss" scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.current-lang {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 24rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 48rpx;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  }
}

.lang-icon {
  font-size: 32rpx;
}

.lang-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.arrow {
  font-size: 20rpx;
  color: #999;
  transition: transform 0.3s ease;

  &.active {
    transform: rotate(180deg);
  }
}

.lang-picker {
  position: absolute;
  top: calc(100% + 16rpx);
  right: 0;
  min-width: 240rpx;
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.lang-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  &.active {
    background: #f0f9ff;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
}

.lang-native {
  font-size: 28rpx;
  color: #333;
}

.check {
  font-size: 32rpx;
  color: #4ECDC4;
  font-weight: bold;
}
</style>
