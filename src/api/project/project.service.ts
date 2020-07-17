import { ProjectRequest } from './project.type'
import projectModel, { ProjectDocument } from './project.model'
import HttpException from '../../utils/httpException'

export default class ProjectService {
  createProject(project: ProjectRequest) {
    return projectModel.create({ ...project })
  }

  getAllProject() {
    return projectModel.find({ isDeleted: false })
  }

  editProject(id: string, project: ProjectRequest) {
    return new Promise<ProjectDocument>(async (resolve, reject) => {
      try {
        const editedProject = await projectModel.findByIdAndUpdate(
          id,
          project,
          {
            new: true,
          }
        )
        if (editedProject) resolve(editedProject)
        else throw new HttpException(400, 'project not found')
      } catch (error) {
        reject(error)
      }
    })
  }

  deleteProject(id: string) {
    return projectModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, lean: true }
    )
  }
}
