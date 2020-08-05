import { Document, model, Schema } from 'mongoose'
import { User } from './user.type'

export type UserDocument = User & Document

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default model<UserDocument>('User', userSchema)
