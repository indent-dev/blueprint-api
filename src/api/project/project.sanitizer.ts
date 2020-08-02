import { body, query, param } from 'express-validator'
import { Types } from 'mongoose'
import validationHandler from '../../middlewares/validationHandler'

export default class ProjectSanitizer {
  sanitizeCreateProject() {
    return [
      body(['name', 'description'], 'must be given').notEmpty().bail().escape(),
      validationHandler,
    ]
  }

  validateGetAllProject() {
    return [
      query(['page', 'itemPerPage'], 'must be given')
        .notEmpty()
        .bail()
        .isInt()
        .withMessage('must be number'),
      query('sortBy', 'must be given').notEmpty(),
      query('sortDirection', 'must be given')
        .notEmpty()
        .bail()
        .isIn(['asc', 'desc'])
        .withMessage('must ascending (asc) or descending (desc)'),
      validationHandler,
    ]
  }

  validateEditProject() {
    return [
      param('id', 'must be given')
        .notEmpty()
        .bail()
        .custom(value => {
          if (Types.ObjectId.isValid(value)) {
            return true
          } else {
            throw new Error('id is not valid')
          }
        }),
      body(['name', 'description'], 'must be given').notEmpty(),
      validationHandler,
    ]
  }

  validateDeleteProject() {
    return [
      param('id', 'must be given')
        .notEmpty()
        .bail()
        .custom(value => {
          if (Types.ObjectId.isValid(value)) {
            return true
          } else {
            throw new Error('id is not valid')
          }
        }),
      validationHandler,
    ]
  }
}
