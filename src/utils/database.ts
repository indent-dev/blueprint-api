require("dotenv").config();
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import projectModel from "../api/project/project.model";

const mongoMemoryServer = new MongoMemoryServer();
const { DB_USER, DB_PASS, DB_NAME } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

async function getConnectionString(isUsingMemory?: boolean) {
  return isUsingMemory
    ? await mongoMemoryServer.getConnectionString()
    : `mongodb+srv://${DB_USER}:${DB_PASS}@clusterblueprint.yvkef.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
}

export async function connectDB(isUsingMemory?: boolean) {
  const connectionString = await getConnectionString(isUsingMemory);
  return mongoose.connect(connectionString, options);
}

// mongoose.connection.on("error", function (error) {
//   console.error("Database connection error:", error);
// });

// mongoose.connection.once("open", function () {
//   console.log("Database connected");
// });

export async function clearDB() {
  return await mongoose.connection.db.dropDatabase();
}

export async function closeDB(isUsingMemory?: boolean) {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (isUsingMemory) await mongoMemoryServer.stop();
}

export async function mockingDatabaseRecord() {
  const project = await projectModel.create({
    name: "peta kandang singa 1",
    description: "kandang singa ini berada disebelah kandang harimau 1",
  });
  await projectModel.create({
    name: "peta kandang singa 2",
    description: "kandang singa ini berada disebelah kandang harimau 2",
  });
}
