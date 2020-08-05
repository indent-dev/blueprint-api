import jwt from 'jsonwebtoken'
import HttpException from '../../utils/httpException'
import userModel, { UserDocument } from './user.model'
import { UserRequest } from './user.type'
import userUtil from './user.util'

export default class UserService {
  getAllUser() {
    return userModel.find()
  }
  getUserByEmail(email: string) {
    return userModel.findOne({ email })
  }

  // create user
  createUser(user: UserRequest) {
    return new Promise<UserDocument>(async (resolve, reject) => {
      try {
        const existingUser = await this.getUserByEmail(user.email)
        if (existingUser) throw new HttpException(401, 'email already exist')

        const hash = await userUtil.hash(user.password)
        userModel.init()
        const userDocument = await userModel.create({
          email: user.email,
          password: hash,
        })
        resolve(userDocument)
      } catch (error) {
        reject(error)
      }
    })
  }

  // auth user
  authenticateUser(user: UserRequest) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const userDocument = await userModel.findOne({
          email: user.email,
        })
        if (!userDocument)
          throw new HttpException(401, 'email or password wrong')

        const isPasswordMatch = await userUtil.compare(
          user.password,
          userDocument.password
        )
        if (!isPasswordMatch)
          throw new HttpException(401, 'email or password wrong')

        const token = jwt.sign(
          { email: user.email },
          process.env.JWT_SECRET || ''
        )
        resolve(token)
      } catch (error) {
        reject(error)
      }
    })
  }
}
