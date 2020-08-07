import { ProjectRequest } from './project.type'
import projectModel, { ProjectDocument } from './project.model'
import HttpException from '../../utils/httpException'

export default class ProjectService {
  /* Harusnya ini nanti
   *  cek nama project
   *  per user yang login ya
   */
  getProjectByName(name: string) {
    return projectModel.findOne({ name, isDeleted: false })
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

  getAllProject(
    page: number,
    itemPerPage: number,
    sortBy: string,
    sortDirection: string,
    name: string
  ) {
    return new Promise<ProjectDocument[]>(async (resolve, reject) => {
      try {
        const query = {
          isDeleted: false,
          name: { $regex: name, $options: 'i' },
        }
        const getProject = await projectModel
          .find(query)
          .limit(itemPerPage)
          .skip((page - 1) * itemPerPage)
          .sort({ [sortBy]: sortDirection })
        if (getProject) resolve(getProject)
        else throw new HttpException(409, 'project not found')
      } catch (error) {
        reject(error)
      }
    })
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
    return new Promise<Pick<ProjectDocument, '_id' | 'name' | 'description'>>(
      async (resolve, reject) => {
        try {
          const deletedProject = await projectModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true, lean: true }
          )
          if (deletedProject) resolve(deletedProject)
          else throw new HttpException(400, 'project not found')
        } catch (error) {
          reject(error)
        }
      }
    )
  }
}
