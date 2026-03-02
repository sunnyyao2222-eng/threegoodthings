import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { AuthRequest, optionalAuth } from '../middleware/auth'
import { chatWithAI } from '../services/ai'

const router = Router()

// AI 对话
router.post(
  '/chat',
  optionalAuth,
  [body('messages').isArray(), body('messages.*.role').isIn(['user', 'assistant', 'system']), body('messages.*.content').notEmpty()],
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

      const { messages } = req.body

      const result = await chatWithAI(messages)

      res.json(result)
    } catch (error) {
      next(error)
    }
  }
)

export default router
