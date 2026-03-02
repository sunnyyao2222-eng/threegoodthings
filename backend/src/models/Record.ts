import mongoose, { Document, Schema } from 'mongoose'

export interface IRecord extends Document {
  userId: mongoose.Types.ObjectId
  content: string
  category: 'interpersonal' | 'achievement' | 'sensory' | 'flow' | 'gratitude' | 'other'
  imageUrl?: string
  voiceUrl?: string
  aiFeedback?: string
  points: number
  date: string // YYYY-MM-DD
  isPublic: boolean
  resonanceCount: number
  createdAt: Date
  updatedAt: Date
}

const recordSchema = new Schema<IRecord>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: ['interpersonal', 'achievement', 'sensory', 'flow', 'gratitude', 'other'],
      default: 'other',
    },
    imageUrl: {
      type: String,
    },
    voiceUrl: {
      type: String,
    },
    aiFeedback: {
      type: String,
    },
    points: {
      type: Number,
      default: 5,
      min: 0,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    resonanceCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// 复合索引
recordSchema.index({ userId: 1, date: -1 })
recordSchema.index({ isPublic: 1, createdAt: -1 })

export const Record = mongoose.model<IRecord>('Record', recordSchema)
