require('dotenv').config()
import { expect } from 'chai'
import supertest from 'supertest'
import app from '../../app'

import {
  connectDB,
  closeDB,
  mockingDatabaseRecord,
  clearDB,
} from '../../utils/database'

const request = supertest(app)

describe('project', () => {
  beforeAll(async () => await connectDB(true))

  beforeEach(async () => {
    await clearDB()
    await mockingDatabaseRecord()
  })

  afterAll(async () => await closeDB(true))

  it('can get all project', async () => {
    const getAllProjectResponse = await request.get('/project')
    expect(getAllProjectResponse.body).to.have.length(2)
  })

  it('can create project', async () => {
    const createProjectResponse = await request
      .post('/project')
      .send({ name: 'sample-project', description: 'sample-description' })
    expect(createProjectResponse.body).to.has.property('_id')
    expect(createProjectResponse.body).to.deep.include({
      name: 'sample-project',
      description: 'sample-description',
    })

    const getAllProjectResponse = await request.get('/project')
    expect(getAllProjectResponse.body).to.have.length(3)
  })

  it("can't create project because required parameter not given", async () => {
    const createProjectResponse = await request
      .post('/project')
      .send({ name: 'sample-project' })
    expect(createProjectResponse.status).equal(500)
    expect(createProjectResponse.body).to.deep.include({
      isSuccess: 'false',
      statusCode: 500,
      message:
        'Project validation failed: description: Path `description` is required.',
    })
  })

  it('can edit project', async () => {
    const geAllProjectResponse = await request.get('/project').send()
    const projectId = geAllProjectResponse.body[0]._id

    const editProjectResponse = await request
      .put(`/project/${projectId}`)
      .send({ name: 'bangau', description: 'kandang bangau' })

    expect(editProjectResponse.body).to.has.property('_id')
    expect(editProjectResponse.body).to.deep.include({
      name: 'bangau',
      description: 'kandang bangau',
    })
  })

  it('can delete project', async () => {
    const getAllProjectResponse = await request.get('/project')
    expect(getAllProjectResponse.body[0]).to.has.property('_id')
    const projectId = getAllProjectResponse.body[0]._id

    const deleteProjectResponse = await request.delete(`/project/${projectId}`)
    expect(deleteProjectResponse.body).to.deep.include({
      _id: `${projectId}`,
      isDeleted: true,
      message: 'Data successfully deleted',
    })

    const getAllProjectVerifyResponse = await request.get('/project')
    expect(getAllProjectVerifyResponse.body[0])
      .to.has.property('_id')
      .but.not.equal(`${projectId}`)
  })

  it('can sanitize HTML character into escaped character', async () => {
    const createProjectResponse = await request.post('/project').send({
      name: '<h1>sample-project</h1>',
      description: '<script>sample-desctiption</script>',
    })

    expect(createProjectResponse.body).to.has.property('_id')
    expect(createProjectResponse.body).to.deep.include({
      name: '&lt;h1&gt;sample-project&lt;&#x2F;h1&gt;',
      description: '&lt;script&gt;sample-desctiption&lt;&#x2F;script&gt;',
    })
  })
})
