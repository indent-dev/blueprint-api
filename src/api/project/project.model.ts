import { Project } from './project.type'
import { Document, Schema, model } from 'mongoose'

export type ProjectDocument = Omit<Project, 'isDeleted'> & Document

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default model<ProjectDocument>('Project', projectSchema)
