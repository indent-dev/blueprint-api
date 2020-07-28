import { Router } from 'express'
import ProjectController from './project.controller'
import ProjectSanitizer from './project.sanitizer'

const projectRouter = Router()
const projectController = new ProjectController()
const projectSanitizer = new ProjectSanitizer()
const baseUrl = '/project'

projectRouter.post(
  `${baseUrl}`,
  projectSanitizer.sanitizeProjectBody(),
  projectController.store
)
projectRouter.get(`${baseUrl}`, projectController.index)
projectRouter.put(`${baseUrl}/:id`, projectController.edit)
projectRouter.delete(`${baseUrl}/:id`, projectController.delete)

export default projectRouter
