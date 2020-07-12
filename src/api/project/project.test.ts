require("dotenv").config();
import { expect } from "chai";
import supertest from "supertest";
import app from "../../app";

import {
  connectDB,
  closeDB,
  mockingDatabaseRecord,
  clearDB,
} from "../../utils/database";

const request = supertest(app);

// mulai bari 51 di code-send nya mas aka

describe("project", () => {
  beforeAll(async () => await connectDB(true));

  beforeEach(async () => {
    await clearDB();
    await mockingDatabaseRecord();
  });

  afterAll(async () => await closeDB(true));

  it("can get all project", async () => {
    const getAllProjectResponse = await request
      .get("/project");
    expect(getAllProjectResponse.body).to.have.length(2)
  });

  it("can create project", async () => {
    const createProjectResponse = await request
      .post("/project")
      .send({ name: "sample-project", description: "sample-description" });
    expect(createProjectResponse.body).to.has.property("_id");
    expect(createProjectResponse.body).to.deep.include({
      name: "sample-project",
      description: "sample-description",
    });

    const getAllProjectResponse = await request
      .get("/project");
    expect(getAllProjectResponse.body).to.have.length(3);
  });

  it("can't create project because required parameter not given", async () => {
    const createProjectResponse = await request
      .post("/project")
      .send({ name: "sample-project" });
    expect(createProjectResponse.status).equal(500);
    expect(createProjectResponse.body).to.has.property("isSuccess")
      .equal("false");
  });
});
