import { Request, Response, NextFunction } from 'express'
import ProjectService from './project.service'
import HttpException from '../../utils/httpException'
const projectService = new ProjectService()

export default class ProjectController {
  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.createProject(req.body)
      res.send(project)
    } catch (error) {
      next(new HttpException(error.statusCode || 500, error.message))
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await projectService.getAllProject()
      res.send(result)
    } catch (error) {
      next(new HttpException(error.statusCode || 500, error.message))
    }
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const project = await projectService.editProject(id, req.body)
      res.send(project)
    } catch (error) {
      next(new HttpException(error.statusCode || 500, error.message))
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await projectService.deleteProject(req.params.id)
      const message = { message: 'Data successfully deleted' }
      res.send({ ...result, ...message })
    } catch (error) {
      next(new HttpException(error.statusCode || 500, error.message))
    }
  }
}
