import express, { Response, Request, Application } from 'express'
import morgan from 'morgan'
import pool from './config/db'
import swaggerUI from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger'
import bookRoutes from './routes/book.routes'

const app: Application = express()

app.use(express.json())
app.use(morgan('dev'))

app.get('/ping', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ ok: true, now: result.rows[0] })
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err)
    res.status(500).json({ error: 'DB error' })
  }
})

app.use('/api/books', bookRoutes)

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))


export default app