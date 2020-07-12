import { Project } from "./project.type";
import { Document, Schema, model } from "mongoose";

export type ProjectDocument = Project & Document;

const projectSchema = new Schema(
  {
    name: String,
    description: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<ProjectDocument>("Project", projectSchema);
