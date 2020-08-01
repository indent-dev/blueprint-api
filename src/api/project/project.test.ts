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

  it('can get all project and limited project per page', async () => {
    const getAllProjectResponse = await request.get(
      '/project/?page=1&itemPerPage=1&sortBy=name&sortDirection=asc'
    )
    expect(getAllProjectResponse.body).to.have.length(1)
  })

  it('can search project by name', async () => {
    const getAllProjectResponse = await request.get(
      '/project/?page=1&itemPerPage=1&sortBy=name&sortDirection=asc&name=safari'
    )
    expect(getAllProjectResponse.body).to.have.length(1)
    expect(getAllProjectResponse.body[0]).to.deep.include({
      name: 'taman safari sector 6',
      description: 'kandang singa ini berada disebelah kandang harimau 2',
    })
  })

  it('can sort project by name A-Z', async () => {
    const getAllProjectResponse = await request.get(
      '/project/?page=1&itemPerPage=1&sortBy=name&sortDirection=asc'
    )
    expect(getAllProjectResponse.body).to.have.length(1)
    expect(getAllProjectResponse.body[0]).to.deep.include({
      name: 'taman safari sector 6',
      description: 'kandang singa ini berada disebelah kandang harimau 2',
    })
  })

  it('can sort project by createdAt oldest', async () => {
    const getAllProjectResponse = await request.get(
      '/project/?page=1&itemPerPage=1&sortBy=createdAt&sortDirection=desc'
    )
    expect(getAllProjectResponse.body).to.have.length(1)
    expect(getAllProjectResponse.body[0]).to.deep.include({
      name: 'taman safari sector 6',
      description: 'kandang singa ini berada disebelah kandang harimau 2',
    })
  })

  it('can sort project by createdAt newest', async () => {
    const getAllProjectResponse = await request.get(
      '/project/?page=1&itemPerPage=1&sortBy=createdAt&sortDirection=asc'
    )
    expect(getAllProjectResponse.body).to.have.length(1)
    expect(getAllProjectResponse.body[0]).to.deep.include({
      name: 'werehouse peta kandang singa 1',
      description: 'kandang singa ini berada disebelah kandang harimau 1',
    })
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

    const getAllProjectResponse = await request.get(
      '/project/?page=1&itemPerPage=3&sortBy=name&sortDirection=asc'
    )
    expect(getAllProjectResponse.body).to.have.length(3)
  })

  it("can't create project because required parameter not given", async () => {
    const createProjectResponse = await request
      .post('/project')
      .send({ name: 'sample-project' })
    expect(createProjectResponse.status).equal(400)
    expect(createProjectResponse.body).to.deep.include({
      isSuccess: 'false',
      statusCode: 400,
      message: {
        description: {
          msg: 'must be given',
          param: 'description',
          location: 'body',
        },
      },
    })
  })

  it('can edit project', async () => {
    const geAllProjectResponse = await request
      .get('/project/?page=1&itemPerPage=1&sortBy=name&sortDirection=asc')
      .send()
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
    const getAllProjectResponse = await request.get(
      '/project/?page=1&itemPerPage=1&sortBy=name&sortDirection=asc'
    )
    expect(getAllProjectResponse.body[0]).to.has.property('_id')
    const projectId = getAllProjectResponse.body[0]._id

    const deleteProjectResponse = await request.delete(`/project/${projectId}`)
    expect(deleteProjectResponse.body).to.deep.include({
      _id: `${projectId}`,
      isDeleted: true,
    })

    const getAllProjectVerifyResponse = await request.get(
      '/project/?page=1&itemPerPage=1&sortBy=name&sortDirection=asc'
    )
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

  it('can check duplicate project name', async () => {
    const createProjectResponse = await request.post('/project').send({
      name: 'werehouse peta kandang singa 1',
      description: 'kandang singa ini berada disebelah kandang harimau 1',
    })

    expect(createProjectResponse.body).to.deep.equal({
      isSuccess: 'false',
      statusCode: 409,
      message: 'Project name already exist',
    })
  })
})
