import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { User } from '../models/User'
import { AuthRequest, authenticate } from '../middleware/auth'

const router = Router()

// 获取用户信息
router.get('/profile', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          isGuest: user.isGuest,
          isVIP: user.isVIP,
          vipExpireAt: user.vipExpireAt,
          totalPoints: user.totalPoints,
          treeStage: user.treeStage,
          streakDays: user.streakDays,
          lastRecordDate: user.lastRecordDate,
          createdAt: user.createdAt,
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

// 更新用户信息
router.put(
  '/profile',
  authenticate,
  [
    body('nickname').optional().trim().isLength({ min: 2, max: 20 }),
    body('avatar').optional().isURL(),
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
      const { nickname, avatar } = req.body

      if (nickname) user.nickname = nickname
      if (avatar) user.avatar = avatar

      await user.save()

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
          },
        },
      })
    } catch (error) {
      next(error)
    }
  }
)

// 获取用户统计
router.get('/stats', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user

    res.json({
      success: true,
      data: {
        stats: {
          totalPoints: user.totalPoints,
          treeStage: user.treeStage,
          streakDays: user.streakDays,
          isVIP: user.isVIP,
          vipExpireAt: user.vipExpireAt,
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
