import { validateId } from '../../../src/middlewares/idValidator.middleware'
// import { IdParamsSchema } from '../../../src/schemas/common/idParams.schema'
import { Request, Response, NextFunction } from 'express'

describe('validateId middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  const next = jest.fn()

  beforeEach(() => {
    req = { params: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next.mockClear()
  })

  test('debería llamar a next si todos los parámetros son válidos', () => {
    req.params = { bookId: '123' }

    const middleware = validateId()
    middleware(req as Request, res as Response, next as NextFunction)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  test('debería retornar status 400 si algún parámetro es inválido', () => {
    req.params = { bookId: 'abc' }

    const middleware = validateId()
    middleware(req as Request, res as Response, next as NextFunction)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: expect.stringMatching(/Parameter 'bookId'/)
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('debería retornar status 400 si ocurre un error inesperado', () => {
    Object.defineProperty(req, 'params', {
      get: () => {
        throw new Error('Unexpected error')
      }
    })

    const middleware = validateId()
    middleware(req as Request, res as Response, next as NextFunction)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid parameter'
    })
    expect(next).not.toHaveBeenCalled()
  })
})