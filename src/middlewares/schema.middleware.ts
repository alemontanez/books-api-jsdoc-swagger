import { ZodError, ZodSchema } from 'zod'
import { Request, Response, NextFunction} from 'express'

/**
 * Middlewares
 * @module Middlewares
 */

/**
 * Middleware para validar el cuerpo de la solicitud (req.body) utilizando un esquema Zod.
 * @param {ZodSchema} schema El esquema Zod a usar para la validación.
 * @returns Un middleware de Express que valida la solicitud.
 */
export const validateSchema = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const res = schema.parse(req.body)
    req.body = res
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: error.errors.map(err => err.message)
      })
      return
    }

    // Si es otro tipo de error (inesperado), lo manejamos como un error interno del servidor
    console.error('An unexpected error occurred during schema validation:', error)
    res.status(500).json({
      error: 'Internal server error during validation.'
    })
    return
  }
}