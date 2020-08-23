import { Router } from 'express'
import UserController from './user.controller'
import UserSanitizer from './user.sanitizer'

const userRouter = Router()
const userController = new UserController()
const userSanitizer = new UserSanitizer()

const baseUrl = `/user`

userRouter.get(`${baseUrl}`, userController.index)
userRouter.get(`${baseUrl}/authenticate/google`, userController.googlelink)
userRouter.get(`${baseUrl}/auth_callback`, userController.googlecallback)

userRouter.post(
  `${baseUrl}`,
  userSanitizer.sanitizeCreateUser(),
  userController.store
)
userRouter.post(
  `${baseUrl}/authenticate`,
  userSanitizer.sanitizeAuthenticateUser(),
  userController.authenticate
)

export default userRouter
