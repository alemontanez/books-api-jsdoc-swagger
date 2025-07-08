import { z } from 'zod'

export const IdParamsSchema = z.object({
  id: z
    .coerce
    .number({
      invalid_type_error: 'must be a number'
    })
    .int('must be an integer')
    .positive('must be positive')
})