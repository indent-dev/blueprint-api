import { ProjectRequest } from "./project.type";
import projectModel from "./project.model";

export default class ProjectService {
  createProject(project: ProjectRequest) {
    return projectModel.create({ ...project });
  }
}
