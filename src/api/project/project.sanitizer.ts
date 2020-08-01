import { body, query, param } from 'express-validator'
import { Types } from 'mongoose'

export default class ProjectSanitizer {
  sanitizeProjectBody() {
    return [
      body(['name', 'description'], 'must be given').notEmpty().bail().escape(),
    ]
  }

  getProjectIndexQuery() {
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
    ]
  }

  putProjectParamBody() {
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
    ]
  }

  deleteProjectParam() {
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
    ]
  }
}
