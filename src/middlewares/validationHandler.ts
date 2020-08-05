import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import HttpException from '../utils/httpException'

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    validationResult(req).throw()
    next()
  } catch (error) {
    next(new HttpException(400, error.mapped()))
  }
}
