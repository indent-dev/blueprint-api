import { Router } from 'express'
import ProjectController from './project.controller'
import ProjectSanitizer from './project.sanitizer'

const projectRouter = Router()
const projectController = new ProjectController()
const projectSanitizer = new ProjectSanitizer()
const baseUrl = '/project'

projectRouter.post(
  `${baseUrl}`,
  projectSanitizer.sanitizeCreateProject(),
  projectController.store
)
projectRouter.get(
  `${baseUrl}`,
  projectSanitizer.validateGetAllProject(),
  projectController.index
)
projectRouter.put(
  `${baseUrl}/:id?`,
  projectSanitizer.validateEditProject(),
  projectController.edit
)
projectRouter.delete(
  `${baseUrl}/:id?`,
  projectSanitizer.validateDeleteProject(),
  projectController.delete
)

export default projectRouter
