import { validateSchema } from '../../../src/middlewares/schema.middleware'
import { z } from 'zod'
import { Request, Response, NextFunction } from 'express'

describe('validateSchema middleware', () => {
  const schema = z.object({
    title: z.string(),
    year: z.number()
  })

  let req: Partial<Request>
  let res: Partial<Response>
  const next = jest.fn()

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next.mockClear()
  })

  test('debería llamar a next si req.body es válido', () => {
    req.body = { title: 'Clean Code', year: 2008 }

    const middleware = validateSchema(schema)
    middleware(req as Request, res as Response, next as NextFunction)

    expect(req.body).toEqual({ title: 'Clean Code', year: 2008 })
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  test('debería retornar status 400 si req.body no es válido', () => {
    req.body = { title: 'Clean Code' }

    const middleware = validateSchema(schema)
    middleware(req as Request, res as Response, next as NextFunction)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: expect.arrayContaining([
        expect.any(String)
      ])
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('debería retornar status 500 si ocurre un error inesperado', () => {
    const brokeSchema = {
      parse: () => {
        throw new Error('Unexpected failure')
      }
    } as any

    req.body = { title: 'Test', year: 2000 }

    const middleware = validateSchema(brokeSchema)
    middleware(req as Request, res as Response, next as NextFunction)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error during validation.'
    })
    expect(next).not.toHaveBeenCalled()
  })
})