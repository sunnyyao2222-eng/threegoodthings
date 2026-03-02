import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

// 获取系统语言
const getSystemLanguage = () => {
  // H5环境
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language || (navigator as any).userLanguage
    if (lang.startsWith('zh')) return 'zh-CN'
    if (lang.startsWith('en')) return 'en-US'
  }

  // uni-app环境
  // @ts-ignore
  if (typeof uni !== 'undefined') {
    // @ts-ignore
    const systemInfo = uni.getSystemInfoSync()
    const lang = systemInfo.language
    if (lang.startsWith('zh')) return 'zh-CN'
    if (lang.startsWith('en')) return 'en-US'
  }

  return 'zh-CN' // 默认中文
}

// 从本地存储获取用户选择的语言
const getSavedLanguage = () => {
  try {
    // H5环境
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('app-language') || getSystemLanguage()
    }

    // uni-app环境
    // @ts-ignore
    if (typeof uni !== 'undefined') {
      // @ts-ignore
      return uni.getStorageSync('app-language') || getSystemLanguage()
    }
  } catch (error) {
    console.error('Failed to get saved language:', error)
  }

  return getSystemLanguage()
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getSavedLanguage(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
  globalInjection: true, // 全局注入 $t 函数
})

// 切换语言的辅助函数
export const changeLanguage = (lang: 'zh-CN' | 'en-US') => {
  i18n.global.locale.value = lang

  // 保存到本地存储
  try {
    // H5环境
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('app-language', lang)
    }

    // uni-app环境
    // @ts-ignore
    if (typeof uni !== 'undefined') {
      // @ts-ignore
      uni.setStorageSync('app-language', lang)
    }
  } catch (error) {
    console.error('Failed to save language:', error)
  }
}

// 获取当前语言
export const getCurrentLanguage = () => {
  return i18n.global.locale.value
}

// 支持的语言列表
export const supportedLanguages = [
  { code: 'zh-CN', name: '简体中文', nativeName: '简体中文' },
  { code: 'en-US', name: 'English', nativeName: 'English' },
]

export default i18n
