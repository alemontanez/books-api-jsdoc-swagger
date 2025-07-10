import app from '../../src/app'
import db from '../../src/config/db'

import request from 'supertest'

describe('App integration tests', () => {

  afterAll(async () => {
    await db.end()
  })

  describe('GET /ping', () => {
    test('debería retornar status 200 y la fecha actual', async () => {
      const res = await request(app).get('/ping')
      expect(res.statusCode).toBe(200)
      expect(res.body.ok).toBe(true)
      expect(res.body.now).toBeDefined()
    })
  })
})