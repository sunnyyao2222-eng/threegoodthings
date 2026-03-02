// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { action, data } = event

  try {
    switch (action) {
      // 微信登录
      case 'wxLogin':
        return await wxLogin(wxContext, data)

      // 获取用户信息
      case 'getUserInfo':
        return await getUserInfo(wxContext)

      // 更新用户信息
      case 'updateUserInfo':
        return await updateUserInfo(wxContext, data)

      default:
        return {
          success: false,
          message: '未知操作'
        }
    }
  } catch (error) {
    console.error('用户操作错误:', error)
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * 微信登录
 */
async function wxLogin(wxContext, data) {
  const { openid, unionid } = wxContext

  // 查询用户是否存在
  const userResult = await db.collection('users').where({
    openid
  }).get()

  let user
  const now = new Date()

  if (userResult.data.length === 0) {
    // 新用户，创建记录
    const createResult = await db.collection('users').add({
      data: {
        openid,
        unionid,
        nickname: data.nickname || '新用户',
        avatar: data.avatar || '',
        isVIP: false,
        vipExpireAt: null,
        streakDays: 0,
        totalPoints: 0,
        treeStage: 0,
        createdAt: now,
        updatedAt: now
      }
    })

    user = {
      _id: createResult._id,
      openid,
      unionid,
      nickname: data.nickname || '新用户',
      avatar: data.avatar || '',
      isVIP: false,
      streakDays: 0,
      totalPoints: 0,
      treeStage: 0
    }
  } else {
    // 老用户，更新登录时间
    user = userResult.data[0]
    await db.collection('users').doc(user._id).update({
      data: {
        updatedAt: now
      }
    })
  }

  return {
    success: true,
    data: {
      userInfo: user,
      token: openid // 简化处理，使用 openid 作为 token
    }
  }
}

/**
 * 获取用户信息
 */
async function getUserInfo(wxContext) {
  const { openid } = wxContext

  const result = await db.collection('users').where({
    openid
  }).get()

  if (result.data.length === 0) {
    return {
      success: false,
      message: '用户不存在'
    }
  }

  return {
    success: true,
    data: result.data[0]
  }
}

/**
 * 更新用户信息
 */
async function updateUserInfo(wxContext, data) {
  const { openid } = wxContext

  const result = await db.collection('users').where({
    openid
  }).update({
    data: {
      ...data,
      updatedAt: new Date()
    }
  })

  if (result.stats.updated === 0) {
    return {
      success: false,
      message: '更新失败'
    }
  }

  return {
    success: true,
    message: '更新成功'
  }
}
