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

  async googlelink(req: Request, res: Response, next: NextFunction) {
    try {
      const link: string = await userService.googleLoginLink()
      res.redirect(link)
    } catch (error) {
      next(new HttpException(error.statusCode || 500, error.message))
    }
  }

  async googlecallback(req: Request, res: Response, next: NextFunction) {
    try {
      const errorLink = req.query.error != null ? req.query.error : ''
      const codeLink = req.query.code != null ? req.query.code : ''

      const googleToken: string = await userService.googleLoginCallback(
        errorLink as string,
        codeLink as string
      )

      const token = await userService.transformGoogleToken(googleToken)

      res.send({ token })
    } catch (error) {
      next(new HttpException(error.statusCode || 500, error.message))
    }
  }
}
