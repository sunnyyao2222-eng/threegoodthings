import { Router, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { User } from '../models/User'
import { config } from '../config'
import { AppError } from '../middleware/error'
import { AuthRequest, authenticate } from '../middleware/auth'
import { googleAuth } from '../services/google'

const router = Router()

// 生成 JWT Token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  })
}

// 注册
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('nickname').trim().isLength({ min: 2, max: 20 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array(),
        })
      }

      const { email, password, nickname } = req.body

      // 检查邮箱是否已存在
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists',
        })
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10)

      // 创建用户
      const user = await User.create({
        email,
        password: hashedPassword,
        nickname,
        isGuest: false,
      })

      // 生成 token
      const token = generateToken(user._id.toString())

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
            isVIP: user.isVIP,
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

// 登录
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array(),
        })
      }

      const { email, password } = req.body

      // 查找用户（包含密码字段）
      const user = await User.findOne({ email }).select('+password')
      if (!user || !user.password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        })
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        })
      }

      // 生成 token
      const token = generateToken(user._id.toString())

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
            isVIP: user.isVIP,
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

// Google 登录
router.get('/google', googleAuth.authenticate)

router.get('/google/callback', googleAuth.callback, (req: any, res) => {
  // 生成 token
  const token = generateToken(req.user._id.toString())

  // 重定向到前端，带上 token
  res.redirect(`${config.frontend.url}/auth/callback?token=${token}`)
})

// 游客登录
router.post('/guest', async (req, res, next) => {
  try {
    const { deviceId } = req.body

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: 'Device ID is required',
      })
    }

    // 使用设备ID作为邮箱
    const email = `guest_${deviceId}@guest.local`

    // 检查是否已存在
    let user = await User.findOne({ email })

    if (!user) {
      // 创建游客账号
      user = await User.create({
        email,
        nickname: `Guest_${deviceId.slice(0, 8)}`,
        isGuest: true,
      })
    }

    // 生成 token
    const token = generateToken(user._id.toString())

    res.json({
      success: true,
      message: 'Guest login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          isGuest: user.isGuest,
          isVIP: user.isVIP,
          totalPoints: user.totalPoints,
          treeStage: user.treeStage,
          streakDays: user.streakDays,
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

// 游客升级为正式账号
router.post(
  '/upgrade',
  authenticate,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('nickname').optional().trim().isLength({ min: 2, max: 20 }),
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

      if (!user.isGuest) {
        return res.status(400).json({
          success: false,
          message: 'User is not a guest',
        })
      }

      const { email, password, nickname } = req.body

      // 检查邮箱是否已被使用
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists',
        })
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10)

      // 更新用户信息
      user.email = email
      user.password = hashedPassword
      user.isGuest = false
      if (nickname) {
        user.nickname = nickname
      }

      await user.save()

      res.json({
        success: true,
        message: 'Account upgraded successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
            isGuest: user.isGuest,
            isVIP: user.isVIP,
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

// 获取当前用户信息
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
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
          createdAt: user.createdAt,
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

// 刷新 Token
router.post('/refresh', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user
    const token = generateToken(user._id.toString())

    res.json({
      success: true,
      data: { token },
    })
  } catch (error) {
    next(error)
  }
})

export default router
