require('dotenv').config()
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import projectModel from '../api/project/project.model'
import userModel from '../api/user/user.model'
import userUtil from '../api/user/user.util'

const mongoMemoryServer = new MongoMemoryServer()
const { CONNECTION_STRING } = process.env
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}

async function getConnectionString(isUsingMemory?: boolean) {
  return isUsingMemory
    ? await mongoMemoryServer.getConnectionString()
    : `${CONNECTION_STRING}`
}

export async function connectDB(isUsingMemory?: boolean) {
  const connectionString = await getConnectionString(isUsingMemory)
  return mongoose.connect(connectionString, options)
}

mongoose.connection.on('error', function (error) {
  console.error('Database connection error:', error)
})

mongoose.connection.once('open', function () {
  console.log('Database connected:', getConnectionString(false))
})

export async function clearDB() {
  return await mongoose.connection.db.dropDatabase()
}

export async function closeDB(isUsingMemory?: boolean) {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  if (isUsingMemory) await mongoMemoryServer.stop()
}

export async function mockingDatabaseRecord() {
  await projectModel.create({
    name: 'werehouse peta kandang singa 1',
    description: 'kandang singa ini berada disebelah kandang harimau 1',
  })
  await projectModel.create({
    name: 'taman safari sector 6',
    description: 'kandang singa ini berada disebelah kandang harimau 2',
  })
  const hash = await userUtil.hash('lulu')
  await userModel.create({
    email: 'lulu@gmail.com',
    password: hash,
  })
}
