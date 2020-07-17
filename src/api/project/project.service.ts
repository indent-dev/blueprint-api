import { ProjectRequest } from './project.type'
import HttpException from '../../utils/httpException'
import projectModel from './project.model'

export default class ProjectService {
  /* Harusnya ini nanti
   *  cek nama project
   *  per user yang login ya
   */
  getProjectByName(name: string) {
    return projectModel.findOne({ name })
  }

  createProject(project: ProjectRequest) {
    return new Promise(async (resolve, reject) => {
      try {
        const isProjectExist = await this.getProjectByName(project.name)
        if (isProjectExist)
          throw new HttpException(409, 'Project name already exist')

        resolve(projectModel.create({ ...project }))
      } catch (error) {
        reject(error)
      }
    })
  }

  getAllProject() {
    return projectModel.find({ isDeleted: false })
  }

  deleteProject(id: string) {
    return projectModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, lean: true }
    )
  }
}
