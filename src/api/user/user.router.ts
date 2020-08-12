import { Router } from 'express'
import UserController from './user.controller'

const userRouter = Router()
const userController = new UserController()

const baseUrl = `/user`

userRouter.get(`${baseUrl}`, userController.index)
userRouter.post(`${baseUrl}`, userController.store)
userRouter.post(`${baseUrl}/authenticate`, userController.authenticate)

export default userRouter
