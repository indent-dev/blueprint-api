import { Credentials } from 'google-auth-library'
import { google } from 'googleapis'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import HttpException from '../../utils/httpException'
import userModel, { UserDocument } from './user.model'
import { UserRequest } from './user.type'
import userUtil from './user.util'

const OAuth2 = google.auth.OAuth2
const oauth_conf: any = require('../../utils/gOauth')

export default class UserService {
  getAllUser() {
    return userModel.find()
  }

  getUserByEmail(email: string) {
    return userModel.findOne({ email })
  }

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

  googleLoginLink() {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const oauth2Client = new OAuth2(
          oauth_conf.client_id,
          oauth_conf.client_secret,
          oauth_conf.redirect_uris[0]
        )

        const loginLink = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: oauth_conf.scopes,
        })
        resolve(loginLink)
      } catch (error) {
        reject(error)
      }
    })
  }

  googleLoginCallback(error: string, code: string) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const oauth2Client = new OAuth2(
          oauth_conf.client_id,
          oauth_conf.client_secret,
          oauth_conf.redirect_uris[0]
        )
        if (error) {
          return new HttpException(403, 'Authorization Failed')
        } else {
          oauth2Client.getToken(code, function (err, token) {
            if (err) return new HttpException(403, 'Authorization Failed')

            const userToken = jwt.sign(
              token as Credentials,
              process.env.JWT_SECRET as string
            )
            resolve(userToken)
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  transformGoogleToken(googleToken: string) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const tokenCookies: any = await jwt.verify(
          googleToken,
          process.env.JWT_SECRET as string
        )

        const { data } = await axios.get(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenCookies.access_token}` },
          }
        )
        let isUserExist = await this.getUserByEmail(data.email)
        if (!isUserExist) {
          const userReq: UserRequest = {
            email: data.email,
            password: 'blueprint123',
          }
          isUserExist = await this.createUser(userReq)
        }

        const token: any = await jwt.sign(
          { email: isUserExist.email },
          process.env.JWT_SECRET || ''
        )
        resolve(token)
      } catch (error) {
        reject(error)
      }
    })
  }
}
