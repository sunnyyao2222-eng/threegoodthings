import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { config } from '../config'
import { User } from '../models/User'

// 只在配置了 Google OAuth 时才启用
const isGoogleConfigured = config.google.clientId && config.google.clientSecret

if (isGoogleConfigured) {
  // 配置 Google OAuth 策略
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 查找是否已存在该 Google 账号
          let user = await User.findOne({ googleId: profile.id })

          if (!user) {
            // 检查邮箱是否已被使用
            const email = profile.emails?.[0]?.value
            if (email) {
              user = await User.findOne({ email })
            }

            if (user) {
              // 邮箱已存在，绑定 Google ID
              user.googleId = profile.id
              await user.save()
            } else {
              // 创建新用户
              user = await User.create({
                googleId: profile.id,
                email: email || `google_${profile.id}@google.local`,
                nickname: profile.displayName || 'Google User',
                avatar: profile.photos?.[0]?.value || '',
                isGuest: false,
              })
            }
          }

          done(null, user)
        } catch (error) {
          done(error as Error, undefined)
        }
      }
    )
  )
}

// 序列化用户
passport.serializeUser((user: any, done) => {
  done(null, user._id)
})

// 反序列化用户
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

export const googleAuth = {
  isConfigured: isGoogleConfigured,
  authenticate: isGoogleConfigured
    ? passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
      })
    : (req: any, res: any) => {
        res.status(503).json({
          success: false,
          message: 'Google OAuth is not configured',
        })
      },
  callback: isGoogleConfigured
    ? passport.authenticate('google', {
        session: false,
        failureRedirect: `${config.frontend.url}/login?error=google_auth_failed`,
      })
    : (req: any, res: any) => {
        res.status(503).json({
          success: false,
          message: 'Google OAuth is not configured',
        })
      },
}
