import { Router } from 'express'
import { body } from 'express-validator'
import ProjectController from './project.controller'

const projectRouter = Router()
const projectController = new ProjectController()
const baseUrl = '/project'

projectRouter.post(
  `${baseUrl}`,
  [body('name').escape(), body('description').escape()],
  projectController.store
)
projectRouter.get(`${baseUrl}`, projectController.index)
projectRouter.put(`${baseUrl}/:id`, projectController.edit)
projectRouter.delete(`${baseUrl}/:id`, projectController.delete)

export default projectRouter
