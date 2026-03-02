// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// AI 反馈文案库
const AI_FEEDBACKS = [
  '真好啊，这样的小确幸值得被记住 ✨',
  '看起来是很温暖的一刻呢 💕',
  '能感受到这份美好，你真幸运 🌟',
  '这个瞬间，一定很特别吧 🌸',
  '谢谢你分享这份美好 🌈',
  '这听起来真是一件美好的事情 🎉',
  '我能感受到你的快乐 😊',
  '太棒了！这样的时刻值得被好好记录 ⭐',
  '这份美好会一直陪伴着你 🌺',
  '生活中的小确幸，最值得珍惜 🍀'
]

// 好事分类关键词
const CATEGORY_KEYWORDS = {
  interpersonal: ['朋友', '家人', '同事', '帮助', '陪伴', '聊天', '微笑', '关心'],
  achievement: ['完成', '成功', '学会', '进步', '突破', '解决', '达成', '实现'],
  sensory: ['美味', '好吃', '香', '美丽', '漂亮', '舒服', '温暖', '阳光', '音乐'],
  flow: ['专注', '投入', '忘我', '沉浸', '享受', '创作', '写作', '画画'],
  gratitude: ['感谢', '感恩', '幸运', '珍惜', '感动', '温暖', '关怀'],
  other: []
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { action, data } = event

  try {
    switch (action) {
      // 提交好事记录
      case 'submit':
        return await submitRecord(wxContext, data)

      // 获取今日记录
      case 'getToday':
        return await getTodayRecords(wxContext)

      // 获取历史记录
      case 'getHistory':
        return await getHistoryRecords(wxContext, data)

      // 删除记录
      case 'delete':
        return await deleteRecord(wxContext, data)

      default:
        return {
          success: false,
          message: '未知操作'
        }
    }
  } catch (error) {
    console.error('记录操作错误:', error)
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * 提交好事记录
 */
async function submitRecord(wxContext, data) {
  const { openid } = wxContext
  const { content, imageUrl, voiceUrl } = data

  // 获取用户信息
  const userResult = await db.collection('users').where({ openid }).get()
  if (userResult.data.length === 0) {
    return { success: false, message: '用户不存在' }
  }

  const user = userResult.data[0]
  const now = new Date()
  const today = now.toISOString().split('T')[0]

  // 检查今日记录数量
  const todayRecords = await db.collection('records').where({
    openid,
    date: today
  }).count()

  const maxRecords = user.isVIP ? 6 : 3
  if (todayRecords.total >= maxRecords) {
    return {
      success: false,
      message: `今日已记录 ${maxRecords} 件好事`
    }
  }

  // 分类识别
  const category = detectCategory(content)

  // 计算积分
  const points = content.length > 20 ? 7 : 5

  // 随机 AI 反馈
  const aiFeedback = AI_FEEDBACKS[Math.floor(Math.random() * AI_FEEDBACKS.length)]

  // 创建记录
  const recordResult = await db.collection('records').add({
    data: {
      openid,
      userId: user._id,
      content,
      category,
      imageUrl: imageUrl || '',
      voiceUrl: voiceUrl || '',
      aiFeedback,
      points,
      date: today,
      isPublic: false,
      createdAt: now
    }
  })

  // 更新用户积分
  await db.collection('users').doc(user._id).update({
    data: {
      totalPoints: _.inc(points)
    }
  })

  // 检查树木升级
  const newTotalPoints = user.totalPoints + points
  const stages = [0, 50, 200, 500, 1200, 3000]
  let newStage = 0
  for (let i = stages.length - 1; i >= 0; i--) {
    if (newTotalPoints >= stages[i]) {
      newStage = i
      break
    }
  }

  if (newStage > user.treeStage) {
    await db.collection('users').doc(user._id).update({
      data: {
        treeStage: newStage
      }
    })
  }

  return {
    success: true,
    data: {
      recordId: recordResult._id,
      aiFeedback,
      points,
      category,
      newStage: newStage > user.treeStage ? newStage : null
    }
  }
}

/**
 * 获取今日记录
 */
async function getTodayRecords(wxContext) {
  const { openid } = wxContext
  const today = new Date().toISOString().split('T')[0]

  const result = await db.collection('records')
    .where({
      openid,
      date: today
    })
    .orderBy('createdAt', 'asc')
    .get()

  return {
    success: true,
    data: result.data
  }
}

/**
 * 获取历史记录
 */
async function getHistoryRecords(wxContext, data) {
  const { openid } = wxContext
  const { startDate, endDate, page = 1, limit = 30 } = data

  const query = db.collection('records').where({
    openid
  })

  if (startDate && endDate) {
    query.where({
      date: _.gte(startDate).and(_.lte(endDate))
    })
  }

  const result = await query
    .orderBy('createdAt', 'desc')
    .skip((page - 1) * limit)
    .limit(limit)
    .get()

  const total = await query.count()

  return {
    success: true,
    data: {
      records: result.data,
      total: total.total,
      page,
      limit
    }
  }
}

/**
 * 删除记录
 */
async function deleteRecord(wxContext, data) {
  const { openid } = wxContext
  const { recordId } = data

  // 验证记录所有权
  const record = await db.collection('records').doc(recordId).get()
  if (!record.data || record.data.openid !== openid) {
    return {
      success: false,
      message: '无权删除此记录'
    }
  }

  await db.collection('records').doc(recordId).remove()

  return {
    success: true,
    message: '删除成功'
  }
}

/**
 * 检测好事分类
 */
function detectCategory(content) {
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'other') continue

    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        return category
      }
    }
  }
  return 'other'
}
