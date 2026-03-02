// Web版存储适配器
// 统一 localStorage 和 uni.storage 的接口

interface StorageAdapter {
  get<T = any>(key: string): T | null
  set<T = any>(key: string, value: T): void
  remove(key: string): void
  clear(): void
}

class WebStorage implements StorageAdapter {
  get<T = any>(key: string): T | null {
    try {
      const value = localStorage.getItem(key)
      if (value === null) return null
      return JSON.parse(value) as T
    } catch (error) {
      console.error('Failed to get from localStorage:', error)
      return null
    }
  }

  set<T = any>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to set to localStorage:', error)
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  }

  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }
}

class UniStorage implements StorageAdapter {
  get<T = any>(key: string): T | null {
    try {
      // @ts-ignore
      const value = uni.getStorageSync(key)
      return value || null
    } catch (error) {
      console.error('Failed to get from uni.storage:', error)
      return null
    }
  }

  set<T = any>(key: string, value: T): void {
    try {
      // @ts-ignore
      uni.setStorageSync(key, value)
    } catch (error) {
      console.error('Failed to set to uni.storage:', error)
    }
  }

  remove(key: string): void {
    try {
      // @ts-ignore
      uni.removeStorageSync(key)
    } catch (error) {
      console.error('Failed to remove from uni.storage:', error)
    }
  }

  clear(): void {
    try {
      // @ts-ignore
      uni.clearStorageSync()
    } catch (error) {
      console.error('Failed to clear uni.storage:', error)
    }
  }
}

// 自动检测环境并使用对应的存储方式
const createStorage = (): StorageAdapter => {
  // 检测是否在浏览器环境
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return new WebStorage()
  }

  // 检测是否在 uni-app 环境
  // @ts-ignore
  if (typeof uni !== 'undefined') {
    return new UniStorage()
  }

  // 降级到内存存储
  console.warn('No storage available, using memory storage')
  const memoryStorage = new Map<string, any>()
  return {
    get: (key: string) => memoryStorage.get(key) || null,
    set: (key: string, value: any) => memoryStorage.set(key, value),
    remove: (key: string) => memoryStorage.delete(key),
    clear: () => memoryStorage.clear(),
  }
}

export const storage = createStorage()

// 导出类型
export type { StorageAdapter }
