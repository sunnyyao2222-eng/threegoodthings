import { Router } from 'express'
import { body, validationResult, query } from 'express-validator'
import { Record } from '../models/Record'
import { User } from '../models/User'
import { AuthRequest, authenticate } from '../middleware/auth'
import { analyzeCategory, generateAIFeedback } from '../services/ai'

const router = Router()

// 创建记录
router.post(
  '/',
  authenticate,
  [
    body('content').trim().isLength({ min: 10, max: 500 }),
    body('imageUrl').optional().isURL(),
    body('voiceUrl').optional().isURL(),
    body('isPublic').optional().isBoolean(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array(),
        })
      }

      const user = req.user
      const { content, imageUrl, voiceUrl, isPublic } = req.body

      // 获取今天的日期
      const today = new Date().toISOString().split('T')[0]

      // 检查今日记录数量
      const todayRecordsCount = await Record.countDocuments({
        userId: user._id,
        date: today,
      })

      const maxRecords = user.isVIP ? 6 : 3
      if (todayRecordsCount >= maxRecords) {
        return res.status(400).json({
          success: false,
          message: `Daily limit reached. ${user.isVIP ? 'VIP' : 'Free'} users can record ${maxRecords} things per day.`,
        })
      }

      // AI 分析分类
      const category = await analyzeCategory(content)

      // AI 生成反馈
      const aiFeedback = await generateAIFeedback(content, category)

      // 计算积分
      let points = 5 // 基础积分
      if (imageUrl) points += 2
      if (voiceUrl) points += 2
      if (content.length > 100) points += 1

      // 创建记录
      const record = await Record.create({
        userId: user._id,
        content,
        category,
        imageUrl,
        voiceUrl,
        aiFeedback,
        points,
        date: today,
        isPublic: isPublic || false,
      })

      // 更新用户积分和树木阶段
      user.totalPoints += points

      // 计算树木阶段
      const stages = [0, 30, 100, 300, 800, 2000]
      for (let i = stages.length - 1; i >= 0; i--) {
        if (user.totalPoints >= stages[i]) {
          user.treeStage = i
          break
        }
      }

      // 更新连续打卡天数
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      if (user.lastRecordDate === yesterdayStr) {
        user.streakDays += 1
      } else if (user.lastRecordDate !== today) {
        user.streakDays = 1
      }

      user.lastRecordDate = today
      await user.save()

      res.status(201).json({
        success: true,
        message: 'Record created successfully',
        data: {
          record: {
            id: record._id,
            content: record.content,
            category: record.category,
            aiFeedback: record.aiFeedback,
            points: record.points,
            date: record.date,
            createdAt: record.createdAt,
          },
          user: {
            totalPoints: user.totalPoints,
            treeStage: user.treeStage,
            streakDays: user.streakDays,
          },
        },
      })
    } catch (error) {
      next(error)
    }
  }
)

// 获取记录列表
router.get(
  '/',
  authenticate,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const user = req.user
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const skip = (page - 1) * limit

      const query: any = { userId: user._id }

      if (req.query.startDate || req.query.endDate) {
        query.date = {}
        if (req.query.startDate) {
          query.date.$gte = req.query.startDate
        }
        if (req.query.endDate) {
          query.date.$lte = req.query.endDate
        }
      }

      const [records, total] = await Promise.all([
        Record.find(query)
          .sort({ date: -1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Record.countDocuments(query),
      ])

      res.json({
        success: true,
        data: {
          records,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      })
    } catch (error) {
      next(error)
    }
  }
)

// 获取今日记录
router.get('/today', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user
    const today = new Date().toISOString().split('T')[0]

    const records = await Record.find({
      userId: user._id,
      date: today,
    }).sort({ createdAt: 1 })

    res.json({
      success: true,
      data: { records },
    })
  } catch (error) {
    next(error)
  }
})

// 获取单条记录
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user
    const record = await Record.findOne({
      _id: req.params.id,
      userId: user._id,
    })

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      })
    }

    res.json({
      success: true,
      data: { record },
    })
  } catch (error) {
    next(error)
  }
})

// 删除记录
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user
    const record = await Record.findOneAndDelete({
      _id: req.params.id,
      userId: user._id,
    })

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      })
    }

    res.json({
      success: true,
      message: 'Record deleted successfully',
    })
  } catch (error) {
    next(error)
  }
})

// 获取公开记录（社区）
router.get('/public/feed', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    const [records, total] = await Promise.all([
      Record.find({ isPublic: true })
        .populate('userId', 'nickname avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Record.countDocuments({ isPublic: true }),
    ])

    res.json({
      success: true,
      data: {
        records,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
