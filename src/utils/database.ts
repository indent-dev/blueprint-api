require('dotenv').config()
import mongoose from 'mongoose'

const { DB_USER, DB_PASS, DB_NAME } = process.env
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}

export async function connectDB() {
  return await mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASS}@clusterblueprint.yvkef.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    options
  )
}

export async function closeDB() {
  return await mongoose.connection.close()
}

export async function clearDB() {
  return await mongoose.connection.dropDatabase()
}
