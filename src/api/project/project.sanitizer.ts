import { body } from 'express-validator'

export default class ProjectSanitizer {
  sanitizeProjectBody() {
    return [
      body('name').notEmpty().escape(),
      body('description').notEmpty().escape(),
    ]
  }
}
