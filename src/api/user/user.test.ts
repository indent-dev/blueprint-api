import supertest from 'supertest'
import app from '../../app'
import { expect } from 'chai'
import {
  clearDB,
  closeDB,
  connectDB,
  mockingDatabaseRecord,
} from '../../utils/database'

require('dotenv').config()
process.env.JWT_SECRET = 'secret'

const request = supertest(app)

describe('user', () => {
  beforeAll(async () => await connectDB(true))

  beforeEach(async () => {
    await clearDB()
    await mockingDatabaseRecord()
  })

  afterAll(async () => await closeDB(true))

  it('can create user', async () => {
    const createUserResponse = await request
      .post('/user')
      .send({ email: 'lulu@gmail.com', password: 'lulu' })

    expect(createUserResponse.body).to.deep.include({
      email: 'lulu@gmail.com',
    })
    expect(createUserResponse.body).to.not.deep.include({
      password: 'lulu',
    })
  })

  it('can authenticate user', async () => {
    const authenticateResponse = await request
      .post('/user/authenticate')
      .send({ email: 'lili@gmail.com', password: 'lili' })

    expect(authenticateResponse.body).to.has.property('token')
  })

  it('can show error message if email or password wrong', async () => {
    const authenticateResponse = await request
      .post('/user/authenticate')
      .send({ email: 'thomas3@gmail.com', password: 'thomas3' })
    expect(authenticateResponse.body).to.deep.include({
      statusCode: 401,
      message: 'email or password wrong',
    })
  })
})
