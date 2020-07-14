import { ProjectRequest } from "./project.type";
import projectModel from "./project.model";

export default class ProjectService {
  createProject(project: ProjectRequest) {
    return projectModel.create({ ...project });
  }

  getAllProject() {
    return projectModel.find({ "isDeleted": false });;
  }

  deleteProject(id: string) {
    return projectModel.findByIdAndUpdate(id, { "isDeleted": true }, { new: true, lean: true });
  }
}
