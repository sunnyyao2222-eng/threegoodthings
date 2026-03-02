/**
 * 微信小程序云开发 API 适配层
 */

// 初始化云开发
if (typeof wx !== 'undefined' && wx.cloud) {
  wx.cloud.init({
    env: 'your-env-id', // 替换为你的云开发环境 ID
    traceUser: true
  })
}

/**
 * 调用云函数
 */
const callFunction = async (name: string, data: any) => {
  try {
    const res = await wx.cloud.callFunction({
      name,
      data
    })
    return res.result
  } catch (error) {
    console.error(`云函数 ${name} 调用失败:`, error)
    throw error
  }
}

/**
 * 用户相关 API
 */
export const cloudUserApi = {
  // 微信登录
  async wxLogin(userInfo: any) {
    return await callFunction('user', {
      action: 'wxLogin',
      data: userInfo
    })
  },

  // 获取用户信息
  async getUserInfo() {
    return await callFunction('user', {
      action: 'getUserInfo'
    })
  },

  // 更新用户信息
  async updateUserInfo(data: any) {
    return await callFunction('user', {
      action: 'updateUserInfo',
      data
    })
  }
}

/**
 * 好事记录相关 API
 */
export const cloudRecordApi = {
  // 提交好事记录
  async submitGoodThing(data: any) {
    return await callFunction('record', {
      action: 'submit',
      data
    })
  },

  // 获取今日记录
  async getTodayRecords() {
    return await callFunction('record', {
      action: 'getToday'
    })
  },

  // 获取历史记录
  async getHistoryRecords(params: any) {
    return await callFunction('record', {
      action: 'getHistory',
      data: params
    })
  },

  // 删除记录
  async deleteRecord(recordId: string) {
    return await callFunction('record', {
      action: 'delete',
      data: { recordId }
    })
  }
}

/**
 * 云存储 API
 */
export const cloudStorageApi = {
  // 上传图片
  async uploadImage(filePath: string) {
    try {
      const cloudPath = `images/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
      const res = await wx.cloud.uploadFile({
        cloudPath,
        filePath
      })
      return {
        success: true,
        fileID: res.fileID,
        url: res.fileID
      }
    } catch (error) {
      console.error('上传图片失败:', error)
      throw error
    }
  },

  // 上传语音
  async uploadVoice(filePath: string) {
    try {
      const cloudPath = `voices/${Date.now()}-${Math.random().toString(36).slice(2)}.mp3`
      const res = await wx.cloud.uploadFile({
        cloudPath,
        filePath
      })
      return {
        success: true,
        fileID: res.fileID,
        url: res.fileID
      }
    } catch (error) {
      console.error('上传语音失败:', error)
      throw error
    }
  },

  // 获取临时链接
  async getTempFileURL(fileID: string) {
    try {
      const res = await wx.cloud.getTempFileURL({
        fileList: [fileID]
      })
      return res.fileList[0].tempFileURL
    } catch (error) {
      console.error('获取临时链接失败:', error)
      throw error
    }
  }
}

/**
 * 云数据库 API（用于社区功能）
 */
export const cloudDBApi = {
  // 获取数据库引用
  getDB() {
    return wx.cloud.database()
  },

  // 获取公开的好事记录（社区）
  async getPublicRecords(limit = 20) {
    const db = wx.cloud.database()
    const _ = db.command

    try {
      const res = await db.collection('records')
        .where({
          isPublic: true
        })
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get()

      return {
        success: true,
        data: res.data
      }
    } catch (error) {
      console.error('获取公开记录失败:', error)
      throw error
    }
  },

  // 设置记录为公开
  async setRecordPublic(recordId: string, isPublic: boolean) {
    const db = wx.cloud.database()

    try {
      await db.collection('records').doc(recordId).update({
        data: {
          isPublic
        }
      })

      return {
        success: true
      }
    } catch (error) {
      console.error('设置记录公开状态失败:', error)
      throw error
    }
  }
}
