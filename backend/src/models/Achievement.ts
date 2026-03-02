import mongoose, { Document, Schema } from 'mongoose'

export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId
  badgeId: string
  badgeName: string
  unlockedAt: Date
}

const achievementSchema = new Schema<IAchievement>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    badgeId: {
      type: String,
      required: true,
    },
    badgeName: {
      type: String,
      required: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// 防止重复解锁
achievementSchema.index({ userId: 1, badgeId: 1 }, { unique: true })

export const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema)
