import { z } from 'zod'

export const bookSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string'
    })
    .trim()
    .min(2, { message: 'Title must be at least 2 characters' })
    .max(100, { message: 'Title must not exceed 100 characters' }),
  author: z
    .string({
      required_error: 'Author is required',
      invalid_type_error: 'Author must be a string'
    })
    .trim()
    .min(2, { message: 'Author must be at least 2 characters' })
    .max(50, { message: 'Author must not exceed 50 characters' })
    .regex(/^[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)*$/, { message: 'Author can only contain letters' }),
  year: z
    .number({
      required_error: 'Year is required',
      invalid_type_error: 'Year must be a number'
    })
    .int({ message: 'Year must be an integer' })
    .positive({ message: 'Year must be a positive integer' })
})