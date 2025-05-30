import express from 'express'
import morgan from 'morgan'
import pool from './config/db.js'
import swaggerUI from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'
import bookRoutes from './routes/books.routes.js'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.get('/ping', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ ok: true, now: result.rows[0] })
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err)
    res.status(500).json({ error: 'DB error' })
  }
})

app.use('/api/books', bookRoutes)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/docs', express.static(path.join(__dirname, '..', 'docs')))

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))


export default app