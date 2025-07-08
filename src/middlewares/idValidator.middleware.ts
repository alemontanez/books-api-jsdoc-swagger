import { Request, Response, NextFunction } from 'express'
import { IdParamsSchema } from '../schemas/common/idParams.schema'

/**
 * Middlewares
 * @module Middlewares
 */

/**
 * Middleware para validar los id recibidos por parámetros (req.params).
 * @returns Un middleware de Express que valida la solicitud.
 */
export const validateId = () => (req: Request, res: Response, next: NextFunction) => {
  try {
    for (const [key, value] of Object.entries(req.params)) {
      const parseResult = IdParamsSchema.safeParse({ id: value })
      if (!parseResult.success) {
        const issue = parseResult.error.errors[0]
        res.status(400).json({ error: `Parameter '${key}' ${issue.message}` })
        return
      }
    }
    next()
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Invalid parameter' })
    return
  }
}