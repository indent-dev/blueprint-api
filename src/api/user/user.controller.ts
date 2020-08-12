import { NextFunction, Request, Response } from 'express'
import HttpException from '../../utils/httpException'
import UserService from './user.service'
const userService = new UserService()

export default class UserController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.getAllUser()
      res.send(result)
    } catch (error) {
      next(new HttpException(error.statusCode || 500, error.message))
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const user = await userService.createUser({ email, password })
      res.send(user)
    } catch (error) {
      next(new HttpException(error.statusCode || 500, error.message))
    }
  }

  async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const token = await userService.authenticateUser({ email, password })
      res.send({ token })
    } catch (error) {
      next(new HttpException(error.statusCode || 500, error.message))
    }
  }
}
