import mongoose from 'mongoose'
import { config } from './index'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodb.uri)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    return true
  } catch (error) {
    console.error('⚠️  MongoDB Connection Failed:', error.message)
    console.log('⚠️  Running without MongoDB - Guest mode only')
    console.log('💡 To enable cloud sync, install MongoDB or use MongoDB Atlas')
    return false
  }
}
