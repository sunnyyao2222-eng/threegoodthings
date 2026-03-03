import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import passport from 'passport'
import { config } from './config'
import { connectDB } from './config/database'
import { errorHandler } from './middleware/error'

// Routes
import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import recordRoutes from './routes/record'
import aiRoutes from './routes/ai'

const app = express()

// 异步初始化
const init = async () => {
  // 尝试连接数据库（可选）
  await connectDB()

  // 中间件
  app.use(helmet())
  app.use(cors({
    origin: (origin, callback) => {
      // 开发环境允许所有 localhost 端口
      if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true)
      } else if (origin === config.frontend.url) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  }))
  app.use(morgan('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(passport.initialize())

  // 健康检查
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    })
  })

  // API 路由
  app.use('/api/auth', authRoutes)
  app.use('/api/user', userRoutes)
  app.use('/api/records', recordRoutes)
  app.use('/api/ai', aiRoutes)

  // 404 处理
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    })
  })

  // 错误处理
  app.use(errorHandler)

  // 启动服务器
  const PORT = config.port

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
    console.log(`📝 Environment: ${config.nodeEnv}`)
    console.log(`🌐 Frontend URL: ${config.frontend.url}`)
  })
}

// 启动应用
init().catch(error => {
  console.error('Failed to start server:', error)
  process.exit(1)
})

export default app
