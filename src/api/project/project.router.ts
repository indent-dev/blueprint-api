import { Router } from 'express'
import { body } from 'express-validator'
import ProjectController from './project.controller'

const projectRouter = Router()
const projectController = new ProjectController()
const baseUrl = '/project'

/*  change
 *   <p>halo dunia</p>
 *   into
 *   p&gt;halo dunia&lt;&#x2F;p&gt;
 */
projectRouter.post(
  `${baseUrl}`,
  [body('name').escape(), body('description').escape()],
  projectController.store
)
projectRouter.get(`${baseUrl}`, projectController.index)
projectRouter.delete(`${baseUrl}/:id`, projectController.delete)

export default projectRouter
