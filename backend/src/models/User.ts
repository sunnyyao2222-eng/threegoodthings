import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  password?: string
  googleId?: string
  nickname: string
  avatar: string
  isGuest: boolean
  isVIP: boolean
  vipExpireAt?: Date
  totalPoints: number
  treeStage: number
  streakDays: number
  lastRecordDate?: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false, // 默认不返回密码
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    nickname: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    isVIP: {
      type: Boolean,
      default: false,
    },
    vipExpireAt: {
      type: Date,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    treeStage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    streakDays: {
      type: Number,
      default: 0,
    },
    lastRecordDate: {
      type: String, // YYYY-MM-DD
    },
  },
  {
    timestamps: true,
  }
)

// 索引
userSchema.index({ email: 1 })
userSchema.index({ googleId: 1 })

export const User = mongoose.model<IUser>('User', userSchema)
