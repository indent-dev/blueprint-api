import { ProjectRequest } from './project.type'
import projectModel, { ProjectDocument } from './project.model'
import HttpException from '../../utils/httpException'
import { ParamsDictionary } from 'express-serve-static-core'

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

  getAllProject(params: ParamsDictionary) {
    const { page, itemPerPage, sortBy, sortDirection, name = '' } = params
    const query = { isDeleted: false, name: { $regex: name, $options: 'i' } }
    return projectModel
      .find(query, null, {
        limit: Number(itemPerPage),
        skip: (Number(page) - 1) * Number(itemPerPage),
        sort: { [sortBy]: sortDirection },
        lean: true,
      })
      .exec()
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
    return projectModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true, lean: true })
      .exec()
  }
}
