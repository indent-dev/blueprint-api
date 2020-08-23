import { body } from 'express-validator'
import validationHandler from '../../middlewares/validationHandler'

export default class UserSanitizer {
  sanitizeCreateUser() {
    return [
      body(['email', 'password'], 'must be given').notEmpty().bail().escape(),
      body('email', 'must a valid email').isEmail(),
      validationHandler,
    ]
  }

  sanitizeAuthenticateUser() {
    return [
      body(['email', 'password'], 'must be given').notEmpty().bail().escape(),
      body('email', 'must a valid email').isEmail(),
      validationHandler,
    ]
  }
}
